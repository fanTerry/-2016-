<template>
  <li class="guess_item guessItemPage" :class="{'match_end':matchInfo.matchStatus >=2 ||isUserPlan}" @click="matchType==0 && goUrlPage(matchInfo.matchId)">
    <div class="header">
      <div class="title">
        <div class="game_logo">
          <img :src="matchInfo.videogameId|gameLogo" alt="">
        </div>
        <!-- <span v-if="matchInfo.matchStatus==0">[未开始]</span> -->

        <!-- <span v-if="matchInfo.matchStatus==2">[比赛结束]</span> -->
        <!-- <span v-if="matchInfo.matchStatus==3">[比赛取消]</span> -->
        <p>{{matchInfo.startTime|formatByDay}}&nbsp;&nbsp;{{matchInfo.leagueName}} BO{{matchInfo.gameNumbers}}</p>

      </div>
      <div class="more_options">

        <span v-if="(matchInfo.matchStatus==0 || matchInfo.matchStatus==1) && matchInfo.grounder==2 && !isUserPlan">滚盘</span>
        <span class="start_time" v-if="matchInfo.matchStatus==2 || isUserPlan">{{matchInfo.startTime|formatByTime}}</span>
        <!-- <span>直播</span> -->
      </div>
      <!-- <div class="more_guess" @click="goUrlPage(matchInfo.matchId,matchInfo.quizMathGame.playNo)">
        <span>更多玩法</span>
        <i class="link_icon"></i>
      </div> -->
    </div>
    <div class="con">
      <div class="battle_info">
        <span class="home_team_name" v-if="matchInfo.homeTeamNameAbbr">
          {{matchInfo.homeTeamNameAbbr|formatName(6)}}<i v-if="matchInfo.homeTeamNameAbbr.length > 6">..</i>
        </span>
        <span class="home_team_name" v-else-if="matchInfo.homeTeamName">
          {{matchInfo.homeTeamName|formatName(6)}}<i v-if="matchInfo.homeTeamName.length>6">..</i>
        </span>
        <img :src="matchInfo.homeTeamLogo|getDefaultImg(globalConst.dDmatchTeamDefaultIcon)" alt="">
        <div class="match_status">
          <span class="before" v-if="matchInfo.matchStatus == 0">{{matchInfo.startTime|formatByTime}}</span>
          <span class="live" v-if="matchInfo.matchStatus == 1">LIVE</span>
          <span class="end" v-if="matchInfo.matchStatus == 2&&matchInfo.homeScore!=null">
            <i>{{matchInfo.homeScore}}</i><span class="colon"></span><i>{{matchInfo.awayScore}}</i>
          </span>
          <!-- <p class="join_num" v-if="matchInfo.betUsers">{{matchInfo.betUsers}}人参加</p> -->
          <p class="join_num" v-if="matchInfo.matchStatus!=2">BO{{matchInfo.gameNumbers}}</p>
          <p class="join_num" v-if="matchInfo.matchStatus==2 && matchInfo.homeScore==null">已完赛</p>
          <p class="join_num" v-if="matchInfo.matchStatus==3 ">异常</p>
          <p class="join_num" v-if="matchInfo.matchStatus==4 ">取消</p>
        </div>
        <img :src="matchInfo.awayTeamLogo|getDefaultImg(globalConst.dDmatchTeamDefaultIcon)" alt="">
        <span class="away_team_name" v-if="matchInfo.awayTeamNameAbbr">
          {{matchInfo.awayTeamNameAbbr|formatName(6)}}<i v-if="matchInfo.awayTeamNameAbbr.length>6">..</i>
        </span>
        <span class="away_team_name" v-else-if="matchInfo.awayTeamName">
          {{matchInfo.awayTeamName|formatName(6)}}
          <i v-if="matchInfo.awayTeamName.length>6">..</i>
        </span>
      </div>
    </div>
    <bet-item class="bet_item" v-if="matchType==3" :quizMathGame="matchInfo" :recommendOption="recommendOption"></bet-item>
  </li>

</template>

<script>
import betItem from '../../components/betItem.vue';
import { fmtDate } from '../../../../libs/utils';
export default {
  components: { betItem },
  props: ['type', 'matchInfo', 'matchType','isUserPlan','recommendOption'],
  filters: {
    formatByDay(time) {
      return fmtDate(new Date(time), 'MM-dd');
    },
    formatByTime(time) {
      return fmtDate(new Date(time), 'hh:mm');
    }
  },
  data() {
    return {};
  },
  methods: {
    goUrlPage(matchId) {
      this.$router.push({
        path: '/guess/allGuess',
        query: {
          matchId: matchId
          // playNo: playNo
        }
      });
    },
    //去充值
    toCharge() {
      this.$emit('toCharge');
    }
  }
};
</script>

<style lang="scss">
@import '../../../../assets/common/_base';

// .guessItemPage {
// .battle_team {
//   @extend .flex_hc;
//   > a {
//     flex: 1;
//     -webkit-flex: 1;
//     &:first-child {
//       margin-right: 2.67vw;
//     }
//     &:last-child {
//       margin-left: 2.67vw;
//     }
//   }
// }
// }
</style>


<style lang='scss' scoped>
@import '../../../../assets/common/_base';
@import '../../../../assets/common/_mixin';

.guess_item {
  margin-bottom: 2.1333vw;
  border-radius: 1.3333vw;
  background-color: #fff;
  color: #666;
  &:last-child {
    // margin-bottom: 0;
  }
  &.match_end {
    color: #fff;
    background-color: #912d32;
    .join_num {
      color: #fff;
    }
    .header::before {
      border-color: #b7565c;
    }
  }
}

.header {
  position: relative;
  @extend .flex_v_justify;
  height: 7.4667vw;
  padding: 0 2.1333vw 0 3.2vw;
  @include getRadiusBorder(#ddd, bottom, 0);
  .title {
    @extend .flex_hc;
    flex: 1 auto;
    -webkit-flex: 1 auto;
    font-size: 0;
    white-space: nowrap;
    overflow: hidden;
    p {
      display: inline-block;
      vertical-align: middle;
      @include t_nowrap(70%);
      font-size: 3.7334vw;
      line-height: 1.2;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      flex: none;
      -webkit-flex: none;
      padding-right: 2.67vw;
      font-size: 3.2vw;
      color: #a86459;
    }
  }
  .game_logo {
    @extend .flex_v_h;
    width: 4.2667vw;
    height: 4.2667vw;
    margin-right: 2.1333vw;
    background-color: #32191e;
    border-radius: 50%;
    img {
      height: 100%;
      object-fit: contain;
    }
  }

  .more_options {
    flex: none;
    -webkit-flex: none;
    @extend .flex_hc;
    span {
      margin-left: 2.1333vw;
      padding: 1.0667vw 2.4vw;
      font-size: 2.6667vw;
      color: #333;
      @include getRadiusBorder(#999, all, 6px);
    }
    .start_time {
      color: rgba(255, 255, 255, 0.5);
      &::before {
        display: none;
      }
    }
  }
  .more_guess {
    flex: none;
    -webkit-flex: none;
    width: 18vw;
    font-size: 0;
    color: #d6a638;
    white-space: nowrap;
    text-align: right;
    span {
      font-size: 3.2vw;
      vertical-align: middle;
    }
  }
  .link_icon {
    display: inline-block;
    vertical-align: middle;
    width: 3.2vw;
    height: 3.2vw;
    margin-left: 1.07vw;
    @include getBgImg('../../../../assets/images/guess/link_icon.png');
    background-size: 100% 100%;
  }
}

.con {
  padding: 4vw 2.67vw;
}

.battle_info {
  @extend .flex_v_h;
  width: 100%;
  text-align: center;
  img {
    width: 10.4vw;
    height: 10.4vw;
    border-radius: 50%;
    object-fit: contain;
  }
}

.away_team_name,
.home_team_name {
  width: 16vw;
  font-size: 3.7333vw;
  font-weight: bold;
  white-space: nowrap;
  i {
    font-size: 2.6667vw;
    font-weight: bold;
  }
}

.away_team_name {
  margin-left: 2.1333vw;
  text-align: left;
}

.home_team_name {
  margin-right: 2.1333vw;
  text-align: right;
}

.match_status {
  min-width: 24.5333vw;
  padding: 0 5.8667vw;
}

.before,
.live {
  @extend .flex_v_h;
  width: 12.8vw;
  height: 4vw;
  margin: 0 auto;
  font-size: 3.2vw;
  border-radius: 2vw;
}

.before {
  line-height: 4vw;
  color: #333;
  border: 1px solid #979797;
}

.live {
  color: #fff;
  background-color: #d43941;
}

.end {
  @extend .flex_v_h;
  position: relative;
  color: #fff;
  i {
    width: 6.4vw;
    padding: 0 1.7334vw;
    font-size: 5.0667vw;
  }
  .colon {
    @extend .g_v_c_mid;
    height: 100%;
    &::before,
    &::after {
      content: '';
      @extend .g_c_mid;
      width: 0.5334vw;
      height: 0.5334vw;
      background-color: #fff;
      border-radius: 50%;
    }
    &:before {
      top: 20%;
    }
    &:after {
      bottom: 20%;
    }
  }
}

.join_num {
  padding-top: 1.0667vw;
  font-size: 2.6667vw;
  line-height: 3.2vw;
  color: #666;
}

.bet_item {
  margin-top: 1.8667vw;
  padding: 0 2.67vw 3.2vw;
}
</style>
