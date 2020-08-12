<template>
  <div class="TxList">
    <div class="table-header && nav">
      <div
        class="header-item"
        v-for="item in fields"
        :key="item.name"
      >{{item.name}}</div>
    </div>
    <div v-if="txList.length > 0">
      <div
        class="table-header && item"
        v-for="(i,index) in txList"
        :key="index"
        @click="goTxDetail(i.txhash)"
      >
        <div
          v-for="item in fields"
          :key="item.name"
        >
          <data-amount
            v-if="(get(i, item.field) instanceof Array)"
            :list="get(i, item.field)"
          />
          <data-amount
            v-else-if="(get(i, item.field) instanceof Object)"
            :list="[get(i, item.field)]"
          />
          <data-amount
            v-else-if="item.name === 'Rewards'"
            :list="rewardList(i, item.field)"
          />
          <data-amount
            v-else-if="item.name === 'Amount'"
            :list="[{denom: get(i, get(fields.find(f => f.linkType === 'token'), 'field')), amount: get(i, item.field)}]"
          />
          <span v-else-if="item.name === 'Action'">{{action(i)}}</span>
          <span v-else-if="item.name.match('Time')">
            {{ get(i, item.field) | formatTime }}
          </span>
          <span v-else-if="item.name === 'Proposal Type'">
            {{ (get(i, item.field) || "").slice(11, (get(i, item.field) || "").length) }}
          </span>
          <span v-else>
            <span v-if="item.name === 'Hash'">{{ (get(i, item.field) || '-').slice(0, 18) + '...'}}</span>
            <span v-else>{{ get(i, item.field) || '-'}}</span>
          </span>
        </div>
      </div>
    </div>
    <div
      class="table-header"
      v-else
    >{{$t('global.noData')}}</div>
  </div>

</template>

<script>
import { isEmpty, get, find, cloneDeep } from "lodash";
import { mapGetters, mapState } from "vuex";
import dataAmount from "@/components/Amount/index.vue";
export default {
  props: {
    list: Array,
    fields: Array,
    load: { type: Boolean, default: false }
  },
  components: {
    "data-amount": dataAmount
  },
  computed: {
    txList() {
      return cloneDeep(this.list);
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
    module() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "message"
      );
      const moduleObj =
        find(get(eventsMessage[0], "attributes"), {
          key: "module"
        }) || {};
      return moduleObj.value;
    }
  },
  methods: {
    get,
    rewardList(row, key) {
      const val = get(row, key);
      return !isEmpty(val)
        ? [{ denom: "uif", amount: val.replace(/[^0-9]/gi, "") }]
        : [];
    },
    goTxDetail(txhash) {
      this.$router.push({ path: `/tx/${txhash}` });
    }
  }
};
</script>
<style lang="scss" scoped>
.TxList {
  width: 100%;
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
    > div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-indent: 1em;
      flex-basis: 20%;
    }
    &.nav {
      font-weight: bolder;
    }
    &.item {
      cursor: pointer;
      &:hover {
        background-color: rgba(230, 230, 230, 1);
      }
    }
  }
}
@include responsive($sm) {
  .TxList {
    .table-header {
      > div {
        flex-basis: 30%;
      }
    }
  }
}
</style>
