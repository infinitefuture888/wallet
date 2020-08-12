<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    custom-class="drawer"
    :before-close="handleClose"
  >
    <div class="user-select">
      <div class="user-list">
        <div
          v-if="mathPlugin && !isEmpty(mathAccount)"
          @click="loginMath"
          class="user-item math is-checked"
        >
          <s-btn-card
            :title="$t('passport.math')"
            :src="icon1"
            :breif="mathAccount.account"
            link=""
          />
        </div>
        <div
          v-for="user in nameList"
          :key="user"
          @click="e => changeAccount(e, user)"
          :class="`user-item ${user === userName &&'is-checked'}`"
        >

          <s-btn-card
            :title="user"
            :src="icon1"
            :breif="userMap[user].address"
            link=""
          />
        </div>
        <div
          v-if="mathPlugin && isEmpty(mathAccount)"
          @click="loginMath"
          class="user-item math"
        >
          <s-btn-card
            :title="$t('passport.math')"
            :src="icon1"
            :breif="$t('passport.useMath')"
            link=""
          />
        </div>
      </div>
      <div class="user-type">
        <div class="s-btn-card-div">
          <s-btn-card
            :title="$t('passport.create')"
            :src="icon1"
            :breif="$t('passport.createBreif')"
            link="/create/pass"
          />
        </div>
        <div class="s-btn-card-div">
          <s-btn-card
            :title="$t('passport.recover')"
            :src="icon2"
            :breif="$t('passport.recoverBreif')"
            link="/recover/key/text"
          />
        </div>
        <!-- <div class="s-btn-card-div">
              <s-btn-card
                :title="get(nodeInfo, 'node_info.network')"
                :src="icon3"
                :breif="$t('passport.network')"
                link=""
              />
            </div> -->
      </div>

    </div>
  </el-drawer>
</template>
<script>
import { mapState } from "vuex";
import { get, set, isEmpty } from "lodash";

import icon1 from "@/assets/creat-icon.svg";
import icon2 from "@/assets/leadingin-icon.svg";
import icon3 from "@/assets/sif-icon.svg";
export default {
  data() {
    return {
      bgColor: "",
      direction: "rtl",
      icon1,
      icon2,
      icon3
    };
  },
  computed: {
    ...mapState("account", [
      "userMap",
      "userName",
      "mathAccount",
      "drawer",
      "mathPlugin"
    ]),
    ...mapState("transactions", ["nodeInfo"]),
    nameList() {
      return Object.keys(this.userMap).sort((a, b) =>
        a === this.userName ? -1 : 1
      );
    }
  },
  methods: {
    isEmpty,
    get,
    handleClose(done) {
      this.$store.commit("account/setDrawer", false);
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
    changeAccount: async function(e, name) {
      this.$store.commit("staking/setValidatorMapEmpty");
      this.$store.commit("staking/setDelegationsEmpty");
      await this.$store.dispatch("account/change", name);
      // logout mathwallet
      if (!isEmpty(this.mathAccount)) {
        await this.$store.dispatch("account/resetMathIdentity");
      }
      if (this.$route.name == "main") {
        window.location.reload();
        return;
      }
      this.$router.push("/main?tab=assets");
    },
    loginMath: async function() {
      const res = await this.$store.dispatch("account/getMathIdentity");
      if (!isEmpty(res)) {
        if (this.$route.name == "main") {
          window.location.reload();
          return;
        }
        this.$router.push("/main?tab=assets");
      }
      this.$store.commit("account/setDrawer", false);
    },
    clickMathAction(val) {
      switch (val) {
        case "logout":
          this.logout();
          break;
        case "switchWallet":
          this.switchWallet();
          break;
      }
    },
    logout() {
      this.$store.dispatch("account/change", this.nameList[0]);
      this.$store.dispatch("account/resetMathIdentity");
    },
    switchWallet: async function() {
      const res = await this.$store.dispatch("account/resetMathIdentity");
      if (res) {
        const response = await this.$store.dispatch("account/getMathIdentity");
        if (!isEmpty(response)) {
          this.$router.push("main?tab=assets");
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.user-select {
  margin: 0 auto;
  max-width: 560px;
  .user-item {
    margin: 0 0 $padding-basic;
    background: rgba(250, 250, 255, 0.15);
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color $trans;
    border: 1px solid transparent;
    &.is-checked {
      border: 1px solid rgba(64, 158, 255, 1);
    }
    &.math {
      display: block;
      .math-top {
        display: flex;
        align-items: center;
        font-size: 20px;
        span {
          margin-bottom: 4px;
        }
      }
      .math-logo {
        width: 36px;
        overflow: hidden;
      }
      p {
        margin-top: 2px;
      }
    }
    &.math1 {
      display: flex;
      justify-content: space-between;
    }
  }

  .user-list {
    border-bottom: 1px solid #e6e6e6;
    padding: $padding-basic;
  }
  .user-type {
    padding: $padding-basic;
    .s-btn-card-div {
      margin-bottom: 24px;
    }
  }
}
</style>
<style lang="scss">
.el-drawer {
  background: #fff !important;
  width: auto !important;
  overflow-y: scroll;
}
// .v-modal {
//   z-index: auto !important;
// }
@include responsive($sm) {
  .el-drawer {
    width: 100% !important;
  }
}
</style>