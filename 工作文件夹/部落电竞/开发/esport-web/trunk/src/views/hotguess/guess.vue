<template>
  <section class="mod_guess">
    <div class="guess_item"
      :class="[{'mvp_bg':guessMarkNum==0},{'champion_bg':guessMarkNum==1},{'hero_bg':guessMarkNum==2},{'fivekill_bg':guessMarkNum==3}]">
      <ul>
        <li :class="{'active':guessMarkNum == index}" v-for="(item,index) in matchList.slice(0,4)" :key="index"
          @click="chooseTab(index)">{{item[0].playName.substring(0,4)}}</li>
      </ul>
    </div>
    <div class="guess_con">
      <ul>
        <template v-for="(item,index) in matchList.slice(0,4)">
          <!-- <template v-for="(item,index) in (matchList.slice(0,4),hotUrl)"> -->
          <!-- <li class="mvp_con" v-if="guessMarkNum === 0">
            <h3>{{item[0].subjectName}}</h3>
            <guess-list :type=1 :guessOptionVos="item[0].quizOptions"></guess-list>
          </li>
          <li class="champion_con" v-if="guessMarkNum === 1">
            <h3>{{item[0].subjectName}}</h3>
            <guess-list :type=1 :guessOptionVos="item[0].quizOptions"></guess-list>
          </li>-->
          <!-- <li class="hero_con" :key="index" v-if="index===guessMarkNum">
            <h3>{{item[0].subjectName}}</h3>
            <guess-list :type=2  :quizGame="item[0]"></guess-list>
            <bet-item :quizMatchGame="item[0]" :showStyle="'hot_personal'"></bet-item>
            <div class="hero_img">
              <img v-if="item[0].backImg" :src="item[0].backImg" alt />
            </div>
          </li> -->
          <li class="fivekill_con" :key="index" v-if="index===guessMarkNum">
            <div class="guess_info">
              <h3>
                {{item[0].homeTeamName}}&nbsp;&nbsp;VS&nbsp;&nbsp;{{item[0].awayTeamName}}
                <!-- {{item[0].homeTeamName|subTeamStr}}&nbsp;&nbsp;VS&nbsp;&nbsp;{{item[0].awayTeamName|subTeamStr}} -->
                <span>截止投注：{{item[0].deadLine|dateFmt}}</span>
              </h3>
              <p class="tips">{{item[0].gameNumber|gameFightNum}} {{item[0].subjectName}}</p>
              <bet-item :quizMatchGame="item[0]" :showStyle="'hot_personal'" :locationType="0"></bet-item>
              <!-- <guess-list :type=2  :quizGame="item[0]"></guess-list>-->
            </div>
            <div v-for="(value,key) in hotUrlMap " :key="key">              
              <div class="hero_img" v-if="index+1==key">
                <img :src="value.picUrl" v-on:@click="toUrl(value.location)" alt />
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </section>
</template>

<script>
import guessList from "./components/guess_list.vue";
import betItem from "components/guessbet/bet_item.vue";

export default {
  components: { guessList, betItem },
  props: [],
  filters: {
    gameNum: function(num) {
      return gameFightNum(num);
    }
  },
  data() {
    return {
      guessItem: ["猜MVP", "猜冠军", "猜英雄", "猜五杀"],
      guessMarkNum: 0,
      matchList: [],
      // currItem: null,
      showBet: false,
      hotUrl: [],
      hotUrlMap: {}
    };
  },

  mounted() {
    this.getHotUrl();
    this.getMatchData();
  },
  methods: {
    //跳转地址
    toUrl(url) {
      console.log(url, "跳转地址");
      window.open(url, "_blank");
    },

    //弹出投注窗口
    goBet(index, openFlag) {
      console.log("打开投注", index);
      this.showBet = openFlag;
    },
    //切换tab
    chooseTab(index) {
      this.guessMarkNum = index;
      // this.$refs.guessItem.currIndex=null
      // this.getMatchData();
    },

    //获取赛事数据
    getMatchData() {
      let param = {};
      //查询首页特殊玩法
      param.recommend = 1;
      return this.$post("/api/quiz/match/gameList", param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            this.matchList = dataResponse.data;
            console.log(this.matchList, "this.matchList");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //热点推送图
    getHotUrl() {
      let param = { typeStr: "6" };
      return this.$post("/api/getAdList", param)
        .then(rsp => {
          const dataResponse = rsp.data;
          console.log(dataResponse, "热点推送图");
          this.hotUrl = dataResponse.adList6;
          for (var index in this.hotUrl) {
            this.hotUrlMap[this.hotUrl[index].orderNumber] = this.hotUrl[index];
          }
        })
        .catch(error => {
          console.log(error, "出现异常");
        });
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/common/_base";
@import "../../assets/common/_mixin";

.mod_guess {
  position: relative;
  // z-index: 3;
  display: table;
  margin: 32px auto 0;
  &::after {
    content: "";
    display: table;
    clear: both;
    overflow: hidden;
  }
  .fivekill_con {
    // @include getBgImg("../../assets/images/home/fivekill_bg.png");
  }
  .hero_con {
    @include getBgImg("../../assets/images/home/hero_bg.png");
  }
  .mvp_bg {
    @include getBgImg("../../assets/images/home/mvp.png");
    background-size: 100% auto;
    background-position: top center;
  }
  .champion_bg {
    @include getBgImg("../../assets/images/home/champion.png");
    background-size: 100% auto;
    background-position: top center;
  }
  .hero_bg {
    @include getBgImg("../../assets/images/home/guesshero.png");
    background-size: 100% auto;
    background-position: top center;
  }
  .fivekill_bg {
    @include getBgImg("../../assets/images/home/fivekill.png");
    background-size: 100% auto;
    background-position: top center;
  }
}

.guess_item {
  float: left;
  width: 170px;
  li {
    width: 100%;
    height: 62px;
    padding-left: 38px;
    font-size: 18px;
    line-height: 62px;
    font-weight: bold;
    font-style: italic;
    color: #ffdcd7;
  }
  .active {
    font-size: 24px;
    color: #f3d40c;
  }
}
.guess_con {
  float: left;
  margin-left: 30px;
  li {
    position: relative;
    width: 1041px;
    @include getBgImg("../../assets/images/home/hero_bg.png");
    min-height: 248px;
    h3 {
      position: relative;
      padding-left: 12px;
      font-size: 20px;
      font-weight: 600;
      color: #ffdcd7;
      span {
        padding-left: 34px;
        font-size: 12px;
        color: #dc9255;
        font-weight: 600;
      }
      &::after {
        content: "";
        @extend .g_v_mid;
        left: 0;
        width: 4px;
        height: 14px;
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
    }
    .tips {
      margin-top: 20px;
      font-size: 15px;
      color: #ffdcd7;
    }
  }
  .guess_info {
    position: relative;
    z-index: 2;
  }
  .hero_img {
    position: absolute;
    right: 0;
    top: 0;
    width: 652px;
    height: 248px;
    transform-origin: right bottom;
    transform: skew(-27deg, 0deg);
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: skew(27deg, 0deg);
      transform-origin: right bottom;
    }
  }
  .player_img {
    position: absolute;
    right: 193px;
    bottom: 0;
    width: 278px;
    height: 238px;
    object-fit: cover;
  }
}

.mvp_con,
.champion_con {
  position: relative;
  // width: 1021px;
  margin-left: 20px;
}

.hero_con {
  padding: 53px 0 0 20px;
}

.fivekill_con {
  padding: 26px 0 0 20px;
  // .player_img {
  //   position: absolute;
  //   right: 193px;
  //   bottom: 0;
  //   width: 278px;
  //   height: 238px;
  //   object-fit: cover;
  // }
}
</style>

