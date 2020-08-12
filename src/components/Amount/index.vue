<template>
  <span>
    <slot></slot>
    {{ viewList.join(' + ') }}
  </span>
</template>

<script>
import { mapState } from "vuex";
import { get, isEmpty } from "lodash";
import BigNumber from "bignumber.js";
import numeral from "numeral";

export default {
  props: {
    list: Array
  },
  data() {
    return {
      viewList: []
    };
  },
  computed: {
    ...mapState("account", ["tokenMap"])
  },
  methods: {
    updateList() {
      if (this.list.find(i => !i.denom)) {
        return false;
      }
      this.viewList = this.list.map(i => {
        if (i.denom.match(/^coin.{10}$/)) {
          const detail = this.tokenMap[i.denom];
          if (!isEmpty(detail)) {
            i.denom = detail.symbol;
            const n = BigNumber(i.amount).dividedBy(
              Math.pow(10, detail.decimals)
            );
            i.amount = numeral(n.toString()).format("0,0.[000000]");
          }
        } else {
          if (i.denom === "uif") {
            const n = BigNumber(i.amount).dividedBy(Math.pow(10, 6));
            i.amount = numeral(n.toString()).format("0,0.[000000]");
            i.denom = "IF";
          } else {
            i.amount = numeral(i.amount).format("0,0.[000000]");
            i.denom = i.denom.toUpperCase();
          }
        }
        return `${i.amount}${i.denom}`;
      });
    }
  },
  watch: {
    list() {
      if (this.list.find(i => !i.denom)) {
        return false;
      }
      this.list.forEach(i => {
        if (i.denom.match(/^coin.{10}$/) && isEmpty(this.tokenMap[i.denom])) {
          this.$store.dispatch("tokens/fetchDetail", i.denom);
        }
      });
      this.updateList();
    },
    tokenMap() {
      if (isEmpty(this.list)) {
        return false;
      }
      this.updateList();
    }
  },
  mounted() {
    this.updateList();
  }
};
</script>