<template>
  <s-page
    :link="link"
    class="staking-container"
  >
    <router-view />
  </s-page>
</template>

<script>
export default {
  name: "Staking",
  computed: {
    link() {
      return this.$route.path.match("/staking/detail")
        ? "/main?tab=delegate"
        : null;
    }
  },
  beforeDestroy() {
    this.$store.dispatch("staking/setToValidator", {});
    this.$store.dispatch("staking/setFromValidator", {});
    this.$store.dispatch("staking/setForm", {});
  }
};
</script>

<style lang="scss" scoped>
.staking-container {
  margin: 0 auto;
}
</style>