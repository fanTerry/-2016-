<template>
  <div class="ui_pop recharge_pop" v-if="rechargePop">
    <div class="Page rechargePage">
      <a class="close" @click="closePop"></a>
      <ul class="prize_list">
        <li v-for="(item,index) in chargeMoneyList" :key="index" :class="chargeIndex==index ? 'select' : ''"
          @click="selectChargeAmount(item.chargeMoney,index)">
          <p :class="item.sendStar>0?'':'no_bg'">{{item.sendStar>0?"+"+item.sendStar+"星星":""}}</p>
          <img :src="require('../../../assets/images/guess/starday0.png')" alt />
          <span class="cost_star">{{item.chargeMoney*1000 | toThousands}}星星</span>
          <a class="prize_get_btn" @click="rechargePrize(index)">{{item.chargeMoney}}元</a>
        </li>
      </ul>
      <div class="exchange_btn" :class="{disabled:selectedAmount<=0}" @click="gotoCharge()">
        <!-- 加disabled置为不可点击 -->
        立即支付 {{selectedAmount <= 0?'':selectedAmount+'元'}}
      </div>
      <charge-pop-up v-if="showChargePopUp" :chargeWayList="chargeWayList" @close="closeChargeDialog"
        @confirmCharge="confirmCharge" :price="selectedAmount"></charge-pop-up>
      <!-- <pops :showType='showType' :showFlag='showFlag' :currChargeItem='currChargeItem' @closePop='closePop'></pops> -->
      <!-- <pop-Alert :showPop="showPop" @close="showPop=false" @confirm="confirm" btnTxt1="已取消" btnTxt2="已完成支付" type="2">
        <p>请确认微信支付是否已完成</p>
      </pop-Alert> -->
    </div>
  </div>
</template>

<script>
import navBar from "../../../components/header/nav_bar/index";
import pops from "./components/pops";
import chargePopUp from "../../../components/pop_up/charge/index.vue";
// import popAlert from "../../../components/pop_up/pop_alert.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { navBar, pops, chargePopUp },
  props: [],
  data() {
    return {
      prizeDay: [],
      showType: 0,
      showFlag: false,
      chargeMoneyList: [], //充值金额列表
      currChargeItem: null, //当前选择的充值选项
      selectedAmount: 0.0, //需要充值的金额
      chargeIndex: null, //下标
      showChargePopUp: false, //是否展示充值方式
      chargeWayList: [], //充值方式列表
      rechargePop: false
      // showPop: false
      // chargeResParam: null,
      // walletRec: null //用户星星数量
    };
  },
  computed: {
    ...mapGetters({
      // wxuserStarNum: "getstarNum"
    }),
    getstarNum() {
      // return this.wxuserStarNum.state;
    }
  },
  //实时监听用户星星状态
  watch: {
    getstarNum(val) {
      // this.walletRec = val;
      console.log(val, "rechargePops用户星星");
    }
  },
  mounted() {
    //屏蔽app处理
    let clientType = this.$route.query.clientType;
    if (clientType == 3) {
      this.$router.push({
        path: "/home",
        query: {}
      });
    } else if (clientType == 4) {
      this.$router.push({
        path: "/iosRecharge",
        query: {}
      });
    }
    this.openChargerDialog().then(() => {
      this.rechargePop = true;
      // 阻止ios系统下弹窗拉起，底部仍会滑动的问题
      this.$nextTick(() => {
        let rechargePop = document.getElementsByClassName("recharge_pop")[0];
        rechargePop.ontouchmove = function(e) {
          e.preventDefault();
        };
      });
    });
    this.getWxConfig();
  },
  methods: {
    getWxConfig: function() {
      this.$post("/api/wxlogin/getJsConfig")
        .then(rsp => {
          console.log(rsp, "rsp");
          if (rsp.appId != "") {
            this.wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: rsp.appId, // 必填，公众号的唯一标识
              timestamp: rsp.timestamp, // 必填，生成签名的时间戳
              nonceStr: rsp.nonceStr, // 必填，生成签名的随机串
              signature: rsp.signature, // 必填，签名，见附录1
              jsApiList: ["chooseWXPay"]
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    /**关闭充值方式弹窗 */
    closeChargeDialog() {
      this.showChargePopUp = false;
    },
    /**充值 */
    confirmCharge: function(chooseChargeWay, chargeWayBalance) {
      console.log(chooseChargeWay, "确认充值选择的充值方式");
      // console.log(chargeWayBalance, "确认充值选择的充值方式余额");
      if (parseFloat(chargeWayBalance) < parseFloat(this.selectedAmount)) {
        this.$toast("余额不足");
        return;
      }

      let param = {
        chargeAmount: this.selectedAmount,
        chargeWay: chooseChargeWay
      };
      console.log(param, "充值传递的参数");
      var _self = this;
      console.log(_self.wx, "_self.wx");
      this.$post("/api/h5charge/tocharge", param)
        .then(rsp => {
          const dataResponse = rsp;
          console.log(dataResponse, "充值返回数据");
          if (dataResponse.code == "200" && dataResponse.data.successFlag) {
            if (
              chooseChargeWay == this.globalConst.payIndexMap.get("WXH5_PAY") &&
              dataResponse.data.requestUrl != ""
            ) {
              var redirect_url = encodeURIComponent(window.location.href);
              window.location.href = dataResponse.data.requestUrl;
              this.url = dataResponse.data.requestUrl;
              setTimeout(() => {
                this.closePop();
                this.$emit("openPopAlert");
              }, 3000);
            } else if (
              chooseChargeWay == this.globalConst.payIndexMap.get("WXJSAPI_PAY")
            ) {
              this.weixinPay(dataResponse.data.requestParams, _self);
            } else {
              this.$toast("充值成功", 2.5);
              this.$emit("getUserWallet");
              setTimeout(() => {
                this.closePop();
              }, 1000);
            }
            this.closeChargeDialog();
          } else if (dataResponse.code == "600") {
            this.$toast("余额不足");
          } else {
            this.$toast("系统异常");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**h5支付后 */
    // confirm: function() {
    //   this.showPop = false;
    //   this.$emit("getUserWallet");
    //   setTimeout(() => {
    //     this.closePop();
    //   }, 1000);
    // },
    /**微信支付 */
    weixinPay: function(params, _self) {
      console.log(params, "params");
      _self.wx.ready(function() {
        _self.wx.chooseWXPay({
          timestamp: params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: params.nonceStr, // 支付签名随机串，不长于 32 位
          package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: params.paySign, // 支付签名
          success: function(res) {
            _self.$toast("充值成功", 2.5);
            _self.$emit("getUserWallet");
            setTimeout(() => {
              _self.closePop();
            }, 1000);
          },
          cancel: function(res) {
            _self.$toast("支付取消", 2);
          },
          fail: function(res) {
            _self.$toast("支付失败", 2);
          }
        });
      });
    },
    /**获取充值方式 */
    gotoCharge() {
      console.log("点击立即充值");
      console.log(this.selectedAmount, "选择的充值金额");
      if (this.selectedAmount <= 0.0) {
        // this.$toast("请先选择充值金额");
        return;
      }

      this.$post("/api/payment/getPayWayList", {
        needRecPay: false
      })
        .then(rsp => {
          const dataResponse = rsp;
          console.log(dataResponse, "h5充值方式返回");
          if (dataResponse.code == "200") {
            this.chargeWayList = dataResponse.data;
            console.log(this.chargeWayList, "充值方式列表1");
            if (this.chargeWayList.length <= 0) {
              this.$toast("充值暂未开放");
              return;
            }
            this.showChargePopUp = true;
          } else {
            this.$toast("获取充值方式异常，请稍后再试");
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**点击选择充值的金额 */
    selectChargeAmount(item, index) {
      console.log(item, index, "充值参数", item.money);
      this.selectedAmount = item;
      this.chargeIndex = index;
    },
    closePop() {
      // this.showFlag = false;
      this.$emit("closeRechargePop");
    },
    openChargerDialog() {
      return this.$post("/api/charge/pageData")
        .then(res => {
          console.log(res, "得到充值页所需数据");
          if (res.code == "200") {
            this.chargeMoneyList = res.data.chargeAmountResponseList;
            this.walletRec = res.data.ableRecScore;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    rechargePrize(index) {
      this.currChargeItem = this.chargeMoneyList[index].chargeMoney;
      this.showFlag = true;
      this.showType = 1;
    }
  }
};
</script>


<style lang='scss' scoped>
@import "../../../assets/common/_base";
@import "../../../assets/common/_mixin";

.Page {
  position: relative;
  width: 87.2vw;
  height: 116.8vw;
  padding-top: 44vw;
  background: #391a1c;
  @include getBgImg("../../../assets/images/guess/recharge_bg.png");
  background-size: 100% auto;
  background-color: transparent;
}

.close {
  position: absolute;
  right: 1.3333vw;
  top: 16.6667vw;
  width: 8vw;
  height: 8vw;
  @include getBgImg("../../../assets/images/guess/close.png");
  background-size: contain;
}

.pop_tips {
  @extend .g_v_c_mid;
  width: 57.33vw;
  padding: 5.33vw 0;
  text-align: center;
  background-color: #34201d;
  p {
    font-size: 3.73vw;
    color: #fff;
  }
  span {
    display: block;
    padding-top: 5.33vw;
    font-size: 5.33vw;
    color: #f6b70d;
  }
}
.prize_list {
  @extend .flex_hc;
  margin: 0 10.6667vw 0 9.8667vw;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
}
li {
  width: 20.8vw;
  margin-right: 2.1333vw;
  margin-bottom: 4.6667vw;
  padding-top: 0.8vw;
  @include getBgImg("../../../assets/images/guess/sign_disabled.png");
  text-align: center;
  border-radius: 4px;
  overflow: hidden;
  &:nth-child(3n) {
    margin-right: 0;
  }
  &.select {
    @include getBgImg("../../../assets/images/guess/sign_bg.png");
    p,
    .prize_get_btn {
      color: #f63c0a;
      background-color: #ffe035;
    }
    .cost_star {
      color: #fff;
    }
  }
  .cost_star {
    display: block;
    font-size: 2.6667vw;
    color: #de3b02;
  }
  p {
    display: inline-block;
    height: 3.7333vw;
    margin: 0 auto;
    padding: 0 1.3333vw;
    line-height: 3.7333vw;
    font-size: 2.6667vw;
    border-radius: 1.8667vw;
    color: #de3b02;
    background-color: #50030a;
    &.no_bg {
      background-color: transparent;
    }
  }
  img {
    display: block;
    height: 6.4vw;
    margin: 1.0667vw auto 2.1333vw;
    object-fit: contain;
  }
}
.prize_get_btn {
  display: block;
  margin-top: 1.3333vw;
  line-height: 5.3333vw;
  font-size: 4vw;
  font-weight: bold;
  color: #de3b02;
  background-color: #50030a;
}

.exchange_btn {
  display: block;
  width: 65.0667vw;
  margin: 0.9333vw auto 0;
  line-height: 9.3333vw;
  font-size: 5.3333vw;
  color: #d1341c;
  font-weight: bold;
  text-align: center;
  background: rgba(255, 224, 53, 1);
  box-shadow: 3px 3px 0 0 #ffa423, 0px 6px 7px 0px rgba(0, 0, 0, 0.35);
  border-radius: 9.3333vw;
  &.disabled {
    opacity: 0.3;
  }
}
</style>
