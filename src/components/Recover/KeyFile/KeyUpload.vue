<template>
  <div class="recover-container">
    <el-upload
      class="upload-demo"
      drag
      action="localhost"
      accept='.txt,.json'
      :before-upload="handleUpload"
      :multiple="false"
      :limit="1"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">{{$t('recover.drag')}} <em>{{$t('recover.click')}}</em></div>

    </el-upload>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "KeyUpload",
  data() {
    return {
      keyStore: ""
    };
  },
  methods: {
    handleUpload(file) {
      const validateKeyStore = value => {
        let res = true;
        try {
          const key = JSON.parse(value);
          if (!key.address || !key.address.match(/^if/)) {
            res = false;
          }
        } catch (e) {
          console.log(e);
          res = false;
        }
        if (!res) {
          this.$message({
            type: "error",
            message: this.$t("recover.keyError"),
            center: true
          });
        }
        return res;
      };
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (validateKeyStore(reader.result)) {
          this.$store.dispatch("recover/inputKey", { keyStore: reader.result });
          this.$router.push("/recover/key/submit");
          return;
        }
        file = null;
      });
      reader.readAsText(file, "utf-8");
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
.recover-container {
  margin: 16px auto;
  .upload-demo {
    border: 1px solid #e6e6e6;
  }
  .btn {
    background: $main-btn;
    width: 100%;
    margin-top: 16px;
    height: 48px;
    color: #fff;
  }
}
</style>

