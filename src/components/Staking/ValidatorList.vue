<template>
  <s-card :title="$t('staking.validators')">
    <div
      v-for="(v, i) in validators"
      :key="i"
      class="item"
      @click="() => onSelect(v)"
    >
      <div>
        <h3>{{ i + 1 }}. {{ get(v, 'description.moniker') }} <span :class="v.jailed ? 'jailed' : ''">{{ v.jailed ? 'Jailed' : 'Active' }}</span></h3>
        <p>{{ $t('staking.commission') }}: {{ numeral(get(v, 'commission.commission_rates.rate')).format('(0.[00]%)') }} / {{ $t('staking.max') }}: {{ numeral(get(v, 'commission.commission_rates.max_rate')).format('(0.[00]%)') }}</p>
      </div>
      <div class="tokens">
        <h3>{{ getViewToken({denom: 'uif', amount: v.tokens}).amount | formatNumber }}</h3>
        <p>{{ $t('staking.tokens') }}</p>
      </div>
    </div>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import { get, isEmpty } from "lodash";

import { getViewToken } from "@/utils/helpers";

export default {
  name: "ValidatorList",
  computed: {
    ...mapState("staking", ["validators"])
  },
  methods: {
    get,
    numeral,
    getViewToken,
    onSelect(v) {
      this.$store.dispatch("staking/setToValidator", v);
      this.$router.back();
    }
  },
  mounted() {
    this.$store.dispatch("staking/fetchValidators", false);
  }
};
</script>

<style lang="scss" scoped>
.item {
  background: white;
  box-shadow: $shadow;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px $padding-basic;
  border-radius: 4px;
  margin-bottom: 12px;
  cursor: pointer;

  h3 {
    color: rgba(0, 0, 0, 0.8);
    font-size: 18px;

    span {
      font-size: 14px;
      color: $color-success;

      &.jailed {
        color: $color-error;
      }
    }
  }
  p {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
  }

  .tokens {
    text-align: center;
  }
}
</style>