<template>
  <div v-if="pageWidth > 414">

    <div class="table-header && hover">
      <!-- <div class="header-index">
        <p>{{ index }}</p>
      </div> -->
      <div class="header-name">{{ get(v, 'description.moniker') }}</div>
      <div class="header-address">{{ v.operator_address | gardValidator }}</div>
      <div class="header-com">{{ numeral(get(v, 'commission.commission_rates.rate')).format('(0.[00]%)') }}</div>
      <div class="header-del"><span v-if="get(delegation, 'shares')">{{myToken.amount | formatNumber}}</span>/{{ viewToken.amount | formatNumber }}</div>
      <div class="header-rewards">
        <p v-if="get(delegation, 'shares')">
          <span v-if="!isEmpty(reward)">
            <span>{{numeral(reward.amount).format('0,0.[0000]')}}{{reward.denom}}</span>
          </span>
          <span v-else>{{$t("global.null")}}</span>
        </p>
      </div>
      <div
        @click="goDetail(v.operator_address)"
        style="cursor:pointer;color:#330867;"
      >{{$t("global.view")}}</div>
    </div>
  </div>
  <div v-else>

    <div class="table-header && hover">
      <div class="header-name">{{ get(v, 'description.moniker') }}</div>
      <div class="header-del"><span v-if="get(delegation, 'shares')">{{myToken.amount | formatNumber}}</span></div>
      <div class="header-rewards">
        <p v-if="get(delegation, 'shares')">
          <span v-if="!isEmpty(reward)">
            <span>{{numeral(reward.amount).format('0,0.[0000]')}}{{reward.denom}}</span>
          </span>
          <span v-else>{{$t("global.null")}}</span>
        </p>
      </div>
      <div
        @click="goDetail(v.operator_address)"
        style="cursor:pointer;color:#330867;"
      >{{$t("global.view")}}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import numeral from "numeral";
import { get, isEmpty } from "lodash";
import { getViewToken } from "@/utils/helpers";
import BigNumber from "bignumber.js";
export default {
  name: "ValidatorPanel",
  data() {
    return {
      pageWidth: document.documentElement.clientWidth
    };
  },
  props: {
    delegation: Object,
    v: { type: Object, required: true },
    index: Number
  },
  computed: {
    ...mapState("account", ["tokenMap"]),
    ...mapState("staking", ["rewardMap"]),
    viewToken() {
      const token = { denom: "uif", amount: this.v.tokens };
      return getViewToken(token, this.tokenMap);
    },
    reward() {
      const result = get(
        this.rewardMap,
        get(this.delegation, "validator_address")
      );
      if (!isEmpty(result)) {
        return getViewToken(get(result, "result.0"));
      }
    },
    myToken() {
      // myShares
      const myShares = get(this.delegation, "shares");
      // myToken/myGard
      const myToken = BigNumber(this.v.tokens)
        .times(myShares)
        .dividedBy(this.v.delegator_shares)
        .toString();
      return getViewToken({ denom: "uif", amount: myToken });
    }
  },
  methods: {
    get,
    isEmpty,
    numeral,
    getViewToken,
    handleResize(event) {
      this.pageWidth = document.documentElement.clientWidth;
    },
    goDetail(value) {
      this.$router.push({ path: `/staking/detail/${value}` });
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    const validator = get(this.delegation, "validator_address");
    if (!isEmpty(validator)) {
      this.$store.dispatch("staking/fetchReward", validator);
    }
  }
};
</script>

<style lang="scss" scoped>
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
  // &.hover {
  //   &:hover {
  //     cursor: pointer;
  //     background-color: rgba(230, 230, 230, 1);
  //   }
  // }
  > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-indent: 1em;
    flex-basis: 20%;
  }
  > .header-com {
    flex-basis: 10%;
  }
  > .header-rewards {
    flex-basis: 30%;
  }
}

@include responsive($sm) {
  .table-header {
    > div {
      flex-basis: 25%;
    }
  }
  .delegation-item {
    flex-basis: 100%;
    margin: 8px 0;
  }
}
</style>

