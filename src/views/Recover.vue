<template>
  <s-page class="import-container">
    <s-card
      class="recover-card"
      :title="$t('passport.recover')"
    >
      <div class="tabs">
        <router-link :to="routes[0]">
          <el-button
            :class="$route.path === routes[0] && 'active'"
            plain
            round
          >{{$t('recover.key')}}</el-button>
        </router-link>
        <router-link :to="routes[1]">
          <el-button
            :class="$route.path === routes[1] && 'active'"
            plain
            round
          >{{$t('recover.keyFile')}}</el-button>
        </router-link>
        <router-link :to="routes[2]">
          <el-button
            :class="$route.path === routes[2] && 'active'"
            plain
            round
          >{{$t('recover.phrase')}}</el-button>
        </router-link>
      </div>

      <RouterView />
    </s-card>
  </s-page>
</template>

<script>
const routes = [
  "/recover/key/text",
  "/recover/key/file",
  "/recover/phrase/input"
];

export default {
  data() {
    return {
      routes
    };
  }
};
</script>

<style lang="scss" scoped>
.import-container {
  margin: 0 auto;
  .recover-card {
    max-width: 460px;

    .tabs {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      button {
        background: rgba(255, 255, 255, 0.15);
        color: $main-btn;
        border-color: rgba(20, 40, 110, 0.2);
        transition: background-color $trans;
        &.active,
        &:hover {
          color: white;
          background: $main-btn;
        }
      }
    }
  }
}
@include responsive($sm) {
  .import-container {
    margin: 0 auto;
    .recover-card {
      max-width: 460px;

      .tabs {
        flex-direction: column;
        button {
          width: 100%;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>

