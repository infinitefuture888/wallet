<template>
  <s-page class="passport-container">
    <div
      class="user-select"
      v-if="isEmpty(mathAccount)"
    >
      <AccountSelect
        :userMap="userMap"
        :user="user"
        :showDelete="user !== userName"
      />
    </div>
    <div
      class="user-select"
      v-if="mathPlugin && !isEmpty(mathAccount)"
    >
      <div
        class="math-action"
        @click="logoutMath"
      >{{$t('passport.logout')}}</div>
    </div>
  </s-page>
</template>

<script>
import { mapState } from "vuex";
import { get, set, isEmpty } from "lodash";

import AccountSelect from "@/components/AccountSelect";

import icon1 from "@/assets/icon-create.svg";
import icon2 from "@/assets/icon-import.svg";

export default {
  components: { AccountSelect },
  data() {
    return {
      icon1,
      icon2,
      user: localStorage.getItem("gard_wallet_username")
    };
  },
  computed: {
    ...mapState("account", ["userMap", "userName", "mathAccount"]),
    nameList() {
      return Object.keys(this.userMap).sort((a, b) =>
        a === this.userName ? -1 : 1
      );
    },
    mathPlugin() {
      return !isEmpty(window.mathExtension);
    }
  },
  methods: {
    isEmpty,
    logoutMath() {
      this.$store.dispatch("account/change", this.nameList[0]);
      this.$store.dispatch("account/resetMathIdentity");
    }
  }
};
</script>

<style lang="scss" scoped>
.passport-container {
  margin: 0 auto;

  .user-select {
    margin: 0 auto;
    max-width: 560px;
    > .math-action {
      height: 80px;
      line-height: 80px;
      font-size: 18px;
      text-align: center;
      background-color: rgba(242, 246, 252, 1);
      color: rgba(0, 0, 0, 0.7);
      border-radius: 4px;
      margin-bottom: 15px;
      box-shadow: $shadow;
      cursor: pointer;
      &:hover {
        background: $main-btn;
        color: #fff;
        transition: 0.2s linear;
      }
    }
  }

  .passport-card {
    max-width: 560px;
  }
}
</style>

