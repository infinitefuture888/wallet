<template>
  <s-card
    :title="$t('staking.validator')"
    v-if="!isEmpty(v)"
  >
    <div class="div">
      <s-item
        :label="$t('staking.name')"
        class="item"
      >{{ get(v, 'description.moniker') }}</s-item>
      <s-item
        :label="$t('staking.status')"
        class="item"
      ><span :class="v.jailed ? 'jailed' : ''">{{ v.jailed ? 'Jailed' : 'Active' }}</span></s-item>
      <s-item
        :label="$t('staking.tokens')"
        class="item"
      >{{ shares.amount | formatNumber }} IF</s-item>
      <s-item
        :label="$t('staking.address')"
        class="item"
      >{{ get(v, 'operator_address') }}</s-item>
      <s-item
        :label="$t('staking.commission')"
        class="item"
      >{{ numeral(get(v, 'commission.commission_rates.rate')).format('(0.[00]%)') }}</s-item>
      <s-item
        :label="$t('staking.max')"
        class="item"
      >{{ numeral(get(v, 'commission.commission_rates.max_rate')).format('(0.[00]%)') }}</s-item>
      <s-item
        :label="$t('staking.commissionChange')"
        class="item"
      >{{ numeral(get(v, 'commission.commission_rates.max_change_rate')).format('(0.[00]%)') }}</s-item>

      <s-item
        :label="$t('staking.website')"
        class="item"
      >{{ get(v, 'description.website') || '-' }}</s-item>
      <s-item
        :label="$t('staking.description')"
        class="item"
      >{{ get(v, 'description.details') || '-' }}</s-item>
    </div>

    <el-button
      @click="toDelegate"
      class="btn-delegate"
    >
      {{ $t('staking.delegate') }}
    </el-button>

    <p
      class="label"
      v-if="isDelegating"
    >{{ $t('staking.delegations') }}</p>

    <div
      v-if="isDelegating"
      class="div"
    >
      <s-item
        v-if="!isEmpty(rewardMap)"
        :label="$t('staking.unpaidReward')"
        class="item"
      >

        <span
          v-for="(i,index) in reward"
          :key="index"
          style="margin-left: 10px;"
        >{{numeral(i.amount).format('0,0.[0000]')}} {{i.denom}}</span>
        <span v-if="reward.length == 0">{{$t("global.null")}}</span>
      </s-item>
      <s-item
        v-if="!isEmpty(v.delegation)"
        :label="$t('staking.delegated')"
        class="item"
      >{{ numeral(myDelegation.amount).format('0,0') }} IF</s-item>
      <s-item
        v-if="!isEmpty(v.unbinding)"
        :label="$t('staking.unbinding')"
        class="item"
      >
        <div
          v-for="i in v.unbinding"
          :key="i.completion_time"
          class="data"
        >
          {{ numeral(getViewToken({denom: 'uif', amount: get(i, 'balance')}).amount).format('0,0') }} IF | {{ get(i, 'completion_time') | formatTime }}
        </div>
      </s-item>
    </div>

    <div
      v-if="!isEmpty(v.delegation)"
      class="btns"
    >
      <el-button
        @click="toUnbind"
        class="btn"
      >
        {{ $t('staking.unbind') }}
      </el-button>
      <el-button
        class="btn"
        @click="withdraw"
      >
        {{$t('staking.withdraw')}}
      </el-button>
      <el-button
        @click="toRedelegate"
        class="btn"
      >
        {{ $t('staking.redelegate') }}
      </el-button>
    </div>
    <el-dialog
      :title="$t('create.pass')"
      :visible.sync="dialogVisible"
      width="360px"
      :close-on-click-modal="false"
    >
      <el-input
        type="password"
        v-model="pass"
        :placeholder="$t('create.pass')"
        @keyup.enter.native="doWithdraw(false)"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="btn-ok"
          @click="doWithdraw(false)"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import { get, isEmpty } from "lodash";
import { getViewToken, handleTxReturn } from "@/utils/helpers";
import BigNumber from "bignumber.js";
export default {
  name: "ValidatorList",
  data() {
    return {
      dialogVisible: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("account", ["mathAccount"]),
    ...mapState("staking", [
      "validatorMap",
      "delegationMap",
      "unbindingMap",
      "rewardMap"
    ]),
    v() {
      const address = this.$route.params.validator;
      const validator = get(this.validatorMap, address) || {};
      // if (!isEmpty(validator)) {
      //   this.$store.dispatch("staking/fetchValidator", address);
      // }
      const unbinding = get(this.unbindingMap, address);
      const unbindingList = [];
      if (!isEmpty(unbinding)) {
        unbinding.entries.forEach(i => {
          unbindingList[unbindingList.length] = i;
        });
      }
      if (validator.result) {
        return {
          ...validator.result,
          delegation: get(this.delegationMap, address),
          unbinding: unbindingList
        };
      } else {
        return {
          ...validator,
          delegation: get(this.delegationMap, address),
          unbinding: unbindingList
        };
      }
    },
    shares() {
      const t = { denom: "uif", amount: this.v.tokens };
      return getViewToken(t);
    },
    isDelegating() {
      return !isEmpty(this.v.delegation) || !isEmpty(this.v.unbinding);
    },
    myDelegation() {
      const t = {
        denom: "uif",
        amount: BigNumber(this.v.tokens)
          .times(get(this.delegationMap, [this.v.operator_address, "shares"]))
          .dividedBy(this.v.delegator_shares)
      };
      return getViewToken(t);
    },
    reward() {
      const result = get(this.rewardMap, this.$route.params.validator);
      const rewards = get(result, "result");
      if (isEmpty(rewards) || rewards.length == 0) {
        return [];
      } else {
        const rewardsArr = [];
        rewards.forEach(i => {
          rewardsArr.push(getViewToken(i));
        });
        return rewardsArr;
      }
    }
  },
  methods: {
    get,
    isEmpty,
    numeral,
    getViewToken,
    toDelegate() {
      const { validator } = this.$route.params;
      this.$router.push(`/staking/delegate?to=${validator}`);
    },
    toUnbind() {
      const { validator } = this.$route.params;
      this.$router.push(`/staking/unbind?from=${validator}`);
    },
    toRedelegate() {
      const { validator } = this.$route.params;
      this.$router.push(`/staking/redelegate?from=${validator}`);
    },
    withdraw() {
      // use math wallet
      if (!isEmpty(this.mathAccount)) {
        this.doWithdraw(true);
        return;
      }
      // else use local wallet
      this.pass = "";
      this.dialogVisible = true;
    },
    doWithdraw: async function(useMathWallet) {
      if (!useMathWallet && !this.pass) {
        this.$message({
          type: "error",
          message: this.$t("global.required", { name: this.$t("create.pass") }),
          center: true
        });
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const params = {
        validator_address: get(this.v, "operator_address"),
        pass: this.pass
      };
      let res = "";
      try {
        res = await this.$store.dispatch("staking/withdraw", params);
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
              name: this.$t("receiveVoucher.extract")
            }),
            center: true,
            duration: 1500,
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
      loading.close();
    }
  },
  async mounted() {
    const { validator } = this.$route.params;
    this.$store.dispatch("staking/fetchValidators", false);
    this.$store.dispatch("staking/setForm", {});

    // rest api returns 500 if result data empty
    // this.$store.dispatch("staking/fetchDelegation", validator);
    // this.$store.dispatch("staking/fetchUnbinding", validator);
    // so we fetch list api
    const delegations = await this.$store.dispatch("staking/fetchDelegations");
    this.$store.dispatch("staking/fetchUnbindings");
    if (delegations.result) {
      const currentValidatorDelegation = delegations.result.filter(i => {
        return i.validator_address == validator;
      });
      if (!isEmpty(currentValidatorDelegation)) {
        this.$store.dispatch("staking/fetchReward", validator);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.div {
  background: $color-background-card;
  padding: 4px $padding-basic;
  margin-bottom: 16px;
  .item {
    margin: 16px 0;
  }
}
.label {
  margin-top: 24px;
  margin-bottom: 12px;
}
.btn-delegate {
  width: 100%;
  height: 48px;
  background: $main-btn;
  color: #fff;
}
.btns {
  margin-top: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .btn {
    width: 100%;
    height: 48px;
    flex-basis: 48%;
    background: $main-btn;
    color: #fff;
  }
}
.btn-ok {
  background: $main-btn;
  color: #fff;
}
@include responsive($sm) {
  .div {
    padding: 4px 0;
  }
}
</style>