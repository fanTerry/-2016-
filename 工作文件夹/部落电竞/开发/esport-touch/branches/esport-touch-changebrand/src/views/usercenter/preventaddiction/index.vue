<template>
  <div class='Page'>
    <header class='mod_header'>
      <nav-bar :pageTitle="'枫叶电竞'"></nav-bar>
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
      <section class="mod_deposit" v-if="tabType==1">
        <div>
          <div class="title">
            <span class="calendar"><i></i>1天</span>
            <span class="num">{{depositLimit.dayLimit}}</span>
          </div>
          <div class="bar">
            <span :class="{active:depositLimit.dayLimit==0}" @click="changeDaylimit(0)">0</span>
            <span :class="{active:depositLimit.dayLimit==500}" @click="changeDaylimit(500)">500</span>
            <span :class="{active:depositLimit.dayLimit==1000}" @click="changeDaylimit(1000)">1000</span>
            <span :class="{active:depositLimit.dayLimit==10000}" @click="changeDaylimit(10000)">10000</span>
            <span :class="{active:depositLimit.dayLimit==20000}" @click="changeDaylimit(20000)">20000</span>
          </div>
        </div>
        <div>
          <div class="title">
            <span class="calendar"><i></i>7天</span>
            <span class="num">{{depositLimit.weekLimit}}</span>
          </div>
          <div class="bar">
            <span :class="{active:depositLimit.weekLimit==0}" @click="changeWeeklimit(0)">0</span>
            <span :class="{active:depositLimit.weekLimit==500}" @click="changeWeeklimit(500)">500</span>
            <span :class="{active:depositLimit.weekLimit==1000}" @click="changeWeeklimit(1000)">1000</span>
            <span :class="{active:depositLimit.weekLimit==10000}" @click="changeWeeklimit(10000)">10000</span>
            <span :class="{active:depositLimit.weekLimit==100000}" @click="changeWeeklimit(100000)">100000</span>
          </div>
        </div>
        <div>
          <div class="title">
            <span class="calendar"><i></i>30天</span>
            <span class="num">{{depositLimit.monthLimit}}</span>
          </div>
          <div class="bar">
            <span :class="{active:depositLimit.monthLimit==0}" @click="changeMonthlimit(0)">0</span>
            <span :class="{active:depositLimit.monthLimit==500}" @click="changeMonthlimit(500)">500</span>
            <span :class="{active:depositLimit.monthLimit==1000}" @click="changeMonthlimit(1000)">1000</span>
            <span :class="{active:depositLimit.monthLimit==10000}" @click="changeMonthlimit(10000)">10000</span>
            <span :class="{active:depositLimit.monthLimit==100000}" @click="changeMonthlimit(100000)">100000</span>
          </div>
        </div>

      </section>
      <!-- 预测限额 -->
      <section class="mod_guess" v-if="tabType==2">
        <div class="title">
          <span class="calendar"><i></i>1天</span>
          <span class="num">{{riskConfig.maxBet}}</span>
        </div>
        <p class="limit_num">{{riskConfig.maxBet}}</p>
        <p class="limit_tips">每日用户最高投注限额5万，达到最高预测限额后，玩家
          将无法继续预测，次日额度将在自然日0:00点后释放。</p>
      </section>
      <!-- 止损限额 -->
      <section class="mod_stop_loss" v-if="tabType==3">
        <div>
          <div class="title">
            <span class="calendar"><i></i>1天</span>
            <span class="num">{{riskConfig.dayLossLimit}}</span>
          </div>
          <div class="bar">
            <span :class="{active:riskConfig.dayLossLimit==0}" @click="changeDayLosslimit(0)">0</span>
            <span :class="{active:riskConfig.dayLossLimit==500}" @click="changeDayLosslimit(500)">500</span>
            <span :class="{active:riskConfig.dayLossLimit==1000}" @click="changeDayLosslimit(1000)">1000</span>
            <span :class="{active:riskConfig.dayLossLimit==10000}" @click="changeDayLosslimit(10000)">10000</span>
            <span :class="{active:riskConfig.dayLossLimit==20000}" @click="changeDayLosslimit(20000)">20000</span>
          </div>
        </div>
        <div>
          <div class="title">
            <span class="calendar"><i></i>1年</span>
            <span class="num">{{riskConfig.maxBetLoss}}</span>
          </div>
        </div>
        <p class="limit_num">{{riskConfig.maxBetLoss}}</p>
        <p class="limit_tips">达到个人设置最高止损额度后，玩家将无法继续预测，
          次日额度将在自然日0:00点后释放，全年用户总止损额
          度10万，年度额度次年释放。</p>
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

export default {
  components: { navBar },
  props: [],
  data() {
    return {
      tabType: 1,
      riskConfig: {},
      depositLimit: {}
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
            console.log(dataResponse.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeDaylimit(dayLimit) {
      if (this.depositLimit.dayLimit == dayLimit) {
        return;
      }
      this.depositLimit.dayLimit = dayLimit;
    },
    changeWeeklimit(weekLimit) {
      if (this.depositLimit.weekLimit == weekLimit) {
        return;
      }
      this.depositLimit.weekLimit = weekLimit;
    },
    changeMonthlimit(monthLimit) {
      if (this.depositLimit.monthLimit == monthLimit) {
        return;
      }
      this.depositLimit.monthLimit = monthLimit;
    },
    changeDayLosslimit(dayLossLimit) {
      if (this.riskConfig.dayLossLimit == dayLossLimit) {
        return;
      }
      this.riskConfig.dayLossLimit = dayLossLimit;
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

<style lang='scss' scoped>
@import '../../../assets/common/_base';
@import '../../../assets/common/_mixin';


.mod_header {
  background-color: transparent;
  .nav_bar {
    background-color: #fff;
  }
}

.main {
  padding-bottom: 9.3333vw;
}

.mod_notice {
  position: relative;
  margin: 3.2vw 4.2667vw 0;
  padding: 5.3333vw 0;
  background-color: #fff;
  border-radius: 1.3333vw;
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
    color: #d63941;
    font-weight: bold;
  }
  .txt {
    padding-top: 5.3333vw;
    font-size: 3.7333vw;
    line-height: 4.2667vw;
    color: #333;
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
  height: 89.6vw;
  margin: 0 4.2667vw;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 1.3333vw;
  overflow: hidden;
  .title {
    @extend .flex_v_justify;
    height: 9.3333vw;
    padding: 0 3.2vw;
    background-color: #f4f4f4;
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
      background-color: $color_main;
      border-radius: 1.3333vw;
    }
    span {
      position: relative;
      text-align: center;
      padding-top: 13.0667vw;
      font-size: 3.7333vw;
      line-height: 4.2667vw;
      &.active::before {
        content: '';
        @extend .g_c_mid;
        top: 3.2vw;
        width: 6.6667vw;
        height: 6.6667vw;
        border: 0.5333vw solid #fff;
        border-radius: 50%;
        background-color: $color_main;
        box-sizing: border-box;
      }
    }
  }
  .limit_num {
    margin: 5.3333vw 3.2vw 0;
    @include getBtn(auto, 13.0667vw, 9.3333vw, $color_main, #f4f4f4, 0.8vw);
    font-weight: bold;
  }
  .limit_tips {
    margin: 4.2667vw 3.2vw 0;
    font-size: 3.4667vw;
    line-height: 5.8667vw;
    color: #333;
  }
}

.mod_footer {
  background-color: #fff;
}
.confirm_btn {
  display: block;
  margin: 1.3333vw 4.2667vw;
  @include getBtn(auto, 10.4vw, 4vw, #fff, $color_main, 0.8vw);
}
</style>
