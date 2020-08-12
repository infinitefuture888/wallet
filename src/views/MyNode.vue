<template>
  <div class="staking-container">
    <div class="valid-list">
      <div v-if="pageWidth > 414">
        <div class="table-header && nav">
          <div class="header-name">{{$t("myNode.name")}}</div>
          <div class="header-comission">{{$t("myNode.comissionRate")}}</div>
          <div class="header-address">{{$t("myNode.address")}}</div>
          <div class="header-time">{{$t("myNode.time")}}</div>
          <div class="view">{{$t("main.operation")}}</div>
        </div>
      </div>
      <div v-else>
        <div class="table-header && nav">
          <div class="header-name">{{$t("myNode.name")}}</div>
          <div class="header-comission">{{$t("myNode.comissionRate")}}</div>
          <div class="view">{{$t("main.operation")}}</div>
        </div>
      </div>

      <div
        class="empty"
        v-if="myValidators.length === 0"
      >{{$t('global.noData1')}}</div>
      <div v-else>
        <div v-if="pageWidth > 414">
          <div
            class="table-header"
            v-for="(v,index) in myValidators"
            :key="index"
          >
            <div class="header-name">{{get(v, 'description.moniker')}}</div>
            <div class="header-comission">{{numeral(get(v, 'commission.commission_rates.rate')).format('(0.[00]%)')}}</div>
            <div class="header-address">{{get(v, 'operator_address')}}</div>
            <div class="header-time">{{get(v,'commission.update_time') | formatTime}}</div>
            <div
              class="view"
              style="cursor:pointer;color:#330867;"
              @click="goDetail(get(v, 'operator_address'))"
            >{{$t("global.view")}}</div>
          </div>
        </div>
        <div v-else>
          <div
            class="table-header"
            v-for="(v,index) in myValidators"
            :key="index"
          >
            <div class="header-name">{{get(v, 'description.moniker')}}</div>
            <div class="header-comission">{{numeral(get(v, 'commission.commission_rates.rate')).format('(0.[00]%)')}}</div>
            <div
              class="view"
              style="cursor:pointer;color:#330867;"
              @click="goDetail(get(v, 'operator_address'))"
            >{{$t("global.view")}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import { get, isEmpty } from "lodash";
import { getViewToken } from "@/utils/helpers";
export default {
  data() {
    return {
      pageWidth: document.documentElement.clientWidth
    };
  },
  computed: {
    ...mapState("account", ["tokenMap", "keyStore"]),
    ...mapState("staking", ["validators"]),
    myValidators() {
      if (this.validators.length == 0) {
        return [];
      } else {
        return this.validators.filter(i => {
          return i.owner == this.keyStore.address;
        });
      }
    }
  },
  methods: {
    get,
    numeral,
    getViewToken,
    handleResize(event) {
      this.pageWidth = document.documentElement.clientWidth;
    },
    goDetail(address) {
      this.$router.push({ path: `/myNode/detail?address=${address}` });
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    this.$store.dispatch("staking/fetchValidators", true);
  }
};
</script>

<style lang="scss" scoped>
.staking-container {
  max-width: $max-width;
  margin: 0 auto $padding-large;
  padding: $padding-large 0;
  .valid-list {
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
    }
    .nav {
      font-weight: bolder;
    }
  }
  .empty {
    background-color: rgba(245, 247, 250, 1);
    height: 50px;
    line-height: 50px;
    border-radius: 4px;
    text-align: center;
    color: rgba(0, 0, 0, 0.7);
  }
}
@include responsive($sm) {
  .staking-container {
    .valid-list {
      .table-header {
        > div {
          flex-basis: 40%;
        }
        .view {
          flex-basis: 20%;
        }
      }
    }
  }
}
</style>