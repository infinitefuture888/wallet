<template>
  <s-card :title="$t('staking.unbind')">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit="onSubmit"
    >
      <el-form-item prop="validator">
        <el-input
          :value="get(fromValidator, 'description.moniker')"
          :placeholder="$t('staking.fromValidator')"
        ></el-input>
      </el-form-item>
      <div class="row-balance">
        Total: {{ viewBalance.amount | formatNumber }} IF
        <a @click="setAmountAll">{{$t('staking.unbindAll')}}</a>
      </div>
      <el-form-item prop="amount">
        <el-input
          v-model="form.amount"
          type="number"
          min="0"
          step="1"
          :placeholder="$t('send.amount')"
          clearable
        ></el-input>
      </el-form-item>
      <div class="fee"><span>{{$t('send.fee')}}</span>1 IF <span
          v-if="gardAmount < 1"
          style="color:red;"
        >{{$t('global.Insufficient')}}</span></div>

      <el-button
        round
        class="btn-send"
        native-type=“submit”
        @click="onSubmit"
      >{{$t('staking.unbind')}}</el-button>
    </el-form>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";
import { getViewToken } from "@/utils/helpers";
import webc from "@/utils/webc";
export default {
  name: "UnbindForm",
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateAmount = (rule, value, callback) => {
      if (!value || value.toString().trim() === "") {
        callback(requireError(this.$t("send.amount")));
        return;
      }
      const input = value - 0;
      const balance = this.viewBalance.shares - 0;
      if (input <= 0) {
        callback(new Error(this.$t("send.amountWarnPositive")));
        return;
      }
      if (input > balance) {
        callback(new Error(this.$t("send.amountWarn")));
        return;
      }
      if (
        BigNumber(input)
          .modulo(BigNumber(0.1).pow(6))
          .toNumber() !== 0
      ) {
        callback(new Error(this.$t("send.amountWarnInvalid")));
        return;
      }
      callback();
    };
    return {
      rules: {
        amount: [{ validator: validateAmount, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("account", ["balance"]),
    ...mapState("staking", [
      "validatorMap",
      "delegationMap",
      "unbindingMap",
      "form",
      "fromValidator"
    ]),
    v() {
      const address = this.$route.query.from;
      const validator = get(this.validatorMap, address) || {};
      const unbinding = get(this.unbindingMap, address);
      const unbindingList = [];
      if (!isEmpty(unbinding)) {
        unbinding.entries.forEach(i => {
          unbindingList[unbindingList.length] = i;
        });
      }
      return {
        ...validator,
        delegation: get(this.delegationMap, address),
        unbinding: unbindingList
      };
    },
    viewBalance() {
      const total = BigNumber(this.v.tokens)
        .times(get(this.v, "delegation.result.shares"))
        .div(this.v.delegator_shares)
        .toFixed();
      const gard = { denom: "uif", amount: total || "0" };
      return getViewToken(gard);
    },
    gardAmount() {
      if (this.balance.length == 0) {
        return 0;
      }
      const gardBalance = this.balance.filter(i => {
        return i.denom == "uif";
      });
      if (isEmpty(gardBalance)) {
        return 0;
      } else {
        return BigNumber(gardBalance[0].amount)
          .dividedBy(Math.pow(10, 6))
          .toString();
      }
    }
  },
  methods: {
    get,
    setAmountAll() {
      this.$store.dispatch("staking/setForm", {
        ...this.form,
        amount: this.viewBalance.amount
      });
    },
    onSubmit(e) {
      e.preventDefault();
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
        const { from } = this.$route.query;
        this.$router.push(`/staking/confirm?action=unbind&from=${from}`);
      });
    }
  },
  mounted: async function() {
    this.$store.dispatch("account/fetchBalance");
    const { from } = this.$route.query;
    isEmpty(this.validatorMap[from]) &&
      (await this.$store.dispatch("staking/fetchValidators", false));
    await this.$store.dispatch("staking/fetchDelegations");
    this.$store.dispatch("staking/setFromValidator", this.validatorMap[from]);
    this.$store.dispatch("staking/setToValidator", {});
    this.$store.dispatch("staking/fetchDelegation", from);
  }
};
</script>

<style lang="scss" scoped>
.row-balance {
  a {
    cursor: pointer;
    float: right;
  }
}

.fee {
  span {
    margin-right: 16px;
  }
}

.btn-send {
  margin-top: $padding-basic;
  width: 100%;
  height: 48px;
  background-color: $main-btn;
  color: #fff;
}
</style>

