<template>
  <div class="item-content">
    <div
      class="action-item"
      @click="edit(user)"
    >{{$t('passport.edit')}}</div>
    <div
      class="action-item"
      @click="backup(user)"
    >{{$t('passport.backup')}}</div>
    <div
      class="action-item"
      @click="privateKey(user)"
    >{{$t('passport.privateKey')}}</div>
    <div
      class="action-item btn-delete"
      @click="deleteWallet(user)"
    >{{$t('passport.delete')}}</div>
    <el-dialog
      :title="`${$t('passport.backup')} ${user}`"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <a
        class="btn-backup btn-copy"
        v-clipboard:copy="JSON.stringify(userMap[user])"
        v-clipboard:success="onCopy"
      ><i class="el-icon-document"></i>{{$t('passport.backupCopy')}}</a>
      <a
        class="btn-backup"
        :download="`${user}.keyStore.txt`"
        :href="fileLink"
      ><i class="el-icon-download"></i>{{$t('passport.backupFile')}}</a>
    </el-dialog>
  </div>
</template>

<script>
import { get, set, isEmpty } from "lodash";
import icon from "@/assets/icon-wallet.svg";

export default {
  name: "selectContent",
  props: {
    userMap: Object,
    user: String
  },
  data() {
    return { dialogVisible: false, fileLink: "", icon };
  },
  computed: {
    width() {}
  },
  methods: {
    handleClick(e) {
      e.stopPropagation();
    },
    handleCommand(user, cmd) {
      const cmds = {
        edit: this.edit,
        backup: this.backup,
        privateKey: this.privateKey,
        delete: this.delete
      };
      cmds[cmd](user);
    },
    edit(user) {
      const inputValidator = v => {
        const name = v.trim();
        if (name.length === 0) {
          return this.$t("global.required", { name: this.$t("create.name") });
        }
        if (name !== user && !isEmpty(this.userMap[name])) {
          return this.$t("create.exist");
        }
        return true;
      };
      this.$prompt("", this.$t("passport.edit"), {
        confirmButtonText: this.$t("global.ok"),
        cancelButtonText: this.$t("global.cancel"),
        confirmButtonClass: "ok-btn",
        closeOnClickModal: false,
        inputValue: user,
        inputValidator
      })
        .then(({ value }) => {
          this.$store.dispatch("account/editName", { user, name: value });
          this.$message({
            type: "success",
            message: this.$t("global.success", {
              name: this.$t("passport.edit")
            })
          });
        })
        .catch(() => {});
    },
    backup(user) {
      this.$prompt(
        this.$t("create.pass"),
        `${this.$t("passport.backup")} ${user}`,
        {
          confirmButtonText: this.$t("global.ok"),
          cancelButtonText: this.$t("global.cancel"),
          confirmButtonClass: "ok-btn",
          inputType: "password",
          inputValidator: v =>
            v.trim().length > 0
              ? true
              : this.$t("global.required", { name: this.$t("create.pass") })
        }
      )
        .then(({ value }) => {
          this.$store
            .dispatch("account/backup", {
              user,
              pass: value
            })
            .then(key => {
              this.dialogVisible = true;
            })
            .catch(e => {
              console.log(e);
              this.$message.error(
                `${this.$t("create.pass")}${this.$t("global.error")}`
              );
            });
        })
        .catch(() => {});
    },
    privateKey(user) {
      this.$prompt(
        this.$t("create.pass"),
        `${this.$t("passport.privateKey")} ${user}`,
        {
          confirmButtonText: this.$t("global.ok"),
          cancelButtonText: this.$t("global.cancel"),
          confirmButtonClass: "ok-btn",
          inputType: "password",
          inputValidator: v =>
            v.trim().length > 0
              ? true
              : this.$t("global.required", { name: this.$t("create.pass") })
        }
      )
        .then(({ value }) => {
          this.$store
            .dispatch("account/backup", {
              user,
              pass: value
            })
            .then(acc => {
              this.$copyText(acc.privateKey).then(
                e => {
                  this.onCopy();
                },
                e => {
                  console.log(e);
                }
              );
            })
            .catch(e => {
              console.log(e);
              this.$message.error(
                `${this.$t("create.pass")}${this.$t("global.error")}`
              );
            });
        })
        .catch(() => {});
    },
    onCopy() {
      this.$message({
        type: "success",
        message: this.$t("global.success", {
          name: this.$t("main.copy")
        })
      });
    },
    deleteWallet(user) {
      this.$confirm(
        this.$t("passport.deleteWarn"),
        `${this.$t("passport.delete")} ${user}`,
        {
          confirmButtonText: this.$t("global.ok"),
          cancelButtonText: this.$t("global.cancel"),
          confirmButtonClass: "ok-btn",
          type: "warning"
        }
      )
        .then(() => {
          this.doDelete(user);
        })
        .catch(() => {});
    },
    doDelete(user) {
      const successMsg = this.$t("global.success", {
        name: this.$t("passport.delete")
      });
      this.$prompt(
        this.$t("create.pass"),
        `${this.$t("passport.delete")} ${user}`,
        {
          confirmButtonText: this.$t("global.ok"),
          cancelButtonText: this.$t("global.cancel"),
          confirmButtonClass: "ok-btn",
          inputType: "password",
          inputValidator: v =>
            v.trim().length > 0
              ? true
              : this.$t("global.required", { name: this.$t("create.pass") }),
          beforeClose: (action, ins, done) => {
            if (action !== "confirm") {
              return done();
            }
            this.$store
              .dispatch("account/delete", {
                user,
                pass: ins.inputValue
              })
              .then(res => {
                this.$message({
                  type: "success",
                  message: successMsg
                });
                done();
              })
              .catch(e => {
                console.log(e);
                this.$message.error(
                  `${this.$t("create.pass")}${this.$t("global.error")}`
                );
              });
          }
        }
      )
        .then(({ value }) => {})
        .catch(() => {});
    }
  },
  mounted() {
    this.fileLink = URL.createObjectURL(
      new Blob([JSON.stringify(this.userMap[this.user])])
    );
  }
};
</script>

<style lang="scss" scoped>
.item-content {
  width: 100%;
  > .action-item {
    height: 80px;
    line-height: 80px;
    font-size: 18px;
    text-align: center;
    background-color: rgba(242, 246, 252, 1);
    color: rgba(0, 0, 0, 0.7);
    border-radius: 4px;
    margin-bottom: 15px;
    box-shadow: $shadow;
    cursor: pointer;
    &:hover {
      background: $main-btn;
      color: #fff;
      transition: 0.2s linear;
    }
  }
  > .btn-delete,
  .btn-delete:hover {
    color: red;
  }
  .el-message-box {
    .el-message-box__btns {
      .ok-btn {
        background-color: $main-btn !important;
        color: #fff;
      }
    }
  }
}
.btn-backup {
  display: block;
  padding: $padding-basic;
  margin-top: $padding-basic;
  background: rgb(44, 61, 120);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  i {
    margin-right: 16px;
  }
  &:hover {
    background: $main-btn;
  }
  &.btn-copy {
    margin-top: 0;
  }
}
</style>
<style lang="scss">
.el-message-box {
  .el-message-box__btns {
    .ok-btn {
      background-color: $main-btn !important;
      color: #fff;
    }
  }
}
@include responsive($sm) {
  .el-message-box {
    width: 80% !important;
  }
  .el-dialog {
    width: 90% !important;
  }
}
</style>


