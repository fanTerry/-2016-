<template>
  <div class='Page preventAddictionPage'>
    <header class='mod_header'>
      <nav-bar :pageTitle="'防沉迷设置'"></nav-bar>
      <div class="mod_notice">
        <p class="title">防沉迷设置</p>
        <p class="txt">通过限制工具自我管理，控制存款，投注，止损</p>
      </div>
      <nav class="tab">
        <ul class="list">
          <li :class="{active:tabType==1}" @click="changeTab(1)">存款限额</li>
          <li :class="{active:tabType==2}" @click="changeTab(2)">预测限额</li>
          <li :class="{active:tabType==3}" @click="changeTab(3)">止损限额</li>
        </ul>
      </nav>
    </header>
    <div class='main'>
      <p class="att_tips" v-if="tabType==1">设置存款限额管理自我花销，您可随时减少存款限额，但存款限额提升需24小时生效时间，新设定生效前无法做其他修改</p>
      <p class="att_tips" v-if="tabType==2">设置预测限额有效控玩家每日投注深度，约束自我行为，永远不要试图通过加大预测并赢回输掉的钱而增加你的止损限额</p>
      <p class="att_tips" v-if="tabType==3">设置止损限额有效控制潜在风险，约束自我行为，永远 不要试图通过加大预测并赢回输掉的钱而增加你的止损 限额</p>

      <!-- 存款限额 -->
      <section class="mod_deposit" v-show="tabType==1">
        <div>
          <div class="title">
            <span class="calendar"><i></i>1天</span>
            <span class="num">{{depositLimit.dayLimit!=null?depositLimit.dayLimit:20000}}</span>
          </div>
          <bar :despositLimit='dayLimitScale' :selectNum='depositLimit.dayLimit' :selectFlag='dayLimitIndex!=null?dayLimitIndex:20' @changeLimit="changeDaylimit"></bar>
        </div>
        <div>
          <div class="title">
            <span class="calendar"><i></i>7天</span>
            <span class="num">{{depositLimit.weekLimit!=null?depositLimit.weekLimit:100000}}</span>
          </div>
          <bar :despositLimit='weekLimitScale' :selectNum='depositLimit.weekLimit' :selectFlag='weekLimitIndex!=null?weekLimitIndex:20' @changeLimit="changeWeeklimit"></bar>
        </div>
        <div>
          <div class="title">
            <span class="calendar"><i></i>30天</span>
            <span class="num">{{depositLimit.monthLimit!=null?depositLimit.monthLimit:100000}}</span>
          </div>
          <bar :despositLimit='monthLimitScale' :selectNum='depositLimit.monthLimit' :selectFlag='monthLimitIndex!=null?monthLimitIndex:20' @changeLimit="changeMonthlimit"></bar>
        </div>

      </section>
      <!-- 预测限额 -->
      <section class="mod_guess" v-show="tabType==2">
        <div class="title">
          <span class="calendar"><i></i>1天</span>
          <span class="num">{{riskConfig.maxBet}}</span>
        </div>
        <p class="limit_num">{{riskConfig.maxBet}}</p>
        <p class="limit_tips">每日用户最高投注限额5万，达到最高预测限额后，玩家
          将无法继续预测，次日额度将在自然日0:00点后释放。</p>
      </section>
      <!-- 止损限额 -->
      <section class="mod_stop_loss" v-show="tabType==3">
        <div>
          <div class="title">
            <span class="calendar"><i></i>1天</span>
            <span class="num">{{riskConfig.dayLossLimit!=null?riskConfig.dayLossLimit:20000}}</span>
          </div>
          <bar :despositLimit='dayLossLimitScale' :selectNum='riskConfig.dayLossLimit' :selectFlag='dayLossLimitIndex!=null?dayLossLimitIndex:20' @changeLimit="changeDayLosslimit"></bar>
        </div>
        <div>
          <div class="title">
            <span class="calendar"><i></i>1年</span>
            <span class="num">{{riskConfig.maxBetLoss}}</span>
          </div>
        </div>
        <p class="limit_num">{{riskConfig.maxBetLoss}}</p>
        <p class="limit_tips">达到个人设置最高止损额度后，玩家将无法继续预测，
          次日额度将在自然日0:00点后释放，全年用户总止损额度10万，年度额度次年释放。</p>
      </section>
    </div>
    <footer class='mod_footer'>
      <a class='confirm_btn' v-if="tabType==1" @click="submitDepositLimit()">确认提交</a>
      <a class='confirm_btn' v-if="tabType==3" @click="submitLossLimit()">确认提交</a>
    </footer>
  </div>
</template>

<script>
import navBar from '../../../components/header/nav_bar/index.vue';
import bar from './components/bar';

export default {
  components: { navBar, bar },
  props: [],
  data() {
    return {
      tabType: 1,
      riskConfig: {},
      depositLimit: {},
      dayLimit: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000],
      dayLimitScale: [0, 500, 1000, 10000, 20000],
      weekLimit: [0, 200, 400, 600, 800, 1000,1500, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 20000, 40000, 60000, 80000, 100000],
      weekLimitScale: [0, 1000, 5000, 10000, 100000],
      monthLimit: [0, 200, 400, 600, 800, 1000, 1500,2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 20000, 40000, 60000, 80000, 100000],
      monthLimitScale: [0, 1000, 5000, 10000, 100000],
      dayLossLimit: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000],
      dayLossLimitScale: [0, 500, 1000, 10000, 20000],
      dayLimitIndex: Number,
      monthLimitIndex: Number,
      weekLimitIndex: Number,
      dayLossLimitIndex: Number
    };
  },
  mounted() {
    this.getRiskConfig();
  },
  methods: {
    changeTab(tabType) {
      if (tabType == this.tabType) {
        return;
      }
      this.tabType = tabType;
    },
    getRiskConfig() {
      this.$post('/api/userRisk/getConfig')
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == '200') {
            this.riskConfig = dataResponse.data;
            this.depositLimit = this.riskConfig.depositLimit;
            this.dayLimitIndex = this.dayLimit.indexOf(parseInt(this.depositLimit.dayLimit));
            this.weekLimitIndex = this.weekLimit.indexOf(parseInt(this.depositLimit.weekLimit));
            this.monthLimitIndex = this.monthLimit.indexOf(parseInt(this.depositLimit.monthLimit));
            this.dayLossLimitIndex = this.dayLossLimit.indexOf(this.riskConfig.dayLossLimit);
            console.log(dataResponse.data, this.dayLimitIndex, this.weekLimitIndex);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeDaylimit(index) {
      if (this.depositLimit.dayLimit == this.dayLimit[index]) {
        return;
      }
      this.dayLimitIndex = index;
      this.depositLimit.dayLimit = this.dayLimit[index];
    },
    changeWeeklimit(index) {
      if (this.depositLimit.weekLimit == this.weekLimit[index]) {
        return;
      }
      this.weekLimitIndex = index;
      this.depositLimit.weekLimit = this.weekLimit[index];
    },
    changeMonthlimit(index) {
      if (this.depositLimit.monthLimit == this.monthLimit[index]) {
        return;
      }
      this.monthLimitIndex = index;
      this.depositLimit.monthLimit = this.monthLimit[index];
    },
    changeDayLosslimit(index) {
      if (this.riskConfig.dayLossLimit == this.dayLossLimit[index]) {
        return;
      }
      this.dayLossLimitIndex = index;
      this.riskConfig.dayLossLimit = this.dayLossLimit[index];
    },
    submitDepositLimit() {
      let param = {};
      param.dayLimit = this.depositLimit.dayLimit;
      param.weekLimit = this.depositLimit.weekLimit;
      param.monthLimit = this.depositLimit.monthLimit;
      console.log('参数', param);
      this.$post('/api/userRisk/submitDepositLimit', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == '200') {
            this.$toast('提交成功');
          } else if (dataResponse.code == '1002') {
            this.$toast('请不要重复提交');
          } else if (dataResponse.code == '1001') {
            this.$toast('操作更改锁定，24小时后生效');
          } else if (dataResponse.code == '1000') {
            this.$toast('提交失败，稍后再试');
          } else {
            this.$toast('系统异常，稍后再试');
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submitLossLimit() {
      let param = {};
      param.dayLimit = this.riskConfig.dayLossLimit;
      console.log('参数', param);
      this.$post('/api/userRisk/submitLossLimit', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == '200') {
            this.$toast('提交成功');
          } else if (dataResponse.code == '1002') {
            this.$toast('请不要重复提交');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>


<style lang="scss">
@import '../../../assets/common/_base';
.preventAddictionPage {
  .mod_header {
    background-color: $color_main;
  }
  .nav_bar {
    color: #fff !important;
    background-color: $color_item !important;
  }
  .back {
    &::before,
    &::after {
      background-color: #fff !important;
    }
  }
}
</style>

<style lang='scss' scoped>
@import '../../../assets/common/_base';
@import '../../../assets/common/_mixin';

.main {
  padding-bottom: 9.3333vw;
}

.mod_notice {
  position: relative;
  margin: 3.2vw 4.2667vw 0;
  padding: 5.3333vw 0;
  background-color: $color_item;
  border-radius: $border_radius;
  text-align: center;
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 2.4vw;
    height: 5.0667vw;
    @include getBgImg('../../../assets/images/guess/notice_icon.png');
  }
  &::before {
    top: -2.1333vw;
    left: 6.1333vw;
  }
  &::after {
    top: -2.1333vw;
    right: 6.1333vw;
  }
  .title {
    font-size: 5.3333vw;
    line-height: 5.8667vw;
    color: $color_yellow;
    font-weight: bold;
  }
  .txt {
    padding-top: 5.3333vw;
    font-size: 3.7333vw;
    line-height: 4.2667vw;
    color: #fff;
  }
}

.tab {
  padding: 0 11.7333vw;
  height: 12.8vw;
  overflow: hidden;
  background-color: $color_main;
  ul {
    @extend .flex_v_justify;
    height: calc(100% + 6px);
    font-size: 0;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
  li {
    padding: 4.2667vw 0;
    font-size: 3.7333vw;
    border-radius: 3px;
    font-weight: bold;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    &.active {
      position: relative;
      color: #fff;
      &::after {
        content: '';
        @extend .g_c_mid;
        bottom: 1.0667vw;
        width: 4vw;
        height: 1.0667vw;
        border-radius: 0.8vw;
        background-color: #fff;
      }
    }
  }
}

.att_tips {
  padding: 2.1333vw 4.2667vw 4.2667vw;
  font-size: 3.7333vw;
  line-height: 4.8vw;
  color: #fff;
}

.mod_deposit,
.mod_guess,
.mod_stop_loss {
  // height: 89.6vw;
  flex: none;
  -webkit-flex: none;
  margin: 0 4.2667vw;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  background-color: $color_item;
  border-radius: $border_radius;
  overflow: hidden;
  .title {
    @extend .flex_v_justify;
    height: 9.3333vw;
    padding: 0 3.2vw;
    font-size: 3.7333vw;
    background-color: #353447;
    color: #fff;
  }
  .calendar {
    @extend .flex_hc;
    font-weight: bold;
    i {
      width: 4.5333vw;
      height: 4.5333vw;
      margin-right: 2.1333vw;
      @include getBgImg('../../../assets/images/user_center/calendar_icon.png');
    }
  }
  .num {
    color: #999;
  }
  .bar {
    position: relative;
    @extend .flex_v_justify;
    padding: 0 3.2vw 3.2vw 7.4667vw;
    &::before {
      content: '';
      @extend .g_c_mid;
      top: 5.8667vw;
      width: 85.2vw;
      height: 1.3333vw;
      background-color: $color_yellow;
      border-radius: 1.3333vw;
    }
    span {
      position: relative;
      text-align: center;
      padding-top: 13.0667vw;
      font-size: 3.7333vw;
      line-height: 4.2667vw;
      color: #fff;
      &.active {
        color: $color_yellow;
        &::before {
          content: '';
          @extend .g_c_mid;
          top: 3.2vw;
          width: 6.6667vw;
          height: 6.6667vw;
          border: 0.5333vw solid #3d3b51;
          border-radius: 50%;
          background-color: $color_yellow;
          box-sizing: border-box;
        }
      }
    }
  }
  .limit_num {
    margin: 5.3333vw 3.2vw 0;
    @include getBtn(auto, 13.0667vw, 9.3333vw, $color_yellow, #353447, $border_radius);
    font-weight: bold;
  }
  .limit_tips {
    margin: 4.2667vw 3.2vw 3.2vw;
    font-size: 3.4667vw;
    line-height: 5.8667vw;
    color: #fff;
  }
}

.mod_footer {
  background-color: $color_item;
}
.confirm_btn {
  display: block;
  @include getBtn(auto, 10.4vw, 4vw, #fff, $color_btn, 0);
}
</style>
