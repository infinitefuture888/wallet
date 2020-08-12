<template>
  <el-form
    class="recover-container"
    ref="form"
    label-position="top"
    :model="form"
    :rules="rules"
    @submit="onSubmit"
  >
    <el-form-item prop="name">
      <el-input
        v-model="form.name"
        :placeholder="$t('create.name')"
      ></el-input>
    </el-form-item>
    <el-form-item prop="pass">
      <el-input
        v-model="form.pass"
        type="password"
        :placeholder="$t('create.pass')"
      ></el-input>
    </el-form-item>

    <el-button
      round
      class="btn"
      native-type=“submit”
      @click="onSubmit"
    >{{$t('passport.recover')}}</el-button>
  </el-form>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "KeySubmit",
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateName = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(requireError(this.$t("create.name")));
        return;
      }
      callback();
    };
    const validatePass = (rule, value, callback) => {
      // callback();
      // return;
      if (value === "") {
        callback(requireError(this.$t("create.pass")));
        return;
      }
      callback();
    };
    return {
      form: {
        name: "",
        pass: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("recover", ["keyText"])
  },
  methods: {
    onSubmit: async function(e) {
      e.preventDefault();
      this.$store.commit("staking/setDelegationsEmpty");
      const { form, $router, $store, keyText } = this;
      this.$refs["form"].validate(async function(valid) {
        if (!valid) return false;
        const params = { ...form, keyStore: keyText };
        const account = await $store.dispatch("account/importKeyStore", params);
        if (account) {
          // clear Key after import
          $store.dispatch("recover/clearKey");
          // and logout math-wallet account
          $store.dispatch("account/resetMathIdentity");

          $router.push("/main?tab=assets");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.recover-container {
  margin: 16px auto;

  .btn {
    background: $main-btn;
    width: 100%;
    margin-top: 16px;
    height: 48px;
    color: #fff;
  }
}
</style>

