<template>
  <s-card :title="$t('send.form')">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit="onSubmit"
    >
      <el-form-item prop="denom">
        <el-select
          style="width: 100%"
          v-model="form.denom"
          :placeholder="$t('send.denom')"
          @change="changeDenom"
        >
          <el-option
            v-for="i in viewBalance"
            :key="i.denom"
            :label="i.label"
            :value="i.denom"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="address">
        <el-input
          v-model="form.address"
          :placeholder="$t('send.address')"
          clearable
        ></el-input>
      </el-form-item>
      <div class="row-balance">
        {{ $t('send.balance') }}: {{ selectedBalance.amount | formatNumber }}
        <a @click="setAmountAll">{{$t('send.all')}}</a>
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
      <el-form-item>
        <el-input
          v-model="form.memo"
          type="textarea"
          :rows="3"
          :placeholder="$t('send.memo')"
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
      >{{$t('main.send')}}</el-button>
    </el-form>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";

import webc from "@/utils/webc";

export default {
  name: "SendForm",
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateAddr = (rule, value, callback) => {
      if (!value || value.trim() === "") {
        callback(requireError(this.$t("send.address")));
        return;
      }
      if (!webc.account.isValidAddress(value)) {
        callback(this.$t("send.addressWarn"));
        return;
      }
      callback();
    };
    const validateAmount = (rule, value, callback) => {
      const input = value - 0;
      const balance = this.selectedBalance.amount - 0;
      if (input <= 0) {
        callback(new Error(this.$t("send.amountWarnPositive")));
        return;
      }
      if (input > balance) {
        callback(new Error(this.$t("send.amountWarn")));
        return;
      }
      if (!isEmpty(this.boxAmount.price)) {
        if (input % parseInt(this.boxAmount.price) != 0) {
          callback(
            new Error(
              this.$t("deposit.multiple", {
                price: this.boxAmount.price
              })
            )
          );
          return;
        }
      }
      let decimals = 6;
      const token = this.tokenMap[this.form.denom];
      if (!isEmpty(token)) {
        decimals = token.decimals;
      }
      if (
        BigNumber(input)
          .modulo(BigNumber(0.1).pow(decimals))
          .toNumber() !== 0
      ) {
        callback(new Error(this.$t("send.amountWarnInvalid")));
        return;
      }
      callback();
    };
    return {
      formData: {},
      form: {
        denom: "uif",
        amount: "",
        address: "",
        memo: "",
        fee: 1
      },
      rules: {
        address: [{ validator: validateAddr, trigger: "blur" }],
        amount: [{ validator: validateAmount, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("account", ["balance", "tokenMap"]),
    viewBalance() {
      if (sessionStorage.getItem("boxAmount")) {
        return [JSON.parse(sessionStorage.getItem("boxAmount"))];
      }
      const coins = this.balance.filter(
        i => !i.denom.match(/^box.{11}$/) && !i.denom.match(/^box.{13}$/)
      );
      return coins.map(i => {
        const token = { ...i };
        if (token.denom.match(/^coin.{10}$/)) {
          const detail = this.tokenMap[token.denom];
          if (!isEmpty(detail)) {
            token.label = `${detail.symbol} (${detail.issue_id})`;
            token.amount = BigNumber(token.amount)
              .dividedBy(Math.pow(10, detail.decimals))
              .toString();
          }
        } else {
          if (token.denom === "uif") {
            token.amount = BigNumber(token.amount)
              .dividedBy(Math.pow(10, 6))
              .toString();
            token.label = "IF";
          } else {
            token.label = token.denom.toUpperCase();
          }
        }
        return token;
      });
    },
    selectedBalance() {
      const gard = { amount: "0", denom: "uif", label: "IF" };
      return this.viewBalance.find(i => i.denom === this.form.denom) || gard;
    },
    boxAmount() {
      return JSON.parse(sessionStorage.getItem("boxAmount")) || { price: "" };
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
    changeDenom() {
      this.form.amount = "";
    },
    setAmountAll() {
      if (this.form.denom == "uif") {
        this.form.amount = parseFloat(this.selectedBalance.amount) - 1;
      } else {
        this.form.amount = parseFloat(this.selectedBalance.amount);
      }
    },
    onSubmit(e) {
      e.preventDefault();
      this.$refs["form"].validate(valid => {
        if (!valid) return false;

        sessionStorage.setItem("sendForm", JSON.stringify(this.form));
        this.$store.dispatch("transactions/input", this.form);
        this.$router.push("/send/confirm");
      });
    }
  },
  mounted: async function() {
    if (!isEmpty(sessionStorage.getItem("sendForm"))) {
      this.formData = JSON.parse(sessionStorage.getItem("sendForm"));
    }
    Object.keys(this.formData).forEach(k => {
      this.form[k] = this.formData[k];
    });
    const balance = await this.$store.dispatch("account/fetchBalance");
    if (isEmpty(balance.result)) {
      this.form.denom = "";
    } else {
      if (isEmpty(JSON.parse(sessionStorage.getItem("token")))) {
        if (!balance.result.find(i => i.denom === this.form.denom)) {
          this.form.denom = balance.result[0].denom;
        }
      } else if (sessionStorage.getItem("boxAmount")) {
        this.form.denom = JSON.parse(sessionStorage.getItem("boxAmount")).denom;
      } else {
        this.form.denom = JSON.parse(sessionStorage.getItem("token")).denom;
      }
    }
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
  background: $main-btn;
  color: #fff;
  height: 48px;
}
</style>

