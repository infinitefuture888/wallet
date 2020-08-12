<template>
  <div class="vote-container">
    <div class="vote-header">
      <div class="header-left">
        <el-select v-model="status">
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <router-link
          to="/vote/creat"
          class="creat-btn"
        >
          <el-button>{{$t("vote.creat")}}</el-button>
        </router-link>

      </div>

      <div class="header-right">
        <el-input
          v-model="title"
          v-if="$route.name === 'voteList'"
          :placeholder="$t('vote.title')"
        ></el-input>
        <router-link
          v-if="$route.name !== 'voteList'"
          to="vote/list"
        >
          <el-button>{{$t("vote.all")}}</el-button>
        </router-link>
      </div>
    </div>
    <div
      class="vote-list"
      v-if="list.length !== 0"
    >
      <div class="table-header && nav">
        <div class="id">ID</div>
        <div>{{$t("vote.title")}}</div>
        <div>{{$t("vote.status")}}</div>
        <div>{{$t("lockInput.creatTime")}}</div>
      </div>
      <div
        class="table-header && hover"
        v-for="(item, index) in list"
        :key="index"
        @click="goDetail(item.id)"
      >
        <div class="id">{{item.id}}</div>
        <div>{{get(item, "content.value.title") || ""}}</div>
        <div>{{item.proposal_status}}</div>
        <div>{{item.submit_time | formatTime}}</div>
      </div>
    </div>
    <div
      class="empty"
      v-else
    >{{$t('global.noData')}}</div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { isEmpty, get } from "lodash";
export default {
  props: {
    voteList: Array
  },
  data() {
    return {
      status: "all",
      title: ""
    };
  },
  computed: {
    statusList() {
      return [
        { label: this.$t("deposit.all"), value: "all" },
        { label: this.$t("vote.voting"), value: "VotingPeriod" },
        { label: this.$t("deposit.toBeActivated"), value: "DepositPeriod" },
        { label: this.$t("vote.passed"), value: "Passed" },
        { label: this.$t("vote.reject"), value: "Rejected" }
      ];
    },
    list() {
      const filterList = this.voteList.filter(item => {
        const title = get(item, "content.value.title") || "";
        if (this.title == "") {
          return this.status === "all"
            ? item
            : this.status === item.proposal_status;
        } else {
          return this.status === "all"
            ? title.indexOf(this.title) > -1
            : this.status === item.proposal_status &&
                title.indexOf(this.title) > -1;
        }
      });
      return filterList;
    }
  },
  methods: {
    get,
    goDetail(id) {
      this.$router.push({ path: `/vote/detail/${id}` });
    }
  }
};
</script>
<style lang="scss" scoped>
.vote-container {
  width: 100%;
  > .vote-header {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-left {
      .creat-btn {
        margin-left: 10px;
      }
    }
    .header-right {
      .el-input {
        width: 300px;
      }
    }
  }
  > .vote-list {
    margin-top: 15px;
    > .table-header {
      background-color: rgba(245, 247, 250, 1);
      display: flex;
      justify-content: space-around;
      height: 50px;
      line-height: 50px;
      border-radius: 4px;
      margin-bottom: 10px;
      text-align: left;
      color: rgba(0, 0, 0, 0.7);
      &.nav {
        font-weight: bolder;
      }
      &.hover {
        &:hover {
          cursor: pointer;
          background-color: rgba(230, 230, 230, 1);
        }
      }
      > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-indent: 1em;
        flex-basis: 20%;
      }
      > .id {
        flex-basis: 10%;
      }
    }
  }
  > .empty {
    margin-top: 15px;
    background-color: rgba(245, 247, 250, 1);
    text-align: center;
    height: 50px;
    line-height: 50px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.7);
  }
}
@include responsive($sm) {
  .vote-container {
    > .vote-header {
      > .header-left {
        display: flex;
        justify-content: space-between;
      }
      .header-right {
        .el-input {
          width: inherit;
        }
      }
    }
  }
}
</style>