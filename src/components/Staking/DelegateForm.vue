<template>
  <s-card :title="$t('staking.delegate')">
    <el-form
      class="staking-form"
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit="onSubmit"
    >
      <el-form-item prop="validator">
        <el-input
          :value="get(toValidator, 'description.moniker')"
          :placeholder="$t('staking.toValidator')"
          @focus="selectValidator"
        ></el-input>
      </el-form-item>
      <div class="row-balance">
        Balance: {{ viewBalance.amount | formatNumber }} IF
        <a @click="setAmountAll">{{$t('staking.all')}}</a>
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
      >{{$t('staking.delegate')}}</el-button>
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
  name: "DelegateForm",
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateAddr = (rule, value, callback) => {
      if (isEmpty(this.toValidator)) {
        callback(requireError(this.$t("staking.validator")));
        return;
      }
      callback();
    };
    const validateAmount = (rule, value, callback) => {
      if (!value || value.toString().trim() === "") {
        callback(requireError(this.$t("send.amount")));
        return;
      }
      const input = value - 0;
      const balance = this.viewBalance.amount - 0;
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
        validator: [{ validator: validateAddr, trigger: "blur" }],
        amount: [{ validator: validateAmount, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("account", ["balance"]),
    ...mapState("staking", ["form", "toValidator", "validatorMap"]),
    viewBalance() {
      const gard = { denom: "uif", amount: "0" };
      const t = this.balance.find(i => i.denom === "uif");
      return t ? getViewToken(t) : gard;
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
    selectValidator() {
      if (this.$route.query.to) {
        return;
      }
      this.$router.push("/staking/validator");
    },
    setAmountAll() {
      if (this.viewBalance.amount == 0) {
        this.$store.dispatch("staking/setForm", {
          ...this.form,
          amount: 0
        });
      } else {
        this.$store.dispatch("staking/setForm", {
          ...this.form,
          amount: (parseFloat(this.viewBalance.amount) - 1).toFixed(2)
        });
      }
    },
    onSubmit(e) {
      e.preventDefault();
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
        this.$router.push("/staking/confirm?action=delegate");
      });
    }
  },
  mounted: async function() {
    const { to } = this.$route.query;
    if (to) {
      isEmpty(this.validatorMap[to]) &&
        (await this.$store.dispatch("staking/fetchValidators", false));
      this.$store.dispatch("staking/setToValidator", this.validatorMap[to]);
    }

    this.$store.dispatch("account/fetchBalance");
  }
};
</script>

<style lang="scss" scoped>
.staking-form {
  margin-top: 20px;
}
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
  background: $main-btn;
  color: #fff;
  height: 48px;
}
</style>

