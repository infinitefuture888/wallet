<template>
  <div class="item-content">
    <div>
      <div class="name"><img :src="icon" />{{user}}</div>
      <p>{{userMap[user].address | gardAddr}}</p>
    </div>
  </div>
</template>

<script>
import { get, set, isEmpty } from "lodash";
import icon from "@/assets/icon-wallet.svg";

export default {
  name: "selectContent",
  props: {
    userMap: Object,
    user: String
  },
  data() {
    return { icon };
  },
  methods: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
.item-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .name {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #000;
    img {
      height: 24px;
      margin-right: 8px;
    }
  }

  p {
    margin-top: 8px;
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.5);
  }
  .el-dropdown-link {
    padding: $padding-basic;
    margin-right: -$padding-basic;
    i {
      font-size: $padding-basic;
    }
  }
}
</style>


