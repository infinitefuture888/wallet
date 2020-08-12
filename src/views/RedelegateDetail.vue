<template>
  <s-page>
    <s-card
      :title="$t('redelegate.detail')"
      v-if="!isEmpty(detail)"
    >
      <div class="div">
        <s-item
          :label="$t('redelegate.amount')"
          class="item"
        >{{ redelegateAmount(detail.entries.balance).amount | formatNumber}}</s-item>
        <s-item
          :label="$t('redelegate.validatorFrom')"
          class="item"
        >{{ detail.validator_src_address }}</s-item>
        <s-item
          :label="$t('redelegate.validatorTo')"
          class="item"
        >{{ detail.validator_dst_address }}</s-item>
        <s-item
          :label="$t('redelegate.completionTime')"
          class="item"
        >{{ detail.entries.completion_time | formatTime }}</s-item>
        <s-item
          :label="$t('redelegate.block')"
          class="item"
        >{{ detail.entries.creation_height }}</s-item>
      </div>
    </s-card>
  </s-page>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getViewToken } from "@/utils/helpers";
import { isEmpty } from "lodash";
export default {
  data() {
    return {
      detail: {}
    };
  },
  computed: {
    ...mapState("account", ["tokenMap"]),
    redelegateAmount() {
      return function(val) {
        return getViewToken({ denom: "uif", amount: val }, this.tokenMap);
      };
    }
  },
  methods: {
    isEmpty
  },
  mounted() {
    this.detail = JSON.parse(sessionStorage.getItem("redelegateDetail"));
  }
};
</script>

<style lang="scss" scoped>
.div {
  background: $color-background-card;
  padding: 4px $padding-basic;
  margin-bottom: 16px;
  .item {
    margin: 16px 0;
  }
}
.label {
  margin-top: 24px;
  margin-bottom: 12px;
}
.btn-delegate {
  width: 100%;
  height: 48px;
  background: $main-btn;
  color: #fff;
}
.btns {
  margin-top: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .btn {
    width: 100%;
    height: 48px;
    flex-basis: 48%;
    background: $main-btn;
    color: #fff;
  }
}
@include responsive($sm) {
  .div {
    padding: 4px 0;
  }
}
</style>