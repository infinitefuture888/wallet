<template>
  <div :class="`header-container ${bgColor}`">
    <div class="header">
      <div class="logo">
        <a href="/">
          <img
            alt="logo"
            src="~@/assets/IFBOX.png"
          />
        </a>
      </div>
      <span class="lang-change">{{get(nodeInfo, 'node_info.network')}}</span>
      <span
        class="lang-change"
        @click="changeLang"
        :value="$i18n.locale"
      >
        <i class="el-icon-sort"></i>
        {{$i18n.locale === 'en' ? '中文':'English'}}
      </span>
      <div
        class="avatar-fa"
        @click="openDrawer"
      >
        <div class="avatar">
          <img
            v-if="isEmpty(mathAccount)"
            :src="walletIcon"
          />
          <img
            v-else
            src="https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/mathwallet/images/mathlabs/wallet_cn_logo_white.png"
          />
        </div>
        <span v-if="isEmpty(mathAccount)">{{ userName}}</span>
        <span v-else>MathWallet</span>
      </div>

    </div>

  </div>
</template>

<script>
import { mapState } from "vuex";
import { get, set, isEmpty } from "lodash";

import walletIcon from "@/assets/icon-wallet.svg";
import Account from "@/components/Account";
import icon1 from "@/assets/creat-icon.svg";
import icon2 from "@/assets/leadingin-icon.svg";
import icon3 from "@/assets/sif-icon.svg";
export default {
  components: { Account },
  data() {
    return {
      langs: ["zh", "en"],
      lang: this.$i18n.locale,
      bgColor: "",
      walletIcon,
      direction: "rtl",
      icon1,
      icon2,
      icon3,
      isMobile: !!navigator.userAgent.match(/iPad|iPhone|Android/)
    };
  },
  props: {
    netName: String
  },
  computed: {
    ...mapState("account", ["userName", "mathAccount"]),
    ...mapState("transactions", ["nodeInfo"])
  },
  methods: {
    isEmpty,
    get,
    openDrawer() {
      const agree = localStorage.getItem("gard_wallet_agree");
      if (!agree) {
        this.$router.push("/agree");
        return;
      }
      // this.$store.commit("account/getmathPlugin");
      this.$store.commit("account/setDrawer", true);
    },
    changeLang() {
      let target = "en";
      if (this.$i18n.locale === "en") {
        target = "zh";
      } else {
        target = "en";
      }
      this.$i18n.locale = target;
      localStorage.setItem("lang", target);
    },
    handleScroll(e) {
      if (window.scrollY > 20) {
        this.bgColor = "primary";
      } else {
        this.bgColor = "";
      }
    }
  },
  mounted() {
    window.onscroll = this.handleScroll;
  }
};
</script>

<style lang="scss" scoped>
.header-container {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 11;
  padding: 0;
  color: white;
  background: transparent;
  transition: background-color 0.6s ease 0s;

  &.primary {
    background: #0c3957;
    box-shadow: $shadow;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px $padding-large;
  max-width: $max-width;
  margin: 0 auto;

  .logo {
    flex: 1;
    display: inline-block;
    line-height: 1;
    img {
      height: 52px;
    }
  }
  .network {
    font-size: 16px;
    span {
      color: white;
      cursor: pointer;
    }
  }
  .lang-change {
    cursor: pointer;
    margin-left: $padding-basic;
    .el-icon-sort {
      transform: rotate(90deg);
    }
  }
  .avatar-fa {
    margin-left: 24px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
    .avatar {
      height: 28px;
      width: 28px;
      background: rgba(255, 255, 255, 0.2);
      overflow: hidden;
      border-radius: 14px;
      padding: 3px;
      margin-right: 6px;
      img {
        height: 18px;
        margin: 2px;
      }
    }
  }
}
@include responsive($sm) {
  .header {
    padding: 16px;

    .lang-change {
      margin-left: 12px;
    }
  }
}
</style>