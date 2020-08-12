<template>
  <div class="tx-container">

    <div class="card-header">
      <div class="select-action">
        <el-select
          class="left-select"
          @change="changeType"
          :value="category"
        >
          <el-option
            v-for="(value, key, index) in txTypes"
            :key="index"
            :value="key"
            :label="key"
          ></el-option>
        </el-select>
        <el-select
          v-if="Object.keys(actions).length > 1"
          :disabled="loading"
          :value="selected_key"
          placeholder="Pls select action"
          @change="onSelect"
        >
          <el-option
            v-for="key in Object.keys(actions)"
            :key="key"
            :value="key"
            :label="actions[key]"
          />
        </el-select>
      </div>
    </div>
    <transaction-list
      :list="txs"
      :fields="fields"
      :load="loading"
    />
    <div class="card-footer">
      <el-pagination
        class="pagination"
        background
        :pager-count="5"
        layout="total, prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="Number(totalCount)"
        @prev-click="onPageChange"
        @next-click="onPageChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import TransactionList from "@/components/TransactionList";
import { txTypes, txFieldsList } from "@/constants";

export default {
  data: function() {
    return {
      txTypes,
      category: "transfers",
      selected_key: Object.keys(txTypes["transfers"])[0]
    };
  },
  components: { "transaction-list": TransactionList },
  computed: {
    ...mapState("transactions", [
      "txs",
      "totalCount",
      "currentPage",
      "pageSize",
      "loading"
    ]),
    actions: function() {
      return txTypes[this.category];
    },
    fields: function() {
      return txFieldsList[this.selected_key];
    },
    selected: function() {
      return this.selected_key.match("-")
        ? this.selected_key.split("-")
        : [this.selected_key, ""];
    }
  },
  methods: {
    changeType(val) {
      this.category = val;
    },
    onPageChange: function(currentPage) {
      const { pageSize, totalCount } = this;
      const page = Math.ceil(totalCount / pageSize) - currentPage + 1;
      this.$store.dispatch("transactions/fetchList", {
        "message.action": this.selected[0],
        page
      });
    },
    onSelect: function(value) {
      this.selected_key = value;
      this.fetchData();
    },
    fetchData: async function() {
      const params = { "message.action": this.selected[0] };
      if (this.selected[1]) {
        params.category = this.selected[1];
      }
      await this.$store.dispatch("transactions/fetchTotalCount", params);
      const { pageSize, totalCount } = this;
      params.page = Math.ceil(totalCount / pageSize) || 1;
      this.$store.dispatch("transactions/fetchList", params);
    }
  },
  mounted: function() {
    this.fetchData();
  },
  watch: {
    category() {
      this.selected_key = Object.keys(txTypes[this.category])[0];
      this.fetchData();
    }
  }
};
</script>

<style lang="scss">
.tx-container {
  .select-action {
    margin: 15px 0;
    display: flex;
    justify-content: flex-start;
    .left-select {
      margin-right: 10px;
    }
  }
  .card-footer {
    text-align: right;
    .el-pagination__total {
      color: #fff;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #330867;
    }
  }
}
</style>


