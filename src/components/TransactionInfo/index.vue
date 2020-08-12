<template>
  <s-page>
    <s-card :title="txStatus ? '' : '交易失败'">
      <div
        class="transaction-detail-content"
        v-if="!isEmpty(detail)"
      >
        <div v-if="txStatus">
          <s-item
            v-for="item in fields[type]"
            :key="item.name"
            :label="item.name"
          >
            <span>
              <data-amount
                v-if="(get(detail, item.field) instanceof Array)"
                :list="get(detail, item.field)"
              />
              <data-amount
                v-else-if="(get(detail, item.field) instanceof Object)"
                :list="[get(detail, item.field)]"
              />
              <span v-else-if="item.name === 'Action'">
                {{action}}
              </span>
              <data-amount
                v-else-if="item.name === 'Amount'"
                :list="[{denom: get(detail, get(fields[type].find(f => f.linkType === 'token'), 'field')), amount: get(detail, item.field)}]"
              />
              <data-amount
                v-else-if="item.name === 'Rewards'"
                :list="rewardList(get(detail, item.field))"
              />
              <span v-else-if="item.name === 'Lock End'">
                {{ get(detail, item.field) | formatTime }}
              </span>
              <span v-else-if="item.name === 'Description'">
                {{ description }}
              </span>
              <span v-else-if="item.name.match('Time')">
                <span v-if="action === 'begin_unbonding'">{{completionTime | formatTime}}</span>
                <span v-else-if="action === 'begin_redelegate'">{{RedelegateCompletionTime | formatTime}}</span>
                <span v-else>{{ get(detail, item.field) | formatTime }}</span>
              </span>
              <span v-else-if="item.name === 'Proposal Type'">
                {{ (get(detail, item.field) || "").slice(11, (get(detail, item.field) || "").length) }}
              </span>
              <span v-else-if="typeof get(detail, item.field) === 'boolean'">
                {{ get(detail, item.field).toString() }}
              </span>
              <span v-else>
                {{ get(detail, item.field) || '-'}}
              </span>
            </span>
          </s-item>
        </div>
        <div v-else>
          <s-item label="txhash">
            <span>{{detail.txhash}}</span>
          </s-item>
        </div>
      </div>
    </s-card>
  </s-page>

</template>

<script>
import { isEmpty, get, find } from "lodash";
import { mapGetters, mapState } from "vuex";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";

import { txFieldsMap } from "@/constants";
import dataAmount from "@/components/Amount/index.vue";
export default {
  data: function() {
    return { fields: txFieldsMap };
  },
  components: {
    "data-amount": dataAmount
  },
  methods: {
    get,
    isEmpty,
    rewardList(val) {
      return [{ denom: "uif", amount: val.replace(/[^0-9]/gi, "") }];
    }
  },
  computed: {
    ...mapState("transactions", ["details"]),
    hash: function() {
      return this.$route.params.id;
    },
    detail: function() {
      const detail = this.details[this.hash];
      return detail;
    },
    description: function() {
      const str = get(
        this.detail,
        get(
          this.fields[this.type].find(f => f.name === "Description"),
          "field"
        )
      );
      if (!str) {
        return "-";
      }
      try {
        return Utf8.stringify(Base64.parse(str));
      } catch (e) {
        return str;
      }
    },
    type: function() {
      // issue 模块交易失败的时候 tags 中不包含 category 字段。
      // if (action && action.value.match("issue")) {
      //   return action && action.value;
      // }
      return `${this.action && this.action}_${this.module && this.module}`;
    },
    action() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "message"
      );
      const action =
        find(get(eventsMessage[0], "attributes"), {
          key: "action"
        }) || {};
      return action.value;
    },
    module() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "message"
      );
      const moduleObj =
        find(get(eventsMessage[0], "attributes"), {
          key: "module"
        }) || {};
      return moduleObj.value;
    },
    completionTime() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "unbond"
      );
      const unbondObj =
        find(get(eventsMessage[0], "attributes"), {
          key: "completion_time"
        }) || {};
      return unbondObj.value;
    },
    RedelegateCompletionTime() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "redelegate"
      );
      const redelegateObj =
        find(get(eventsMessage[0], "attributes"), {
          key: "completion_time"
        }) || {};
      return redelegateObj.value;
    },
    txStatus() {
      return get(this.detail, "logs.0.success");
    }
  },
  watch: {
    detail() {
      if (isEmpty(this.detail)) {
        return false;
      }
      // fetch token detail
      let denom = "";
      if (this.action.match("issue")) {
        denom = get(this.detail, "tags.2.value");
      }
      if (this.action.match("inject")) {
        denom = get(this.detail, "tx.value.msg.0.value.amount.denom");
      }
      if (this.action.match("create")) {
        denom = get(
          this.detail,
          "tx.value.msg.0.value.params.total_amount.token.denom"
        );
      }
      if (this.action.match("take")) {
        denom = get(this.detail, "tx.value.msg.0.value.value.denom");
      }
      if (denom && denom.match(/^coin.{10}$/)) {
        this.$store.dispatch("tokens/fetchDetail", denom);
        return;
      }
      if (this.action.match("send")) {
        const coins = get(this.detail, "tx.value.msg.0.value.amount");
        coins.forEach(i => {
          if (i.denom.match(/^coin.{10}$/)) {
            this.$store.dispatch("tokens/fetchDetail", i.denom);
          }
        });
      }
      if (this.action === "make") {
        const coins = [
          get(this.detail, "tx.value.msg.0.value.target"),
          get(this.detail, "tx.value.msg.0.value.supply")
        ];
        coins.forEach(i => {
          if (i.denom.match(/^coin.{10}$/)) {
            this.$store.dispatch("tokens/fetchDetail", i.denom);
          }
        });
      }
    }
  },
  mounted() {
    this.$store.dispatch("transactions/fetch", this.hash);
  }
};
</script>
