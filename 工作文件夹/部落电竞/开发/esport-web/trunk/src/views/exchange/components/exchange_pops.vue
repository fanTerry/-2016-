<template>
  <div class="ui_pop" v-if="showType">
    <!-- 积分兑换 -->
    <div class="pointsExchange">
      <a class="close" @click="closePop"></a>
      <h2>积分兑换<span>1000星星 = 1椰子分</span></h2>
      <div class="pointsExchange_con">
        <div class="exchange_con">
          <span class="star"></span>
          <span class="exchange_icon"></span>
          <span class="coco"></span>
        </div>
        <div class="exchange_tips"><span>星星</span><span>椰子分</span></div>
        <p class="star_balance">
          <span>可兑换星星余额：{{getUserData.recScore}}</span>
          <span class="exchange_rules" @click="showRulesPop = true"><i></i>规则</span>
        </p>
        <input class="exchange_num " type="text" placeholder="输入消耗星星数量" v-model="starNum" ref="getValue"
          v-on:input="inputNum($event)" />
        <!-- 输入兑换数量后加active -->
        <a class="exchange_btn" :class="{active:showNum}" @click="starExchange">立即兑换</a>
        <p class="att_tips" v-if="showNum">可兑换椰子分：{{starNum/1000}}</p>
      </div>
      <!-- 输入兑换金额大于星星余额弹窗 -->
      <div class="pop_tips" v-if="showBalancePop">
        <p>{{msg}}</p>
      </div>

      <!-- 兑换规则 -->
      <div class="exchange_pop_rules" v-if="showRulesPop">
        <a class='close' @click='showRulesPop = false'></a>
        <p>1000星星兑换1椰子积分<br>椰子积分可以在椰子商城兑换各种商品。</p>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {},
  props: ["showType"],

  data() {
    return {
      showBalancePop: false, // 星星不满足条件时弹出
      yeYunPoints: "", // 兑换的椰云积分
      showNum: false, // 控制 [立即兑换] 按钮
      starNum: null, // 输入的星星数量
      msg: null, // 兑换弹窗,
      showRulesPop: false, //兑换规则弹窗
      //信息提示
      exchangeMsg: [
        "请输入正整数",
        "余额不足或不是1000的倍数，请重新输入",
        "兑换星星最少为1000",
        "兑换成功",
        "请输入1000的倍数"
      ]
    };
  },

  computed: {
    ...mapGetters({
      getUserData: "getUserData"
    })
  },

  methods: {
    closePop() {
      this.$emit("closePop");
    },

    //输入错误的提示
    inputError(msgStr) {
      this.showNum = false;
      this.showBalancePop = true;
      this.msg = msgStr;
      setTimeout(() => {
        this.showBalancePop = false;
        this.msg = null;
      }, 2000);
    },
    //输入正确的提示
    inputCorrect(msgStr) {
      this.showBalancePop = true;
      this.msg = msgStr;
      setTimeout(() => {
        this.showBalancePop = false;
        this.starNum = null;
        this.showNum = false;
      }, 1500);
    },

    // 控制input输入的星星
    inputNum(e) {
      this.starNum = e.target.value;
      // console.log(this.starNum);
      // console.log(this.getUserData.recScore, "可兑换星星数量");
      let boolean = new RegExp("^[1-9][0-9]*$").test(this.starNum);
      if (!boolean) {
        this.inputError(this.exchangeMsg[0]);
      } else if (
        this.starNum >= 1000 &&
        this.starNum <= this.getUserData.recScore &&
        this.starNum % 1000 == 0
      ) {
        console.log("数字合适");
        this.showNum = true;
      } else if (this.starNum > this.getUserData.recScore) {
        this.inputError(this.exchangeMsg[1]);
      } else {
        this.showNum = false;
      }
    },

    //防止用户多次点击
    starExchange() {
      if (this.showNum == true) {
        this.showNum = false;
        this.affirmStarExchange();
      } else {
        this.inputError(this.exchangeMsg[4]);
      }
    },
    //确认点击兑换
    affirmStarExchange() {
      if (this.starNum < 1000) {
        this.inputError(this.exchangeMsg[2]);
      } else if (
        this.starNum >= 1000 &&
        this.starNum <= this.getUserData.recScore &&
        this.starNum % 1000 == 0
      ) {
        let param = {};
        param.walletScore = this.starNum;
        return this.$post("/api/yeYunOrder/exchangeYeYunScore", param)
          .then(rsp => {
            const dataResponse = rsp;
            // console.log(dataResponse);
            if (dataResponse.code == 200) {
              this.$parent.dataRefresh();
              this.inputCorrect(this.exchangeMsg[3]);
              //后台返回错误信息提示
            } else {
              this.showBalancePop = true;
              this.msg = dataResponse.message;
              setTimeout(() => {
                this.showBalancePop = false;
              }, 3000);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.inputError(this.exchangeMsg[1]);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../../assets/common/_base";
@import "../../../assets/common/_mixin";

.ui_pop > div {
  position: relative;
}

.close {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 20px;
  height: 20px;
}

.pop_tips {
  @extend .g_v_c_mid;
  width: 215px;
  padding: 20px 0;
  text-align: center;
  p {
    font-size: 14px;
    color: #ffdcd7;
  }
  span {
    display: block;
    padding-top: 20px;
    font-size: 20px;
    color: #f6b70d;
  }
}

.att_tips {
  padding-top: 10px;
  font-size: 14px;
  color: #ba3129;
}

.exchange_pop_rules {
  @extend .g_v_c_mid;
  @extend .flex_v_h;
  width: 415px;
  height: 230px;
  padding: 25px;
  font-size: 16px;
  color: #ffdcd7;
  p {
    line-height: 30px;
  }
}

.confirm_pay,
.orderDetails,
.recharge,
.prize,
.qrCodePay,
.payStatus,
.pointsExchange,
.pop_tips,
.exchange_pop_rules {
  background: linear-gradient(to right bottom, #34201d, #2a181c);
  background: -webkit-linear-gradient(left top, #34201d, #2a181c);
  background: -ms-linear-gradient(left top, #34201d, #2a181c);
  box-shadow: 0px 0px 15px 0px rgba(10, 2, 4, 0.5);
}

.pointsExchange {
  width: 648px;
  height: 506px;
  padding: 30px;
  h2 {
    position: relative;
    padding-left: 22px;
    font-size: 24px;
    color: #fff6ea;
    &::before {
      content: "";
      position: absolute;
      top: 1px;
      left: 0;
      width: 7px;
      height: 24px;
      background: linear-gradient(
        to bottom,
        rgba(246, 215, 75, 1),
        rgba(197, 69, 4, 1)
      );
      background: -ms-linear-gradient(
        top,
        rgba(246, 215, 75, 1),
        rgba(197, 69, 4, 1)
      );
      background: -webkit-linear-gradient(
        top,
        rgba(246, 215, 75, 1),
        rgba(197, 69, 4, 1)
      );
    }
    span {
      padding-left: 20px;
      font-size: 14px;
      color: #6d4c42;
    }
  }
}

.pointsExchange_con {
  width: 350px;
  margin: 58px auto 0;
  text-align: center;
  .exchange_con {
    @extend .flex_v_justify;
    margin: 0 65px;
  }
  .star,
  .coco {
    width: 50px;
    height: 50px;
    @include getBgImg("../../../assets/images/pop/star_icon.png");
  }
  .coco {
    @include getBgImg("../../../assets/images/pop/coco_icon.png");
  }
  .exchange_icon {
    width: 40px;
    height: 40px;
    @include getBgImg("../../../assets/images/pop/exchange_points.png");
  }
  .exchange_tips {
    @extend .flex_v_justify;
    margin: 0 65px;
    padding-top: 31px;
    padding-left: 7px;
    font-size: 18px;
    color: #ffdcd7;
  }
  .star_balance {
    @extend .flex_v_justify;
    padding-top: 58px;
    font-size: 14px;
    color: #ac7d6d;
  }
  .exchange_rules {
    @extend .flex_hc;
    font-size: 14px;
    color: #f5b457;
    cursor: pointer;
    i {
      width: 16px;
      height: 16px;
      margin-right: 6px;
      @include getBgImg("../../../assets/images/pop/wenhao.png");
    }
  }
  .exchange_num {
    width: 100%;
    height: 46px;
    margin-top: 10px;
    line-height: 46px;
    font-size: 18px;
    color: #ffdcd7;
    text-align: center;
    border: 1px solid #3e2428;
    background-color: #231416;
  }
  .exchange_btn {
    display: block;
    width: 100%;
    margin-top: 41px;
    line-height: 42px;
    font-size: 18px;
    font-weight: bold;
    color: #5a3e39;
    border: 3px solid currentColor;
    &.active {
      color: #f5b457;
    }
  }
  input::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: #6d4c42;
  }
  input::-moz-placeholder {
    /* Firefox 19+ */
    color: #6d4c42;
  }
  input:-ms-input-placeholder {
    /* IE 10+ */
    color: #6d4c42;
  }
  input:-moz-placeholder {
    /* Firefox 18- */
    color: #6d4c42;
  }
}
</style>