<template>
  <div class="Page">
    <header class="mod_header">
      <navBar :pageTitle="type==1?'修改密码':'重置密码'"></navBar>
    </header>

    <div class="main">
      <div class="phone_num">
        <!-- <span class="area_code">中国+86</span> -->
        <span v-if='type==1'>您绑定的手机号是:</span>
        <span class="area_code" v-else>中国+86</span>
        <template v-if='disabledFlag'>
          <!--修改密码无法编辑手机号-->
          <input type="tel" maxlength="11" placeholder="请输入手机号" :disabled='disabledFlag' v-model="phoneHide">
        </template>
        <template v-else>
          <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="phone" @blur="scrollToTop">
        </template>
      </div>
      <div class="ver_code">
        <input type="tel" maxlength="4" placeholder="请输入验证码" v-model="registerCode" @blur="scrollToTop">
        <!-- disabled置灰态 -->
        <button v-if="showCountDown" class="send_code disabled">{{countDownTime}} 秒重新获取</button>
        <button v-else v-bind:class="sendRegisterCodeClass" @click="getRegisterCode">发送验证码</button>
      </div>
      <a class="login_btn" @click="goToNext">下一步</a>
      <p class="att_tips">点击上面的“下一步”按钮，即表示您同意</p>
      <p class="rules">枫叶电竞软件许可及服务协议，枫叶电竞版权保护说明，用户私隐政策</p>
    </div>
  </div>
</template>

<script>
import navBar from "../../../components/header/nav_bar/index";

export default {
  data() {
    return {
      phone: "",
      registerCode: "",
      sendRegisterCodeClass: "send_code",
      showCountDown: false,
      countDownTime: 60,
      type: null, //1:修改密码,默认是重置密码
      disabledFlag: false, //无法修改手机号标识
      phoneHide: null
    };
  },
  mounted() {
    if (this.$route.query && this.$route.query.type) {
      this.type = this.$route.query.type;
    }
    if (this.type == 1) {
      this.getUserInfo();
    }
  },
  methods: {
    checkPhone(phone) {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
        return false;
      }
      return true;
    },
    //倒计时
    showCountDownMethod(_this) {
      _this.showCountDown = true;
      var timer = null;
      timer = setInterval(function() {
        if (_this.countDownTime >= 1) {
          _this.countDownTime--;
        }
        if (_this.countDownTime <= 0) {
          clearInterval(timer);
          _this.showCountDown = false;
          _this.countDownTime = 60;
          _this.sendRegisterCodeClass = "send_code";
        }
      }, 1000);
    },
    //获取验证码
    getRegisterCode() {
      this.sendRegisterCodeClass = "send_code disabled";
      console.log(this.phone);
      if (this.phone == "") {
        this.$toast("请先输入手机号");
        this.sendRegisterCodeClass = "send_code";
        return;
      }
      if (!this.checkPhone(this.phone)) {
        this.$toast("手机号码有误，请重填");
        this.sendRegisterCodeClass = "send_code";
        return;
      }
      this.showCountDownMethod(this);
      let param = {
        phone: this.phone
      };
      this.$post("/agency/regist/resetPasswordValidCode/", param)
        .then(dataResponse => {
          if (dataResponse.code == 200) {
            this.$toast("发送成功,请注意查收~");
          } else {
            this.$toast(dataResponse.message);
          }
          this.sendRegisterCodeClass = "send_code";
        })
        .catch(error => {
          console.log(error);
          this.sendRegisterCodeClass = "send_code";
        });
    },

    //点击下一步
    goToNext() {
      if (this.phone == "") {
        this.$toast("手机号为空");
        return;
      }
      if (this.registerCode == "") {
        this.$toast("验证码为空");
        return;
      }
      let param = {
        phone: this.phone,
        code: this.registerCode,
        type: 2
      };
      this.$post("/agency/regist/validRegisterCode/", param)
        .then(dataResponse => {
          if (dataResponse.code != "200") {
            this.$toast(dataResponse.message);
          } else {
            this.$router.push({
              name: "resetPasswordConfirm",
              params: {
                phone: this.phone,
                code: this.registerCode
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    scrollToTop: function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
        console.log("回滚");
      }, 100);
    },
    getUserInfo() {
      let param = {};
      this.$post("/agency/usercenter/ucIndexdata", param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == "200") {
            console.log(dataResponse, "个人设置");
            this.phone = dataResponse.data.phone;
            this.disabledFlag = true;
            this.phoneHide = dataResponse.data.phone.substring(0, 7) + "****";
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: {
    navBar
  }
};
</script>

<style lang='scss' scoped>
@import "../../../assets/common/_mixin";
@import "../../../assets/common/_base";
@import "../../../assets/common/_var";

.mod_header {
  .meet_problem {
    @extend .g_v_mid;
    right: 20px;
    color: #999;
    font-size: 13px;
  }
}

.main {
  padding-top: 25px;
  .phone_num,
  .ver_code {
    @extend .flex_v_justify;
    margin: 0 20px;
    @include getBorder(bottom, #e7e7e7);
    input {
      flex: 1;
      -webkit-flex: 1;
      height: 55px;
      font-size: 15px;
      border: none;
    }
    .send_code {
      @extend .flex_v_h;
      width: 85px;
      height: 24px;
      border-radius: 4px;
      background-color: #d13840;
      border: none;
      color: #fff;
    }
  }
  .phone_num input {
    padding-left: 20px;
  }
  .area_code {
    position: relative;
    padding: 20px 15px 20px 0;
    font-size: 14px;
    &::after {
      content: "";
      @extend .g_v_mid;
      right: 0;
      width: 1px;
      height: 22px;
      background-color: #757a7e;
    }
  }
  .login_btn {
    display: block;
    margin: 20px 20px 25px;
    padding: 15px;
    font-size: 18px;
    color: #fff;
    border-radius: 8px;
    text-align: center;
    background-color: #d13840;
  }
  .disabled {
    opacity: 0.5;
  }
  .att_tips {
    padding-top: 10px;
    padding-left: 20px;
    color: #7c7c7c;
  }
  .rules {
    padding: 20px 20px 0;
    line-height: 18px;
    color: #494949;
  }
}
</style>
