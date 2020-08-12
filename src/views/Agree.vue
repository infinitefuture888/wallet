<template>
  <s-page class="agree-container">
    <s-card :title="$t('agree.title')">
      <el-checkbox
        class="term"
        :label="$t('agree.term1')"
        v-model="checkList0"
        :change="handleCheck"
      ></el-checkbox>
      <el-checkbox
        class="term"
        :label="$t('agree.term2')"
        v-model="checkList1"
        :change="handleCheck"
      ></el-checkbox>
      <el-checkbox
        class="term"
        label=""
        v-model="checkList2"
        :change="handleCheck"
      ></el-checkbox>
      <div class="links">
        {{$t('agree.term3')}}
        <span
          @click="useInfo"
          style="cursor: pointer;"
        >{{$t('agree.use')}}</span>
        {{$t('agree.and')}}
        <span
          @click="privacyInfo"
          style="cursor: pointer;"
        >{{$t('agree.privacy')}}</span>
      </div>

      <el-button
        round
        :disabled="!agreed"
        @click="onSubmit"
      >{{$t('agree.confirm')}}</el-button>
    </s-card>
  </s-page>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "Agree",
  data() {
    return {
      checkList0: false,
      checkList1: false,
      checkList2: false
    };
  },
  computed: {
    ...mapState("account", ["userMap"]),
    agreed() {
      return this.checkList0 && this.checkList1 && this.checkList2;
    }
  },
  methods: {
    handleCheck: async function() {},
    onSubmit: async function() {
      localStorage.setItem("gard_wallet_agree", true);
      this.$store.commit("account/setDrawer", true);
    },
    useInfo() {
      this.$router.push({ path: "/useInfo" });
    },
    privacyInfo() {
      this.$router.push({ path: "/privacyInfo" });
    }
  }
};
</script>

<style lang="scss" scoped>
.agree-container {
  margin: 0 auto;

  .term {
    display: flex;
    align-items: flex-start;
    margin: $padding-basic 0;
  }
  .links {
    position: relative;
    left: 30px;
    top: -46px;
    color: rgba(0, 0, 0, 0.7);
    font-size: 14px;
    width: calc(100% - 30px);
  }
  .el-button {
    width: 100%;
    height: 48px;
    background-color: $main-btn;
    color: #fff;
  }
}
</style>

