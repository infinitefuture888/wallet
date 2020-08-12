<template>
  <div class="card-container">
    <div class="main-content">
      <div class="header">
        <p v-if="title">{{ title }}</p>
      </div>
      <div class="content">
        <slot />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "card",
  props: {
    title: String
  }
};
</script>

<style lang="scss" scoped>
.card-container {
  border-radius: 4px;
  max-width: 470px;
  margin: 0 auto;
  background: #fff;
  color: rgba(0, 0, 0, 0.8);
  > .main-content {
    padding: 40px;
  }
}

.header {
  width: 100%;
  font-size: 24px;
  text-align: left;
  color: rgba(0, 0, 0, 0.8);
}
.content {
  min-height: 50px;
}
</style>


