<template>
  <div>
    <header class="header">
      <div class="users">
        <img :src="userInfo.icon|getDefaultImg(globalConst.xyxUserDefaultIcon)" alt="">
        <p>{{userInfo.nickName|subStr(4)}}</p>
      </div>
      <div class="header_info">
        <div class="flex_v_justify">
          <div class="assets" @click="toCharge()">
            <countTo :start-val='oldBalance' :end-val='userInfo.ableRecScore' :decimals="2" :duration='2000'></countTo>
          </div>
          <div class="herf_gather">
            <!-- <a class="sign_icon" @click="showSignType = true"></a> -->
            <a class="exchange_icon" @click="showExchangeList = !showExchangeList">
              <span v-if="showExchangeTips">话费/黄金可兑</span>
              <ul v-if="showExchangeList">
                <li @click="showExchangeType = true">积分兑换</li>
                <li @click="goToYeYunPage()">椰云商城</li>
                <!-- <li @click="goToHaiLePage()">嗨乐商城</li> -->
              </ul>
            </a>
            <a class="more_icon" @click="showRecordList = !showRecordList">
              <ul v-if="showRecordList">
                <li @click="showWalletPop = true">游戏记录</li>
                <li @click="goUrlPage('/wallet')">钱包流水</li>
                <li @click="showRulesPop = true">规则说明</li>
                <li @click="confirmLogOut" v-if="accountLoginFlag">退出</li>
              </ul>
            </a>
          </div>
        </div>
        <div class="broadcast swiper-container">
          <ul class="swiper-wrapper">
            <li class="swiper-slide" v-for="(item,index) in broacardList" :key="index">
              <span>恭喜</span>
              <span class="award_name">{{item.userName}}</span>
              <span>于 {{item.createTime|dateFmt("MM-dd hh:mm")}} {{item.type==4?'摇到':'获得'}}</span>
              <span class="award_value">{{item.goodsName}}</span>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <exchange-pop v-if="showExchangeType" @closeExchangePop='showExchangeType = false'></exchange-pop>
    <!-- <haiLePointExchange v-if="showHaileExchangeType" @closeExchangePop='showHaileExchangeType = false'>
    </haiLePointExchange> -->
    <!-- <sign-pop v-if="showSignType" @closeSignPop='showSignType = false' @updateWallet="updateWallet"></sign-pop> -->
    <recharge-pop v-if="showRechargePop" @closeRechargePop="closeRechargePop" @getUserWallet="getUserWallet"
      @openPopAlert="openPopAlert">
    </recharge-pop>

    <shake-rules v-if="showRulesPop" @closeRulesPop='showRulesPop = false'></shake-rules>
    <wallet v-if="showWalletPop" @closeWalletPop='showWalletPop = false'></wallet>
  </div>
</template>

<script>
import Swiper from "swiper";
import { mapGetters, mapActions } from "vuex";

import exchangePop from "../../guess/pointsExchange.vue";
import haiLePointExchange from "../../guess/haiLePointExchange.vue";
import signPop from "../../guess/sign.vue";
import rechargePop from "../../guess/recharge/recharge.vue";
import shakeRules from "../shake/rules.vue";
import wallet from "../shake/wallet.vue";
import countTo from "vue-count-to";
import { delCookie } from "../../../libs/utils";

export default {
  components: {
    exchangePop, //兑换椰云积分弹窗
    signPop,
    rechargePop,
    shakeRules,
    wallet,
    countTo,
    haiLePointExchange //兑换嗨乐积分弹窗
  },
  props: [],
  data() {
    return {
      showExchangeType: false,
      showHaileExchangeType: false,
      showSignType: false,
      showRechargePop: false,
      showRecordList: false,
      showExchangeTips: false, //兑奖提示
      showRulesPop: false,
      showWalletPop: false,
      showExchangeList: false,
      broacardList: [],
      oldBalance: 0,
      accountLoginFlag: false
    };
  },
  computed: {
    ...mapGetters({
      getBetData: "getBetData",
      getGuessData: "getGuessData",
      userInfo: "getUserInfo"
    })
  },
  watch: {
    getBetData(val) {
      if (val.toReflushBalance) {
        //下单完刷新余额
        this.getUserWallet();
      }
    },
    userInfo(newVal, oldVal) {
      if (newVal.ableRecScore > oldVal.ableRecScore) {
        this.oldBalance = oldVal.ableRecScore;
      } else {
        this.oldBalance = newVal.ableRecScore;
      }
    },
    getGuessData(val) {
      if (val.isFirstGuess) {
        //下单完刷新余额
        this.showQrCode();
        // this.isFirstGuess = true;
        // 阻止ios系统下弹窗拉起，底部仍会滑动的问题
        // let qrCodePop = document.getElementsByClassName("qr_code_pop")[0];
        // qrCodePop.ontouchmove = function(e) {
        //   e.preventDefault();
        // };
      }
    }
  },
  created() {
    this.getUserWallet().then(res => {
      this.oldBalance = this.userInfo.ableRecScore;
    });
  },
  mounted() {
    this.getBroadcastList();
    setInterval(() => {
      this.getBroadcastList();
    }, 30 * 1000);

    setTimeout(() => {
      this.initAwardSwiper();
    }, 3000);
    document.addEventListener("click", e => {
      let moreIcon = document.querySelector(".more_icon");
      let exchangeIcon = document.querySelector(".exchange_icon");
      if (moreIcon && !moreIcon.contains(e.target)) {
        this.showRecordList = false;
      }
      if (exchangeIcon && !exchangeIcon.contains(e.target)) {
        this.showExchangeList = false;
      }
    });
    let biz = this.baseParamConfig.biz,
      clientType = this.baseParamConfig.clientType;
    if ((biz == 3 && clientType == 6) || clientType == 3 || clientType == 4) {
      this.accountLoginFlag = true;
    }
  },
  methods: {
    ...mapActions(["setUserInfo"]),
    //播报
    initAwardSwiper() {
      this.swiper = new Swiper(".broadcast", {
        loop: true,
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        direction: "vertical",
        observer: true,
        observeParents: true
      });
    },
    getBroadcastList() {
      return this.$post("/api/game/shake/broadcastList")
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == "200") {
            if (dataResponse.data) {
              this.broacardList = dataResponse.data;
            }
          } else {
            this.$toast(dataResponse.message, 1.5);
          }
        })
        .catch(error => {
          this.$toast("请求异常", 1.5);
          console.log(error);
        });
    },
    /**签到更新钱包余额*/
    updateWallet(wallet) {
      this.setUserInfo({
        ...this.userInfo,
        ableRecScore: wallet
      });
    },
    //查询设置用户钱包
    getUserWallet() {
      return this.$post("/api/starNum/queryStarNum")
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            // console.log(dataResponse.data.ableRecScore, "接口获取用户的星星");
            this.setUserInfo({
              ...this.userInfo,
              recScore: dataResponse.data.recScore,
              giftRecScore: dataResponse.data.giftRecScore,
              ableRecScore: dataResponse.data.ableRecScore,
              nickName: dataResponse.data.nickName,
              icon: dataResponse.data.icon
            });

            // console.log(this.userInfo);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    openPopAlert() {
      this.$emit("openPopAlert");
    },
    /**关闭支付弹窗 */
    closeRechargePop() {
      this.showRechargePop = false;
    },
    // 跳转到椰云积分商城
    goToYeYunPage() {
      this.$post("/api/yeYunUser/getYeYunIndex")
        .then(rsp => {
          const dataResponse = rsp;
          let yeYunUrl = dataResponse.message;
          // console.log(yeYunUrl);
          window.location.href = yeYunUrl;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //跳转到嗨乐积分商城
    goToHaiLePage() {
      this.$post("/api/haiLeUser/getHaileChannelUrl")
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == "200") {
            let haiLeUrl = dataResponse.data.haiLeChannelUrl;
            console.log(haiLeUrl);
            window.location.href = haiLeUrl;
          } else if (dataResponse.code == "1001") {
            // this.$toast("手机未绑定", 1.5);
            // setTimeout(() => {
            //   this.goToBindPhone();
            // }, 1500);
          } else {
            console.log(dataResponse.message, 1.5);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //跳到绑定手机号
    goToBindPhone() {
      this.$router.push({
        path: "/uc/bindPhone",
        query: {
          redirect: this.$route.path
        }
      });
    },
    goUrlPage(url) {
      this.$router.push({
        path: url,
        query: {}
      });
    },
    toCharge() {
      this.showRechargePop = true;
    },
    dataRefresh() {
      // this.queryYeYunPoints();
      this.getUserWallet();
    },
    confirmLogOut() {
      this.$post("/api/phoneloginout")
        .then(dataResponse => {
          if (dataResponse.code != "200") {
            this.$toast("系统异常");
            return;
          }
          window.localStorage.removeItem("token");
          //删除H5cookie
          delCookie("ddquiz_h5_login_cookie_sid");
          this.$toast("退出成功");
          this.$router.push({
            name: "login",
            query: {
              redirect: "/game/shake?roomNo=100102"
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../../assets/common/_base";
@import "../../../assets/common/_mixin";

.header {
  position: relative;
  @extend .flex_v_justify;
  padding: 3.7333vw 1.8667vw 0 1.3333vw;
  background-color: transparent;
}

.users {
  position: relative;
  top: 1.0667vw;
  width: 14.4vw;
  height: 18.4vw;
  text-align: center;
  @include getBgImg("../../../assets/images/game/shake/avatar_bg.png");
  &::after {
    content: "";
    @extend .g_c_mid;
    top: -0.8vw;
    width: 15.2vw;
    height: 15.2vw;
    @include getBgImg("../../../assets/images/game/shake/avatar_border.png");
  }
  img {
    width: 12.2667vw;
    height: 12.2667vw;
    object-fit: contain;
    border-radius: 50%;
  }
  p {
    @include t_nowrap(89%);
    margin: 0 auto;
    padding-top: 1.0667vw;
    font-size: 2.2667vw;
    color: #fff;
    text-align: center;
  }
}

.header_info {
  margin-left: 1.8667vw;
  .assets {
    position: relative;
    @extend .flex_v_h;
    min-width: 32.6667vw;
    height: 6.4vw;
    padding: 0 6.6667vw 0 5.3333vw;
    margin-left: 1.4667vw;
    font-size: 5.6vw;
    color: #fff;
    background: rgba(1, 18, 18, 0.47);
    box-shadow: 0 0.8vw 1.3333vw 0 rgba(0, 0, 0, 0.18) inset,
      -0.1333vw 0.8vw 0.9333vw 0 rgba(0, 0, 0, 0.18) inset,
      -0.5333vw 2.4vw 1.3333vw 0 rgba(255, 255, 255, 0.26) inset;
    border-radius: 2.9333vw;
    &::before,
    &::after {
      content: "";
      @extend .g_v_mid;
    }
    &:before {
      left: -2.2667vw;
      width: 9.6vw;
      height: 9.6vw;
      @include getBgImg("../../../assets/images/game/shake/asset_star.png");
      background-size: contain;
    }
    &:after {
      right: -1.8667vw;
      width: 9.0667vw;
      height: 9.0667vw;
      @include getBgImg("../../../assets/images/game/shake/recharge_icon.png");
      background-size: contain;
    }
  }
  .herf_gather {
    @extend .flex_hc;
    a {
      width: 9.0667vw;
      height: 9.0667vw;
      margin-right: 3.4667vw;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .sign_icon {
    @include getBgImg("../../../assets/images/game/shake/sign_icon.png");
    background-size: contain;
  }

  .more_icon,
  .exchange_icon {
    position: relative;
    @include getBgImg("../../../assets/images/game/shake/more_icon.png");
    background-size: contain;
    ul {
      // @include getRadiusBorder(#b03b04, all, 6px);
      position: absolute;
      right: 0;
      top: 10.1333vw;
      z-index: 10;
      width: 18.67vw;
      border-radius: 2.6667vw;
      background-color: #b03b04;
      &::after {
        content: "";
        position: absolute;
        top: 0.27vw;
        right: 3.47vw;
        transform: translateY(-100%);
        -webkit-transform: translateY(-100%);
        @include getTriangle(1.33vw, #ba3129, up);
      }
    }
    li {
      line-height: 10.67vw;
      font-size: 3.2vw;
      color: #ffeaea;
      text-align: center;
      @include getBorder(bottom, #c65b28);
      &:last-child {
        background: none;
      }
    }
  }
  .exchange_icon {
    @include getBgImg("../../../assets/images/game/shake/gift_icon.png");
    background-size: contain;
    span {
      @extend .g_c_mid;
      top: calc(100% + 2.1333vw);
      z-index: 10;
      padding: 1.6vw 2vw;
      font-size: 3.2vw;
      color: #fedcd7;
      background-color: rgba(0, 0, 0, 0.7);
      border: 0.1333vw solid #714038;
      border-radius: 0.5333vw;
      white-space: nowrap;
      &::before {
        content: "";
        @extend .g_c_mid;
        top: -3.2vw;
        @include getTriangle(1.6vw, rgba(0, 0, 0, 0.7), up);
      }
    }
  }
  .broadcast {
    @extend .flex_v_h;
    width: 79.7333vw;
    height: 6.6667vw;
    line-height: 6.6667vw;
    margin-top: 0.9333vw;
    margin-right: 0.8vw;
    background: rgba(6, 128, 136, 0.8);
    border-radius: 6.6667vw;
    li {
      @extend .flex_v_h;
      height: 6.6667vw;
      line-height: 6.6667vw;
      font-size: 3.2vw;
      color: #fff;
    }
    .award_name,
    .award_value {
      @include t_nowrap(13.3333vw);
      line-height: 1.2;
      margin: 0 1.3333vw;
      color: #fff200;
    }
  }
}
</style>
