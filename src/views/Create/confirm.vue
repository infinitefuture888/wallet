<template>

  <s-card :title="$t('create.confirm')">
    <el-form
      ref="form"
      :model="form"
      label-position="top"
      class="phrase-container"
    >
      <el-form-item
        v-for="i in Object.keys(form)"
        :key="i"
        :prop="i"
        class="word-input"
      >
        <el-input
          :value="form[i]"
          :placeholder="i"
          @focus="() => handleFocus(i)"
          @clear="() => handleClear(i)"
          :ref="`input_${i}`"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>

    <el-row :gutter="8">
      <el-col
        :xs="6"
        :sm="6"
        class="item"
        v-for="i in buttonList"
        :key="i"
      >
        <el-button
          class="btn"
          @click="() => onClick(i)"
        >{{i}}</el-button>
      </el-col>
    </el-row>
    <div class="action">
      <el-button
        round
        @click="reset"
        class="reset"
      >{{$t('create.reset')}}</el-button>
      <el-button
        round
        class="ok"
        @click="ok"
        :disabled="!buttonList.length == 0"
      >{{$t('global.ok')}}</el-button>
    </div>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get, sortBy } from "lodash";

const phrase = {};
for (let i = 1; i < 25; i++) {
  phrase[`${i}`] = "";
}

export default {
  name: "Confirm",
  data() {
    return {
      form: { ...phrase },
      focusInput: "1"
    };
  },
  computed: {
    ...mapState("account", ["account"]),
    buttonList: function() {
      if (!this.account.phrase) return [];
      const origin = this.account.phrase.split(" ");
      const phraseList = Object.values(this.form);
      if (phraseList.length) {
        return sortBy(origin.filter(i => !phraseList.find(j => i === j)));
      }
      return sortBy(origin);
    }
  },
  methods: {
    onClick(v) {
      this.form[this.focusInput] = v;
      if (this.focusInput < 24) {
        this.focus(`${this.focusInput - 0 + 1}`);
      }
    },
    reset() {
      this.form = { ...phrase };
      this.focus("1");
    },
    ok() {
      if (Object.values(this.form).join(" ") !== this.account.phrase) {
        this.$message({
          type: "error",
          message: this.$t("create.mnemonicWarn")
        });
        return;
      }

      this.$store.dispatch("account/finishCreate");
      this.onFinish();
    },
    handleFocus(i) {
      this.focusInput = i;
    },
    focus(i) {
      this.focusInput = i;
      this.$refs[`input_${i}`][0].focus();
    },
    handleClear(i) {
      this.form[i] = "";
      this.focus(i);
    },
    onFinish() {
      this.$confirm(this.$t("create.backup"), this.$t("create.success"), {
        confirmButtonText: this.$t("global.ok"),
        cancelButtonText: this.$t("global.cancel"),
        type: "success"
      })
        .then(() => {
          this.$store.commit("setAccount", {});
          this.$router.push("/main?tab=assets");
        })
        .catch(() => {
          this.$router.push("/main?tab=assets");
        });
    }
  },
  mounted() {
    this.focus("1");
  }
};
</script>

<style lang="scss" scoped>
.phrase-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-left: -4px;
  margin-right: -4px;
  margin-bottom: 16px;
  .word-input {
    flex-basis: 80px;
    flex-grow: 1;
    margin: 4px;
    input.el-input__inner {
      padding-left: 8px;
      height: 40px;
    }
  }
}
.action {
  text-align: center;
  margin-top: 20px;
  .reset {
    background-color: #fff;
    color: $main-btn;
    width: 30%;
  }
  .ok {
    color: #fff;
    background-color: $main-btn;
    width: 30%;
  }
}
.item {
  margin-bottom: 8px;
}
.btn {
  width: 100%;
  background-color: rgba(220, 223, 230, 1);
  border: 1px solid #dcdfe6;
}
@include responsive($sm) {
  .phrase-container {
    .word-input {
      flex-basis: 80px;
    }
  }
}
</style>
