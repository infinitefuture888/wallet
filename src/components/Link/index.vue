<template>
  <a
    target="_blank"
    :href="`${gardplorerDomain}tx/${content}`"
    :class="`${ellipsis ? 'ellipsis' : ''}`"
    v-if="type === 'tx'"
  >{{ content }}</a>
  <a
    target="_blank"
    :href="`${gardplorerDomain}address/${content}`"
    :class="`${ellipsis ? 'ellipsis' : ''}`"
    v-else-if="type === 'address'"
  >{{ content }}</a>
  <a
    target="_blank"
    :href="`${gardplorerDomain}block/${content}`"
    :class="`${ellipsis ? 'ellipsis' : ''}`"
    v-else-if="type === 'block'"
  >{{ content }}</a>
  <a
    target="_blank"
    :href="`${gardplorerDomain}validator/${content}`"
    :class="`${ellipsis ? 'ellipsis' : ''}`"
    v-else-if="type === 'validator'"
  >{{ content }}</a>
</template>

<script>
import { gardplorerDomain } from "@/constants";

export default {
  props: {
    type: String,
    content: String,
    ellipsis: { type: Boolean, default: true }
  },
  data() {
    return {
      gardplorerDomain
    };
  }
};
</script>

<style lang="scss" scoped>
.ellipsis {
  display: inline-block;
  max-width: 180px;
  vertical-align: top;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
