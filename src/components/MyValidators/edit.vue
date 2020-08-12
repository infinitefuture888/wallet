<template>
  <s-card
    title="编辑节点"
    v-if="!isEmpty(detail)"
  >
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        label="节点名称"
        prop="moniker"
      >
        <el-input v-model="form.moniker"></el-input>
      </el-form-item>
      <el-form-item
        label="节点网站"
        prop="website"
      >
        <el-input v-model="form.website"></el-input>
      </el-form-item>
      <el-form-item
        label="节点描述"
        prop="details"
      >
        <el-input v-model="form.details"></el-input>
      </el-form-item>
      <el-form-item
        label="佣金"
        prop="commission_rate"
      >
        <el-input v-model="form.commission_rate"></el-input>
      </el-form-item>
      <el-form-item
        label="min self delegation"
        prop="min_self_delegation"
      >
        <el-input v-model="form.min_self_delegation"></el-input>
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button
        class="btn"
        @click="submit"
      >确定</el-button>
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
export default {
  data() {
    return {
      dialogVisible: false,
      pass: "",
      form: {
        moniker: "",
        website: "",
        details: "",
        commission_rate: "",
        min_self_delegation: ""
      }
    };
  },
  computed: {
    ...mapState("staking", ["validatorMap"]),
    detail() {
      return this.validatorMap[this.$route.query.address];
    },
    rules() {
      return {
        moniker: [{ required: true, message: "必填", trigger: "blur" }]
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
        res = await this.$store.dispatch("transactions/editValidator", {
          ...this.form,
          pass: this.pass,
          address: this.$route.query.address
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
            message: "编辑成功",
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
    const validatorDetail = await this.$store.dispatch(
      "staking/fetchValidator",
      this.$route.query.address
    );
    this.form.moniker = get(validatorDetail, "result.description.moniker");
    this.form.website = get(validatorDetail, "result.description.website");
    this.form.details = get(validatorDetail, "result.description.details");
    this.form.commission_rate = get(
      validatorDetail,
      "result.commission.commission_rates.rate"
    );
    this.form.min_self_delegation = get(
      validatorDetail,
      "result.min_self_delegation"
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