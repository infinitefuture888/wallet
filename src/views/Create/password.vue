<template>
  <s-card :title="$t('passport.create')">
    <div class="create-warn">
      <ul>
        <li>{{$t('create.warn1')}}</li>
        <li>{{$t('create.warn2')}}</li>
      </ul>
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      @submit="onSubmit"
      v-loading="loading"
      label-position="top"
    >
      <el-form-item
        prop="name"
        :label="$t('create.name')"
      >
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item
        prop="pass"
        :label="$t('create.pass')"
      >
        <el-input
          v-model="form.pass"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item
        prop="checkPass"
        :label="$t('create.passCheck')"
      >
        <el-input
          v-model="form.checkPass"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="agree-div">
          <el-checkbox
            class="term"
            label=""
            v-model="agree"
          ></el-checkbox>
          <p class="links">
            <span>{{$t('agree.term3')}}</span>
            <span
              @click="useInfo"
              style="cursor: pointer;"
            >{{$t('agree.use')}}</span>
            {{$t('agree.and')}}
            <span
              @click="privacyInfo"
              style="cursor: pointer;"
            >{{$t('agree.privacy')}}</span>
          </p>
        </div>
      </el-form-item>
      <el-button
        round
        class="btn-next"
        native-type=“submit”
        @click="onSubmit"
      >{{$t('global.next')}}</el-button>
    </el-form>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Password",
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateName = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(requireError(this.$t("create.name")));
        return;
      } else {
        if (value.length > 12) {
          callback(new Error(this.$t("create.nameLength")));
        }
      }
      callback();
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(requireError(this.$t("create.pass")));
      } else {
        if (!value.match("^(?=.*[a-zA-Z])(?=.*\\d)[^\\s]{8,18}$")) {
          callback(new Error(this.$t("create.passWarn")));
          return;
        }
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(requireError(this.$t("create.pass")));
      } else if (value !== this.form.pass) {
        callback(new Error(this.$t("create.passCheckWarn")));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      loading: false,
      agree: false
    };
  },
  methods: {
    useInfo() {
      this.$router.push({ path: "/useInfo" });
    },
    privacyInfo() {
      this.$router.push({ path: "/privacyInfo" });
    },
    onSubmit(e) {
      e.preventDefault();
      if (!this.agree) return false;
      const {
        form,
        $store: { dispatch },
        $router,
        $message,
        $t
      } = this;
      let loading = this.loading;
      this.$refs["form"].validate(async function(valid) {
        if (!valid) return false;

        // create account
        loading = true;
        const created = await dispatch("account/create", form);
        loading = false;
        if (!created) {
          $message({
            type: "error",
            message: $t("create.exist"),
            center: true
          });
          return false;
        }

        // next step
        $router.push("mnemonic");
      });
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
  li {
    list-style: none;
  }
}
.agree-div {
  display: flex;
  align-items: center;
  .term {
    display: flex;
    align-items: flex-start;
    margin: $padding-basic 0;
  }
  .links {
    margin-left: 15px;
    a {
      font-weight: bolder;
      padding: 0 3px;
    }
  }
}
.btn-next {
  width: 100%;
  height: 48px;
  background-color: $main-btn;
  color: #fff;
}
.el-form-item {
  margin-bottom: 10px;
}
</style>

