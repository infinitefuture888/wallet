<template>
  <div id="app">
    <Header />
    <div class="main">
      <RouterView />
    </div>
    <Footer />
    <Slider />
  </div>
</template>

<script>
import Header from "@/components/Header/index.vue";
import Footer from "@/components/Footer/index.vue";
import Slider from "@/components/Slider/index.vue";
import { mapState } from "vuex";

export default {
  components: { Header, Footer, Slider }
};
</script>

<style lang="scss">
@import "~@/styles/_reset.scss";
@import "~@/styles/_common.scss";

html,
body {
  font-size: 16px;
  line-height: 1.5;
  font-family: "PingFangSC", Microsoft YaHei, "Helvetica Neue", Helvetica, Arial,
    STHeiTi, sans-serif;
  background: $color-background;
  color: $color-font;
  padding-right: 0 !important;
}

#app {
  .main {
    min-height: calc(100vh - 104px);
    width: 100%;
    padding-top: 86px;
  }
}
</style>
