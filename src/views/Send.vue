<template>
  <s-page
    class="send-container"
    :link="link"
  >
    <router-view />
  </s-page>
</template>

<script>
export default {
  name: "Send",
  computed: {
    link() {
      return this.$route.path.match("/send/finish") ? "/main?tab=assets" : null;
    }
  },
  beforeDestroy() {
    this.$store.dispatch("transactions/input", { denom: "uif", fee: 0 });
  }
};
</script>

<style lang="scss" scoped>
.send-container {
  margin: 0 auto;
}
</style>

