<template>
  <div class="address">
    <div v-if="ellipsis">
      {{address | gardAddr}}
    </div>
    <div v-else>
      {{address}}
    </div>
    <img
      :class="`copy-icon ${brightBackground && 'invert'}`"
      src="~@/assets/icon-copy.svg"
      v-clipboard:copy="address"
      v-clipboard:success="onCopy"
    />
  </div>
</template>

<script>
export default {
  props: {
    address: { type: String, default: true },
    ellipsis: Boolean,
    brightBackground: Boolean
  },
  methods: {
    onCopy() {
      this.$message({
        type: "success",
        message: this.$t("global.success", {
          name: this.$t("main.copy")
        })
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.address {
  display: flex;
  align-items: center;
  img {
    margin-left: 8px;
    width: 28px;
    cursor: pointer;

    &.invert {
      filter: invert(10);
    }
  }
}
</style>
