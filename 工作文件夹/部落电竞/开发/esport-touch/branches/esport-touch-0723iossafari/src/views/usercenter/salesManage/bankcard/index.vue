<template>
  <div class='Page'>
    <header class='mod_header'>
      <nav-bar :pageTitle="'我的银行卡'"></nav-bar>
    </header>
    <div class='main'>
      <mescroll ref="mescroll" :isUseDown="false" :isUseUp="false">
        <p class="tips">请准确填写个人银行卡信息用于财务打款</p>
        <section class="mod_card" v-for="(item,index) in bankCardList" :key="index" :class="{select:item.isDefault==1}"
          @click="toDefault(item.id,item.isDefault,item.bankAccountNo)">
          <div class="card_info">
            <div class="card_img">
              <img src="../../../../assets/images/user_center/sales/default_icon.png" alt="">
            </div>
            <div>
              <p class="card_name">{{item.bankName |subStr(13)}}</p>
              <p>{{item.cardTypeName }}</p>
            </div>
          </div>
          <div class="card_num">
            <span v-for="(item,index) in 3" :key="index"><i v-for="(item,index) in 4" :key="index"></i></span>
            <span>{{item.bankAccountNo |formatNumber(4)}}</span>
          </div>
        </section>
        <div class="add_card" @click="addCard()">
          <span class="add_icon"></span>
          <span>添加银行卡</span>
          <i></i>
        </div>
      </mescroll>
    </div>
    <popAlert :showPop='showPop' @close='showPop=false' @confirm='confirm' type="2">
      <p v-if="bankAccountNo">将尾号{{bankAccountNo |formatNumber(4)}}的卡设置为默认卡</p>
    </popAlert>
    <footer class='mod_footer'>

    </footer>
  </div>
</template>

<script>
import navBar from '../../../../components/header/nav_bar/index.vue';
import popAlert from '../../../../components/pop_up/pop_alert.vue';
import mescroll from '../../../../components/common/mescroll.vue';
export default {
  components: {
    navBar,
    popAlert,
    mescroll
  },
  props: [],
  data() {
    return {
      bankCardList: [],
      showPop: false,
      bankAccountNo: null,
      bankCardId: null,
      trueName: null
    };
  },
  mounted() {
    this.getBankCard();
  },
  methods: {
    //获取用户银行卡
    getBankCard() {
      return this.$post('/api/usercenter/getBankCardList')
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200 && dataResponse.data.userBankList) {
            this.bankCardList = dataResponse.data.userBankList;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //改变默认卡
    toDefault(bankCardId, isDefault, bankAccountNo) {
      this.bankAccountNo = bankAccountNo;
      this.bankCardId = bankCardId;
      if (isDefault != 1) {
        this.showPop = true;
      }
    },
    setDefault() {
      let param = {};
      param.id = this.bankCardId;
      console.log('参数', param);
      return this.$post('/api/usercenter/changeDefault', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == '200') {
            this.getBankCard();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    confirm: function() {
      this.showPop = false;
      this.setDefault();
    },
    //添加银行卡
    addCard() {
      return this.$post('/api/usercenter/getUserIDCard')
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            if (dataResponse.data.name) {
              this.trueName = dataResponse.data.name;
              this.goAddCard();
            }
          } else {
            this.$toast(dataResponse.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goAddCard() {
      console.log(this.trueName);
      this.$router.push({
        path: '/userCenter/salesManage/addCard',
        query: {
          trueName: this.trueName
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../../../../assets/common/_base';
@import '../../../../assets/common/_mixin';

.tips {
  padding: 3.2vw 0;
  font-size: 3.7333vw;
  line-height: 4.2667vw;
  color: #fff;
  text-align: center;
}

.mod_card {
  height: 34.6667vw;
  margin: 0 4.2667vw 2.1333vw;
  padding: 4.2667vw;
  border-radius: 1.3333vw;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  background-color: #242330;
  @include getBgImg('../../../../assets/images/user_center/sales/card_bg.png');
  background-size: 36.8vw;
  background-position: 40vw 1.0667vw;
  &.select {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      right: 1.0667vw;
      top: 1.0667vw;
      width: 10.6667vw;
      height: 10.6667vw;
      border-radius: 50%;
      @include getBgImg('../../../../assets/images/user_center/select_icon.png');
    }
  }
}

.card_info {
  @extend .flex_hc;
  color: rgba(255, 255, 255, 0.3);
}

.card_img {
  margin-right: 2.1333vw;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  img {
    width: 8.8vw;
    height: 8.8vw;
    border-radius: 50%;
  }
}

.card_name {
  font-size: 4.5333vw;
  padding-bottom: 0.6667vw;
  color: #fff;
}

.card_num {
  @extend .flex_v_h;
  padding-top: 5.8667vw;
  padding-right: 6vw;
  span {
    @extend .flex_hc;
    margin-left: 5.3333vw;
    font-size: 8.8vw;
    color: #fff;
  }
  i {
    width: 1.6vw;
    height: 1.6vw;
    margin: 0 0.5333vw;
    border-radius: 50%;
    background-color: #fff;
  }
}

.add_card {
  position: relative;
  @extend .flex_hc;
  height: 10.6667vw;
  margin: 0 4.2667vw;
  padding: 0 4.2667vw;
  border-radius: 1.3333vw;
  background-color: #3d3b51;
  .add_icon {
    position: relative;
    width: 3.7333vw;
    height: 3.7333vw;
    margin-right: 2.1333vw;
    &::before,
    &::after {
      content: '';
      @extend .g_v_c_mid;
      background-color: #999;
    }
    &:before {
      width: 0.8vw;
      height: 100%;
    }
    &:after {
      width: 100%;
      height: 0.8vw;
    }
  }
  span {
    font-size: 4vw;
    color: #fff;
  }
  i {
    @extend .g_v_mid;
    right: 4.9333vw;
    @include getArrow(2.1333vw, #999, right);
  }
}

.mod_footer {
  min-height: 10.6667vw;
}
</style>
