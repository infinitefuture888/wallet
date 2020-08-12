<template>
  <s-card :title="$t('send.finish')">
    <s-item :label="$t('send.amount')">{{form.amount}} {{denom}}</s-item>
    <s-item :label="$t('send.sender')">{{sender}}</s-item>
    <s-item :label="$t('send.address')">{{recipient}}</s-item>
    <s-item :label="$t('send.fee')">{{form.fee}} IF</s-item>
    <s-item :label="$t('send.txHash')">{{get(result, 'txhash')}}</s-item>
    <s-item :label="$t('send.block')">{{get(result, 'height')}}</s-item>
    <s-item :label="$t('send.time')">{{get(result, 'timestamp') | formatTime}}</s-item>

    <div class="btns">

      <el-button
        class="btn-again"
        @click="goSendForm"
      >{{$t('send.again')}}</el-button>

      <router-link
        class="btn-back"
        to="/main?tab=assets"
      >
        <el-button>{{$t('send.back')}}</el-button>
      </router-link>
    </div>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, find } from "lodash";
import moment from "dayjs";

export default {
  name: "Send",
  data() {
    return {};
  },
  computed: {
    ...mapState("account", ["tokenMap"]),
    ...mapState("transactions", ["form", "result"]),
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
      return this.form.denom.toUpperCase();
    },
    sender() {
      const eventsMessage = get(this.result, "events", []).filter(
        item => item.type === "message"
      );
      const sender =
        find(get(eventsMessage[0], "attributes"), {
          key: "sender"
        }) || {};
      return sender.value;
    },
    recipient() {
      const eventsMessage = get(this.result, "events", []).filter(
        item => item.type === "transfer"
      );
      const recipient =
        find(get(eventsMessage[0], "attributes"), {
          key: "recipient"
        }) || {};
      return recipient.value;
    }
  },
  methods: {
    get,
    moment,
    goSendForm() {
      sessionStorage.removeItem("sendForm");
      this.$router.push({ path: "/send/form" });
    }
  }
};
</script>

<style lang="scss" scoped>
.btns {
  display: flex;
  .btn-again {
    margin-right: 16px;
    flex-grow: 1;
    height: 48px;
    background-color: $main-btn;
    color: #fff;
  }
  .btn-back {
    margin-left: 16px;
    flex-grow: 1;
    button {
      height: 48px;
      background-color: $main-btn;
      color: #fff;
      width: 100%;
    }
  }
}
</style>

