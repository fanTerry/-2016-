<template>
  <div>
    <div class="phone_num">
      <!-- <span class="area_code">中国+86</span> -->
      <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="phoneLogin.phone" @blur="scrollToTop">
    </div>
    <div class="ver_code">
      <input type="tel" maxlength="4" placeholder="请输入验证码" v-model="phoneLogin.phoneSendCode" @blur="scrollToTop">
      <button class="send_code" :class="{'disabled':phoneLogin.clickSendFlag}" :disabled="phoneLogin.clickSendFlag" @click="getSendPhoneCode()">
        <template v-if="phoneLogin.clickSendFlag&&phoneLogin.countDownTime>0">{{phoneLogin.countDownTime}}秒重新获取</template>
        <template v-else>发送验证码</template>
      </button>
    </div>
    <p class="att_tips" v-if='cookieUseFlag==false'>您的手机浏览器不支持或已经禁止使用cookie,无法正常登录,请开启或更换其他浏览器</p>
    <a class="confirm_btn" :class="{'disabled':activeFlag}" @click="doConfirm" v-if='btnTxt'>{{btnTxt}}</a>
  </div>
</template>

<script>
export default {
  props: {
    time: Number, //倒计时秒数
    btnTxt: String, //按钮文字
    cookieUseFlag: null
  },
  data() {
    return {
      phoneLogin: {
        phone: null, //手机号
        phoneSendCode: null, //验证码
        countDownTime: null, //倒计时秒数
        clickSendFlag: false //点击发送验证码按钮,可控制样式:false 表示可以点击发送
      }
    };
  },
  computed: {
    //计算是否可以高亮确定按钮
    activeFlag() {
      let input1 = this.phoneLogin.phone;
      let input2 = this.phoneLogin.phoneSendCode;
      if (input1 && input2 && input1.length == 11 && input2.length == 4) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    doConfirm() {
      this.$emit('doConfirm', this.phoneLogin.phone, this.phoneLogin.phoneSendCode);
    },
    //获取验证码
    getSendPhoneCode() {
      let phone = this.phoneLogin.phone;
      console.log(phone, '点击获取验证码-start');
      if (!phone) {
        this.$toast('请先输入手机号');
        return;
      }
      if (!this.checkPhone(phone)) {
        this.$toast('手机号码有误，请重填');
        return;
      }
      if (this.phoneLogin.clickSendFlag) {
        this.$toast('验证码发送中,请稍等');
        return;
      }
      this.phoneLogin.clickSendFlag = true;
      this.showCountDownMethod();
      this.$emit('getSendPhoneCode', phone);
      // let param = {
      //   phone: phone
      // };
      // this.$post("/api/regist/gainPhoneRegistValidCode/", param)
      //   .then(dataResponse => {
      //     if (dataResponse.code != "200") {
      //       this.$toast(dataResponse.message);
      //     }
      //     this.phoneLogin.clickSendFlag = false;
      //   })
      //   .catch(error => {
      //     console.log(error);
      //     this.phoneLogin.clickSendFlag = false;
      //   });
      console.log('点击获取验证码-end');
    },
    //验证输入的手机号
    checkPhone(phone) {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
        return false;
      }
      return true;
    },
    //倒计时
    showCountDownMethod() {
      var timer = null;
      this.phoneLogin.countDownTime = this.time;
      timer = setInterval(() => {
        if (this.phoneLogin.countDownTime >= 1) {
          this.phoneLogin.countDownTime--;
        }
        if (this.phoneLogin.countDownTime <= 0) {
          clearInterval(timer);
          this.phoneLogin.countDownTime = this.time;
          this.phoneLogin.clickSendFlag = false;
        }
      }, 1000);
    },
    setClickFlag(flag) {
      this.phoneLogin.clickSendFlag = flag;
    },
    scrollToTop: function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 100);
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../../assets/common/_base.scss';
@import '../../assets/common/_mixin.scss';
@import '../../assets/common/_var.scss';

.phone_num,
.ver_code {
  @extend .flex_v_justify;
  margin: 0 23px;
  padding-left: 4.2667vw;
  background-color: transparent;
  border-radius: 3px;
  input {
    height: 12vw;
    font-size: 4vw;
    width: 32vw;
    flex: 1;
    -webkit-flex: 1;
    border: none;
    color: #333;
  }
  .send_code {
    @include getBtn(34.1333vw, 9.3333vw, 4vw, #fff, #636391, $border_radius);
    font-weight: bold;
  }
}

.phone_num {
  justify-content: flex-start;
  -webkit-justify-content: flex-start;
}

.ver_code {
  margin-top: 11px;
  padding-right: 7px;
  input::-webkit-input-placeholder {
    color: #999;
  }
}

.att_tips {
  margin: 10px 20px 0;
  line-height: 20px;
  font-size: 15px;
  color: red;
}

.phone_num input {
  &::-webkit-input-placeholder {
    color: #999;
  }
}
.area_code {
  position: relative;
  padding: 20px 10px 20px 15px;
  font-size: 14px;
  color: #999;
  &::after {
    content: '';
    @extend .g_v_mid;
    right: 0;
    width: 1px;
    height: 22px;
    background-color: #999;
  }
}
.disabled {
  opacity: 0.5;
}
.confirm_btn {
  display: block;
  margin: 35px 23px 20px;
  @include getBtn(auto, 12.2667vw, 4.8vw, #fff, $color_btn, $border_radius);
  font-weight: bold;
  &.disabled {
    opacity: 0.5;
  }
}
</style>
