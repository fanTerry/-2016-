<template>
  <div class="ui_pop " v-if="showFlag">
    <div class="Page hotGamePage" ref='hotGamePage'>
      <h3><a class='close' @click="closePop()"></a></h3>
      <div class='match_team'>
        <img :src="matchInfo.homeTeamLogo|getDefaultImg(globalConst.dDmatchTeamDefaultIcon)" alt="">
        <div class="info">
          <p class="title">{{matchInfo.startTime|formatByDay}} {{matchInfo.leagueName}} BO {{matchInfo.gameNumbers}}</p>
          <p class="time">{{matchInfo.startTime|formatByTime}}</p>
        </div>
        <img :src="matchInfo.awayTeamLogo|getDefaultImg(globalConst.dDmatchTeamDefaultIcon)" alt="">
      </div>
      <bet-item class="bet_item" :quizMathGame="matchInfo.quizMathGame"></bet-item>
      <!-- <div class="att_tips">
        <span class="select_icon"></span>请选择一个支持的选项
      </div> -->
      <div class="exchange_btn">
        <!-- 加disabled置为不可点击 -->
        <a>请选择一个支持的选项</a>
      </div>
    </div>
  </div>
</template>

<script>
import betItem from "../../components/betItem.vue";
import { fmtDate } from "../../../../libs/utils";

export default {
  components: { betItem },
  props: [],
  filters: {
    formatByDay(time) {
      return fmtDate(new Date(time), "MM-dd");
    },
    formatByTime(time) {
      return fmtDate(new Date(time), "hh:mm");
    }
  },
  data() {
    return {
      showFlag: false,
      matchInfo: {}
    };
  },
  mounted() {
    this.getHotGame();
  },
  methods: {
    closePop() {
      this.showFlag = false;
    },
    getHotGame() {
      let param = {};
      param.agentId = this.$route.query.agentId;
      param.clientType = this.$route.query.clientType;
      return this.$post("/api/quiz/match/recommendGameList", param)
        .then(rsp => {
          console.log(rsp, param);
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            if (dataResponse.data.length) {
              this.showFlag = true;
              this.matchInfo = dataResponse.data[0];
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //去充值
    toCharge() {
      this.$emit("toCharge");
    }
  }
};
</script>


<style lang="scss">
.hotGamePage {
  .bet_item {
    margin-top: 5.0667vw;
    padding: 0 4.5333vw;
  }
  .battle_team {
    display: flex;
    display: -webkit-flex;
    a {
      flex: 1 !important;
      -webkit-flex: 1 !important;
      padding: 2.1333vw 0;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>


<style lang='scss' scoped>
@import "../../../../assets/common/_base";
@import "../../../../assets/common/_mixin";

.Page {
  position: relative;
  width: 94.6667vw;
  height: 84vw;
  background: #391a1c;
  &::before {
    content: "";
    position: absolute;
    right: 0;
    top: -24.3333vw;
    width: 97.3333vw;
    height: 43.2vw;
    @include getBgImg("../../../../assets/images/guess/hot_game_bg.png");
  }
}

h3 {
  position: relative;
  width: 100%;
  height: 8.8vw;
}

.close {
  position: absolute;
  right: 2.67vw;
  top: 1.6vw;
  width: 5.33vw;
  height: 5.33vw;
  @include getBgImg("../../../../assets/images/guess/close.png");
  background-size: contain;
}

.match_team {
  position: relative;
  @extend .flex_v_justify;
  margin: 9.8667vw 4.5333vw 0;
  padding: 1.8667vw 2.9333vw;
  border-radius: 8vw;
  background: linear-gradient(
    to right,
    rgba(126, 52, 43, 1),
    rgba(57, 26, 28, 1),
    rgba(50, 76, 129, 1)
  );
  background: -webkit-linear-gradient(
    left,
    rgba(126, 52, 43, 1),
    rgba(57, 26, 28, 1),
    rgba(50, 76, 129, 1)
  );
  img {
    width: 12.2667vw;
    height: 12.2667vw;
    border-radius: 50%;
  }
  .info {
    @extend .g_v_c_mid;
    text-align: center;
  }
  .title {
    font-size: 3.7333vw;
    color: #fedcd7;
  }
  .time {
    display: inline-block;
    margin-top: 1.7333vw;
    padding: 1.2vw 3.4667vw;
    font-size: 3.7333vw;
    color: #fedcd7;
    background-color: #482527;
    border-radius: 3.0667vw;
  }
}

.exchange_btn {
  margin: 3.2vw 4.5333vw 4.5333vw;
  padding: 2.67vw 0 4vw;
  @include getBgImg("../../../../assets/images/guess/shadow.png");
  background-size: 100% auto;
  background-position: top center;
  text-align: center;
  a {
    display: block;
    margin: 0 auto;
    border-radius: 3px;
    line-height: 8.8vw;
    font-size: 3.73vw;
    color: #fedcd7;
    background: linear-gradient(to bottom, #df2f26, #86171a);
    background: -webkit-linear-gradient(top, #df2f26, #86171a);
  }
}

.att_tips {
  @extend .flex_hc;
  padding: 3.2vw 1.6vw 3.2vw 4.5333vw;
  font-size: 3.4667vw;
  color: #ef4336;
}

.select_icon {
  width: 3.7333vw;
  height: 3.7333vw;
  margin-right: 1.6vw;
  border-radius: 50%;
  @include getBgImg("../../../../assets/images/guess/select.png");
}
</style>
