<template>
  <s-card :title="$t('send.confirm')">
    <s-item :label="$t('send.denom')">{{denom}}</s-item>
    <s-item :label="$t('send.address')">{{form.address}}</s-item>
    <s-item :label="$t('send.amount')">{{form.amount | formatNumber}}</s-item>
    <s-item :label="$t('send.memo')">{{form.memo || '-'}}</s-item>
    <s-item :label="$t('send.fee')">{{form.fee}} IF</s-item>

    <el-button
      round
      class="btn-send"
      @click="onSubmit"
    >{{$t('main.send')}}</el-button>

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
        @keyup.enter.native="onSend(false)"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="onSend(false)"
          class="ok-btn"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty, throttle } from "lodash";
import { handleTxReturn } from "../../utils/helpers.js";
export default {
  name: "Confirm",
  data() {
    return {
      form: {},
      dialogVisible: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("account", ["tokenMap", "mathAccount"]),
    token() {
      const { denom } = this.form;
      if (denom.match(/^coin.{10}$/)) {
        return this.tokenMap[denom];
      }
      return false;
    },
    denom() {
      if (this.token) {
        return this.token.symbol;
      }
      if (this.form.denom === "uif") {
        return "IF";
      }
      if (sessionStorage.getItem("boxAmount")) {
        return JSON.parse(sessionStorage.getItem("boxAmount")).label;
      }
      return this.form.denom.toUpperCase();
    }
  },
  methods: {
    onSubmit: async function() {
      // use math wallet
      if (!isEmpty(this.mathAccount)) {
        this.onSend(true);
        return;
      }
      // else use local wallet
      this.pass = "";
      this.dialogVisible = true;
    },
    onSend: throttle(
      async function(useMathWallet) {
        if (!useMathWallet && !this.pass) {
          this.$message({
            type: "error",
            message: this.$t("global.required", {
              name: this.$t("create.pass")
            }),
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
        const params = { ...this.form, pass: this.pass };
        // fix token amount by token decimals
        if (this.token) {
          params.amount = BigNumber(this.form.amount)
            .times(BigNumber(10).pow(this.token.decimals))
            .toFixed();
        } else if (this.form.denom === "uif") {
          params.amount = BigNumber(this.form.amount)
            .times(BigNumber(10).pow(6))
            .toFixed();
        } else {
          // box send
          const token = JSON.parse(sessionStorage.getItem("boxAmount"));
          // deposit
          if (token.denom.slice(3, 5) === "ab") {
            params.amount = BigNumber(params.amount).dividedBy(token.price);
          }
          // future
          if (token.denom.slice(3, 5) === "ac") {
            params.amount = BigNumber(params.amount)
              .times(Math.pow(10, token.decimal))
              .toFixed();
          }
        }
        let res = "";
        try {
          res = await this.$store.dispatch("transactions/send", params);
        } catch (e) {
          this.$store.dispatch("transactions/result", {});
          this.$message({
            type: "error",
            message: this.$t(`send.error`),
            center: true
          });
        }
        if (res.txhash) {
          const txStatus = await handleTxReturn(res);
          if (txStatus) {
            this.$message.success("send success!");
            this.dialogVisible = false;
            this.$store.dispatch("transactions/result", res);
            this.$router.push("/send/finish");
          } else {
            this.$store.dispatch("transactions/result", {});
          }
        } else {
          this.$store.dispatch("transactions/result", {});
          this.$message({
            type: "error",
            message: this.$t(`send.${res}`),
            center: true
          });
        }
        loading.close();
      },
      1500,
      { trailing: false }
    )
  },
  beforeMount() {
    this.form = JSON.parse(sessionStorage.getItem("sendForm"));
    if (!this.form.denom) {
      this.$router.push("/send/form");
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-send {
  margin-top: $padding-basic;
  width: 100%;
  background: $main-btn;
  color: #fff;
  height: 48px;
}
.ok-btn {
  width: 100%;
  background: $main-btn;
  color: #fff;
}
</style>

