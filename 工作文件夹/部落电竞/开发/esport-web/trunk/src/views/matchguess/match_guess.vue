<template>
  <section class="mod_match_guess">
    <mod-title :titleTxt="'赛事竞猜'" :showTab='true' :showPageTab='true'>
      <div class="tab_container  swiper-container">
        <ul class="tab swiper-wrapper">
          <li class="swiper-slide" :class="{active:leagueTab==-1}" @click="changeLeague(null,-1)">全部比赛</li>
          <li class="swiper-slide" :class="{active:leagueTab==index}" @click="changeLeague(item.leagueId,index)"
            v-for="(item,index) in leagueList" :key="index"><span>{{item.leagueName}}</span></li>
        </ul>
      </div>
      <div class="page_tab">
        <span class="left_icon" @click="previousPage()" v-if="requestParam.totalPages>1"></span>
        <div class="page_con">
          <ul class="page_list">
            <li @click="changePage(index+1)" :class="{active:requestParam.pageNo==(index+1)}"
              v-for="(item ,index) in requestParam.totalPages" :key="index">{{index+1}}</li>
          </ul>
        </div>
        <span class="right_icon" @click="nextPage($event)" v-if="requestParam.totalPages>1"></span>
      </div>
    </mod-title>
    <div class="match_con" v-if="showMatchList">
      <ul class="match_screen">
        <!-- 每一屏只显示一页 -->
        <li class="match_page">
          <ul class="match_list">
            <!-- 每一页插8个数据 -->
            <guess-item :matchIndex='index' :matchInfo="item" :currIndex="currIndex" v-for="(item,index) in matchList"
              :key="index" @openMore='openMore'>
            </guess-item>
            <more-guess ref="moreGuess" :matchMoreMark='matchMoreMark'></more-guess>
          </ul>
        </li>
      </ul>
      <div class="to_left_page" @click="previousPage()" v-if="requestParam.pageNo!=1"></div>
      <div class="to_right_page" @click="nextPage()"
        v-if="requestParam.totalPages!=0 && requestParam.pageNo!=requestParam.totalPages "></div>
    </div>
    <div class="no_data" v-else>
      <img src="../../assets/images/icon/no_data_icon.png" alt="">
      <p>暂时没有新的比赛</p>
    </div>
  </section>
</template>

<script>
import Swiper from "swiper";
import modTitle from "../../components/title/title.vue";
import guessItem from "./components/guess_item.vue";
import moreGuess from "./components/more_guess.vue";
import { mapGetters, mapActions } from "vuex";
var spSchdule = null;
var spUpdatTime = 30; //秒，赔率刷新时间
export default {
  components: { guessItem, moreGuess, modTitle },
  props: [],

  data() {
    return {
      matchMoreMark: Number,
      matchList: [], //赛事列表
      morePlayList: [], //更多玩法列表
      leagueList: [], //联赛列表
      leagueTab: -1,
      currSpList: "", //用于刷新赔率
      currIndex: null,
      requestParam: {
        pageNo: 1,
        pageSize: 8,
        totalPages: 0,
        leagueId: null
      },
      showMatchList: true
    };
  },
  computed: {},
  mounted() {
    this.getIndexMatchData();
    this.getLeagueList().then(() => {
      this.$nextTick(() => {
        this.initSwiper();
      });
    });
    //30秒刷新一次
    // let that = this;
    // setInterval(() => {
    //   that.getIndexMatchData();
    // }, 30000);
  },
  methods: {
    /**
     * 加载更多玩法
     */
    openMore(matchId, index, playNo, close) {
      if (playNo != 1) {
        this.getMorePlayByMatchId(matchId, playNo);
      }
      this.currIndex = index;
      if (close) {
        this.matchMoreMark = -1;
      } else {
        this.matchMoreMark = index;
      }

      console.log(this.matchMoreMark, index);
    },

    changePage(pageNo) {
      this.showMatchList = true;
      this.requestParam.pageNo = pageNo;
      this.getIndexMatchData();
      this.clearOpenMore();
      // document.getElementById("today").scrollIntoView();
    },
    /**上一页 */
    previousPage() {
      if (this.requestParam.pageNo == 1) {
        return;
      }
      this.requestParam.pageNo -= 1;

      // 切换tab框移动
      let moveRight = -34 * (this.requestParam.pageNo - 1);
      document
        .getElementsByClassName("page_list")[0]
        .setAttribute("style", "transform:translateX(" + moveRight + "px)");

      this.getIndexMatchData();
      this.clearOpenMore();
    },
    /**下一页 */
    nextPage() {
      if (this.requestParam.pageNo == this.requestParam.totalPages) {
        return;
      }
      this.requestParam.pageNo += 1;

      // 切换tab框移动
      let moveLeft = -34 * (this.requestParam.pageNo - 1);
      document
        .getElementsByClassName("page_list")[0]
        .setAttribute("style", "transform:translateX(" + moveLeft + "px)");

      this.getIndexMatchData();
      this.clearOpenMore();
      // let target =  e.currentTarget.previousElementSibling
      //  var thisLeft = target.offsetLeft - 10;
      //  console.log("v",thisLeft);
      // $(".page_list").animate({ scrollLeft: thisLeft }, 500);
      // let taget = "page_"+this.requestParam.pageNo ;
      // document.getElementById(taget).scrollIntoView();
    },
    clearOpenMore() {
      this.matchMoreMark = -1;
      this.currIndex = null;
    },
    /**联赛筛选 */
    changeLeague(leagueId, index) {
      if (this.leagueTab == index) {
        return;
      }
      this.leagueTab = index;
      if (leagueId) {
        this.requestParam.leagueId = leagueId;
      } else {
        this.leagueTab = -1;
        this.requestParam.leagueId = null;
      }
      this.requestParam.pageNo = 1;

      document
        .getElementsByClassName("page_list")[0]
        .setAttribute("style", "transform:translateX(0)");
      this.matchList = [];
      this.getIndexMatchData();
      this.clearOpenMore();
    },
    /**获取联赛列表 */
    getLeagueList() {
      return this.$post("/api/quiz/match/leagueList")
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            this.leagueList = dataResponse.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**获取首页数据 */
    getIndexMatchData() {
      //清除定时器
      clearInterval(spSchdule);
      let param = {};
      param = this.requestParam;
      return this.$post("/api/quiz/match/indexQuizMatch", param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            console.log(dataResponse.data.dataList);
            this.matchList = dataResponse.data.dataList;
            if (this.matchList.length == 0) {
              this.showMatchList = false;
            } else {
              this.showMatchList = true;
            }
            this.requestParam.totalPages = dataResponse.data.totalPages;
            this.requestParam.pageNo = dataResponse.data.pageNo;
            this.createSpList();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    createSpList() {
      this.currSpList = [];
      this.matchList.forEach(matchInfo => {
        if (matchInfo.quizMathGame.id) {
          this.currSpList = this.currSpList + matchInfo.quizMathGame.id + ",";
        }
      });
      this.currSpList = this.currSpList.substring(
        0,
        this.currSpList.length - 1
      );
      console.log("获取赔率列表", this.currSpList);
      let _this = this;
      spSchdule = setInterval(() => {
        _this.updateMatchSp();
      }, spUpdatTime * 1000);
    },

    /**
     * 定时更新赔率
     */
    updateMatchSp() {
      let param = {};
      param.matchGameIds = this.currSpList;
      return this.$post("/api/quiz/match/updateSp", param)
        .then(rsp => {
          let _this = this;
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            let quizMathGameList = dataResponse.data;
            if (quizMathGameList.length > 0) {
              quizMathGameList.forEach(quizMathGame => {
                _this.matchList.forEach(match => {
                  if (quizMathGame.matchId === match.matchId) {
                    match.quizMathGame = quizMathGame;
                    console.log("更新赛事题目赔率", quizMathGame.matchId);
                    console.log("更新后", match.quizMathGame.matchId);
                  }
                });
              });
            }
            console.log("更新赔率");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**加载更多玩法 */
    getMorePlayByMatchId(matchId, playNo) {
      //先设置为空，清除以前的数据，防止断网等原因，数据残留，造成投注异常
      // this.$refs.moreGuess.morePlayList = [];
      let param = {};
      param.matchId = matchId;
      param.playNo = playNo;
      param.distinctIndex = false;
      return this.$post("/api/quiz/match/gameList", param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            console.log("更多玩法");
            this.morePlayList = dataResponse.data;
            console.log(this.morePlayList);
            this.$refs.moreGuess.morePlayList = this.morePlayList;
            for (let index = 0; index < this.morePlayList.length; index++) {
              const matchInfo = this.morePlayList[index];
              if (matchInfo.length > 0) {
                this.$refs.moreGuess.selectedNum = index;
                return;
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // swiper组件初始化
    initSwiper() {
      let swiper = new Swiper(".tab_container", {
        slidesPerView: "auto"
      });
    }
  }
};
</script>


<style lang='scss' scoped>
@import "../../assets/common/_mixin";
@import "../../assets/common/_base";

.no_data {
  text-align: center;
  padding: 120px 0;
  p {
    padding-top: 20px;
    font-size: 20px;
    color: #ffdcd7;
  }
}

.mod_match_guess {
  display: table;
  margin: 30px auto 0;
}

.match_con {
  position: relative;
  min-height: 350px;
  .match_screen {
    width: 1240px;
    padding-top: 15px;
  }
  .to_left_page,
  .to_right_page {
    @extend .g_v_mid;
    width: 54px;
    height: 134px;
  }
  .to_left_page {
    left: -54px;
    @include getBgImg("../../assets/images/home/to_left_page.png");
  }
  .to_right_page {
    right: -54px;
    @include getBgImg("../../assets/images/home/to_right_page.png");
  }
  .match_list {
    position: relative;
    width: 1240px;
    &::after {
      content: "";
      clear: both;
      overflow: hidden;
      display: table;
    }
    h3 {
      position: relative;
      padding-left: 10px;
      font-size: 14px;
      font-weight: normal;
      color: #ffdcd7;
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
  }
}
</style>
