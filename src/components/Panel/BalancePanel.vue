<template>
  <div class="balance-container">
    <div v-if="pageWidth > 414">
      <div class="table-header table-header-nav">
        <div class="header-img"></div>
        <div class="header-denom">{{$t("main.coinType")}}</div>
        <div class="header-amount">{{$t("main.available")}}</div>
        <!-- <div class="header-freeze">{{$t("main.frozen")}}</div> -->
        <!-- <div class="header-action">{{$t("main.operation")}}</div> -->
      </div>
      <div
        class="table-header table-header-hover"
        v-for="(item, index) in token"
        :key="index"
      >
        <div class="header-img">
          <img
            v-if="viewToken(item).img"
            :src="viewToken(item).img"
            alt=""
          >
          <div
            v-else
            class="logo-none"
          ></div>
        </div>
        <div class="header-denom">{{viewToken(item).denom}}</div>
        <div class="header-amount">{{viewToken(item).amount | formatNumber}}</div>
        <!-- <div class="header-freeze">

        </div> -->
        <!-- <div class="header-action">
          <el-button
            size="small"
            @click="goSingleToken(item)"
          >{{$t('main.manage')}}</el-button>
        </div> -->
      </div>
      <div
        class="table-header"
        v-if="token.length == 0"
      >{{$t("global.null2")}}</div>
    </div>
    <div v-else>
      <div class="table-header table-header-nav">
        <div class="header-denom">{{$t("main.coinType")}}</div>
        <div class="header-amount">{{$t("main.available")}}</div>
        <!-- <div class="header-action">{{$t("main.operation")}}</div> -->
      </div>
      <div
        class="table-header table-header-hover"
        v-for="(item, index) in token"
        :key="index"
      >
        <div class="header-denom">{{viewToken(item).denom}}</div>
        <div class="header-amount">{{viewToken(item).amount | formatNumber}}</div>
        <!-- <div class="header-action">
          <el-button
            size="small"
            @click="goSingleToken(item)"
          >{{$t('main.manage')}}</el-button>
        </div> -->
      </div>
      <div
        class="table-header"
        v-if="token.length == 0"
      >{{$t("global.null2")}}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getViewToken } from "@/utils/helpers";

export default {
  name: "BalancePanel",
  props: {
    token: { type: Array, required: true }
  },
  data() {
    return {
      pageWidth: document.documentElement.clientWidth
    };
  },
  computed: {
    ...mapState("account", ["tokenMap"]),
    viewToken() {
      return function(tokenItem) {
        return getViewToken(tokenItem, this.tokenMap);
      };
    }
  },
  methods: {
    goSingleToken(token) {
      sessionStorage.setItem("token", JSON.stringify(token));
      this.$router.push({
        name: "SingleTokenAssets"
      });
    },
    handleResize(event) {
      this.pageWidth = document.documentElement.clientWidth;
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style lang="scss" scoped>
.balance-container {
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
    }
    > .header-img {
      flex-basis: 10%;
      img {
        height: 40px;
        width: 40px;
        margin-top: 5px;
      }
      .logo-none {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        margin-top: 5px;
        background: #e6e6e6;
        display: inline-block;
      }
    }
    > .header-denom {
      flex-basis: 20%;
    }
    > .header-amount {
      flex-basis: 35%;
    }
    > .header-freeze {
      flex-basis: 35%;
    }
    > .header-action {
      flex-basis: 10%;
    }
  }
  .table-header-nav {
    font-weight: bolder;
  }
  .table-header-hover {
    cursor: pointer;
    &:hover {
      background-color: rgba(242, 246, 252, 1);
    }
  }
}
@include responsive($sm) {
  .balance-container {
    width: 100%;
    padding: 0;
    .table-header {
      > .header-denom {
        flex-basis: 30%;
      }
      > .header-amount {
        flex-basis: 40%;
      }
      > .header-action {
        flex-basis: 30%;
      }
    }
  }
}
</style>

