<template>
  <div class="recover-container">

    <el-form
      ref="form"
      :model="phrase"
      :rules="rules"
      @submit="onSubmit"
      label-position="top"
    >
      <div class="phrase-container">
        <el-form-item
          v-for="i in Object.keys(phrase)"
          :key="i"
          :prop="i"
          class="word-input"
        >
          <el-autocomplete
            v-model="phrase[i]"
            :fetch-suggestions="(query, callback) => querySearch(i, query, callback)"
            :placeholder="i"
            :trigger-on-focus="false"
            @change="v => handleChange(i, v)"
            @select="v => handleSelect(i, v)"
            clearable
          ></el-autocomplete>
        </el-form-item>
      </div>

      <el-button
        round
        class="btn"
        native-type=“submit”
        @click="onSubmit"
      >{{$t('global.next')}}</el-button>
    </el-form>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";
import { wordList } from "@/constants/wordList";

export default {
  name: "PhraseInput",
  data() {
    const validator = (rule, value, callback) => {
      if (value.trim().split(" ").length > 1) {
        callback();
        return;
      }
      if (!wordList.find(i => i === value)) {
        callback(new Error(this.$t("create.mnemonicWarn")));
        return;
      }
      callback();
    };

    const phrase = {};
    for (let i = 1; i < 25; i++) {
      phrase[`${i}`] = "";
    }
    const rules = {};
    Object.keys(phrase).forEach(k => {
      rules[k] = [{ validator: validator, trigger: "change" }];
    });
    return {
      wordList,
      phrase,
      rules
    };
  },
  methods: {
    handleChange(i, v) {
      const ls = v.trim().split(" ");
      if (ls.length > 1) {
        this.splitInput(i, ls);
      }
    },
    querySearch(i, query, callback) {
      this.handleChange(i, query);

      const words = query
        ? this.wordList.filter(w => w.indexOf(query) === 0)
        : this.wordList;
      callback(words.map(w => ({ value: w })));
    },
    handleSelect(i, e) {
      this.handleChange(i, e.value);
    },
    splitInput(i, ls) {
      ls.forEach((word, index) => {
        this.phrase[`${i - 0 + index}`] = word;
      });
    },
    onSubmit(e) {
      e.preventDefault();
      const { phrase, $router, $store } = this;
      this.$refs["form"].validate(async function(valid) {
        if (!valid) return false;
        $store.dispatch("recover/inputPhrase", {
          phrase: Object.values(phrase).join(" ")
        });
        $router.push("/recover/phrase/submit");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.recover-container {
  margin: 12px auto;

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

  .btn {
    width: 100%;
    height: 48px;
    background-color: $main-btn;
    color: #fff;
  }
}
</style>

