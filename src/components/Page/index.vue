<template>
  <div class="page-container">
    <div class="header">
      <a
        href="javascript:;"
        @click="link ? $router.push(link) : $router.back()"
      >
        <i class="el-icon-back"></i>
      </a>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "Page",
  props: {
    link: String
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  max-width: $max-width;
  margin: 0 auto $padding-large;
  padding: $padding-large;
  a {
    color: rgba(255, 255, 255, 0.75);
    font-size: 28px;
    transition: color $trans;
    &:hover {
      color: white;
    }
  }
}

.header {
  text-align: right;
}
.content {
  min-height: 50px;
}

@include responsive($sm) {
  .page-container {
    padding: 16px;
  }
}
</style>


