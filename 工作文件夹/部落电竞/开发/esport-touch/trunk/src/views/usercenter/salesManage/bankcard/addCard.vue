<template>
  <div class='Page'>
    <header class='mod_header'>
      <nav-bar :pageTitle="'新增银行卡'"></nav-bar>
    </header>
    <div class='main'>
      <!-- <p class="title">新增卡</p> -->
      <p class="tips">为保障账户资金安全，仅可绑定实名认证用户本人的银行卡</p>
      <p class="info_input">持卡人：{{trueName}}<i class="att_icon"></i></p>

      <input class="input" v-model="bankInfo.bankName" type="text" maxlength="20" placeholder="所属银行：请输入所属银行" @blur="scrollToTop" />
      <input class="input" v-model="bankInfo.branchBank" type="text" placeholder="分行信息：请输入分行信息" maxlength="18" @blur="scrollToTop" />
      <input class="input" v-model="bankInfo.bankNo" type="tel" v-on:input="bankNo=onlyNum(bankInfo.bankNo)" placeholder="卡号码：请输入卡号" maxlength="25" @blur="scrollToTop">

      <a class='next_btn' @click="toVerifyBankCard()">确认绑卡</a>
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
      trueName: null,
      bankInfo: {
        bankName: '',
        branchBank: '',
        bankNo: ''
      }
    };
  },
  created() {
    this.trueName = this.$route.query.trueName;
  },
  methods: {
    //银行卡验证
    toVerifyBankCard() {
      if (!this.bankInfo.bankName || !this.bankInfo.branchBank || !this.bankInfo.bankNo) {
        this.$toast('必要参数为空');
        return;
      }
      console.log(this.bankInfo);
      this.$post('/api/usercenter/bindCard', this.bankInfo)
        .then(rsp => {
          let response = rsp.data;
          if (rsp.code === '200') {
            this.$toast('银行卡绑定成功!');
            setTimeout(() => {
              this.$router.go(-1);
            }, 3 * 1000);
          } else {
            this.$toast(rsp.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // goAddCardConfirm(userBankCardResult) {
    //   console.log(userBankCardResult);
    //   this.$router.push({
    //     name: 'addCardConfirm',
    //     params: {
    //       trueName: userBankCardResult.name,
    //       accountNo: userBankCardResult.accountNo,
    //       bank: userBankCardResult.bank
    //     }
    //   });
    // },

    onlyNum(bankNo) {
      return bankNo.replace(/\D/g, '');
    },
    scrollToTop: function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
        console.log('回滚');
      }, 100);
    }
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
  @extend .flex_v_justify;
  width: 91.4667vw;
  height: 10.6667vw;
  margin: 0 auto 2.1333vw;
  padding: 0 4.2667vw;
  border-radius: $border_radius;
  font-size: 4vw;
  color: rgba(255, 255, 255, 0.3);
  background-color: #242330;
  i {
    width: 3.7333vw;
    height: 3.7333vw;
    @include getBgImg('../../../../assets/images/user_center/sales/att_icon.png');
  }
}

.input {
  color: rgba(255, 255, 255, 0.5);
  background-color: #3d3b51;
}

.next_btn {
  display: block;
  margin: 62.1333vw 4.2667vw 0;
  @include getBtn(auto, 10.4vw, 4vw, #fff, $color_main, 1.3333vw);
  border: 1px solid #3d3b51;
}
</style>
