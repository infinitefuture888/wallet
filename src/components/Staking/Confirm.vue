<template>
  <s-card :title="$t('send.confirm')">
    <s-item
      v-if="!isEmpty(fromValidator)"
      :label="$t('staking.fromValidator')"
    >{{ get(fromValidator, 'description.moniker') }}</s-item>
    <s-item
      v-if="!isEmpty(toValidator)"
      :label="$t('staking.toValidator')"
    >{{ get(toValidator, 'description.moniker') }}</s-item>
    <s-item
      v-if="$route.query.action !== 'unbind'"
      :label="$t('staking.commission')"
    >{{ numeral(get(toValidator, 'commission.commission_rates.rate')).format('(0.[00]%)') }}</s-item>
    <s-item :label="$t('send.amount')">{{numeral(form.amount).format('0,0.[000000000000000000]')}} IF</s-item>
    <s-item :label="$t('send.fee')">1 IF</s-item>

    <el-button
      round
      class="btn-send"
      @click="onSubmit"
    >{{$t('global.confirm')}}</el-button>

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
          class="btn-ok"
          @click="onSend(false)"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import { get, isEmpty } from "lodash";
import { handleTxReturn } from "../../utils/helpers.js";
export default {
  name: "StakingConfirm",
  data() {
    return {
      dialogVisible: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("account", ["mathAccount"]),
    ...mapState("staking", ["form", "toValidator", "fromValidator"])
  },
  methods: {
    get,
    isEmpty,
    numeral,
    onSubmit: async function() {
      // use math wallet
      if (!isEmpty(this.mathAccount)) {
        this.onSend(true);
        return;
      }
      // else use local wallet
      this.dialogVisible = true;
    },
    onSend: async function(useMathWallet) {
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
      let res = "";
      try {
        res = await this.$store.dispatch(
          `staking/${this.$route.query.action}`,
          {
            pass: this.pass
          }
        );
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
          this.isShow = false;
          this.$message({
            type: "success",
            message: this.$t("global.success", {
              name: this.$route.query.action
            }),
            center: true,
            duration: 1000
          });
          if (this.$route.query.action === "unbind") {
            this.$router.push(
              `/staking/detail/${this.fromValidator.operator_address}`
            );
          } else {
            this.$router.push(
              `/staking/detail/${this.toValidator.operator_address}`
            );
          }
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
  beforeMount() {
    if (!this.form.amount) {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-send,
.btn-ok {
  margin-top: $padding-basic;
  width: 100%;
  height: 48px;
  background-color: $main-btn;
  color: #fff;
}
</style>

