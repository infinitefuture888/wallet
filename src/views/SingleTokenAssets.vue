<template>
  <s-page>
    <div class="singleToken-container">
      <div class="singleToken-top">
        <div class="top-left">
          <div class="top-left-img">
            <img
              v-if="viewToken.img"
              :src="viewToken.img"
              alt=""
            >
            <div
              v-else
              class="logo-none"
            ></div>
          </div>
          <div class="top-left-info">
            <p>{{viewToken.denom}}</p>
          </div>
        </div>
        <div class="top-center">
          <p style="font-size:20px;">{{ viewToken.amount | formatNumber }}</p>
          <p>{{$t('singleTokenAssets.available')}}</p>
        </div>
        <div class="top-right">

          <el-button @click="goSendForm">{{$t('main.send')}}</el-button>

          <el-button @click="goReceive">{{$t('main.receive')}}</el-button>

          <el-button @click="goCreat">{{$t('vote.mortgage')}}</el-button>
        </div>
      </div>
      <!-- <div
        class="TransactionList"
        v-if="!isEmpty(txs)"
      >
        <div
          class="empty"
          v-if="transaction.length === 0"
        >{{$t('main.empty')}}</div>
        <div v-else>
          <div
            class="tx-list"
            v-for="(item, index) in transaction"
            :key="index"
            @click="txDetail(item.txhash)"
          >
            <div :class="`tx-action ${action(item)}`"><span>{{action(item)}}</span></div>
            <div class="tx-info">
              <p class="tx-hash">{{item.txhash}}</p>
              <p class="tx-time">{{item.timestamp | formatTime}}</p>
            </div>
            <div class="tx-amount">
              <data-amount
                v-if="action(item) === 'send'"
                :list="get(item, 'tx.value.msg.0.value.amount')"
              >
                <span v-if="get(item, 'tx.value.msg.0.value.from_address') === keyStore.address">-</span>
                <span v-if="get(item, 'tx.value.msg.0.value.to_address') === keyStore.address">+</span>
              </data-amount>
              <data-amount
                v-if="action(item) === 'create_validator'"
                :list="[get(item, 'tx.value.msg.0.value.value')]"
              >-</data-amount>
              <data-amount
                v-if="action(item) === 'delegate'"
                :list="[get(item, 'tx.value.msg.0.value.amount')]"
              >-</data-amount>
              <data-amount
                v-if="action(item) === 'begin_unbonding'"
                :list="[get(item, 'tx.value.msg.0.value.amount')]"
              >+</data-amount>
              <data-amount
                v-if="action(item) === 'withdraw_delegator_reward'"
                :list="withdrawAmount(item)"
              >+</data-amount>
              <data-amount
                v-if="action(item) === 'deposit'"
                :list="get(item, 'tx.value.msg.0.value.amount')"
              >-</data-amount>
            </div>
          </div>
          <p class="all-txs"><a
              target="_blank"
              :href="`${domain}address/${address}`"
              style="font-size: 16px;"
            >{{$t('main.allTxs')}}</a></p>
        </div>
      </div> -->
    </div>
  </s-page>
</template>
<script>
import { getViewToken } from "@/utils/helpers";
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import { filter, forEach, map, isEmpty, find, get, cloneDeep } from "lodash";
import { gardplorerDomain } from "@/constants";
import TransactionList from "@/components/TransactionList";
import dataAmount from "@/components/Amount/index.vue";
import BigNumber from "bignumber.js";
import { txFieldsList } from "@/constants";
export default {
  name: "SingleTokenAssets",
  components: {
    TransactionList,
    "data-amount": dataAmount
  },
  data() {
    return {
      domain: gardplorerDomain
    };
  },
  computed: {
    ...mapState("account", ["balance", "keyStore", "tokenMap"]),
    ...mapState("transactions", { txLoading: "loading", txs: "tokenTx" }),
    ...mapState("lock", ["lockList"]),
    ...mapGetters("account", { address: "currentAddress" }),
    viewBalance() {
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
    denom() {
      return JSON.parse(sessionStorage.getItem("token")).denom;
    },
    viewToken() {
      return getViewToken(
        JSON.parse(sessionStorage.getItem("token")),
        this.tokenMap
      );
    },
    transaction() {
      const txsList = cloneDeep(this.txs);
      const filterArr = txsList.filter(item => {
        const action = this.action(item);
        if (action === "send") {
          const denomArr = map(item.tx.value.msg[0].value.amount, "denom");
          const from = get(item, "tx.value.msg.0.value.from_address");
          const to = get(item, "tx.value.msg.0.value.to_address");
          return (
            denomArr.indexOf(
              JSON.parse(sessionStorage.getItem("token")).denom
            ) > -1 &&
            (from === this.keyStore.address || to === this.keyStore.address)
          );
        }
        if (
          action === "create_validator" ||
          action === "delegate" ||
          action === "begin_unbonding"
        ) {
          const denom = get(item, "tx.value.msg.0.value.value.denom");
          return denom === JSON.parse(sessionStorage.getItem("token")).denom;
        }
        if (action === "withdraw_delegator_reward") {
          return item;
        }
        if (action === "deposit") {
          const denomArr = map(item.tx.value.msg[0].value.amount, "denom");
          return (
            denomArr.indexOf(
              JSON.parse(sessionStorage.getItem("token")).denom
            ) > -1
          );
        }
      });
      return filterArr;
    },
    action() {
      return function(detail) {
        const eventsMessage = get(detail, "events", []).filter(
          item => item.type === "message"
        );
        const action =
          find(get(eventsMessage[0], "attributes"), {
            key: "action"
          }) || {};
        return action.value;
      };
    },
    withdrawAmount() {
      return function(detail) {
        const eventsMessage = get(detail, "events", []).filter(
          item => item.type === "transfer"
        );
        const action =
          find(get(eventsMessage[0], "attributes"), {
            key: "amount"
          }) || {};
        const value = action.value;
        return [
          {
            denom: value.substring(value.length - 5, value.length),
            amount: value.substring(0, value.length - 5)
          }
        ];
      };
    },
    fields: function() {
      return txFieldsList["send"];
    }
  },
  methods: {
    isEmpty,
    numeral,
    get,
    goSendForm() {
      sessionStorage.removeItem("sendForm");
      sessionStorage.removeItem("boxAmount");
      this.$router.push({ path: "send/form" });
    },
    goCreat() {
      this.$router.push({ path: "/main?tab=delegate" });
    },
    goLockList() {
      this.$router.push({ path: "/lock/list" });
    },
    goReceive() {
      this.$router.push({ path: "/receive" });
    },
    fetchData: async function() {
      const action = [
        "send",
        "create_validator",
        "delegate",
        "begin_unbonding",
        "withdraw_delegator_reward",
        "deposit"
      ];
      // const action = ["send"];
      action.forEach(i => {
        let params = {};
        if (i === "send") {
          params = {
            "message.action": i,
            page: 1
          };
        } else {
          params = {
            "message.action": i,
            page: 1,
            "message.sender": this.keyStore.address
          };
        }
        this.$store.dispatch("transactions/fetchTokenTx", params);
      });
    },
    txDetail(txhash) {
      this.$router.push({ path: `/tx/${txhash}` });
    }
  },
  mounted() {
    this.$store.dispatch("account/fetchBalance");
    // this.$store.dispatch("lock/fetchList");
    this.fetchData();
  },
  beforeDestroy() {
    this.$store.commit("transactions/setTokenTxEmpty");
  }
};
</script>
<style lang="scss" scoped>
.singleToken-container {
  max-width: $max-width;
  margin: 0 auto $padding-large;
  > .singleToken-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(0, 0, 0, 0.7);
    background: rgba(245, 247, 250, 1);
    box-shadow: 4px 5px 20px 0;
    padding: $padding-large;
    border-radius: 4px;
    > .top-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > .top-left-img {
        > img {
          width: 80px;
        }
        > .logo-none {
          width: 80px;
          height: 80px;
          background: #eee;
          border-radius: 24px;
        }
      }
      > .top-left-info {
        margin-left: 10px;
        > p {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.7);
          font-weight: bolder;
          height: 30px;
          line-height: 30px;
        }
        > h3 {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          height: 30px;
          line-height: 30px;
        }
      }
    }
    > .top-center {
      font-size: 18px;
      text-align: center;
    }
    > .top-right {
      .el-button {
        margin-left: 10px;
      }
      .el-button--primary {
        background: rgb(74, 170, 248);
        border-color: rgb(74, 170, 248);
      }
    }
  }
  > .TransactionList {
    margin-top: 15px;
    .empty {
      margin: $padding-large;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
    }
    .all-txs {
      margin-top: 16px;
      text-align: center;
    }
    .tx-list {
      display: flex;
      align-items: center;
      background: #fff;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 15px;
      cursor: pointer;
      .tx-action {
        width: 50px;
        height: 50px;
        border-radius: 50px;
        text-align: center;
        line-height: 50px;
        margin-right: 10px;
        color: #fff;
        &.send {
          background: red;
        }
        &.create_validator {
          background: red;
        }
        &.delegate {
          background: red;
        }
        &.begin_unbonding {
          background: rgb(66, 156, 254);
        }
        &.withdraw_delegator_reward {
          background: rgb(66, 156, 254);
        }
        &.deposit {
          background: red;
        }
      }
      .tx-info {
        flex-grow: 1;
        .tx-hash {
          padding: 6px 0;
          color: rgba(0, 0, 0, 0.7);
        }
        .tx-time {
          color: rgba(0, 0, 0, 0.4);
        }
      }
      .tx-amount {
        color: rgba(0, 0, 0, 0.7);
        font-size: 20px;
      }
    }
  }
}
@include responsive($sm) {
  .singleToken-container {
    padding: 16px;
    .singleToken-top {
      flex-direction: column;
      > .top-center {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        > p {
          padding: 0 10px;
        }
      }
      > .top-right {
        display: flex;
        justify-content: space-between;
      }
    }
    > .TransactionList {
      .tx-list {
        flex-direction: column;
        .tx-action {
          margin-right: inherit;
        }
        .tx-info {
          text-align: center;
          .tx-hash {
            width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>

