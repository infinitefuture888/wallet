<template>
  <s-page class="receive-container">
    <s-card :title="$t('main.receive')">
      <div class="card-content">
        <ul class="warn">
          <li>{{$t('send.codeMessage1')}}</li>
          <li>{{$t('send.codeMessage2')}}</li>
        </ul>
        <div id="qrcode"></div>
        <p class="address">{{address || ''}}</p>
        <div class="btn-div">
          <el-button
            round
            v-clipboard:copy="address"
            v-clipboard:success="onCopy"
          >{{$t('main.copy')}}</el-button>
        </div>
      </div>
    </s-card>
  </s-page>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get, isEmpty } from "lodash";
import QRCode from "@/utils/qrcode";

export default {
  name: "Receive",
  data() {
    return {
      address: ""
    };
  },
  computed: {
    ...mapState("account", ["keyStore", "mathAccount"])
  },
  mounted() {
    if (isEmpty(this.keyStore)) {
      new QRCode(document.getElementById("qrcode"), this.mathAccount.account);
      this.address = this.mathAccount.account;
    } else {
      new QRCode(document.getElementById("qrcode"), this.keyStore.address);
      this.address = this.keyStore.address;
    }
  },
  methods: {
    onCopy() {
      this.$message({
        type: "success",
        message: this.$t("global.success", {
          name: this.$t("main.copy")
        })
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.receive-container {
  margin: 0 auto;
  text-align: center;

  .card-content {
    background: white;
    border-radius: 4px;
    padding: $padding-basic 0 $padding-large;
    color: rgba(0, 0, 0, 0.7);
    text-align: left;
    li {
      list-style: none;
    }
    > .warn {
      padding: 8px 15px;
      background: rgba(230, 162, 60, 0.2);
      margin-bottom: $padding-basic;
      color: rgba(230, 162, 60, 1);
      font-size: 12px;
      border-radius: $border-radius;
      margin-top: 5px;
    }
    h4 {
      font-size: 20px;
      font-weight: bold;
      margin: 16px;
    }
    #qrcode {
      width: 256px;
      margin: 16px auto;
    }
    .btn-div {
      text-align: center;
      margin-top: 15px;
      .el-button {
        width: 80%;
        background-color: $main-btn;
        color: #fff;
      }
    }
    .address {
      text-align: center;
    }
  }
}
@include responsive($sm) {
  .receive-container {
    .card-content {
      p {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>

