<template>
  <div class='Page recommendPlanDetailPage'>
    <header class='mod_header'>
      <nav-bar :pageTitle="'大神跟单'"></nav-bar>
    </header>
    <div class='main' id='mainId'>
      <mescroll ref="mescroll" @downCallback="downCallback" @upCallback="upCallback" @mescrollInit="mescrollInit">
        <!-- 大神信息 -->
        <master-info ref="masterInfo"></master-info>
        <!-- 发单详情 -->
        <section class="bills_detail" v-if='recommendDetail'>
          <div class="mod_title">
            <span>发单详情</span>
            <span class="flex_hc">佣金率{{add(rate,commissionRate)}}%<i class="rules_icon"
                @click="popUps.showCommissionPop = true"></i></span>
          </div>
          <follow-plan-item :recommendDetail="recommendDetail" :detailType="1"></follow-plan-item>
        </section>
        <!-- 方案详情 -->
        <section class="bills_detail">
          <div class="mod_title">
            <span v-if="recommendDetail!=null">方案详情 (编号：{{recommendDetail.planNo}})</span>
          </div>
          <div class="bill_project">
            <!-- 需要填数据才能显示 -->
            <guess-item v-if="matchInfo!=null" :recommendOption="recommendOption" :matchType="3" :isUserPlan='isUserPlan' :matchInfo="matchInfo">
            </guess-item>
            <!-- 遮罩 -->
            <div class="bill_mask" v-else>
              <i class="lock_icon"></i>
              <p>开奖后公开</p>
            </div>
          </div>
        </section>
        <section class="bills_detail">
          <div class="mod_title">
            <span>跟单详情</span>
          </div>
          <div class="match_table">

            <ul>
              <li class="title">
                <span>用户名</span>
                <span>跟单金额</span>
                <span>获得奖金</span>
                <span>支付佣金</span>
              </li>
              <li v-for="(item,index) in planFollowList" :key="index">
                <span>{{item.followUserNickName |subStr(5)}}</span>
                <span>{{item.followCost}}</span>
                <span v-if="recommendDetail!=null && recommendDetail.resultStatus==2">{{item.winAward.toFixed(2)}}</span>
                <span v-else>-</span>
                <span
                  v-if="recommendDetail!=null && recommendDetail.resultStatus==2">{{(add(item.winIncomeUser,item.winIncomeSys)).toFixed(2)}}</span>
                <span v-else>-</span>
              </li>
              <li v-if="noData">
                <span>暂无跟单信息</span>
              </li>
            </ul>

          </div>
        </section>

        <section class="pop_commission" v-if="popUps.showCommissionPop">
          <p>玩家跟单方案盈利率≥{{recommendRule.oddsMin}}时</p>
          <p>跟单用户需支付奖金{{add(rate,commissionRate)}}%做为佣金</p>
          <p>其中{{commissionRate}}%给予大神做为奖励</p>
        </section>
      </mescroll>
    </div>
    <footer class='mod_footer'>
    </footer>
  </div>
</template>

<script>
import navBar from '../../../../components/header/nav_bar/index.vue';
import masterInfo from '../components/masterInfo.vue';
import followPlanItem from '../components/followPlanItem.vue';
import guessItem from '../../home/components/guessItem.vue';
import mescroll from '../../../../components/common/mescroll.vue';
import noData from '../../../../components/no_data/index.vue';
import { accAdd } from '../../../../libs/math';
export default {
  components: { navBar, masterInfo, followPlanItem, guessItem, mescroll, noData },
  props: [],
  data() {
    return {
      popUps: {
        showCommissionPop: false
      },
      requestParam: {
        pageNo: 1,
        pageSize: 10,
        planId: null
      },
      planFollowList: [], //跟单详情
      hasNext: true,
      currPageSize: 10,
      recommendDetail: null, //推荐单详情
      userId: null,
      planRecommendId: null, //推荐单ID
      matchInfo: null, //比赛详情
      rate: 1, //系统佣金率
      commissionRate: 5, // 推荐用户佣金率
      betType: false, //投注弹窗
      noData: false,
      isUserPlan: false,
      recommendOption: null, //用户选项下标
      recommendRule: {}
    };
  },
  mounted() {
    this.requestParam.planId = this.$route.query.planId;
    this.planRecommendId = this.$route.query.id;
    this.userId = this.$route.query.uid;
    // 监听弹窗事件
    this.$nextTick(() => {
      this.closePopCommission();
    });
    // this.getRecommendDetail();
    this.getRecommendRule();
    this.$refs.masterInfo.getTenWinInfo();

    //监听监听跟单成功事件
    this.$bus.$on('followSuccess', data => {
      console.log('事件触发接受');
      this.updateFollowPlanList(data);
    });
  },
  methods: {
    add(s1, s2) {
      return accAdd(s1, s2);
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    updateFollowPlanList(param) {
      console.log('followSuccess-更新跟单列表', param);
      if (this.planRecommendId == param.recommendPlanId) {
        this.downCallback();
      }
    },
    downCallback() {
      this.getRecommendDetail();
      this.planFollowList = [];
      this.requestParam.pageNo = 1;
      this.getPlanFollowData().then(data => {
        this.mescroll.endSuccess(this.currPageSize, this.hasNext);
      });
    },
    upCallback() {
      this.requestParam.pageNo += 1;
      this.getPlanFollowData().then(data => {
        this.mescroll.endSuccess(this.currPageSize, this.hasNext);
      });
    },
    closePopCommission() {
      document.addEventListener('click', e => {
        if (this.popUps.showCommissionPop) {
          var rulePopDom = document.getElementsByClassName('pop_commission')[0];
          var ruleIconDom = document.getElementsByClassName('rules_icon')[0];
          if (!ruleIconDom.contains(e.target) && !rulePopDom.contains(e.target)) {
            this.popUps.showCommissionPop = false;
          }
        }
      });
    },
    //分页查询，跟单详情
    getPlanFollowData() {
      let param = {};
      param = this.requestParam;
      // console.log('param,分页查询，跟单详情:', param);
      return this.$post('/api/planRecommend/planFollowPage', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            this.planFollowList = this.planFollowList.concat(dataResponse.data.dataList);
            this.hasNext = dataResponse.data.hasNext;
          }
          if (this.planFollowList.length > 0) {
            this.noData = false;
          } else {
            this.noData = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //推荐单详情
    getRecommendDetail() {
      let param = {};
      param.id = this.planRecommendId;
      // console.log('param,推荐单详情:', param);
      return this.$post('/api/planRecommend/recommendDetail', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            console.log('recommendDetail,推荐单详情:', dataResponse.data);
            this.recommendDetail = dataResponse.data;
            this.rate = dataResponse.data.feeRate;
            this.commissionRate = dataResponse.data.commissionRate;
            if (dataResponse.data.recommendOption) {        
               this.recommendOption = dataResponse.data.recommendOption;
            }
            if (dataResponse.data.recommendMatchResponse != null) {
              this.matchInfo = dataResponse.data.recommendMatchResponse;
              this.isUserPlan = true;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //取系统配置的跟单参数
    getRecommendRule() {
      this.popUps.billRules = true;
      return this.$post('/api/planRecommend/getRecommendRule').then(rsp => {
        const dataResponse = rsp;
        if (dataResponse.code == 200) {
          this.recommendRule = rsp.data;
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import '../../../../assets/common/_base';

.recommendPlanDetailPage {
  .guess_item.match_end {
    .header {
      &::before {
        display: none;
      }
    }
    .more_options span {
      color: #fff !important;
      &::before {
        border-color: #fff !important;
      }
    }
    .before {
      color: $color_main;
      background-color: #fff;
      border: none !important;
    }
  }
  .follow_order {
    background-color: #912d32 !important;
    .match_table {
      &,
      & span {
        color: #fff;
        border-color: #b7565c;
      }

      .title {
        background-color: #b7565c;
      }
    }
    .match_info {
      color: #fff;
    }
  }
}
</style>


<style lang='scss' scoped>
@import '../../../../assets/common/_base';
@import '../../../../assets/common/_mixin';


.mod_title {
  @extend .flex_v_justify;
  margin: 3.2vw 0;
  font-size: 3.4667vw;
  line-height: 4.2667vw;
  color: #fff;
}

.rules_icon {
  width: 3.7333vw;
  height: 3.7333vw;
  margin-left: 2.1333vw;
  border-radius: 50%;
  @include getBgImg('../../../../assets/images/followplan/rules_icon.png');
  background-size: contain;
}

.bills_detail {
  margin: 0 4.2667vw;
}

.bill_project {
  position: relative;
  min-height: 45.6vw;
  border-radius: 1.3333vw;
  // background-color: #912d32;
  .bill_mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    @extend .flex_v_h;
    flex-direction: column;
    -webkit-flex-direction: column;
    @include getBgImg('../../../../assets/images/common/default_img.png');
    background-size: contain;
    background-color: #912d32;
    .lock_icon {
      width: 6.4vw;
      height: 6.4vw;
      @include getBgImg('../../../../assets/images/followplan/lock.png');
    }
    p {
      padding-top: 4.2667vw;
      font-size: 5.3333vw;
      line-height: 5.8667vw;
      color: #fff;
    }
  }
}

.match_table {
  margin: 2vw 0;
  padding: 3.2vw;
  background-color: #912d32;
  border-radius: 1.3333vw;
  ul {
    border: 1px solid #b7565c;
    border-bottom: none;
  }
  li {
    @extend .flex;
    span {
      flex: 1;
      -webkit-flex: 1;
      border-left: 0.2667vw solid #b7565c;
      border-bottom: 0.2667vw solid #b7565c;
      font-size: 3.4667vw;
      line-height: 8.8vw;
      text-align: center;
      color: #fff;
      &:first-child {
        border-left: none;
      }
    }
  }
  .title {
    background-color: #b7565c;
    span {
      border: none;
    }
  }
}

.pop_commission {
  @extend .g_v_c_mid;
  position: fixed;
  z-index: 999;
  padding: 2.6667vw 9.3333vw;
  text-align: left;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  p {
    padding: 1.6vw 0;
    font-size: 4vw;
    line-height: 4.5333vw;
    color: #fff;
    white-space: nowrap;
  }
}

.mod_footer {
  background-color: #fff;
}

.follow_plan_btn {
  display: block;
  margin: 2.1333vw;
  @include getBtn(auto, 10.6667vw, 3.7333vw, #fff, $color_main, 0.8vw);
}
</style>
