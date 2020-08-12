<template>
  <div class="staking-container">
    <div class="staking-top">
      <div>
        <h3 v-if="!isEmpty(delegations) && !isEmpty(validatorMap)">{{ numeral(totalDelegation.amount).format('0,0.[0000]') }} IF</h3>
        <p>{{ $t('staking.delegationTotal') }}</p>
      </div>
      <div>
        <h3 v-if="!isEmpty(rewards)">
          {{ numeral(reward.amount).format('0,0.[0000]') }} IF
        </h3>
        <h3 v-else>{{$t("global.null")}}</h3>
        <p>{{ $t('staking.reward') }}</p>
      </div>
      <div
        @click="goDelegate"
        style="cursor: pointer;"
      >
        {{ $t('staking.delegate') }}
      </div>
      <div
        @click="confirmWithdraw"
        style="cursor: pointer;"
      >
        {{ $t('staking.withdrawAll') }}
      </div>
    </div>
    <div class="valid-list">
      <div v-if="pageWidth > 414">
        <div class="table-header && nav">
          <!-- <div class="header-index">{{$t("deposit.order")}}</div> -->
          <div class="header-name">{{$t("staking.name")}}</div>
          <div class="header-address">{{$t("staking.validator")}}</div>
          <div class="header-com">{{$t("staking.commission")}}</div>
          <div class="header-del">{{$t("staking.delegations")}}/{{$t("staking.tokens")}}</div>
          <div class="header-rewards">{{$t("staking.unpaidReward")}}</div>
          <div class="view">{{$t("main.operation")}}</div>
        </div>
      </div>
      <div v-else>
        <div class="table-header && nav">
          <div class="header-name">{{$t("staking.name")}}</div>
          <div class="header-del">{{$t("staking.delegations")}}</div>
          <div class="header-rewards">{{$t("staking.unpaidReward")}}</div>
          <div class="view">{{$t("main.operation")}}</div>
        </div>
      </div>

      <div
        class="empty"
        v-if="viewDelegations.length === 0"
      >{{$t('main.empty')}}</div>
      <div v-else>
        <ValidatorPanel
          v-for="(v,index) in viewDelegations"
          :key="v.validator_address"
          :v="v.validator.result ? v.validator.result : v.validator"
          :delegation="v.delegation"
          :index="index + 1"
          class="item"
        />
      </div>
    </div>
    <el-dialog
      :title="$t('create.pass')"
      :visible.sync="dialogVisible"
      width="360px"
      v-loading="withdrawLoading"
      element-loading-text="Loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.7)"
      :close-on-click-modal="false"
    >
      <el-input
        type="password"
        v-model="pass"
        :placeholder="$t('create.pass')"
        @keyup.enter.native="onWithdraw(false)"
      ></el-input>
      <span slot="footer">
        <el-button @click="onWithdraw(false)">{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Bignumber, { BigNumber } from "bignumber.js";
import numeral from "numeral";
import { get, isEmpty } from "lodash";
import { getViewToken, handleTxReturn } from "@/utils/helpers";
import ValidatorPanel from "@/components/Panel/ValidatorPanel";
export default {
  name: "StakingMain",
  components: { ValidatorPanel },
  data() {
    return {
      filter: "tokens",
      dialogVisible: false,
      withdrawLoading: false,
      pass: "",
      pageWidth: document.documentElement.clientWidth
    };
  },
  computed: {
    ...mapState("account", ["userName", "keyStore", "mathAccount"]),
    ...mapState("staking", [
      "loading",
      "validators",
      "validatorMap",
      "delegations",
      "unbindings",
      "rewards"
    ]),
    totalDelegation() {
      let res = BigNumber(0);
      this.viewDelegations.forEach(i => {
        if (i.validator.result) {
          const tokens = Bignumber(i.validator.result.tokens)
            .div(i.validator.result.delegator_shares)
            .times(i.delegation.shares);
          res = tokens.plus(res);
        } else {
          const tokens = Bignumber(i.validator.tokens)
            .div(i.validator.delegator_shares)
            .times(i.delegation.shares);
          res = tokens.plus(res);
        }
      });
      return getViewToken({ denom: "uif", amount: res.toFixed() });
    },
    reward() {
      return getViewToken(this.rewards[0]);
    },
    viewDelegations() {
      if (!Object.keys(this.validatorMap).length) return [];
      const unbonded = this.delegations.filter(
        i => !this.validatorMap[i.validator_address]
      );
      if (!isEmpty(unbonded)) {
        unbonded.forEach(v => {
          this.$store.dispatch("staking/fetchValidator", v.validator_address);
        });
        return [];
      }
      return this.delegations.map(i => {
        return {
          delegation: i,
          validator: this.validatorMap[i.validator_address]
        };
      });
    },
    viewValidators() {
      if (this.filter === "tokens") {
        return this.validators;
      }
      return [...this.validators].sort(
        (a, b) =>
          get(a, "commission.commission_rates.rate") -
          get(b, "commission.commission_rates.rate")
      );
    }
  },
  methods: {
    isEmpty,
    get,
    numeral,
    handleResize(event) {
      this.pageWidth = document.documentElement.clientWidth;
    },
    goDelegate() {
      this.$router.push({ path: "/staking/delegate" });
    },
    fetchData: async function() {
      await this.$store.dispatch("staking/fetchValidators", false);
      await this.$store.dispatch("staking/fetchDelegations");
      await this.$store.dispatch("staking/fetchUnbindings");
      await this.$store.dispatch("staking/fetchRewards");
    },
    confirmWithdraw() {
      if (isEmpty(this.rewards)) {
        return false;
      }
      if (!isEmpty(this.mathAccount)) {
        this.onWithdraw(true);
        return;
      }
      this.pass = "";
      this.dialogVisible = true;
    },
    onWithdraw: async function(useMathWallet) {
      if (!useMathWallet && !this.pass) {
        this.$message({
          type: "error",
          message: this.$t("global.required", { name: this.$t("create.pass") }),
          center: true
        });
        return false;
      }
      this.withdrawLoading = true;
      let res = "";
      try {
        res = await this.$store.dispatch("staking/withdrawAll", {
          pass: this.pass
        });
      } catch (e) {
        this.$message({
          type: "error",
          message: this.$t(`send.error`),
          center: true
        });
      }
      if (res.txhash) {
        const txStatus = await handleTxReturn(res);
        if (txStatus) {
          this.dialogVisible = false;
          this.$message({
            type: "success",
            message: this.$t("global.success", {
              name: this.$t("staking.withdraw")
            }),
            duration: 1000,
            onClose: () => {
              window.location.reload();
            }
          });
        }
      } else {
        this.$message({
          type: "error",
          message: this.$t(`send.${res}`),
          center: true
        });
      }
      this.withdrawLoading = false;
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style lang="scss" scoped>
.staking-container {
  max-width: $max-width;
  margin: 0 auto $padding-large;
  padding: $padding-large 0;
  .staking-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      background: rgba(245, 247, 250, 1);
      color: rgba(0, 0, 0, 1);
      height: 100px;
      flex-basis: 22%;
      border-radius: 4px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      > h3 {
        font-size: 18px;
      }
    }
    > .top-btns {
      line-height: 100px;
      cursor: pointer;
    }
  }
  .valid-list {
    margin-top: 15px;
    .table-header {
      background-color: rgba(245, 247, 250, 1);
      display: flex;
      justify-content: space-around;
      height: 50px;
      line-height: 50px;
      border-radius: 4px;
      margin-bottom: 10px;
      text-align: left;
      color: rgba(0, 0, 0, 0.7);
      font-weight: bolder;
      > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-indent: 1em;
        flex-basis: 20%;
      }
      > .header-index {
        flex-basis: 10%;
      }
      > .header-com {
        flex-basis: 10%;
      }
      > .header-rewards {
        flex-basis: 30%;
      }
    }
  }
  .tools {
    margin-top: $padding-basic;
  }
  .empty {
    background-color: rgba(245, 247, 250, 1);
    height: 50px;
    line-height: 50px;
    border-radius: 4px;
    text-align: center;
    color: rgba(0, 0, 0, 0.7);
  }
  .delegations,
  .validators {
    display: flex;
    flex-wrap: wrap;
    padding: $padding-basic 0;
    margin: 0 -1%;
  }
  .el-button {
    background: $main-btn;
    color: #fff;
  }
}
@include responsive($sm) {
  .staking-container {
    .staking-top {
      display: block;
      > div {
        width: 100%;
        height: 100px;
        margin-bottom: 10px;
        > h3 {
          font-size: 18px;
        }
      }
    }
    .valid-list {
      .table-header {
        > div {
          flex-basis: 25%;
        }
      }
    }
    .delegations {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style>