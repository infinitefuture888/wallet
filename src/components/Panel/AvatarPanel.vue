<template>
  <div class="avatar-container">
    <div class="avatar">
      <span :style="{background: avatarColor}">{{name.slice(0,1).toUpperCase()}}</span>
    </div>
    <h1 class="name">{{name}}</h1>
    <s-address :address="address" />
  </div>
</template>

<script>
export default {
  name: "AvatarPanel",
  props: {
    name: { type: String, required: true },
    address: { type: String, required: true }
  },
  computed: {
    avatarColor() {
      const code = this.name.slice(0, 1).charCodeAt();
      const factor = code > 122 ? 73 : code;
      const Hue = 360 * (factor / 122);
      return "hsla(" + Hue + ",60%,65%,1)";
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-container {
  width: 100%;

  .avatar {
    display: inline-block;
    width: 160px;
    height: 160px;
    color: white;
    background: $color-second;
    border: 6px double white;
    box-shadow: 0 0 2px 4px $color-second;
    border-radius: 80px;
    margin: $padding-large * 2 72px 0;
    span {
      display: inline-block;
      width: 148px;
      height: 148px;
      border-radius: 74px;
      background: $color-primary;
      border: 5px solid white;
      padding: $padding-basic;
      font-size: 64px;
    }
  }

  h1 {
    font-size: 32px;
  }
  .copy-icon {
    width: 20px;
    position: relative;
    top: 4px;
    left: 8px;
  }
}
</style>

