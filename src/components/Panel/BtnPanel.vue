<template>
  <router-link
    v-if="!isEmpty(link)"
    class="btn-panel"
    :to="link"
  >
    <img
      :alt="title"
      :src="src"
    />
    <div>
      <h4>{{title}}</h4>
      <p>{{breif}}</p>
    </div>
  </router-link>
  <div
    v-else
    class="btn-panel"
  >
    <img
      :alt="title"
      :src="src"
    />
    <div>
      <h4>{{title}}</h4>
      <p>{{breif}}</p>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "lodash";
export default {
  name: "BtnPanel",
  props: {
    src: { type: String, required: true },
    title: { type: String, required: true },
    breif: { type: String, required: true },
    link: { type: String, required: false }
  },
  methods: {
    isEmpty
  }
};
</script>

<style lang="scss" scoped>
.btn-panel {
  padding: $padding-basic;
  background: #fff;
  box-shadow: $shadow;
  display: flex;
  align-items: center;
  transition: background-color $trans;
  width: 100%;
  &:hover {
    background: rgba(250, 250, 255, 0.4);
  }
  > div {
    h4 {
      font-size: 20px;
      color: #000;
    }
    p {
      margin-top: 8px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
  img {
    height: 40px;
    margin-right: $padding-basic;
  }
}
@include responsive($sm) {
  .btn-panel {
    > div {
      p {
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>

