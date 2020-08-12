<template>
  <s-card :title="$t('vote.creat')">
    <div class="creat-form">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="title">
          <el-input
            v-model="form.title"
            :placeholder="$t('vote.title')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-select
            v-model="form.type"
            @change="changeType"
          >
            <!-- <el-option
              label="提案类型"
              value="提案类型"
              :disabled="true"
            ></el-option> -->
            <el-option
              label="Text"
              value="Text"
            ></el-option>
            <!-- <el-option
              label="ParameterChange"
              value="ParameterChange"
            ></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            :placeholder="$t('vote.describe')"
            maxlength="150"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item prop="amount">
          <div class="amount-info">
            <p>{{$t("vote.activation")}}: 10</p>
            <p v-if="!isEmpty(gardBalance)">{{$t("send.balance")}}: {{gardBalance.amount | formatNumber}}{{gardBalance.denom}}</p>
          </div>
          <el-input v-model.number.trim="form.amount"></el-input>
          <!-- <div class="amount-info">
            <p>{{$t("send.fee")}}: 10000</p>
          </div> -->
        </el-form-item>
        <el-form-item>
          <el-button
            round
            class="ok-btn"
            @click="onSubmit('form')"
          >{{$t("global.confirm")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="提案参数"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-checkbox-group v-model="parameterSelected">
        <el-checkbox
          v-for="(item ,index) in parameter"
          :key="index"
          :label="item.name"
        ></el-checkbox>
      </el-checkbox-group>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button class="ok-btn">{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('create.pass')"
      :visible.sync="dialogVisible1"
      width="360px"
      :close-on-click-modal="false"
    >
      <el-input
        type="password"
        v-model="form.pass"
        :placeholder="$t('create.pass')"
        @keyup.enter.native="creatVote(false)"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="ok-btn"
          @click="creatVote(false)"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </s-card>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { isEmpty, get } from "lodash";
import { getViewToken } from "@/utils/helpers";
import { parameter } from "@/constants";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      parameterSelected: [],
      parameter,
      form: {
        title: null,
        description: null,
        type: "Text",
        denom: "uif",
        amount: 10,
        pass: null
      }
    };
  },
  computed: {
    ...mapState("account", ["balance", "tokenMap", "mathAccount"]),
    ...mapState("gov", ["minDeposit"]),
    rules() {
      const validatorNumber = (rule, value, callback) => {
        if (!Number.isInteger(value) || value <= 0) {
          callback(new Error(this.$t("deposit.PositiveNumber")));
          return;
        }
        callback();
      };
      const rules = {
        title: [
          {
            required: true,
            message: this.$t("global.required", {
              name: this.$t("vote.title")
            }),
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: this.$t("global.required", {
              name: this.$t("vote.describe")
            }),
            trigger: "blur"
          }
        ],
        amount: [
          {
            validator: validatorNumber,
            trigger: "blur"
          }
        ]
      };
      return rules;
    },
    gardBalance() {
      if (!isEmpty(this.balance)) {
        let token = this.balance.filter(i => {
          return i.denom === "uif";
        });
        return getViewToken(token[0], this.tokenMap);
      } else {
        return { denom: "IF", amount: 0 };
      }
    }
  },
  methods: {
    isEmpty,
    changeType(val) {
      if (val == "ParameterChange") {
        this.dialogVisible = true;
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // use math wallet
          if (!isEmpty(this.mathAccount)) {
            this.creatVote(true);
            return;
          }
          // else use local wallet
          this.form.pass = "";
          this.dialogVisible1 = true;
        } else {
          return false;
        }
      });
    },
    creatVote: async function(useMathWallet) {
      if (!useMathWallet && !this.form.pass) {
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
      const params = { ...this.form };
      params.amount = BigNumber(this.form.amount)
        .times(BigNumber(10).pow(6))
        .toFixed();
      let res = "";
      try {
        res = await this.$store.dispatch("gov/create", params);
      } catch (e) {
        this.$message({
          type: "error",
          message: this.$t(`send.error`),
          center: true
        });
      }
      if (res.txhash) {
        this.dialogVisible1 = false;
        this.$message({
          type: "success",
          message: this.$t("global.success", {
            name: this.$t("vote.creat")
          }),
          center: true,
          duration: 1000,
          onClose: () => {
            this.$router.push({
              path: "/main?tab=vote"
            });
          }
        });
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
  mounted() {
    this.$store.dispatch("account/fetchBalance");
  }
};
</script>
<style lang="scss" scoped>
.creat-form {
  margin-top: 20px;
  .el-select {
    width: 100%;
  }
  .amount-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ok-btn {
    height: 48px;
    background-color: $main-btn;
    color: #fff;
    width: 100%;
  }
}
.el-checkbox-group {
  display: flex;
  justify-content: flex-start;

  align-items: center;
  flex-wrap: wrap;
  .el-checkbox {
    flex-basis: 35%;
    font-size: 16px;
    margin-bottom: 15px;
  }
}
.dialog-footer {
  .ok-btn {
    background-color: $main-btn;
    color: #fff;
  }
}
@include responsive($sm) {
  .el-dialog {
    width: 90% !important;
  }
  .creat-form {
    .amount-info {
      display: block;
    }
  }
}
</style>