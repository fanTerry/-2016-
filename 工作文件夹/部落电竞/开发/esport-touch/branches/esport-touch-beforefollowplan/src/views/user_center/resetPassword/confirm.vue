<template>
  <div class="Page">
    <header class="mod_header">
      <navBar pageTitle="设置新密码"></navBar>
    </header>

    <div class="main">
      <div class="user_pwd">
        <input type="password" placeholder="请输入密码" v-model="password" @blur="scrollToTop">
      </div>
      <div class="user_pwd">
        <input type="password" placeholder="请重复输入密码" v-model="repetPassword" @blur="scrollToTop">
      </div>
      <!-- disabled置灰态 -->
      <a class="register_btn" @click="reset">确定</a>
    </div>
  </div>
</template>

<script>
import jsencrypt from '../../../libs/jsencrypt-rsa.js';
import navBar from '../../../components/header/nav_bar/index';
export default {
  data() {
    return {
      phone: '',
      code: '',
      password: '',
      repetPassword: ''
    };
  },
  mounted() {
    if (this.$route.params && this.$route.params.phone) {
      this.phone = this.$route.params.phone;
      this.code = this.$route.params.code;
    }
  },
  methods: {
    reset() {
      if (this.phone == '') {
        this.$toast('手机号为空');
        return;
      }
      if (this.code == '') {
        this.$toast('验证码为空');
        return;
      }
      if (this.password == '') {
        this.$toast('密码为空');
        return;
      }
      if (!/^([a-zA-Z0-9]){6,15}$/.test(this.password)) {
        this.$toast('密码只能是6-15位字母数字');
        return;
      }
      if (this.repetPassword == '') {
        this.$toast('重复密码为空');
        return;
      }
      if (this.password != this.repetPassword) {
        this.$toast('两次输入的密码不一样');
        return;
      }
      let encryPassword1 = jsencrypt.encryptPwd(this.password);
      let encryPassword2 = encryPassword1;
      let param = {
        phone: this.phone,
        code: this.code,
        password: encryPassword1,
        repetPassword: encryPassword2
      };
      this.$post('/api/regist/resetPassword/', param)
        .then(dataResponse => {
          if (dataResponse.code != '200') {
            this.$toast(dataResponse.message);
            return;
          }
          this.$toast('重置成功');
          this.$router.push({
            name: 'login'
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    scrollToTop: function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
        console.log('回滚');
      }, 100);
    }
  },
  components: {
    navBar
  }
};
</script>

<style lang='scss' scoped>
@import '../../../assets/common/_mixin';
@import '../../../assets/common/_base';
@import '../../../assets/common/_var';

.main {
  padding-top: 25px;
  .user_name,
  .user_pwd {
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
  }
  .register_btn {
    display: block;
    margin: 20px 20px 25px;
    padding: 15px;
    font-size: 18px;
    color: #fff;
    border-radius: 8px;
    text-align: center;
    background-color: $color_main;
    &.disabled {
      opacity: 0.5;
    }
  }
}
</style>
