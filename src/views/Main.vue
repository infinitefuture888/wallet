<template>
  <div class="main-container">
    <div class="main-top">
      <div class="top-balance">
        <div class="balance-left">
          <div>
            <img
              :src="icon"
              alt=""
            >
          </div>
          <div class="name">
            <p>{{userName}}</p>
            <s-address
              :address="address"
              :ellipsis="true"
              style="margin-bottom:15px;"
            />
            <s-address
              :address="strToHexCharCode(address)"
              :ellipsis="true"
            />
          </div>

        </div>
        <div class="balance-right">
          <router-link
            class="top-btn"
            to="passport"
          >
            <img :src="icon3" />
          </router-link>
        </div>
      </div>
      <div class="top-btns">
        <el-button @click="receive">{{$t('main.receive')}}
        </el-button>

        <el-button @click="goSendForm">
          {{$t('main.send')}}
        </el-button>

      </div>
    </div>

    <el-tabs
      v-model="tab"
      :before-leave="onTabChange"
      type="card"
    >
      <el-tab-pane
        :label="$t('main.assets')"
        name="assets"
      >
        <div
          v-loading="loading"
          element-loading-background="rgba(255, 255, 255, 0)"
          class="assets"
        >
          <BalancePanel :token="balance" />
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('staking.delegations')"
        name="delegate"
      >
        <DelegatePage></DelegatePage>
      </el-tab-pane>
      <!-- <el-tab-pane
        :label="$t('main.txs')"
        name="tx"
      >
        <TxPage></TxPage>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('vote.governance')"
        name="vote"
      >
        <VotePage :voteList="proposalList"></VotePage>
      </el-tab-pane> -->
      <el-tab-pane
        :label="$t('redelegate.my')"
        name="redelegate"
      >
        <Redelegate></Redelegate>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('myNode.myNode')"
        name="myNode"
      >
        <MyNode></MyNode>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { get, isEmpty, map, filter } from "lodash";
import { gardplorerDomain } from "@/constants";
import icon from "@/assets/creat-icon.svg";
import icon1 from "@/assets/icon-to.svg";
import icon2 from "@/assets/icon-from.svg";
import icon3 from "@/assets/set.svg";
import AvatarPanel from "@/components/Panel/AvatarPanel.vue";
import BalancePanel from "@/components/Panel/BalancePanel";
import TransactionList from "@/components/TransactionList";
import DelegatePage from "@/views/StakingMain";
import Redelegate from "@/views/Redelegate";
import MyNode from "@/views/MyNode";
// import VotePage from "@/views/VoteMain.vue";
// import TxPage from "@/views/Txs.vue";
import { getViewToken, strToHexCharCode } from "@/utils/helpers";

export default {
  name: "Main",
  components: {
    AvatarPanel,
    BalancePanel,
    TransactionList,
    DelegatePage,
    // TxPage,
    // VotePage,
    Redelegate,
    MyNode
  },
  data() {
    return {
      icon,
      icon1,
      icon2,
      icon3,
      domain: gardplorerDomain,
      pageWidth: document.documentElement.clientWidth,
      isMobile: !!navigator.userAgent.match(/iPad|iPhone|Android/),
      tab: sessionStorage.getItem("tab")
        ? sessionStorage.getItem("tab")
        : "assets"
    };
  },
  computed: {
    ...mapState("account", [
      "userName",
      "keyStore",
      "balance",
      "txs",
      "loading"
    ]),
    ...mapState("transactions", { txLoading: "loading", txs: "txs" }),
    ...mapState("gov", ["proposalList"]),
    ...mapGetters("account", { address: "currentAddress" })
  },
  methods: {
    isEmpty,
    getViewToken,
    strToHexCharCode,
    onTabChange(tab) {
      sessionStorage.setItem("tab", tab);
      this.$route.query.tab !== tab && this.$router.push(`/main?tab=${tab}`);
      if (tab === "assets") {
        this.$store.dispatch("account/fetchBalance");
      }
      if (tab === "receiveVoucher" || tab === "depositVoucher") {
        this.$store.dispatch("account/fetchBalance");
      }
    },
    onCopy() {
      this.$message({
        type: "success",
        message: this.$t("home.copy")
      });
    },
    goSendForm() {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("sendForm");
      sessionStorage.removeItem("boxAmount");
      this.$router.push({ path: "send/form" });
    },
    receive() {
      this.$router.push({ path: "/receive" });
    },
    goMigrate() {
      this.$router.push({ path: "/migrate/form" });
    },
    handleResize(event) {
      this.pageWidth = document.documentElement.clientWidth;
    }
  },
  beforeMount() {
    if (!this.userName) {
      this.$router.push("/passport");
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    this.onTabChange(this.tab);
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  max-width: $max-width;
  margin: 0 auto $padding-large;
  padding: $padding-large;

  .main-top {
    display: flex;
    align-items: stretch;
    color: rgba(0, 0, 0, 0.7);
    background: rgba(245, 247, 250, 1);
    box-shadow: 4px 5px 20px 0;
    border-radius: 4px 4px 0 0;
    .top-balance {
      padding: 0 0 0 $padding-large;
      margin: 4px;
      flex-basis: 50%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > .balance-left {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 60px;
        }
        .name {
          margin-left: 15px;
          > .address {
            font-size: 14px;
          }
        }
      }
      > .balance-right {
        flex-basis: 30%;
      }
      .name {
        font-size: 20px;
        margin-bottom: 8px;
        img {
          height: 24px;
          margin-right: 8px;
        }
        .math-logo {
          width: 32px;
          overflow: hidden;
          margin-bottom: -2px;
        }
      }
      .top-btn {
        flex-grow: 1;
        line-height: 32px;
        padding: $padding-large 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &:hover {
          background: $color-primary-light;
        }
        img {
          width: 32px;
        }
      }
    }
    .top-btns {
      text-align: center;
      margin: 4px;
      flex-basis: 50%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 30px;
      .el-button {
        background: rgba(220, 223, 230, 0.1);
        height: 36px;
      }
      .draw {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }
  .assets {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: $padding-basic 0;
    > div {
      width: 100%;
      .table-header {
        width: 100%;
        background-color: rgba(245, 247, 250, 1);
        display: flex;
        justify-content: space-around;
        height: 50px;
        line-height: 50px;
        border-radius: 4px;
        margin-bottom: 10px;
        text-align: left;
        color: rgba(0, 0, 0, 0.7);
        font-weight: bolder;
        > div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-indent: 1em;
          flex-basis: 20%;
        }
      }
    }
  }
  .txs {
    padding: $padding-basic 0;

    .empty {
      margin: $padding-large;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
    }
    p {
      margin-top: 16px;
      text-align: center;
    }
  }
}

@include responsive($sm) {
  .main-container {
    padding: 16px;
    .main-top {
      flex-direction: column;
      padding: 10px 0;
      .top-balance {
        padding: 0;
      }
      .top-btns {
        justify-content: center;
        padding-right: 0;
      }
    }
    .assets {
      flex-direction: column;
      align-items: stretch;
      > div {
        > .table-header {
          > .header-denom {
            flex-basis: 20%;
          }
          > .header-amount {
            flex-basis: 20%;
          }
          > .header-action {
            flex-basis: 40%;
          }
        }
      }
    }
    .txs {
      padding: $padding-basic 4px;
    }
  }
}
</style>

