<template>
  <div class='Page guessRankPage'>
    <header class='mod_header'>
      <nav-bar>
        <div class="slot">
          <ul class="tab">
            <li :class="{active:tabCheck==index}" @click="tabClick(index)" v-for="(item,index) in rankTab" :key="index">
              {{item}}</li>
          </ul>
          <a class="rules" @click="rules()">规则</a>
        </div>
      </nav-bar>
    </header>
    <div class="award" v-if="winTopResult">
      <div class="award_info">
        <img :src="winTopResult.userIcon|getDefaultImg(userDefaultUrl)" alt="">
        <div>
          <p class="award_name">{{winTopResult.nickName}}</p>
          <p class="award_rank" v-if="winTopResult.rank">No.{{winTopResult.rank}}</p>
        </div>
      </div>
      <div class="award_gift">
        <p class="award_num" v-if="winTopResult.awardTtotal!=null"><span>{{winTopResult.awardTtotal}}</span>星星</p>
        <p class="gift_name" v-if="winTopResult.hd105GiftResponse!=null">
          <span v-if="tabCheck==0">预期奖励：</span>
          <span v-else>获得奖励：</span>
          {{winTopResult.hd105GiftResponse.giftName}}
        </p>
        <p v-if="winTopResult.hd105GiftResponse==null && winTopResult.awardTtotal==null">暂未上榜,继续加油!</p>
      </div>
    </div>
    <div class='main'>
      <mescroll ref="mescroll" :isUseDown="false" :isUseUp="false">
        <div v-if="winTopList">
          <h3>
            <span class="rank">排名</span>
            <span class="id">用户名</span>
            <span class="num" v-if="tabCheck==0">本周中奖</span>
            <span class="num" v-else>上周中奖</span>
            <span class="reward" v-if="tabCheck==0">预期奖励</span>
            <span class="reward" v-else>获得奖励</span>
          </h3>
          <ul class="award_list">
            <li v-for="(item,index) in winTopList" :key="index">
              <span class="rank">{{index+1}}</span>
              <p class="users">
                <img :src="item.userIcon|getDefaultImg(userDefaultUrl)" alt="">
                <span>{{item.nickName }}</span>
                <!--只显示名字第一个字符 -->
              </p>
              <span class="num">{{item.awardTtotal | formatAwardTtotal}}</span>
              <span class="gift_name" v-if="item.hd105GiftResponse">{{item.hd105GiftResponse.giftName}}</span>
              <span class="gift_name" v-else></span>
            </li>
          </ul>
        </div>
      </mescroll>
      <!-- 没有数据时展示 -->
      <noData v-if="noData" :imgUrl="imgUrl" :text="'暂时还没有排行榜哦'"> </noData>
    </div>

    <div class="ui_pop" v-if="showRules">
      <div class="rules">
        <h3>大神预测榜单规则<a class="close" @click="showRules = false"></a></h3>
        <div class="content">
          <p>1.大神实时排行统计自然周内玩家赛事预测中奖星星总数；</p>
          <p>2.大神实时排行仅展示当前中奖星星排名TOP100的玩家；</p>
          <p>3.榜单统计周期为自然周，即周一的00:00至周日的24:00；</p>
          <p>4.玩家也可通过上周排行查看上期的个人排名及奖励情况；</p>
          <p>5.大神榜单将不定期更新每期奖励，敬请关注榜单奖励说明；</p>
          <p>6.当周榜单获取实物奖励的用户请联系赢加微信客服:jzdj08；</p>
          <p>7.当周榜单获取的星星奖励将于下周一排名确立后自动派发；</p>
          <p>8.当周榜单获取的星星奖励具备7日使用有效期，预期将作废。</p>
        </div>
        <a class="agree_btn" @click="showRules = false">好的</a>
      </div>
    </div>
    <!-- 中奖弹窗 -->
    <daily-award v-if="showDailyAward" @closeDailyAward="closeDailyAward" :winPrize="winPrize" :winText="winText">
    </daily-award>

    <footer class="mod_footer">
      <div class="rank_footer">
        <p></p>
        <p v-if="tabCheck==0">距排名结束还有：<span>{{day}}</span> 天 <span>{{hour}}</span> 时 <span>{{min}}</span> 分</p>
        <p v-else>距排名结束还有：已结束</p>
      </div>
    </footer>
  </div>
</template>

<script>
import navBar from '../../../../components/header/nav_bar/index.vue';
import noData from '../../../../components/no_data/index.vue';
import mescroll from '../../../../components/common/mescroll.vue';
import dailyAward from '../../../guess/dailyAward.vue';
export default {
  components: {
    navBar,
    noData,
    mescroll,
    dailyAward
  },
  props: [],
  data() {
    return {
      rankTab: ['实时排行', '上周排行'],
      tabCheck: 0,
      imgUrl: require('../../../../assets/images/guess/no_data_icon.png'),
      userDefaultUrl: require('../../../../assets/images/hd/rank/default.png'),
      noData: false,
      showRules: false,
      showDailyAward: false, //中奖提示
      winPrize: null, //礼品名称
      param: {
        dateType: 0, //0本周，1上周
        isOneself: false
      },
      winTopList: [],
      winTopResult: Object,
      beginTime: 1593360000000, //2020-06-29 00:00:00 后才显示上周排行榜
      endTime: Date,
      hour: 0,
      day: 0,
      min: 0
    };
  },
  mounted() {
    this.LastWeekShow();
    this.queryUserWinGift();
    this.queryWinTop(this.param).then(val => {
      this.countDown();
    });
  },
  methods: {
    queryWinTop(param) {
      console.log(param, '参数');
      return this.$post('/api/quizTop/winTop', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            console.log('查询排行榜');
            if (dataResponse.data.winTop.length > 0) {
              this.winTopList = dataResponse.data.winTop;
              this.winTopResult = dataResponse.data;
              this.endTime = dataResponse.data.endTime;
            } else {
              this.noData = true;
            }
          } else if (dataResponse.code == 1601 || dataResponse.code == 1602 || dataResponse.code == 1603 || dataResponse.code == 1604) {
            this.$toast(dataResponse.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**关闭中奖弹窗 */
    closeDailyAward() {
      this.showDailyAward = false;
    },
    /**  中奖提示 */
    queryUserWinGift() {
      return this.$post('/api/quizTop/queryUserGift')
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200 && dataResponse.data.existWinPrize) {
            if (dataResponse.data.giftType == 6) {
              //星星
              this.winText = '荣登上榜，获得星星';
              this.winPrize = dataResponse.data.amount;
              this.showDailyAward = true;
            } else if (dataResponse.data.giftType == 4) {
              //实物
              this.winText = '获得' + dataResponse.data.giftName;
              // this.winPrize = dataResponse.data.amount;
              this.showDailyAward = true;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //2020-06-29 00:00:00 后才显示上周排行榜
    LastWeekShow() {
      var now = new Date();
      let t = this.beginTime - now.getTime();
      if (t > 0) {
        this.rankTab = ['实时排行'];
      }
    },
    rules() {
      this.showRules = true;
    },
    tabClick(index) {
      console.log('下标', index);
      this.tabCheck = index;
      this.winTopList = [];
      this.userWinTop = {};
      this.param.dateType = index;
      this.queryWinTop(this.param);
      this.countDown();
    },
    countDown() {
      var now = new Date();
      let t = this.endTime - now.getTime();
      if (t > 0) {
        this.day = Math.floor(t / 86400000);
        this.hour = Math.floor((t / 3600000) % 24);
        this.min = Math.floor((t / 60000) % 60);
      }
      if (this.tabCheck == 0) {
        this._interval = setTimeout(() => {
          this.countDown(), console.log('执行');
        }, 5000);
      } else {
        clearInterval(this._interval);
      }
    }
  },
  beforeDestroy() {
    console.log('清除定时器');
    clearInterval(this._interval);
  }
};
</script>


<style lang="scss">
.guessRankPage {
  .nav_bar .back {
    &::before,
    &::after {
      background-color: #fff;
    }
  }
  .no_data p {
    color: #d73a42;
  }
}
</style>

<style lang='scss' scoped>
@import '../../../../assets/common/_base';
@import '../../../../assets/common/_mixin';

.mod_header {
  background-color: initial;
  .slot {
    min-height: 44px;
  }
  .tab {
    @extend .g_v_c_mid;
    @extend .flex_hc;
    background-color: #353447;
    border-radius: $border_radius;
    overflow: hidden;
  }
  .tab li {
    padding: 0 8.4vw;
    font-size: 3.7333vw;
    line-height: 8.5333vw;
    color: #fff;
    &.active {
      background-color: #666695;
    }
  }
  .rules {
    @extend .g_v_mid;
    right: 4.6667vw;
    font-size: 3.4667vw;
    color: #fff;
  }
}

.award {
  @extend .flex_v_justify;
  padding: 6.4vw 4.2667vw 3.7333vw 4.2667vw;
  @include getBgImg('../../../../assets/images/hd/rank/rank_bg.png');
  background-position: 24vw bottom;
  background-size: 48vw;
  color: #fff;
}

.award_info {
  @extend .flex_hc;
  img {
    width: 12vw;
    height: 12vw;
    border-radius: 50%;
  }
}

.award_name {
  padding-left: 4.2667vw;
  font-size: 3.4667vw;
}

.award_rank {
  padding-left: 4.2667vw;
  padding-top: 1.3333vw;
  font-size: 5.3333vw;
  font-style: italic;
  font-weight: bold;
}

.award_gift {
  font-size: 3.4667vw;
  line-height: 4vw;
  text-align: right;
  .gift_name {
    padding-top: 1.6vw;
    font-weight: bold;
  }
}

.award_num {
  font-size: 3.4667vw;
  line-height: 4vw;
  span {
    padding-right: 0.9333vw;
    font-size: 4vw;
  }
}

.main {
  background-color: $color_item;
  border-radius: $border_radius;
  h3 {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #242330;
    @extend .flex;
    padding: 3.6vw 0;
    .rank {
      width: 15.5vw;
      padding-left: 3.2vw;
    }
    .id {
      width: 31.4667vw;
    }
    .num {
      flex: 1;
      text-align: right;
    }
    .reward {
      width: 32vw;
      padding-right: 3.2vw;
      text-align: right;
    }
  }
  h3 span {
    font-size: 3.4667vw;
    font-weight: normal;
    color: #fff;
  }
}
.award_list {
  margin: 0 1.0667vw;
}

.award_list li {
  @extend .flex_hc;
  position: relative;
  height: 10.6667vw;
  margin-bottom: 0.5333vw;
  border-radius: $border_radius;
  color: #fff;
  background: #353447;
  &:first-child,
  &:nth-child(2),
  &:nth-child(3) {
    .rank {
      font-size: 6.6667vw;
      color: #fff;
    }
    .users span,
    .num {
      color: #fff;
    }
    .gift_name {
      color: $color_yellow;
      font-weight: bold;
    }
  }
  &:first-child {
    background-color: rgba(200, 89, 88, 1);
  }
  &:nth-child(2) {
    background: rgba(200, 89, 88, 0.8);
  }
  &:nth-child(3) {
    background: rgba(200, 89, 88, 0.6);
  }
  .rank {
    width: 15.5vw;
    padding-left: 3.2vw;
    font-size: 5.3333vw;
    font-weight: bold;
    font-style: italic;
    color: rgba(255, 255, 255, 0.5);
  }
  .users {
    @extend .flex_hc;
    img {
      width: 4.8vw;
      height: 4.8vw;
      border-radius: 50%;
    }
    span {
      // width: 26.6667vw;
      @include t_nowrap(24vw);
      padding-left: 2.1333vw;
      font-size: 3.4667vw;
      // letter-spacing: 2px;
    }
  }
  .num {
    flex: 1;
    -webkit-flex: 1;
    font-size: 3.4667vw;
    text-align: right;
  }
  .gift_name {
    width: 32vw;
    padding-right: 3.2vw;
    @include t_nowrap(32vw);
    line-height: 1.2;
    font-size: 3.7333vw;
    text-align: right;
  }
}

.ui_pop {
  .rules {
    width: 89.3333vw;
    border-radius: $border_radius;
    background-color: $color_item;
    overflow: hidden;
  }
  h3 {
    position: relative;
    @include getBtn(89.3333vw, 10.4vw, 4.2667vw, #fff, #353447, 0);
    @include getBorder(bottom, #565279);
  }
  .close {
    @extend .g_v_mid;
    right: 0;
    width: 10.4vw;
    height: 10.4vw;
    @include getBgImg('../../../../assets/images/guess/sign_close.png');
    background-size: 4.2667vw;
  }
  .content {
    height: 68.7333vw;
    margin: 3.2vw 4.2667vw;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    p {
      padding-top: 1.3333vw;
      font-size: 4vw;
      line-height: 1.2;
      color: #fff;
    }
  }
}

.rank_footer {
  @extend .flex_v_h;
  height: 15.7333vw;
  padding: 0 2.1333vw;
  p {
    @extend .flex_hc;
    font-size: 3.4667vw;
    color: #fff;
    span {
      @extend .flex_v_h;
      width: 5.0667vw;
      height: 5.0667vw;
      margin: 0 1.0667vw;
      color: $color_yellow;
      border-radius: $border_radius;
      background-color: #3d3b51;
    }
  }
}

.agree_btn {
  display: block;
  @include getBtn(100%, 10.4vw, 4vw, #fff, $color_btn, 0);
}
</style>
