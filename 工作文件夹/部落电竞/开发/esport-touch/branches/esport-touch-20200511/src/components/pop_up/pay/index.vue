<template>
  <div class="ui_pop" v-if="readyFlag">
    <div class="pop_pay">
      <div class="order">
        <!-- 订单金额：{{price}}星星 -->
        请选择支付方式
        <a class="close" @click="close()"></a>
      </div>

      <!-- <div class="discount">
                <span>优惠券</span>
                <div>无可用优惠券<span class="c_red">-4.00元</span><i class='iconfont icon-xiangyou'></i></div>
            </div>
            <div class="balance">
                <span>余额抵扣</span>
                <span class="c_red">-4.00元</span>
            </div> -->

      <div class="pay_title">需支付</div>
      <div class="pay_num">{{choosedPrice}}
        <span>{{choosedPayWay.currencyUnit?choosedPayWay.currencyUnit:'星星'}}</span>
      </div>
      <div class="pay_method" v-for="(item,index) in payWay " @click="choosePay(item)" v-if='item.payIndex!=7'>
        <div>
          <img :src="item.payIcon" alt="">{{item.payName}}
          <span v-if='item.showBalance==1'>(余额:{{item.balance}})</span>
        </div>
        <i class="select_icon" :class="choosedPayWay.payIndex==item.payIndex?'selected':''"></i>
      </div>
      <!-- <div class="pay_method">
                <i class="yb_icon"></i>友宝余额支付
                <span>余额:{{youbaoBalance}}</span>
            </div> -->
      <a class="exchange_btn" @click="payMoney()">{{buttonTxt}}</a>
      <div class="att_tips" v-for="item in payWay">
        <template v-if="item.payIndex==2"> 温馨提示:1元友宝余额价值与1星星价值一致</template>
      </div>
    </div>
  </div>
</template>

<script>
// import popAlert from "components/pop_up/pop_alert";
export default {
  props: ["price", "unit"],

  data() {
    return {
      tips: "",
      choosedPayWay: {},
      payWay: [],
      readyFlag: false,
      preventRepeatFlag: true,
      notEnough: false,
      showPop: false,
      buttonTxt: "确认支付",
      buttonStr: "余额不足,去充值",
      choosedPrice: 0
    };
  },
  watch: {
    choosedPayWay(newData, oldData) {
      console.log(newData, this.price);
      if (newData.payIndex != 0) {
        this.choosedPrice = this.price;
      }
      if (newData.showBalance == 0) {
        this.notEnough = false;
        this.buttonTxt = "确认支付";
      } else if (parseFloat(newData.balance) < parseFloat(this.choosedPrice)) {
        this.buttonTxt = "余额不足,去充值";
        this.notEnough = true;
      } else if (parseFloat(newData.balance) >= parseFloat(this.choosedPrice)) {
        this.buttonTxt = "确认支付";
        this.notEnough = false;
      }
    }
  },
  mounted() {
    this.getPayWayList();
    this.choosedPrice = this.price;
  },
  methods: {
    getPayWayList() {
      let _self = this;
      return this.$post("/api/payment/getPayWayList")
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == "200") {
            _self.payWay = dataResponse.data;
            _self.readyFlag = true;
            console.warn("getPayWayList");
            dataResponse.data.forEach(function(item) {
              console.log(item);
              if (parseFloat(item.balance) >= _self.choosedPrice) {
                _self.choosedPayWay = item;
                return;
              } else {
                _self.choosedPayWay = dataResponse.data[0];
              }
            });
          } else {
            this.$toast("获取支付方式异常", 2);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    close() {
      this.$emit("close", 1);
    },
    toCharge() {
      let chooseIndex = this.choosedPayWay.payIndex;
      if (chooseIndex == 2) {
        window.location.href = this.globalConst.uboxCharge;
      } else if (chooseIndex == null || chooseIndex == 0) {
        let clientType = this.$route.query.clientType;
        if (clientType == 4) {
          this.$router.push({
            path: "/iosRecharge",
            query: { redirect: this.$route.fullPath }
          });
        } else {
          this.$router.push({
            path: "/recharge",
            query: {
              redirect: this.$route.fullPath
            }
          });
        }
      }
    },
    // judgeIsEnough() {
    //   if (this.choosedPayWay.showBalance == 0) {
    //     this.notEnough = false;
    //     this.buttonTxt = "确认支付";
    //     return;
    //   }
    //   if (parseFloat(this.choosedPayWay.balance) < parseFloat(this.price)) {
    //     this.tips = this.choosedPayWay.name + ",余额不足";
    //     this.notEnough = true;
    //     this.buttonTxt = this.buttonStr;
    //   } else {
    //     this.notEnough = false;
    //     this.buttonTxt = "确认支付";
    //   }
    // },
    choosePay(payItem) {
      this.choosedPayWay = payItem;
    },
    payMoney() {
      console.log(this.choosedPayWay.payIndex);
      if (this.choosedPayWay.payIndex == null) {
        this.tips = "请先选择支付方式";
        return;
      }
      if (this.notEnough) {
        this.toCharge();
        return;
      }
      console.log(this.preventRepeatFlag, "this.preventRepeatFlag");
      if (!this.preventRepeatFlag) {
        this.$toast("正在支付...请稍等", 2);
        return;
      }
      this.$emit("chooseWay", this.choosedPayWay.payIndex);
    },
    preventRepeat(flag) {
      this.preventRepeatFlag = flag;
    }
  },
  components: {
    // popAlert
  }
};
</script>

<style lang='scss' scoped>
@import "../../../assets/common/_base";
@import "../../../assets/common/_mixin";
@import "../../../assets/common/_var";

.pop_pay {
  position: relative;
  width: 100%;
  margin: 0 20px;
  padding-bottom: 25px;
  border-radius: 8px;
  background-color: #fff;
  color: #b7b7b7;

  .close {
    @include getClose(20px, #000);
    @extend .g_v_mid;
    right: 0;
  }
  .order,
  .discount,
  .balance {
    @extend .flex_v_justify;
  }
  .order {
    position: relative;
    padding: 18px 0 14px 15px;
    font-size: 17px;
    color: #000;
    border-bottom: 1px solid #ddd;
  }
  .discount {
    margin: 0 15px;
    padding: 12px 0;
    font-size: 15px;
    border-bottom: 1px solid #ddd;
    .icon-xiangyou {
      font-size: 15px;
    }
    div {
      @extend .flex_hc;
    }
  }
  .balance {
    margin: 0 15px;
    padding: 12px 0;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
  }
  .pay_num {
    padding: 10px 0 15px;
    font-size: 42px;
    text-align: center;
    color: #ee322b;
  }
  .pay_num span {
    font-size: 19px;
  }
  .pay_method {
    @extend .flex_v_justify;
    position: relative;
    margin: 0 15px 10px;
    height: 45px;
    font-size: 16px;
    color: #000;
    > div {
      @extend .flex_hc;
    }
    img {
      width: 26px;
      height: 26px;
      object-fit: cover;
      margin-right: 5px;
    }
    span {
      padding-left: 10px;
      font-size: 13px;
      color: #ee322b;
    }
    .select_icon {
      width: 20px;
      height: 20px;
      // @include getRadiusBorder(#999, all, 100%);
      border: 1px solid #999;
      border-radius: 50%;
    }
    .selected {
      @include getBgImg("../../../assets/images/store/select.png");
      border: none;
    }
  }
  .yb_icon {
    @include getBgImg("../../../assets/images/user_center/yb_coin.png");
  }
  .att_tips {
    padding: 4px 0 8px;
    text-align: center;
  }
  .pay_title {
    padding-top: 20px;
    font-size: 15px;
    text-align: center;
    color: #000;
  }
  .warn_tips {
    @extend .g_c_mid;
    bottom: 10px;
    color: #333;
    text-align: center;
    white-space: nowrap;
    a {
      color: $color_red;
    }
  }
  .exchange_btn {
    display: table;
    margin: 0 auto 10px;
    padding: 0 30px;
    font-size: 17px;
    line-height: 40px;
    @include getBtn(auto, auto, transparent, #fff, 40px);
    background: linear-gradient(to right, #ffa200, #ff7b1c);
  }
}
</style>
