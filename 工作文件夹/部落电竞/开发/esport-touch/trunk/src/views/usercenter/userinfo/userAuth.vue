<template>
  <div class="Page userAuthPage" @click="closeShowRulesPop($event)">
    <header class="mod_header">
      <navBar pageTitle="实名认证"></navBar>
    </header>
    <div class="main">
      <div class="tips">
        温馨提示：<br>
        每日3次验证机会,请核对信息后提交,一旦提交不可修改。
      </div>
      <section>
        <label for="real_name">真实姓名</label>
        <input v-model="userInfo.trueName" id="real_name" type="text" maxlength="20" placeholder="请输入真实姓名" @blur="scrollToTop">
      </section>

      <section>
        <label for="ID_num">身份证号</label>
        <input v-model="userInfo.certNo" id="ID_num" type="text" placeholder="请输入身份证号码" maxlength="18" @blur="scrollToTop">
      </section>
      <div class="phonecode_div">
        <phone-send-code ref='phoneSend' :time="60" btnTxt="提交" @doConfirm="toDoConfirm" @getSendPhoneCode="getSendPhoneCode">
        </phone-send-code>
      </div>
      <div class="verify_tips">验证不通过<i class="rules_icon" @click="showPopRules = true"></i></div>
      <div class="pop_rules" v-if="showPopRules">
        若出现"身份信息验证不通过"时，原因如下：<br>
        1、现役军人，或退役不到2年（一般为2年）特殊部门人员；<br>
        2、身份真实，大学生户口迁移；<br>
        3、户口迁出，且没有在新迁入地迁入；<br>
        4、户口迁入新迁入地，当地公安系统未上报到公安部；<br>
        5、更改姓名，当地公安系统未上报到公安部；<br>
        6、身份真实，但是逾期未办理；<br>
        7、身份真实，未更换二代身份证；<br>
        8、移民和已故；<br>
        9、身份证号确实不存在。<br>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '../../../components/header/nav_bar/index';
import phoneSendCode from '../../../components/user_info/phoneSendCode.vue';
import { getCheck } from '../../../libs/utils';
import { mapMutations } from 'vuex';

export default {
  components: {
    navBar,
    phoneSendCode
  },
  data() {
    return {
      userInfo: {
        trueName: '',
        certNo: ''
      },
      showPopRules: false
    };
  },
  created() {
    if (this.$store.state.userCenterInfo) {
      this.userInfo = this.$store.state.userCenterInfo;
    }

    console.log(this.userInfo, '获取到的用户信息');
  },
  methods: {
    ...mapMutations(['USER_CENTER_INFO']),
    scrollToTop: function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
        console.log('回滚');
      }, 100);
    },

    //验证输入的手机号
    checkPhone(phone) {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
        return false;
      }
      return true;
    },
    // 处理接收验证码
    getSendPhoneCode(phone) {
      if (phone == '') {
        this.$toast('请先输入手机号');
        return;
      }
      if (!this.checkPhone(phone)) {
        this.$toast('手机号码有误，请重填');
        return;
      }
      let param = {
        phone: phone,
        smsType: 3
      };
      this.$post('/api/user/sendPhoneCode/', param)
        .then(dataResponse => {
          console.log(dataResponse, '实名认证');
          if (dataResponse.code == 200 && dataResponse.data) {
            this.$toast('发送成功,请注意查收~');
          } else {
            this.$toast(dataResponse.message);
            this.$refs.phoneSend.setClickFlag(false);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //处理提交绑定
    toDoConfirm(phone, phoneCode) {
      if (!getCheck.checkTrueName(this.userInfo.trueName)) {
        this.$toast('请输入真实姓名');
        return false;
      }
      if (!getCheck.checkIdCard(this.userInfo.certNo)) {
        this.$toast('请填写正确身份证号');
        return false;
      }
      if (!this.checkPhone(phone)) {
        this.$toast('手机号码有误');
        return;
      }
      if (phoneCode == '') {
        this.$toast('验证码为空');
        return;
      }
      let param = {
        phone: phone,
        code: phoneCode,
        trueName: this.userInfo.trueName,
        certNo: this.userInfo.certNo
      };
      console.log(param);
      this.$post('/api/user/realNameCheck/', param)
        .then(rsp => {
          let response = rsp.data;
          if (rsp.code === '200') {
            this.$toast('实名认证成功!', 2.5);
            this.USER_CENTER_INFO(this.userInfo);
            setTimeout(() => {
              this.$router.go(-1);
            }, 2.5 * 1000);
          } else {
            this.$toast(rsp.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    closeShowRulesPop(e) {
      if (e) {
        console.log(e.target, 123123);
        let rulePopDom = document.getElementsByClassName('pop_rules')[0];
        let RulesIconDom = document.getElementsByClassName('rules_icon')[0];
        if (!rulePopDom.contains(e.target) && e.target != RulesIconDom) {
          this.showPopRules = false;
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import '../../../assets/common/_base';
@import '../../../assets/common/_mixin';
.userAuthPage {
  .mod_header {
    background-color: $color_item !important;
  }
  .nav_bar {
    color: #fff !important;
    .back {
      &::before,
      &::after {
        background-color: #fff !important;
      }
    }
  }
  .phone_num,
  .ver_code {
    height: 12vw !important;
    margin: 0 !important;
    font-size: 3.7333vw !important;
    input {
      color: #fff !important;
    }
    ::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.2) !important;
    }
  }
  .phone_num {
    @include getBorder(bottom, #504d70);
  }
  .confirm_btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100% !important;
    margin: 0 !important;
    border-radius: 0 !important;
    @media only screen and (min-device-width: 375px) and (min-device-height: 812px) and (-webkit-device-pixel-ratio: 3),
      only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
      margin-bottom: constant(safe-area-inset-bottom) !important;
      margin-bottom: env(safe-area-inset-bottom) !important;
    }
  }
}
</style>


<style lang='scss' scoped>
@import '../../../assets/common/_base';
@import '../../../assets/common/_mixin';

.main {
  padding: 0 4.2667vw;
}

.tips {
  padding: 4.2667vw 0;
  font-size: 3.4667vw;
  line-height: 5.8667vw;
  color: rgba(255, 255, 255, 0.5);
}

.pop_rules {
  @extend .g_v_c_mid;
  width: 77.3333vw;
  padding: 3.2vw;
  font-size: 3.4667vw;
  line-height: 5.8667vw;
  border-radius: $border_radius;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
}

section {
  position: relative;
  @extend .flex_hc;
  @include getBorder(bottom, #504d70);
  height: 12vw;
  padding: 0 3.2vw;
  font-size: 3.7333vw;
  background-color: $color_item;
  label {
    width: 19.2vw;
    font-weight: bold;
    color: #fff;
  }
  input {
    flex: 1;
    -webkit-flex: 1;
    line-height: 44px;
    border: none;
    color: #fff;
  }
  input::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
}
.personal_sign {
  align-items: flex-start;
  flex-direction: column;
  -webkit-flex-direction: column;
  height: initial;
  padding: 15px 20px;
  label {
    line-height: 1;
  }
  textarea {
    margin-top: 10px;
    width: 100%;
    padding-top: 5px;
    line-height: 16px;
    border: none;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
.submit_btn {
  display: block;
  margin: 20px 20px 25px;
  padding: 15px;
  font-size: 18px;
  color: #fff;
  border-radius: 8px;
  text-align: center;
  background-color: $color_main;
}
.phonecode_div {
  background-color: $color_item;
  padding-bottom: 2px;
}

.verify_tips {
  @extend .flex_hc;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
  margin-top: 3.4667vw;
  font-size: 3.7333vw;
  color: rgba(255, 255, 255, 0.5);
  i {
    width: 3.7333vw;
    height: 3.7333vw;
    margin-left: 1.0667vw;
    @include getBgImg('../../../assets/images/user_center/rules_icon.png');
    background-size: contain;
  }
}
</style>
