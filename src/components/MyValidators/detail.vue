<template>
  <s-card
    :title="$t('myNode.info')"
    v-if="!isEmpty(detail)"
  >
    <div class="div">
      <s-item
        :label="$t('myNode.name')"
        class="item"
      >{{get(detail, 'description.moniker')}}</s-item>
      <s-item
        :label="$t('myNode.state')"
        class="item"
      >{{ detail.jailed ? 'Jailed' : 'Active' }}</s-item>
      <s-item
        :label="$t('myNode.delegate')"
        class="item"
      >{{ getViewToken({denom: 'uif', amount: detail.tokens}).amount | formatNumber }}</s-item>
      <s-item
        :label="$t('myNode.address')"
        class="item"
      >{{detail.operator_address}}</s-item>
      <s-item
        :label="$t('myNode.comissionRate')"
        class="item"
      >{{numeral(get(detail, 'commission.commission_rates.rate')).format('(0.[00]%)')}}</s-item>
      <s-item
        :label="$t('myNode.comissionMax')"
        class="item"
      >{{numeral(get(detail, 'commission.commission_rates.max_rate')).format('(0.[00]%)')}}</s-item>
      <s-item
        :label="$t('myNode.comissionMaxChange')"
        class="item"
      >{{numeral(get(detail, 'commission.commission_rates.max_change_rate')).format('(0.[00]%)')}}</s-item>
      <s-item
        :label="$t('myNode.website')"
        class="item"
      >{{get(detail, "description.website") || "-"}}</s-item>
      <s-item
        :label="$t('myNode.details')"
        class="item"
      >{{get(detail, "description.details") || "-"}}</s-item>
      <s-item
        :label="$t('myNode.withdraw')"
        class="item"
      >
        <span v-if="!isEmpty(distribution)">{{get(distribution, "result.operator_address")}}</span></s-item>
    </div>
    <div class="div">
      <s-item
        :label="$t('myNode.rewards')"
        class="item"
      >
        <span v-if="!isEmpty(distribution)">
          <data-amount
            v-if="!isEmpty(rewards)"
            :list="rewards"
          ></data-amount>
          <span v-else>-</span>
        </span>

      </s-item>
      <s-item
        :label="$t('myNode.commission')"
        class="item"
      >
        <span v-if="!isEmpty(distribution)">
          <data-amount
            v-if="!isEmpty(commission)"
            :list="commission"
          ></data-amount>
          <span v-else>-</span>
        </span>
      </s-item>
    </div>
    <!-- <div class="btns">
      <el-button
        class="btn"
        @click="goEdit"
      >编辑节点</el-button>
      <el-button
        class="btn"
        @click="goWithdraw"
      >{{$t("myNode.setWithdraw")}}</el-button>
      <el-button class="btn">修改佣金</el-button>
    </div> -->
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getViewToken } from "@/utils/helpers";
import { isEmpty, get } from "lodash";
import numeral from "numeral";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("account", ["tokenMap"]),
    ...mapState("staking", ["validatorMap", "distributionMap"]),
    detail() {
      return this.validatorMap[this.$route.query.address];
    },
    distribution() {
      return this.distributionMap[this.$route.query.address];
    },
    rewards() {
      if (!this.distribution.result.self_bond_rewards) {
        return [];
      } else {
        return this.distribution.result.self_bond_rewards;
      }
    },
    commission() {
      if (!this.distribution.result.val_commission) {
        return [];
      } else {
        return this.distribution.result.val_commission;
      }
    }
  },
  methods: {
    isEmpty,
    get,
    getViewToken,
    numeral,
    goEdit() {
      this.$router.push({
        path: `/myNode/edit?address=${this.$route.query.address}`
      });
    },
    goWithdraw() {
      this.$router.push({
        path: `/myNode/withdraw?address=${this.$route.query.address}`
      });
    }
  },
  mounted() {
    this.$store.dispatch("staking/fetchValidator", this.$route.query.address);
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
    background: $main-btn;
    color: #fff;
  }
}
@include responsive($sm) {
  .div {
    padding: 4px 0;
  }
}
</style>