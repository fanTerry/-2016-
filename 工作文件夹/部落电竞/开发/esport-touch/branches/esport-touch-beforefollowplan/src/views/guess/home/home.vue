<template>
  <div class="Page guessPage" v-if='readyFlag'>
    <mescroll ref="mescroll" @downCallback="downCallback" @upCallback="upCallback" @mescrollInit="mescrollInit" :isShowEmpty="false">
      <div class="main" id="mainId">
        <!-- 直播位 -->
        <section class="mod_live" v-if="bannerUrlList.length > 0 ">
          <div class="live" v-if="false">
            <h3>2020年LPL职业联赛 总决赛</h3>
            <video src=""></video>
          </div>
          <!-- 运营位 -->
          <banner ref="banner" :isTitle='true' class="banner" v-if="bannerUrlList.length > 0 && isKeep" :adList='bannerUrlList' @toPop="toPop">
            <h3 slot-scope="item">{{item.data.title}}</h3>
          </banner>
        </section>
        <!-- 跑马灯 -->
        <broad-cast :prizeList='prizeList' v-if="prizeList.length > 0 && isKeep"></broad-cast>
        <!-- 游戏切换 -->
        <nav class="match_tab">
          <ul class="list">
            <li :class="{'active':!leagueInfo.requestParam.videoGameId}" @click="changeGame(0,$event)">全部游戏</li>
            <li :class="{'active':leagueInfo.requestParam.videoGameId==item.index}" v-for=" (item, index) in leagueInfo.gameList" :key="index" @click="changeGame(item.index,$event)">
              {{item.description}}
            </li>
          </ul>
        </nav>
        <!-- 赛事列表 -->
        <ul class="guess_list" id="guess_list" v-if="leagueInfo.matchList.length != 0">
          <guess-item class="guess_item" :type=1 :matchInfo="item" v-for="(item,index) in leagueInfo.matchList" :key="index" @toCharge="toCharge">
          </guess-item>
        </ul>

        <!-- 已完结赛事列表 -->

        <!-- 没有数据时展示 -->
        <no-data v-if="noData" :text="'暂无新比赛'" :imgUrl='require("../../../assets/images/guess/no_data_icon.png")'>
        </no-data>
        <!-- 点击加上active -->
        <a class="refresh_btn" :class="spUpdate.reflushFlag?'active':''" @click="onClickRefresh()"></a>
      </div>
    </mescroll>
    <!-- 微信中引导浏览器打开 -->
    <div class="ui_pop to_browser_pop" v-show="isBrowserOpen">
      <img src="../../../assets/images/guess/to_browser.png" alt="">
    </div>
    <!-- 首页焦点赛事-后续优化 -->
    <hot-game @toCharge="toCharge"></hot-game>
    <!-- 中奖弹窗 -->
    <daily-award v-if="popUps.award.showDailyAward" @closeDailyAward="closeDailyAward" :winPrize="popUps.award.winPrize"></daily-award>
    <!-- 充值弹窗 -->
    <recharge-pop v-if="popUps.payPops.showRechargePop" @closeRechargePop="closeRechargePop" @getUserWallet="getUserWallet" @openPopAlert="openPopAlert">
    </recharge-pop>
    <!-- 充值完成支付的弹窗,目前微信H5用上 -->
    <pop-Alert :showPop="popUps.payPops.showPop" @close="popUps.payPops.showPop=false" @confirm="confirm" btnTxt1="已取消" btnTxt2="已完成支付" type="2">
      <p>请确认支付是否已完成</p>
    </pop-Alert>
    <footer class="mod_footer">
      <tabbar></tabbar>
    </footer>
  </div>
</template>

<script>
import guessItem from './components/guessItem.vue';
import { mapGetters, mapActions } from 'vuex';
import mescroll from '../../../components/common/mescroll.vue';
import banner from '../../../components/header/banner/swiper.vue';
import broadCast from './components/broadCast.vue';
import hotGame from './components/hotGame.vue';
import dailyAward from '../dailyAward.vue';
import rechargePop from '../recharge/recharge.vue';
import popAlert from '../../../components/pop_up/pop_alert.vue';
import { getQueryString } from '../../../libs/utils';
import noData from '../../../components/no_data/index.vue';
import tabbar from '../../../components/tabbar/index.vue';
import utils from '../../../libs/utilsTool';
//定时任务
var spSchdule = null;
export default {
  components: {
    guessItem,
    mescroll,
    banner,
    broadCast,
    hotGame,
    dailyAward,
    rechargePop,
    popAlert,
    noData,
    tabbar
  },
  props: [],
  data() {
    return {
      //弹窗集合
      popUps: {
        //中奖弹窗
        award: {
          showDailyAward: false, //提示
          winPrize: 0 //中奖总金额
        },
        //支付
        payPops: {
          showRechargePop: false, //支付弹窗
          showPop: false
        }
      },
      //联赛数据  leagueInfo.
      leagueInfo: {
        matchList: [], //赛事列表
        currSpList: '', //用于刷新赔率
        currPageSize: 10,
        gameList: [],
        loadMore: true, //加载更多
        queryStartHour: 24, //单位小时，查询开始时间，24小时之前
        requestParam: {
          pageNo: 1,
          pageSize: 10,
          totalPages: 0,
          leagueId: null,
          videoGameId: null
        }
      },
      //赔率刷新
      spUpdate: {
        spUpdatTime: 5, //赔率刷新间隔是啊集 单位秒
        reflushFlag: false
      },
      noData: false,
      stopReapeat: false,
      bannerUrlList: [], // 广告
      readyFlag: false,
      prizeList: [],
      isBrowserOpen: false, //是否是浏览器打开
      isKeep: false //判断进入页面状态
    };
  },
  created() {},
  computed: {
    ...mapGetters({
      getBetData: 'getBetData',
      getGuessData: 'getGuessData',
      userInfo: 'getUserInfo'
    })
  },
  watch: {
    getBetData(val) {
      if (val.toReflushBalance) {
        //下单完刷新余额
        this.getUserWallet();
      }
    }
  },
  mounted() {
    this.webSocketConfig();
    if (this.checkOpenH5InWx()) {
      this.isBrowserOpen = true;
    }
    //预测banner广告
    this.getBannerUrl();
    this.getGameList();
    //提示中奖弹窗
    this.getDailyAward();
    // 跑马灯数据
    this.prizeCarousel();
  },
  activated() {
    this.intoWebsocketRoom();
    if (this.checkOpenH5InWx()) {
      this.isBrowserOpen = true;
    }
    this.dataRefresh();
    this.isKeep = true;
  },
  deactivated() {
    this.isKeep = false;
  },
  beforeRouteLeave(to, from, next) {
    let url = to.fullPath;
    console.log(' beforeRouteLeave !', url);
    if (url.search('allGuess') != -1 || url.search('guess/home') != -1) {
      //进入详情页不断开
      console.log('进入-allGuess');
    } else {
      console.log(' this.closeWebsocket()');
      //主动关闭websocket
      this.closeWebsocket();
    }
    next();
  },

  destroyed() {
    //关闭websocket
    this.closeWebsocket();
  },
  methods: {
    ...mapActions(['setUserInfo']),
    closeWebsocket() {
      console.log('主动断开');
      this.socketGuess.lockReconnect = true;
      this.socketGuess.isConneted = false;
      this.socketGuess.heartCheck.reset();
      this.socketGuess.websocketclose();
    },
    //进入赛事场景
    intoWebsocketRoom() {
      this.socketGuess.lockReconnect = false;
      let userId = this.socketGuess.socketObeject.userId;
      // if (userId == null) {
      //   userId = this.userInfo.userId;
      // }
      var initScene = this.socketGuess.getHomeRoomSceneMsg(userId);
       this.socketGuess.socketObeject.currContextObject = this;
      this.socketGuess.socketObeject.initScene = initScene;
      console.log('websock', this.socketGuess.isConneted);
      if (this.socketGuess.isConneted) {
        this.socketGuess.toSendSocketMessage(initScene);
      } else {
        console.log('打开wsSocket');
        this.openAndinitWebSocket();
      }
    },
    webSocketConfig() {
      //监听websocket推送
      this.$bus.$on('webMessage', data => {
        this.handleUpdateData(data);
      });
      //断线重连重连
      // this.$bus.$on("reconnect", data => {
      //   //判断在哪个房间重连
      //   console.log("initScene", this.socketGuess.socketObeject.initScene);
      //   this.openAndinitWebSocket();
      // });
    },

    //处理webSocket推送的数据
    handleUpdateData(data) {
      if (data.execType == 12) {
        console.log('连接成功');
        return;
      }
      let matchResponse = JSON.parse(data.playload);
      if (data.execType == 19) {
        let deleteArray = []; // 临时存放可能需要移动的数据的下标
        this.leagueInfo.matchList.forEach((matchInfo, k) => {
          if (matchInfo.matchId == matchResponse.matchId) {
            if (data.matchType == 'match_game') {
              //以下赔率更新暂停使用
              // if (matchResponse.data && matchResponse.data.length > 0) {
              //   matchResponse.data.forEach(quizGame => {
              //     if (matchInfo.quizMathGame.id == quizGame.matchGameId) {
              //       matchInfo.quizMathGame.status = quizGame.status;
              //       matchInfo.quizMathGame.suspended = quizGame.suspended;
              //       // matchInfo.quizMathGame.visible = matchResponse.data.visible
              //     }
              //   });
              // }
            } else {
              //  matchResponse.suspended == 1  matchResponse.visible == 0
              // 需要拼接完结赛事列表最后的
              if (matchInfo.matchStatus != matchResponse.status && matchResponse.status >= 2) {
                deleteArray.push(k);
              }
              //当前首页只更新赛事状态
              if (matchResponse.status != null) {
                matchInfo.matchStatus = matchResponse.status;
              }

              if (matchResponse.homeScore != null) {
                matchInfo.homeScore = matchResponse.homeScore;
              }
              if (matchResponse.awayScore != null) {
                matchInfo.awayScore = matchResponse.awayScore;
              }
            }
          }
        });
        //根据索引删掉元素
        let delObejectArray = []; //临时存放需要移动的数据
        if (deleteArray.length > 0) {
          // console.log("deleteArray", deleteArray);
          for (const index of deleteArray) {
            // let element = {};
            // Object.assign(deleteArray[index], element)
            let gameObject = this.leagueInfo.matchList[index];
            delObejectArray.push(gameObject);
            this.leagueInfo.matchList.splice(index, 1);
          }
          this.leagueInfo.matchList = this.removeByindexArr(this.leagueInfo.matchList, delObejectArray);
          // console.log("delObejectArray", delObejectArray);
        }
        //当已经是最后一页,把删除掉的元素拼接到最后一页末尾
        let currPage = this.leagueInfo.requestParam.pageNo;
        let totalPage = this.leagueInfo.requestParam.totalPages;
        //如果当前判断翻到最后一页，把移动的数据拼接到末尾，否则不做处理
        if (currPage == totalPage) {
          if (delObejectArray.length > 0) {
            this.leagueInfo.matchList = this.leagueInfo.matchList.concat(delObejectArray);
          }
        }
      }
    },
    //根据下标数组删除元素
    removeByindexArr(elementArr, indexArr) {
      var newarr = [];
      elementArr.forEach(function(element, index) {
        if (!indexArr.includes(index)) {
          newarr.push(element);
        }
      });
      // console.log("newarr", newarr);
      return newarr;
    },

    /** 打开websocket*/
    openAndinitWebSocket() {
      console.log('获取websocket');
      if (this.socketGuess.stopRepeat) {
        return;
      }
      this.socketGuess.stopRepeat = true;
      return this.$post('/api/user/getUserWebsocket')
        .then(rsp => {
          const dataResponse = rsp;
          console.log(dataResponse);
          this.socketGuess.socketObeject.socketUrl = dataResponse.data.socketUrl;
          this.socketGuess.socketObeject.userId = dataResponse.data.userId;
          var initScene = this.socketGuess.getHomeRoomSceneMsg(this.socketGuess.socketObeject.userId);
          this.socketGuess.socketObeject.initScene = initScene;
          console.log("首页",this.socketGuess.socketObeject);
          this.socketGuess.initWebSocket(this.socketGuess.socketObeject, this);
          console.log('初始化连接');
          this.socketGuess.stopRepeat = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 签到更新钱包余额
     */
    updateWallet(wallet) {
      this.setUserInfo({
        ...this.userInfo,
        ableRecScore: wallet
      });
    },
    // 跑马灯数据请求
    prizeCarousel() {
      return this.$post('/api/quiz/record/broadcastList')
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            // console.log(dataResponse.data, "顶部获奖跑马灯");
            this.prizeList = dataResponse.data;
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
      this.leagueInfo.matchList = [];
      this.leagueInfo.requestParam.pageNo = 1;
      this.getIndexMatchData().then(data => {
        this.mescroll.endSuccess(this.leagueInfo.currPageSize, this.leagueInfo.loadMore);
      });
    },
    upCallback() {
      console.log('上拉加载更多');
      console.log('leagueInfo.loadmore');
      this.leagueInfo.requestParam.pageNo += 1;
      this.getIndexMatchData().then(data => {
        this.mescroll.endSuccess(this.leagueInfo.currPageSize, this.leagueInfo.loadMore);
      });
    },
    /** 中奖弹窗*/
    getDailyAward() {
      console.log('mountedmounted');
      return this.$post('/api/starNum/queryWinPrize')
        .then(rsp => {
          const dataResponse = rsp;
          console.log(dataResponse, '查询中奖弹窗返回');
          console.log(dataResponse.data.existWinPrize, '是否有中奖纪录');
          if (dataResponse.code == 200 && dataResponse.data.existWinPrize == true) {
            this.popUps.award.winPrize = dataResponse.data.winPrize;
            this.popUps.award.showDailyAward = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**关闭中奖弹窗 */
    closeDailyAward() {
      this.popUps.award.showDailyAward = false;
    },
    /**获取游戏列表 */
    getGameList() {
      // this.mescroll.showDownScroll();
      return this.$post('/api/quiz/match/videoGames')
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            this.leagueInfo.gameList = dataResponse.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeGame(videoGameId, e) {
      if (videoGameId == 0) {
        this.leagueInfo.requestParam.videoGameId = null;
      } else {
        this.leagueInfo.requestParam.videoGameId = videoGameId;
      }
      this.leagueInfo.requestParam.pageNo = 1;
      this.leagueInfo.matchList = [];

      // $('p.upwarp-nodata').each(function(index, ele) {
      //   console.log(ele);
      //   $(ele).hide();

      //   //
      // });

      this.getIndexMatchData().then(data => {
        this.mescroll.endSuccess(this.leagueInfo.currPageSize, this.leagueInfo.loadMore);
        $('.upwarp-nodata').hide();
        // setTimeout(() => {

        // }, 100);
      });
      this.scrollTarget(e.currentTarget.previousElementSibling);
    },
    scrollTarget(target) {
      if (!target) {
        return;
      }
      var thisLeft = target.offsetLeft - 20;
      // console.log(thisLeft, "thisLeft");
      $('.list').animate({ scrollLeft: thisLeft }, 500);
    },
    getStartTime() {
      let timestamp = new Date().getTime();
      timestamp = timestamp - this.leagueInfo.queryStartHour * 60 * 60 * 1000;
      //yyyy-MM-dd HH:mm:ss
      var datebefore = new Date(timestamp);
      return utils.fmtDate(datebefore, 'yyyy-MM-dd hh:mm:ss');
    },
    getIndexMatchData() {
      let param = {};
      param = this.leagueInfo.requestParam;
      param.startTime = this.getStartTime();
      return this.$post('/api/quiz/match/indexQuizMatch', param)
        .then(rsp => {
          const dataResponse = rsp;
          this.stopReapeat = false;
          if (dataResponse.code == 200) {
            let dataList = dataResponse.data.dataList;
            if (dataList) {
              this.leagueInfo.currPageSize = dataList.length;
            }
            this.leagueInfo.loadMore = dataResponse.data.hasNext;
            this.leagueInfo.matchList = this.leagueInfo.matchList.concat(dataList);
            this.leagueInfo.requestParam.totalPages = dataResponse.data.totalPages;
            this.leagueInfo.requestParam.pageNo = dataResponse.data.pageNo;
            // this.createSpList();
          }
          if (this.leagueInfo.matchList.length > 0) {
            this.noData = false;
          } else {
            this.noData = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    refreshFirstData() {
      if (this.leagueInfo.matchList.length == 0) {
        return;
      }
      let param = {};
      param.pageNo = 1;
      param.pageSize = this.leagueInfo.requestParam.pageNo * this.leagueInfo.requestParam.pageSize;
      param.leagueId = this.leagueInfo.requestParam.leagueId;
      param.videoGameId = this.leagueInfo.requestParam.videoGameId;

      return this.$post('/api/quiz/match/indexQuizMatch', param)
        .then(rsp => {
          const dataResponse = rsp;
          this.stopReapeat = false;
          if (dataResponse.code == 200) {
            let dataList = dataResponse.data.dataList;
            if (dataList.length == 0) {
              return;
            }
            // let tempList = this.leagueInfo.matchList.slice(this.leagueInfo.requestParam.pageSize);
            this.leagueInfo.matchList = dataList;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    createSpList() {
      this.leagueInfo.currSpList = [];
      this.leagueInfo.matchList.forEach(matchInfo => {
        if (matchInfo.quizMathGame.id) {
          this.leagueInfo.currSpList = this.leagueInfo.currSpList + matchInfo.quizMathGame.id + ',';
        }
      });
      console.log('获取赔率列表', this.leagueInfo.currSpList);
    },

    goUrlPage(url) {
      this.$router.push({
        path: url,
        query: {}
      });
    },
    onScroll() {
      //可滚动容器的高度
      let innerHeight = document.querySelector('#guess_list').clientHeight;
      //屏幕尺寸高度
      let outerHeight = document.querySelector('#mainId').clientHeight;
      //可滚动容器超出当前窗口显示范围的高度
      let scrollTop = document.querySelector('#main').scrollTop;
      if (innerHeight < outerHeight + scrollTop + 30) {
        //加载更多操作
        if (!this.leagueInfo.loadMore) {
          return;
        }
        if (this.stopReapeat) {
          return;
        }
        this.stopReapeat = true;
        console.log('leagueInfo.loadmore');
        this.leagueInfo.requestParam.pageNo += 1;
        this.getIndexMatchData();
      }
    },
    //查询设置用户钱包
    getUserWallet() {
      return this.$post('/api/starNum/queryStarNum')
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            console.log(dataResponse.data.ableRecScore, '获取用户的星星');
            this.setUserInfo({
              ...this.userInfo,
              recScore: dataResponse.data.recScore,
              giftRecScore: dataResponse.data.giftRecScore,
              ableRecScore: dataResponse.data.ableRecScore,
              nickName: dataResponse.data.nickName,
              icon: dataResponse.data.icon
            });

            console.log(this.userInfo);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    dataRefresh() {
      this.getUserWallet();
    },
    //预测banner广告
    getBannerUrl() {
      let param = { typeStr: '7' };
      return this.$post('/api/getAdList', param)
        .then(rsp => {
          this.readyFlag = true;
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            console.log(dataResponse, '广告位置');
            this.bannerUrlList = dataResponse.data.adList7;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    toCharge() {
      this.popUps.payPops.showRechargePop = true;
    },
    /**关闭支付弹窗 */
    closeRechargePop() {
      this.popUps.payPops.showRechargePop = false;
    },
    toLocation(href) {
      if (href != '') {
        window.location.href = href;
      }
    },
    openPopAlert() {
      this.popUps.payPops.showPop = true;
    },
    /**h5支付后 */
    confirm() {
      this.popUps.payPops.showPop = false;
      this.getUserWallet();
    },
    //跳转功能弹窗
    toPop(location) {
      //1：充值弹窗
      if (location == 1) {
        this.toCharge();
      }
    },
    checkOpenH5InWx() {
      //是否在微信中打开账号密码登录的H5
      var clientType = this.$route.query.clientType;
      var biz = this.$route.query.biz;
      if (clientType == 6 && biz == 1) {
        let u = navigator.userAgent;
        if (u.toLowerCase().match(/MicroMessenger/i) != 'micromessenger') {
          //不是微信打开
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    //刷新数据
    onClickRefresh() {
      this.dataRefresh();
      if (this.spUpdate.reflushFlag) {
        //数据加载防重复点击加载 以及 0.5秒刷新按钮动画延迟
        return;
      }
      this.spUpdate.reflushFlag = true;
      setTimeout(() => {
        this.spUpdate.reflushFlag = false;
      }, 500);
      this.downCallback();
    }
  }
};
</script>

<style lang="scss">
.guessPage {
  .swiper-pagination {
    bottom: 2.6667vw;
    left: initial;
    right: 4vw;
    width: auto;
  }

  .mescroll-upwarp .upwarp-nodata {
    color: #fff;
  }
  .no_data img {
    display: none;
  }
  .mod_live {
    video,
    .banner img {
      width: 89.3333vw;
      height: 45.0667vw;
      border-radius: 1.3333vw;
    }
  }
}
</style>


<style lang='scss' scoped>
@import '../../../assets/common/_base';
@import '../../../assets/common/_mixin';

.Page,
.main {
  overflow: visible;
  background: linear-gradient(to bottom, #fff 0%, #fff 42.1333vw, $color_main 42.1333vw, $color_main 100%);
  background: -webkit-linear-gradient(top, #fff 0%, #fff 42.1333vw, $color_main 42.1333vw, $color_main 100%);
}

.mod_footer {
  background-color: #fff;
}

.mod_header {
  background-color: #321919;
  h2 {
    line-height: 11.73vw;
    font-size: 4.8vw;
    font-weight: normal;
    color: #fedcd7;
    text-align: center;
    &::after {
      content: '';
      position: relative;
      top: 3px;
      margin-left: 1.8vw;
      @include getTriangle(5px, #fedcd7, down);
    }
    &.active {
      &::after {
        position: relative;
        top: -3px;
        @include getTriangle(5px, #fedcd7, up);
      }
    }
  }
}

// .banner {
//   height: 36vw;
//   margin: 2.6667vw;
// }

.mod_live {
  margin: 1.0667vw 4.2667vw 0;
  padding: 1.0667vw;
  border-radius: 1.3333vw;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  background: $color_main;
  h3 {
    padding: 1.3334vw 0 2.4vw;
    font-size: 4vw;
    color: #fff;
    font-weight: bold;
    text-align: center;
  }
}

.mod_award {
  @extend .flex_hc;
  margin: 1.8667vw 4.2667vw 0;
  background-color: #fff;
  border-radius: 0.8vw;
}

.horn_icon {
  width: 5.3333vw;
  height: 5.3333vw;
  @include getBgImg('../../../assets/images/guess/horn.png');
}

.horn_close {
  width: 4.8vw;
  height: 4.8vw;
  @include getBgImg('../../../assets/images/guess/horn_close.png');
}

.winner_scroll {
  flex: 1;
  -webkit-flex: 1;
  height: 8vw;
  overflow: hidden;
  li {
    @extend .flex_v_h;
    padding: 0 2.6667vw 0 2.2667vw;
    color: #333;
    span {
      font-size: 3.7333vw;
      line-height: 1.2;
    }
    .winner_name {
      @include t_nowrap(20vw);
      padding: 0 1.8667vw;
      color: $color_main;
    }
    .award_value {
      @include t_nowrap(30.3333vw);
      padding: 0 1.8667vw;
      font-weight: bold;
      color: $color_main;
    }
  }
  .notice {
    @include t_nowrap(100%);
  }
}

.match_tab {
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 1;
  margin: 1.0667vw 4.2667vw 0;
  height: 12.8vw;
  overflow: hidden;
  background-color: $color_main;
  ul {
    height: calc(100% + 6px);
    font-size: 0;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
  li {
    display: inline-block;
    margin-right: 7.7333vw;
    padding: 4.2667vw 0;
    font-size: 3.7333vw;
    color: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
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

.league_tab {
  position: relative;
  ul {
    @extend .g_c_mid;
    position: absolute;
    z-index: 10;
    top: 100%;
    width: 100%;
    background-color: #4c2723;
    box-shadow: 0 14px 14px 0px rgba(0, 0, 0, 0.5);
    &::after {
      content: '';
      @extend .g_c_mid;
      top: -9px;
      @include getTriangle(5px, #4c2723, up);
    }
  }
  li {
    line-height: 10.67vw;
    font-size: 4.8vw;
    color: #ffe9e9;
    @include getBorder(bottom, #703b35);
    text-align: center;
    &:last-child {
      background: none;
    }
  }
}

.navBar {
  @extend .flex_v_justify;
  height: 12vw;
  padding-left: 2.67vw;
  @include getBorder(top, #4e261e);
}

.users {
  @extend .flex_hc;
  img {
    width: 7.7333vw;
    height: 7.7333vw;
    margin-right: 1.3333vw;
    border-radius: 50%;
    object-fit: cover;
  }
}

.user_name {
  font-size: 2.9333vw;
  color: #fedcd7;
}

.user_assets {
  @extend .flex_hc;
  padding: 1.3333vw 2.4vw 1.3333vw 0.9333vw;
  font-size: 2.6667vw;
  color: #fedcd7;
  white-space: nowrap;
  background-color: #1f1212;
  border: 1px solid #4e2823;
  border-radius: 4vw;
  span {
    margin: 0 1.8667vw;
    font-size: 3.7333vw;
    color: #fff300;
  }
  img {
    width: 5.6vw;
    height: 5.6vw;
    margin-right: 0;
    object-fit: contain;
  }
  .add {
    width: 3.3333vw;
    height: 3.3333vw;

    @include getBgImg('../../../assets/images/guess/add.png');
  }
}

.coco_points {
  margin-left: 2.1333vw;
  font-size: 2.6667vw;
  text-align: center;
  p {
    color: #fff;
  }
  a {
    display: block;
    width: 17.3333vw;
    margin-top: 1.3333vw;
    line-height: 4.4vw;
    color: #fff300;
    background-color: #4e2823;
    border: 1px solid #6d3932;
    border-radius: 4.6667vw;
  }
}

.herf_gather {
  @extend .flex_hc;
  a {
    width: 6.4vw;
    height: 6.4vw;
    margin: 0 2.1333vw 0 2.1333vw;
  }
}

.guess_list {
  padding: 0 4.2667vw;
}

.no_data {
  margin-top: 30vw;
}

.record_icon,
.get_icon,
.exchange_icon {
  position: relative;
  @include getBgImg('../../../assets/images/guess/record_icon.png');
  ul {
    @include getRadiusBorder(#d6564f, all, 6px);
    position: absolute;
    right: -1.2vw;
    top: 7.93vw;
    z-index: 10;
    width: 18.67vw;
    border-radius: 3px;
    background-color: #ba3129;
    &::after {
      content: '';
      position: absolute;
      top: 0.27vw;
      right: 3.47vw;
      transform: translateY(-100%);
      -webkit-transform: translateY(-100%);
      @include getTriangle(1.33vw, #ba3129, up);
    }
  }
  li {
    line-height: 10.67vw;
    font-size: 3.2vw;
    color: #ffeaea;
    text-align: center;
    @include getBorder(bottom, #d6564f);
    &:last-child {
      background: none;
    }
  }
}
.con {
  height: 110px;
  margin-top: 8px;
  overflow: hidden;
  .list {
    height: calc(100% + 6px);
    white-space: nowrap;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .item {
    display: inline-block;
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
  img {
    width: 250px;
    height: 110px;
    border-radius: 4px;
    object-fit: cover;
  }
}
.get_icon,
.exchange_icon {
  position: relative;
  @include getBgImg('../../../assets/images/guess/get_icon.png');
  span {
    @extend .g_c_mid;
    top: calc(100% + 2.1333vw);
    z-index: 10;
    padding: 1.6vw 2vw;
    font-size: 3.2vw;
    color: #fedcd7;
    background-color: rgba(0, 0, 0, 0.7);
    border: 0.1333vw solid #714038;
    border-radius: 0.5333vw;
    white-space: nowrap;
    &::before {
      content: '';
      @extend .g_c_mid;
      top: -3.2vw;
      @include getTriangle(1.6vw, rgba(0, 0, 0, 0.7), up);
    }
  }
}

.exchange_icon {
  @include getBgImg('../../../assets/images/guess/exchange_icon.png');
}

.link_icon {
  @include getBgImg('../../../assets/images/guess/link_icon.png');
}

.office {
  position: relative;
  margin-top: -13.3333vw;
  margin-left: -2.6667vw;
  padding: 50.6667vw 12vw 6.6667vw 15.7333vw;
  font-size: 4.5333vw;
  color: #fff2f0;
  text-align: center;
  @include getBgImg('../../../assets/images/guess/office_bg.png');
  .close {
    position: absolute;
    top: 18.8vw;
    right: 0;
    z-index: 1;
    width: 8vw;
    height: 8vw;
    @include getBgImg('../../../assets/images/guess/close.png');
    background-size: contain;
  }
  img {
    position: relative;
    z-index: 10;
    width: 57.3333vw;
    height: 57.3333vw;
    object-fit: cover;
    -webkit-touch-callout: inherit !important;
    // @include getBgImg("../../../assets/images/guess/office_code.png");
    // background-size: contain;
    // background-position: top center;
  }
  p {
    margin-top: 4vw;
    line-height: 6.4vw;
  }
  .office_txt {
    font-size: 3.2vw;
    line-height: 1;
  }
  .hide_img {
    @extend .g_v_c_mid;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    z-index: 0;
  }
}

.qr_code_pop {
  position: absolute;
}

.to_browser_pop {
  img {
    position: absolute;
    top: 0.6667vw;
    right: 2.6667vw;
    width: 92.8vw;
  }
}

.refresh_btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  @include getBgImg('../../../assets/images/match/refresh_btn.png');

  position: fixed;
  z-index: 10;
  right: 5px;
  bottom: 150px;
}

.refresh_btn.active {
  animation: rotate 0.5s;
}

@keyframes rotate {
  form {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes rotate {
  form {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
