<template>
  <h2 class="nav_bar">
    <div class="back" @click="goBackHome" v-if="type"></div>
    <div class="back" @click="goBackCommunity" v-else-if="commentType==2"></div>
    <div class="back" @click="goBack" v-else></div>
    {{pageTitle}}
    <slot>
    </slot>
    <!-- 注册页面用到 遇到问题 -->
    <!-- <a class="meet_problem">遇到问题?</a> -->
  </h2>
</template>

<script>
import { getQueryString } from '../../../libs/utils';
export default {
  props: ['pageTitle', 'type', 'commentType'],
  data() {
    return {};
  },
  methods: {
    goBack() {
      console.log('back2');
      if (this.judgeWindowLocation()) {
        this.$router.go(-2);
      } else {
        this.$router.go(-1);
      }
      if (window.history.length <= 1) {
        this.$router.push('/home');
      }
    },
    goBackHome() {
      this.$router.push('/home');
    },
    goBackCommunity() {
      var url = window.location.href;
      console.log('获取到的url', url);
      var firstUrl = window.sessionStorage.getItem('firstUrl');
      let sp = getQueryString('sp');
      console.log('0000', window.history.length, sp);
      /** step1 在话题页测试返回 */
      if (window.history.length <= 1) {
        this.$router.push('/community');
      } else if (url == firstUrl) {
        console.log('url相同');
        window.sessionStorage.removeItem('firstUrl');
        this.$router.replace('/community');
      } else {
        //通过window.location.href跳转话题内页，需要点击2下返回
        if (sp) {
          console.log('back', sp);
          this.$router.go(-2);
        } else {
          console.log('back1');
          this.$router.go(-1);
        }
      }
    },
    judgeWindowLocation() {
      //使用window.location 需要跳转两次页面,所以在这里处理
      if (this.$route.path.indexOf('uc/userAuth') > -1 && this.$route.query.redirect && this.$route.query.redirect.indexOf('recharge') > -1) {
        return true;
      }
    }
  },

  components: {}
};
</script>

<style lang='scss' scoped>
@import '../../../assets/common/_mixin';
@import '../../../assets/common/_base';
@import '../../../assets/common/_var';
.nav_bar {
  position: relative;
  @include t_nowrap(100%);
  padding: 0 40px;
  font-size: 18px !important;
  line-height: 44px;
  font-weight: normal;
  color: #333;
  text-align: center;
  .meet_problem {
    @extend .g_v_mid;
    right: 20px;
    color: #999;
    font-size: 13px;
  }
}
// 回退按钮
.back {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 44px;
  height: 44px;
  @include getArrow(12px, #525252, left);
  &:before,
  &:after {
    width: 2px;
  }
}
</style>
