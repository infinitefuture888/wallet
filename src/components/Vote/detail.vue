<template>
  <div
    class="vote-detail"
    v-if="!isEmpty(detailData)"
  >
    <div
      class="voting-time"
      v-if="detailData.proposal_status === 'VotingPeriod'"
    >
      <p class="title">{{$t("vote.distanceTime")}} <span>{{votingTime}}</span></p>
      <div class="time">
        <span>{{detailData.voting_start_time | formatTime}}</span>
        <el-progress
          :percentage="timePercent"
          color="#330867"
        ></el-progress>
        <span>{{detailData.voting_end_time | formatTime}}</span>
      </div>
    </div>
    <p class="title">{{get(detailData, 'content.value.title') || ''}}</p>
    <div class="content">
      <div class="content-top">
        <span>VoteID: <span class="detail-info">{{detailData.id}}</span></span>
      </div>
      <div class="status">{{$t("lockInput.status")}}: <span class="detail-info">{{getStatus}}</span></div>
      <div class="deposit">{{$t("vote.totalDeposit")}}: <span class="detail-info">{{totalDeposit.amount}} {{totalDeposit.denom}}</span></div>
      <div
        class="changes"
        v-if="get(detailData, 'content.value.changes')"
      >
        <p>{{$t("vote.parameter")}}:</p>
        <div
          v-for="(item, index) in get(detailData, 'content.value.changes')"
          :key="index"
          class="params"
        >
          <span>{{index}}. {{item.subspace}}/{{item.key}}</span>
          <span>{{$t("vote.adjusted")}}: {{item.value}}</span>
        </div>
      </div>
      <div class="submit-time">{{$t("lockInput.creatTime")}}: <span class="detail-info">{{detailData.submit_time | formatTime}}</span></div>
      <div class="des">{{get(detailData, "content.value.description") || ""}}</div>
    </div>
    <div
      class="form-content"
      v-if="detailData.proposal_status === 'DepositPeriod'"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="amount">
          <el-progress
            style="width: 100%;"
            :percentage="depositPercent"
            color="#330867"
          ></el-progress>
          <p>
            <span><span>{{$t("vote.needMortgage")}}</span><span> {{needDeposit}} IF </span><span>{{$t("vote.activation")}}</span></span>
            <span></span>
          </p>
          <el-input v-model.number.trim="form.amount"></el-input>
          <p class="balance">
            <span>{{$t("send.fee")}}: 100IF</span>
            <span v-if="!isEmpty(gardBalance)">{{$t("send.balance")}}: {{gardBalance.amount | formatNumber}}{{gardBalance.denom}}</span>
          </p>
        </el-form-item>
        <el-form-item>
          <el-button
            round
            class="ok-btn"
            @click="onSubmit('form')"
          >{{$t("vote.mortgage")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div
      class="vote-content"
      v-if="detailData.proposal_status !== 'DepositPeriod'"
    >
      <div class="table-header && nav">
        <div
          class="radio"
          v-if="detailData.proposal_status === 'VotingPeriod'"
        ></div>
        <div>{{$t("vote.option")}}</div>
        <div>{{$t("vote.numberVotes")}}</div>
        <div>{{$t("vote.proportion")}}</div>
      </div>

      <div
        class="table-header && hover"
        v-for="(item, key, index) in detailData.final_tally_result"
        :key="index"
      >
        <div
          class="radio"
          v-if="detailData.proposal_status === 'VotingPeriod'"
        >
          <el-radio
            v-model="voted"
            :label="key"
          ></el-radio>
        </div>
        <div>{{key}}</div>
        <div>{{voteCount(key)}}</div>
        <div>{{percent(voteCount(key))}}</div>
      </div>
    </div>
    <el-dialog
      :title="$t('create.pass')"
      :visible.sync="dialogVisible"
      width="360px"
    >
      <el-input
        type="password"
        v-model="form.pass"
        :placeholder="$t('create.pass')"
        @keyup.enter.native="handle(false)"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="handle(false)"
          class="dia-ok-btn"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { isEmpty, get } from "lodash";
import { getViewToken } from "@/utils/helpers";
import BigNumber from "bignumber.js";
export default {
  name: "voteDetail",
  data() {
    return {
      type: null,
      dialogVisible: false,
      form: {
        amount: null,
        pass: null
      },
      voted: ""
    };
  },
  computed: {
    ...mapState("gov", ["proposalMap", "votes", "minDeposit"]),
    ...mapState("account", ["balance", "tokenMap", "mathAccount"]),
    rules() {
      const validatorNumber = (rule, value, callback) => {
        if (!Number.isInteger(value) || value <= 0) {
          callback(new Error(this.$t("deposit.PositiveNumber")));
          return;
        }
        callback();
      };
      const rules = {
        amount: [
          {
            validator: validatorNumber,
            trigger: "blur"
          }
        ]
      };
      return rules;
    },
    detailData() {
      return this.proposalMap[this.$route.params.id];
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
    },
    totalVote() {
      if (this.detailData.proposal_status === "VotingPeriod") {
        if (!isEmpty(this.votes)) {
          return this.votes.length;
        } else {
          return 0;
        }
      } else {
        return (
          parseInt(this.detailData.final_tally_result.yes) +
          parseInt(this.detailData.final_tally_result.no) +
          parseInt(this.detailData.final_tally_result.abstain) +
          parseInt(this.detailData.final_tally_result.no_with_veto)
        );
      }
    },
    percent() {
      return function(value) {
        if (value == "0") {
          return 0;
        } else {
          const result = (parseInt(value) / this.totalVote) * 100;
          return `${result}%`;
        }
      };
    },
    votingTime() {
      const time = Math.abs(
        new Date(this.detailData.voting_end_time).getTime() -
          new Date().getTime()
      );

      const m = parseInt(time / 1000 / 60);
      if (m <= 60) {
        return `${m}分钟`;
      } else {
        const h = (m / 60).toFixed(2);
        const timeArry = h.split(".");
        const minute = parseFloat(`0.${timeArry[1]}`);
        return `${timeArry[0]}小时${parseInt(minute * 60)}分`;
      }
    },
    surplusTime() {
      const time = Math.abs(
        new Date(this.detailData.voting_end_time).getTime() -
          new Date().getTime()
      );
      return parseInt(time / 1000 / 60);
    },
    voteTime() {
      const time = Math.abs(
        new Date(this.detailData.voting_end_time).getTime() -
          new Date(this.detailData.voting_start_time).getTime()
      );
      return parseInt(time / 1000 / 60);
    },
    timePercent() {
      return 100 - parseInt((this.surplusTime / this.voteTime) * 100);
    },
    voteYes() {
      if (this.detailData.proposal_status === "VotingPeriod") {
        if (!isEmpty(this.votes)) {
          const filterArr = this.votes.filter(item => {
            return item.option === "Yes";
          });
          return filterArr.length;
        } else {
          return 0;
        }
      } else {
        return parseInt(this.detailData.final_tally_result.yes);
      }
    },
    voteNo() {
      if (this.detailData.proposal_status === "VotingPeriod") {
        if (!isEmpty(this.votes)) {
          const filterArr = this.votes.filter(item => {
            return item.option === "No";
          });
          return filterArr.length;
        } else {
          return 0;
        }
      } else {
        return parseInt(this.detailData.final_tally_result.no);
      }
    },
    voteAbstain() {
      if (this.detailData.proposal_status === "VotingPeriod") {
        if (!isEmpty(this.votes)) {
          const filterArr = this.votes.filter(item => {
            return item.option === "Abstain";
          });
          return filterArr.length;
        } else {
          return 0;
        }
      } else {
        return parseInt(this.detailData.final_tally_result.abstain);
      }
    },
    voteNoWithVeto() {
      if (this.detailData.proposal_status === "VotingPeriod") {
        if (!isEmpty(this.votes)) {
          const filterArr = this.votes.filter(item => {
            return item.option === "NoWithVeto";
          });
          return filterArr.length;
        } else {
          return 0;
        }
      } else {
        return parseInt(this.detailData.final_tally_result.no_with_veto);
      }
    },
    voteCount() {
      return function(option) {
        switch (option) {
          case "yes":
            return this.voteYes;
            break;
          case "no":
            return this.voteNo;
            break;
          case "abstain":
            return this.voteAbstain;
            break;
          case "no_with_veto":
            return this.voteNoWithVeto;
            break;
        }
      };
    },
    totalDeposit() {
      const token = get(this.detailData, "total_deposit");
      return getViewToken(token[0], this.tokenMap) || {};
    },
    minAmount() {
      let token;
      if (!isEmpty(this.minDeposit)) {
        token = get(this.minDeposit, "min_deposit");
        return getViewToken(token[0], this.tokenMap) || {};
      }
    },
    needDeposit() {
      if (!isEmpty(this.totalDeposit) && !isEmpty(this.minAmount)) {
        if (
          parseInt(this.totalDeposit.amount) >= parseInt(this.minAmount.amount)
        ) {
          return 0;
        } else {
          return (
            parseInt(this.minAmount.amount) - parseInt(this.totalDeposit.amount)
          );
        }
      }
    },
    depositPercent() {
      if (!isEmpty(this.totalDeposit) && !isEmpty(this.minAmount)) {
        return (
          (parseInt(this.totalDeposit.amount) /
            parseInt(this.minAmount.amount)) *
          100
        );
      }
    },
    totalDeposit() {
      return getViewToken(this.detailData.total_deposit[0], this.tokenMap);
    },
    getStatus() {
      switch (this.detailData.proposal_status) {
        case "DepositPeriod":
          return this.$t("deposit.toBeActivated");
          break;
        case "VotingPeriod":
          return this.$t("vote.voting");
          break;
        case "Passed":
          return this.$t("vote.passed");
          break;
        case "Rejected":
          return this.$t("vote.reject");
          break;
      }
    }
  },
  watch: {
    voted(val) {
      this.type = false;
      this.dialogVisible = true;
      this.form.pass = "";
    }
  },
  methods: {
    isEmpty,
    get,
    getSeconds() {},
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.type = true;
          // use math wallet
          if (!isEmpty(this.mathAccount)) {
            this.handle(true);
            return;
          }
          // else use local wallet
          this.form.pass = "";
          this.dialogVisible = true;
        } else {
          return false;
        }
      });
    },
    handle: async function(useMathWallet) {
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
      let params;
      if (this.type) {
        params = { ...this.form };
        params.id = this.$route.params.id;
        params.denom = get(this.detailData, "total_deposit.0.denom");
        let decimals;
        if (params.denom === "uif") {
          decimals = 6;
        } else {
          decimals = this.tokenMap[params.denom].decimals;
        }
        params.amount = BigNumber(params.amount)
          .times(BigNumber(10).pow(decimals))
          .toFixed();
      } else {
        let option;
        switch (this.voted) {
          case "yes":
            option = "Yes";
            break;
          case "abstain":
            option = "Abstain";
            break;
          case "no":
            option = "No";
            break;
          case "no_with_veto":
            option = "NoWithVeto";
            break;
        }
        params = {
          pass: this.form.pass,
          id: this.$route.params.id,
          option
        };
      }
      let res = "";
      try {
        const action = this.type ? "gov/deposit" : "gov/vote";
        res = await this.$store.dispatch(action, params);
      } catch (e) {
        this.$message({
          type: "error",
          message: this.$t(`send.error`),
          center: true
        });
      }
      if (res.txhash) {
        this.dialogVisible = false;
        this.$message({
          type: "success",
          message: this.$t("global.success", {
            name: this.type ? this.$t("vote.mortgage") : this.$t("vote.vote")
          }),
          center: true,
          duration: 2000,
          onClose: () => {
            this.$store.dispatch("account/fetchBalance");
            this.$store.dispatch("gov/fetchVotes", this.$route.params.id);
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
    this.$store.dispatch("gov/list", {});
    this.$store.dispatch("account/fetchBalance");
    this.$store.dispatch("gov/fetchVotes", this.$route.params.id);
    this.$store.dispatch("gov/fetchMinDeposit");
  }
};
</script>
<style lang="scss" scoped>
.vote-detail {
  color: #000;
  margin-top: 20px;
  .voting-time {
    padding: $padding-basic;
    background: #fff;
    border-radius: 6px;
    color: #000;
    margin-bottom: 40px;
    .time {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-progress {
        flex-basis: 60%;
      }
      /deep/.el-progress__text {
        display: none;
      }
      /deep/.el-progress-bar {
        padding-right: 0;
      }
    }
  }
  .title {
    text-align: center;
    font-size: 24px;
    span {
      color: red;
    }
  }
  .content {
    padding: $padding-basic;
    background: #fff;
    border-radius: 6px;
    margin-top: 20px;
    > .content-top {
      margin-top: 15px;
    }
    > .status {
      margin-top: 20px;
    }
    > .deposit {
      margin-top: 20px;
    }
    > .des {
      margin-top: 20px;
      color: rgba(0, 0, 0, 0.7);
    }
    > .changes {
      margin-top: 20px;
      p {
        margin-bottom: 15px;
      }
      .params {
        color: rgba(0, 0, 0, 0.7);
        span {
          margin-right: 15px;
        }
      }
    }
    > .submit-time {
      margin-top: 20px;
    }
    .detail-info {
      color: rgba(0, 0, 0, 0.7);
    }
  }
  .form-content {
    margin: 60px auto 0;
    border-radius: 4px;
    max-width: 470px;
    color: rgba(0, 0, 0, 0.8);
    /deep/.el-progress__text {
      display: none;
    }
    /deep/.el-progress-bar {
      padding-right: 0;
    }
  }
  .vote-content {
    margin-top: 60px;
    .table-header {
      background-color: rgba(245, 247, 250, 1);
      display: flex;
      justify-content: space-around;
      height: 50px;
      line-height: 50px;
      border-radius: 4px;
      margin-bottom: 10px;
      text-align: left;
      color: rgba(0, 0, 0, 0.7);
      &.nav {
        font-weight: bolder;
      }
      &.hover {
        &:hover {
          cursor: pointer;
          background-color: rgba(230, 230, 230, 1);
        }
      }
      > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-indent: 1em;
        flex-basis: 20%;
      }
      .radio {
        flex-basis: 10%;
      }
      /deep/.el-radio__label {
        display: none !important;
      }
    }
  }
  .balance {
    display: flex;
    justify-content: space-between;
  }
  .ok-btn {
    background-color: $main-btn;
    border-color: transparent;
    color: #fff;
    width: 100%;
    height: 48px;
    margin-top: 10px;
  }
}
.dialog-footer {
  .dia-ok-btn {
    background-color: $main-btn;
    color: #fff;
  }
}
@include responsive($sm) {
  .vote-detail {
    .vote-content {
      .table-header {
        .radio {
          flex-basis: 20%;
        }
      }
    }
    .voting-time {
      .time {
        flex-direction: column;
        /deep/ .el-progress {
          width: 100% !important;
        }
      }
    }
  }
}
</style>