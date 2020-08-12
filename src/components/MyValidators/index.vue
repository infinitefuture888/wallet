<template>
  <s-page
    class="container"
    :link="link"
  >
    <router-view />
  </s-page>
</template>

<script>
export default {
  computed: {
    link() {
      return this.$route.path.match("/myNode/detail")
        ? "/main?tab=myNode"
        : `/myNode/detail?address=${this.$route.query.address}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
}
</style>

