<template>
  <div class="ui_pop">
    <!-- 积分兑换 -->
    <div class="pointsExchange">
      <h3>椰子分兑换<a class="close" @click="closePop"></a></h3>
      <div class="pointsExchange_con">
        <div class="exchange_con">
          <div class="star_balance">
            <span>
              <template v-if='getUserInfo.exchangeStarNum!=null'>
                {{getUserInfo.exchangeStarNum>getUserInfo.recScore?getUserInfo.recScore:getUserInfo.exchangeStarNum}}
              </template>
            </span>
            <p>可兑换星星余额</p>
          </div>
          <div class="exchange_input">
            <p>兑换椰子分</p>
            <div class="flex_v_justify">
              <input class="exchange_num " type="text" placeholder="请输入兑换数量" v-model="starNum" ref="getValue" v-on:input="inputNum($event)" @click="inputNum($event)" @blur="inputBlur($event)" />
              <span @click="allExchange">全部</span>
            </div>
          </div>
          <div class="exchange_rules">
            <p>
              <span>兑换比例</span>
              <span>{{exchangeRatio}} : 1</span>
            </p>
            <p>
              <span>到账时间</span>
              <span>实时</span>
            </p>
            <p>
              <span>每日可兑</span>
              <span>{{exchangeYeYunScore}}</span>
            </p>
          </div>
        </div>
        <!-- 输入兑换数量后加active -->
        <!-- <p class="att_tips {active:showNum}" v-if="showNum">可兑换{{pointNameArray[tabCheck]}}分：{{starNum/multi}}</p> -->
        <div class="exchange_btn">
          <!-- 加disabled置为不可点击 -->
          <a :class="{disabled:!showNum}" @click="starExchange">立即兑换</a>
        </div>
      </div>
      <!-- 输入兑换金额大于星星余额弹窗 -->
      <!-- <div class="pop_tips" v-if="showBalancePop">
        <p>{{msg}}</p>
      </div> -->

    </div>

  </div>
</template>

<script>
import Vue from 'vue';
import { accAdd, accSub } from '../../libs/math';

import { mapGetters, mapActions } from 'vuex';

export default {
  components: {},
  props: ['exchangeYeYunScore', 'exchangeRatio'],
  data() {
    return {
      yeYunPoints: '', // 兑换的椰云积分
      showNum: false, // 控制 [立即兑换] 按钮
      starNum: null, // 输入的星星数量
      //信息提示
      exchangeMsg: ['请输入合适的数字', '星星余额不足', '兑换星星最少为1', '兑换成功', '请输入1的倍数'],
      tabCheck: 0,
      pointNameArray: ['椰子', '嗨乐'],
      multi: 1 //兑换倍数
      // exchangeStarNum: null
    };
  },

  computed: {
    ...mapGetters({
      getUserInfo: 'getUserInfo'
    })
  },
  mounted() {
    // this.getExchangeStarNum();
  },
  methods: {
    ...mapActions(['setUserInfo']),
    closePop() {
      this.$emit('closeExchangePop');
    },

    /**
     * @description: 切换兑换积分类型
     * @param {type}
     * @return:
     */
    switchPointType(type) {
      if (this.tabCheck == type) {
        return;
      }
      this.tabCheck = type;
      //去掉嗨乐积分的手机号校验
      // if (this.tabCheck == 1) {
      //   let user = JSON.parse(window.localStorage.user);
      //   if (!user.phone) {
      //     this.$toast("请先绑定手机号...跳转中", 2);
      //     setTimeout(() => {
      //       this.$router.push({
      //         path: "/uc/bindPhone",
      //         query: {
      //           redirect: this.$route.fullPath
      //         }
      //       });
      //     }, 2000);
      //   }
      // }
    },

    //输入错误的提示
    inputError(msgStr) {
      this.showNum = false;
      this.$toast(msgStr);
    },
    //输入正确的提示
    inputCorrect(msgStr) {
      this.$toast(msgStr, 4);
      this.closePop();
      setTimeout(() => {
        this.starNum = null;
        this.showNum = false;
      }, 1500);
    },

    // 控制input输入的星星
    inputNum(e) {
      this.starNum = e.target.value;
      e.target.setAttribute('placeholder', this.starNum);
      let boolean = new RegExp('^[0-9]+([.]{1}[0-9]{1,2})?$').test(this.starNum);
      if (!boolean) {
        this.inputError(this.exchangeMsg[0]);
      } else if (this.starNum > 0 && this.starNum <= this.getUserInfo.exchangeStarNum) {
        console.log('数字合适');
        this.showNum = true;
      } else if (this.starNum > this.getUserInfo.exchangeStarNum) {
        this.inputError(this.exchangeMsg[1]);
      } else {
        this.showNum = false;
      }
    },

    inputBlur(e) {
      e.target.setAttribute('placeholder', '输入消耗星星数量');
      this.scrollToTop();
    },

    //全部兑换
    allExchange() {
      if (this.getUserInfo.exchangeStarNum > this.getUserInfo.recScore) {
        this.starNum = this.getUserInfo.recScore;
      } else {
        this.starNum = this.getUserInfo.exchangeStarNum;
      }
      console.log(this.starNum, 'this.starNum');
      if (this.starNum > 0) {
        this.showNum = true;
      }
    },

    //防止用户多次点击
    starExchange() {
      if (this.showNum == true) {
        this.showNum = false;
        this.affirmStarExchange();
      } else {
        this.inputError(this.exchangeMsg[1]);
      }
    },
    //确认点击兑换
    affirmStarExchange() {
      if (this.starNum > 0 && this.starNum <= this.getUserInfo.exchangeStarNum) {
        let param = {};
        param.walletScore = this.starNum;
        return this.exchangeScore(param);
      } else {
        this.inputError(this.exchangeMsg[1]);
      }
    },

    /**
     * @description: 请求兑换接口地址
     * @param {number} 兑换的星星数量
     * @return:
     */
    exchangeScore(param) {
      let reqUrl = '';
      if (this.tabCheck == 0) {
        //兑换椰子积分
        reqUrl = '/api/yeYunOrder/exchangeYeYunScore';
      } else if (this.tabCheck == 1) {
        //兑换嗨乐积分
        reqUrl = '/api/haiLeUser/exchangeHaileScore';
      }
      return this.$post(reqUrl, param)
        .then(rsp => {
          const dataResponse = rsp;
          console.log(dataResponse);
          if (dataResponse.code == 200) {
            // this.$parent.userWalletRefresh();
            this.inputCorrect(this.exchangeMsg[3]);
            //更新积分钱包
            let point = param.walletScore;
            // this.exchangeStarNum = this.exchangeStarNum - point;
            if (this.tabCheck == 0) {
              //椰子
              this.setUserInfo({
                ...this.getUserInfo,
                yeYunPoints: this.add(this.getUserInfo.yeYunPoints, point),
                recScore: this.sub(this.getUserInfo.recScore, this.starNum),
                exchangeStarNum: this.sub(this.getUserInfo.exchangeStarNum, this.starNum)
              });
            } else {
              this.setUserInfo({
                ...this.getUserInfo,
                haiLePoints: this.getUserInfo.haiLePoints + point
              });
            }
          } else {
            this.$toast(dataResponse.message, 3);
          }
        })
        .catch(error => {
          console.log(error, '兑换积分失败');
        });
    },

    add(s1, s2) {
      return accAdd(s1, s2);
    },

    sub(a1, a2) {
      return accSub(a1, a2);
    },
    scrollToTop: function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
        console.log('回滚');
      }, 100);
    }
    // getExchangeStarNum() {
    //   this.$post("/api/starNum/queryExchangeScore")
    //     .then(rsp => {
    //       console.log(rsp, "starNum/queryExchangeScore");
    //       if (rsp.code == "200") {
    //         if (rsp.data >= 0) {
    //           this.exchangeStarNum = rsp.data;
    //         } else {
    //           this.exchangeStarNum = 0;
    //         }
    //       } else {
    //         this.exchangeStarNum = 0;
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // }
  }
};
</script>

<style lang='scss' scoped>
@import '../../assets/common/_base';
@import '../../assets/common/_mixin';

.ui_pop > div {
  position: relative;
}

.close {
  @extend .g_v_mid;
  right: 0;
  width: 10.4vw;
  height: 10.4vw;
  @include getBgImg('../../assets/images/guess/sign_close.png');
  background-size: 4.2667vw;
}

.rules {
  padding-bottom: 8vw;
  font-size: 3.2vw;
  color: #995d53;
}

.pop_tips {
  @extend .g_v_c_mid;
  width: 57.33vw;
  padding: 5.33vw 2.67vw;
  text-align: center;
  background-color: #2a181c;
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

.att_tips {
  padding-top: 2.67vw;
  font-size: 3.73vw;
  color: $color_yellow;
}

.pointsExchange {
  position: relative;
  width: 100%;
  margin: 0 2.67vw;
  background-color: $color_item;
  border-radius: 1.3333vw;
  overflow: hidden;
  h3 {
    position: relative;
    @include getBtn(auto, 9.6vw, 4.2667vw, #fff, #353447, 0);
    @include getBorder(bottom, #565279);
  }
}

.pointsExchange_con {
  text-align: center;
  .exchange_con {
    margin: 0 4.2667vw;
  }
  .exchange_input {
    margin-top: 5.3333vw;
    padding: 2.4vw 4.2667vw;
    background-color: #353447;
    @include getRadiusBorder(#454360, all, 1.0667vw);
    p {
      padding-bottom: 3.0667vw;
      font-size: 4vw;
      line-height: 4.5333vw;
      color: #fff;
      text-align: left;
    }
    span {
      font-size: 3.4667vw;
      color: $color_yellow;
    }
  }
  .star_balance {
    padding-top: 5.3333vw;
    span {
      display: block;
      font-size: 9.3333vw;
      line-height: 9.8667vw;
      font-weight: bold;
      color: $color_yellow;
    }
    p {
      padding-top: 1.0667vw;
      font-size: 3.4667vw;
      line-height: 4vw;
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .exchange_rules {
    @extend .flex_hc;
    color: #f5b457;
    i {
      width: 3.2vw;
      height: 3.2vw;
      margin-right: 1.6vw;
      @include getBgImg('../../assets/images/guess/wenhao.png');
      background-size: 100% 100%;
    }
  }
  .exchange_num {
    width: 66.6667vw;
    line-height: 6.1333vw;
    font-size: 5.6vw;
    color: #fff;
    text-align: left;
    &::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.1);
    }
  }
  .exchange_rules {
    display: block;
    margin-top: 3.2vw;
    padding: 0 4.2667vw;
    background-color: #353447;
    @include getRadiusBorder(#454360, all, 1.0667vw);
    p {
      @extend .flex_v_justify;
      width: 100%;
      height: 9.0667vw;
      font-size: 4vw;
      line-height: 4.5333vw;
      color: #fff;
      @include getBorder(bottom, #454360);
      &:last-child {
        background: transparent;
      }
    }
  }
  .exchange_btn {
    padding-top: 5.3333vw;
    a {
      display: block;
      line-height: 10.4vw;
      font-size: 4vw;
      border-radius: 0 0 3px 3px;
      font-weight: bold;
      color: #fff;
      background-color: $color_btn;
    }
    .disabled {
      opacity: 0.2;
    }
  }
  input::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: #3e2428;
  }
  input::-moz-placeholder {
    /* Firefox 19+ */
    color: #3e2428;
  }
  input:-ms-input-placeholder {
    /* IE 10+ */
    color: #3e2428;
  }
  input:-moz-placeholder {
    /* Firefox 18- */
    color: #3e2428;
  }
}
</style>


