<template>
  <div class='Page godPage'>
    <header class='mod_header'>
      <nav-bar :pageTitle="'我的发单'"></nav-bar>
    </header>
    <mescroll ref="mescroll" @downCallback="downCallback" @upCallback="upCallback" @mescrollInit="mescrollInit" :isShowEmpty="false">

      <div class='main' id="mainId">
        <!-- 大神信息 -->
        <master-info ref="masterInfo"></master-info>
        <!-- 10场红单情况 -->
        <ul class="bills" v-if="tenScore!=null">
          <li :class="{right:item==1,wrong:item==0}" v-for="(item,index) in tenScore" :key='index'>
            {{item==1?'红':'黑'}}</li>
          <!-- <li class="wrong">黑</li> -->
        </ul>
        <!-- 发单详情 -->
        <section class="bills_detail">
          <div class="mod_title">
            <span>今日剩余发单次数：<em>{{historyData.todayEnableRecommend?historyData.todayEnableRecommend:0}}</em></span>
            <span class="flex_hc">发单规则<i class="rules_icon" @click="getRecommendRule"></i></span>
          </div>
          <div class="info">
            <span>成功发单：{{historyData.allRecommendSum?historyData.allRecommendSum:0}}单</span>
            <span>跟单累计：{{historyData.followAmonutSum?historyData.followAmonutSum:0}}</span>
            <span>已结佣金：{{historyData.commissionSum?historyData.commissionSum:0}}</span>
          </div>
        </section>
        <!-- 投单列表 -->
        <ul class="orders">
          <follow-plan-item :recommendDetail="item" :orderType="false" v-for="(item,index) in this.planRecommendInfo.dataList" :key='index'></follow-plan-item>
        </ul>
      </div>
      <no-data v-if="noData" :text="'暂无数据'"> </no-data>
      <!-- 发单规则 -->
      <div class="ui_pop " v-if="popUps.billRules">
        <div class="pop_bill_rules">
          <h3>发单规则<span class="close" @click="popUps.billRules = false"></span></h3>
          <div class="con">
            <p class="title">大神发单条件：</p>
            <div>
              <p>1. 订单金额 <span>≥{{recommendRule.moneyMin}}</span> 星星</p>
              <p>2. 跟单盈利方案 <span>≥{{recommendRule.oddsMin}}</span> </p>
            </div>
            <p class="tips">若玩家预测过程中由于题目赔率变化返还率
              ＜{{recommendRule.oddsMin}}，用户下单将不计入佣金统计，大神
              每日可最多发布{{recommendRule.orderCount}}条跟单，可获得玩家订单奖
              励的{{recommendRule.commissionRate}}佣金</p>
          </div>
          <a class="agree_btn" @click="popUps.billRules = false">好的</a>
        </div>
      </div>
    </mescroll>
    <!-- <footer class='mod_footer'>
      <a class="send_bill_btn" @click="toRecommend">立即发单</a>
    </footer> -->
  </div>
</template>

<script>
import navBar from '../../../../components/header/nav_bar/index.vue';
import masterInfo from '../components/masterInfo.vue';
import followPlanItem from '../components/followPlanItem.vue';
import mescroll from '../../../../components/common/mescroll.vue';
import noData from '../../../../components/no_data/index.vue';

export default {
  components: { navBar, masterInfo, followPlanItem, mescroll, noData },
  props: [],
  data() {
    return {
      noData: false,
      popUps: {
        billRules: false
      },
      mescroll: null,
      userId: null,
      tenScore: null,
      historyData: {},
      noData: false,
      planRecommendInfo: {
        loadMore: true,
        currPageSize: 10,
        dataList: [],
        requestParam: {
          pageNo: 1,
          pageSize: 10,
          followQueryType: 1 //我的发单
        },
        userScore: ''
      },
      recommendRule:{} //发单规则
    };
  },
  mounted() {
    this.userId = this.$route.query.uid;
    this.getHistoryRecommendData();
  },
  methods: {
    getHistoryRecommendData() {
      let param = {};
      param.userId = this.userId;
      return this.$post('/api/planRecommend/getHistoryRecommendData', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            this.historyData = dataResponse.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      // this.mescroll.setBounce(true)//允许iOS回弹,相当于配置up的isBounce为true
    },
    downCallback() {
      console.log('下拉刷新');
      // this.refresh(true);
      // this.mescroll.setPageNum(2);
      this.$refs.masterInfo.getTenWinInfo().then(data => {
        this.tenScore = this.$refs.masterInfo.tenwinUserInfo.bet10WinDetail;
      });
      this.planRecommendInfo.dataList = [];
      this.planRecommendInfo.requestParam.pageNo = 1;
      this.pageData().then(data => {
        this.$nextTick(() => {
          this.mescroll.endSuccess(this.planRecommendInfo.currPageSize, this.planRecommendInfo.loadMore);
        });
      });
    },
    upCallback() {
      console.log('上拉加载更多');
      this.planRecommendInfo.requestParam.pageNo += 1;
      this.pageData().then(data => {
        this.$nextTick(() => {
          this.mescroll.endSuccess(this.planRecommendInfo.currPageSize, this.planRecommendInfo.loadMore);
        });
      });
    },
    //分页数据查询
    pageData() {
      let param = {};
      param = this.planRecommendInfo.requestParam;
      param.userId = this.userId;
      return this.$post('/api/planRecommend/pageData', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            let dataList = dataResponse.data.dataList;
            if (dataList) {
              this.planRecommendInfo.currPageSize = dataList.length;
            }
            this.planRecommendInfo.loadMore = dataResponse.data.hasNext;
            this.planRecommendInfo.dataList = this.planRecommendInfo.dataList.concat(dataList);
            this.planRecommendInfo.requestParam.pageNo = dataResponse.data.pageNo;
          }
          if (this.planRecommendInfo.dataList.length > 0) {
            this.noData = false;
          } else {
            this.noData = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    getRecommendRule() {
      this.popUps.billRules = true
      return this.$post('/api/planRecommend/getRecommendRule').then(rsp => {
        const dataResponse = rsp;
        if (dataResponse.code == 200) {
          this.recommendRule = rsp.data;
        }else{
          this.$toast("数据异常")
        }

      });
    },
    toRecommend() {
      this.$router.push({
        path: '/guess/home',
        query: {}
      });
    }
  }
};
</script>

<style lang="scss">
.godPage {
  .user_info {
    display: none !important;
  }
}
</style>


<style lang='scss' scoped>
@import '../../../../assets/common/_base';
@import '../../../../assets/common/_mixin';



.bills {
  @extend .flex_hc;
  margin-top: 2.1333vw;
  padding: 3.2vw 2.9333vw;
  background-color: #fff;
  li {
    @extend .flex_v_h;
    width: 6.6667vw;
    height: 6.6667vw;
    margin: 0 1.3333vw;
    border-radius: 50%;
    font-size: 3.2vw;
    color: #fff;
  }
  .right {
    background-color: $color_main;
  }
  .wrong {
    background-color: #333;
  }
}

.orders {
  margin: 0 4.2667vw;
}

.bills_detail {
  margin: 0 4.2667vw;
  .info {
    @extend .flex_v_justify;
    padding: 3.2vw;
    line-height: 8vw;
    border-radius: 1.3333vw;
    color: #fff;
    background-color: #912d32;
  }
}

.mod_title {
  @extend .flex_v_justify;
  margin: 3.2vw 0;
  font-size: 3.7333vw;
  line-height: 4.2667vw;
  color: #fff;
  font-weight: bold;
  em {
    color: #feff00;
  }
}

.rules_icon {
  width: 3.7333vw;
  height: 3.7333vw;
  margin-left: 2.1333vw;
  border-radius: 50%;
  @include getBgImg('../../../../assets/images/followplan/rules_icon.png');
  background-size: contain;
}
.mod_footer {
  background-color: #fff;
}

.send_bill_btn {
  display: block;
  @include getBtn(91.4667vw, 10.6667vw, 4vw, #fff, $color_main, 0.8vw);
  margin: 2vw auto;
  font-weight: bold;
}

.pop_bill_rules {
  width: 89.3333vw;
  border-radius: 1.3333vw;
  background-color: #fff;
  overflow: hidden;
  h3 {
    @include getBtn(89.3333vw, 10.6667vw, 4.2667vw, #333, #f4f4f4, 0);
    @include getRadiusBorder(#ddd, bottom, 0);
  }
  .close {
    @extend .g_v_mid;
    right: 2.6667vw;
    @include getClose(4.2667vw, #999);
  }
  .con {
    height: 62.4vw;
    padding: 4.2667vw;
    p {
      font-size: 4vw;
      line-height: 4.5333vw;
      color: #333;
      span {
        color: $color_main;
        font-weight: bold;
      }
    }
  }
  .title {
    font-weight: bold;
    padding-bottom: 2.1333vw;
  }
  .tips {
    padding-top: 5.0667vw;
  }
  .agree_btn {
    display: block;
    @include getBtn(100%, 10.6667vw, 4vw, #fff, $color_main, 0);
  }
}
</style>
