<template>
  <div class="recover-container">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        prop="keyStore"
        required
      >
        <el-input
          class="input"
          type="textarea"
          :placeholder="$t('recover.key')"
          :autosize="{ minRows: 8, maxRows: 12}"
          v-model="form.keyStore"
        >
        </el-input>
      </el-form-item>
    </el-form>

    <el-button
      round
      class="btn"
      @click="onSubmit"
    >{{$t('global.next')}}</el-button>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "KeyInput",
  data() {
    const validateKeyStore = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("global.required", { name: "KeyStore" })));
      } else {
        try {
          const key = JSON.parse(value);
          if (!key.address || !key.address.match(/^if/)) {
            callback(new Error(this.$t("recover.keyError")));
            return;
          }
          callback();
        } catch (e) {
          callback(new Error(this.$t("recover.keyError")));
        }
      }
    };
    return {
      form: {
        keyStore: ""
      },
      rules: {
        keyStore: [{ validator: validateKeyStore, trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      const { form, $router, $store } = this;
      this.$refs["form"].validate(async function(valid) {
        if (!valid) return false;
        $store.dispatch("recover/inputKey", form);
        $router.push("/recover/key/submit");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.recover-container {
  margin: 16px auto;

  .btn {
    width: 100%;
    height: 48px;
    background-color: $main-btn;
    color: #fff;
  }
}
</style>

