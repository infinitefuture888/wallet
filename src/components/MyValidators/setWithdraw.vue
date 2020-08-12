<template>
  <s-card :title="$t('myNode.setWithdraw')">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        :label="$t('myNode.withdraw')"
        prop="newAddress"
      >
        <el-input v-model="form.newAddress"></el-input>
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button
        class="btn"
        @click="submit"
      >{{$t("global.ok")}}</el-button>
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
        @keyup.enter.native="onSend"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="onSend"
          class="ok-btn"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { isEmpty, get } from "lodash";
import { handleTxReturn } from "../../utils/helpers.js";
import webc from "@/utils/webc";
export default {
  data() {
    return {
      dialogVisible: false,
      pass: "",
      form: {
        address: "",
        newAddress: ""
      }
    };
  },
  computed: {
    ...mapState("staking", ["validatorMap"]),
    rules() {
      const requireError = name =>
        new Error(this.$t("global.required", { name }));
      const validateAddr = (rule, value, callback) => {
        if (!value || value.trim() === "") {
          callback(
            requireError(
              this.$t("global.required", {
                name: this.$t("myNode.withdraw")
              })
            )
          );
          return;
        }
        if (!webc.account.isValidAddress(value)) {
          callback(this.$t("send.addressWarn"));
          return;
        }
        callback();
      };
      return {
        newAddress: [{ validator: validateAddr, trigger: "blur" }]
      };
    }
  },
  methods: {
    isEmpty,
    get,
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.dialogVisible = true;
          this.pass = "";
        }
      });
    },
    async onSend() {
      if (!this.pass) {
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
      let res = "";
      try {
        res = await this.$store.dispatch("transactions/editWithdraw", {
          ...this.form,
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
          this.$message({
            type: "success",
            message: this.$t("global.success", {
              name: this.$t("myNode.set")
            }),
            center: true,
            duration: 1500,
            onClose: () => {
              this.$router.push({
                path: `/myNode/detail?address=${this.$route.query.address}`
              });
            }
          });
          this.dialogVisible = false;
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
    this.form.address = await this.$store.dispatch(
      "staking/fetchValidatorOwner",
      this.$route.query.address
    );
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
  .btn {
    width: 100%;
    height: 48px;
    background: $main-btn;
    color: #fff;
  }
}
.ok-btn {
  width: 100%;
  background: $main-btn;
  color: #fff;
}
@include responsive($sm) {
  .div {
    padding: 4px 0;
  }
}
</style>