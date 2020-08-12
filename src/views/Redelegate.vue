<template>
  <div class="staking-container">
    <div class="valid-list">
      <div v-if="pageWidth > 414">
        <div class="table-header && nav">
          <div class="header-amount">{{$t('redelegate.amount')}}</div>
          <div class="header-address">{{$t('redelegate.validatorFrom')}}</div>
          <div class="header-address">{{$t('redelegate.validatorTo')}}</div>
          <div class="header-time">{{$t('redelegate.completionTime')}}</div>
          <div class="view">{{$t("main.operation")}}</div>
        </div>
      </div>
      <div v-else>
        <div class="table-header && nav">
          <div class="header-amount">{{$t('redelegate.amount')}}</div>
          <div class="header-time">{{$t('redelegate.completionTime')}}</div>
          <div class="view">{{$t("main.operation")}}</div>
        </div>
      </div>

      <div
        class="empty"
        v-if="addressRedelegations.length === 0"
      >{{$t('main.empty')}}</div>
      <div v-else>
        <div v-if="pageWidth > 414">
          <div
            class="table-header"
            v-for="(i,index) in addressRedelegations"
            :key="index"
          >
            <div class="header-amount">{{redelegateAmount(i.entries.balance).amount | formatNumber}}</div>
            <div class="header-address">{{i.validator_src_address}}</div>
            <div class="header-address">{{i.validator_dst_address}}</div>
            <div class="header-time">{{i.entries.completion_time | formatTime}}</div>
            <div
              class="view"
              style="cursor:pointer;color:#330867;"
              @click="goDetail(i)"
            >{{$t("global.view")}}</div>
          </div>
        </div>
        <div v-else>
          <div
            class="table-header"
            v-for="(i,index) in addressRedelegations"
            :key="index"
          >
            <div class="header-amount">{{redelegateAmount(i.entries.balance).amount | formatNumber}}</div>
            <div class="header-time">{{i.entries.completion_time | formatTime}}</div>
            <div
              class="view"
              style="cursor:pointer;color:#330867;"
              @click="goDetail(i)"
            >{{$t("global.view")}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getViewToken } from "@/utils/helpers";
export default {
  data() {
    return {
      pageWidth: document.documentElement.clientWidth
    };
  },
  computed: {
    ...mapState("account", ["tokenMap"]),
    ...mapState("staking", ["addressRedelegations"]),
    redelegateAmount() {
      return function(val) {
        return getViewToken({ denom: "uif", amount: val }, this.tokenMap);
      };
    }
  },
  methods: {
    handleResize(event) {
      this.pageWidth = document.documentElement.clientWidth;
    },
    goDetail(val) {
      sessionStorage.setItem("redelegateDetail", JSON.stringify(val));
      this.$router.push({ path: "/redelegateDetail" });
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    this.$store.dispatch("staking/fetchAddressRedelegations");
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