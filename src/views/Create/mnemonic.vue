<template>

  <s-card :title="$t('passport.create')">

    <div class="create-warn">
      {{$t('create.mnemonicBreif')}}
    </div>
    <p class="phrase-name">
      <span>{{$t("create.mnemonic")}}</span>
      <span
        class="copy"
        v-clipboard:copy="account.phrase"
        v-clipboard:success="onCopy"
      >{{$t('create.clickCopy')}}</span>
    </p>
    <!-- <el-input
      class="mnemonic"
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 8}"
      :value="account.phrase"
    >
    </el-input>

    <el-button
      class="btn-next"
      @click="onSubmit"
    >{{$t('global.next')}}</el-button> -->
    <el-form>
      <div class="phrase-container">
        <el-form-item
          v-for="i in Object.keys(phrase)"
          :key="i"
          :prop="i"
          class="word-input"
        >
          <el-input
            :value="phraseArr[i]"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </div>
      <el-button
        round
        class="btn-next"
        @click="onSubmit"
      >{{$t('passport.backups')}}</el-button>
    </el-form>
    <el-dialog
      :title="$t('create.mnemonicConfirm')"
      :visible.sync="dialogVisible"
      width="360px"
      :close-on-click-modal="false"
    >
      <p class="info">{{$t('create.mnemonicInfo')}}</p>
      <el-input
        v-model="text"
        @keyup.enter.native="onConfirm"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="onConfirm"
          class="ok-btn"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Mnemonic",
  data() {
    const phrase = {};
    for (let i = 0; i < 24; i++) {
      phrase[`${i}`] = "";
    }
    return {
      phrase,
      dialogVisible: false,
      text: ""
    };
  },
  computed: {
    ...mapState("account", ["account"]),
    phraseArr() {
      return this.account.phrase.split(" ");
    }
  },
  methods: {
    onSubmit() {
      this.dialogVisible = true;
    },
    onCopy() {
      this.$message({
        type: "success",
        message: this.$t("global.success", {
          name: this.$t("main.copy")
        })
      });
    },
    onConfirm() {
      if (this.text == this.$t("create.mnemonicInfo2")) {
        this.$router.push("confirm");
      } else {
        this.$message.error(this.$t("global.entryError"));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.create-warn {
  padding: 8px 15px;
  background: rgba(230, 162, 60, 0.2);
  margin-bottom: $padding-basic;
  color: rgba(230, 162, 60, 1);
  font-size: 12px;
  border-radius: $border-radius;
  margin-top: 5px;
}
.mnemonic {
  margin-bottom: $padding-basic;
}
.btn-next {
  width: 100%;
  height: 48px;
  background-color: $main-btn;
  color: #fff;
}
.phrase-name {
  display: flex;
  justify-content: space-between;
  .copy {
    color: $main-btn;
    cursor: pointer;
    font-weight: bolder;
  }
}

.phrase-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-left: -4px;
  margin-right: -4px;
  .word-input {
    flex-basis: 80px;
    flex-grow: 1;
    margin: 4px;
    margin-bottom: 16px;
    input.el-input__inner {
      padding-left: 8px;
    }
  }
}
.ok-btn {
  background: $main-btn;
  color: #fff;
}
.info {
  color: $main-btn;
}
</style>
