<template>
  <div class='Page'>
    <header class='mod_header'>
      <nav-bar :pageTitle="'我的银行卡'"></nav-bar>
    </header>
    <div class='main'>
      <p class="title">新增卡</p>
      <p class="tips">为保障账户资金安全，仅可绑定实名认证用户本人的银行卡</p>
      <p class="info_input">持卡人：{{trueName}}<i class="att_icon"></i></p>
      <input class="input" type="text" placeholder="卡号码：请输入卡号">
      <a class='next_btn'>下一步</a>
    </div>
    <footer class='mod_footer'>

    </footer>
  </div>
</template>

<script>
import navBar from '../../../../components/header/nav_bar/index.vue';
export default {
  components: {
    navBar
  },
  props: [],
  data() {
    return {
      trueName: null
    };
  },
  created() {
    this.trueName = this.$route.query.trueName;
    console.log(this.trueName, '获取到的用户名字');
  },
  methods: {
    //
  }
};
</script>

<style lang='scss' scoped>
@import '../../../../assets/common/_base';
@import '../../../../assets/common/_mixin';


.title {
  padding-top: 10.6667vw;
  font-size: 5.3333vw;
  line-height: 5.8667vw;
  text-align: center;
  color: #fff;
}

.tips {
  padding: 3.2vw 4.2667vw 10.6667vw;
  font-size: 3.7333vw;
  line-height: 5.3333vw;
  color: #fff;
}

.info_input,
.input {
  @extend .flex_hc;
  width: 91.4667vw;
  height: 10.6667vw;
  margin: 0 auto 2.1333vw;
  padding: 0 4.2667vw;
  border-radius: 1.3333vw;
  font-size: 4vw;
  color: #666;
  background-color: #ccc;
}

.input {
  color: #999;
  background-color: #fff;
}

.next_btn {
  display: block;
  margin: 62.1333vw 4.2667vw 0;
  @include getBtn(auto, 10.4vw, 4vw, #fff, #d53941, 1.3333vw);
  border: 1px solid #ff9da3;
}
</style>
