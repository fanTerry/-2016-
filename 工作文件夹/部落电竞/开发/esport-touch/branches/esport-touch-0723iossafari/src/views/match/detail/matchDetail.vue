<template>
  <div class="Page matchDetailPage">
    <header class="mod_header">
      <!-- <h2>
        <div class="back" @click="$router.back(-1);"></div>
        {{matchDetail.leagueName |subStr(10)}} BO{{matchDetail.numberOfGames}}
      </h2> -->
      <navBar :pageTitle="matchDetail.leagueName |subStr(10)"></navBar>
      <div class="live_header">
        <!-- <p class="title">{{matchDetail.leagueName |subStr(10)}}</p> -->
        <div class="team_pk">
          <img :src="matchDetail.homeTeamLogo |getDefaultImg(globalConst.matchTeamDefaultIcon)" alt />
          <div class="BO">
            <span>{{matchDetail.homeScore==null?0:matchDetail.homeScore}}</span>
            <div>
              <!-- <span>第二局</span> -->
              <span v-if="matchDetail.status==0">未开赛</span>
              <span v-if="matchDetail.status==1">进行中</span>
              <span v-if="matchDetail.status==2">已结束</span>
            </div>
            <span>{{matchDetail.awayScore==null?0:matchDetail.awayScore}}</span>
          </div>
          <img :src="matchDetail.awayTeamLogo |getDefaultImg(globalConst.matchTeamDefaultIcon)" alt />
        </div>
        <div class="team_name">
          <span>{{matchDetail.homeTeamName |subStr(5)}}</span>
          <div class="watch_live" v-if="matchDetail.status==1">
            <i class="iconfont icon-shexiangji"></i>进行中
          </div>
          <span>{{matchDetail.awayTeamName |subStr(5)}}</span>
        </div>
        <div class="tab_list">
          <div :class="curType==item.type?'item active':'item'" v-for="(item,index) in menuArray" :key="index"
            @click="selectTap(item.type)">{{item.name}}</div>
        </div>
      </div>
    </header>
    <div class="main">
      <!-- 聊天室 -->
      <section class="chat_room" v-if="curType==1">
        <p class="warnings">!! 欢迎来到评论区，任何传播违法、违规、低俗等不良信息的行为将被封号。</p>
        <div class="voice_list" v-if='showChat'>
          <p class="item" v-for="(item,index) in chatList" :key="index">
            <!-- bg_blue,bg_green,bg_yellow,bg_orange,bg_purple,bg_red -->
            <!-- <span class="tag bg_blue">
              标签
              <span>5</span>
            </span>-->
            <span class="name">{{item.nickName}}：</span>
            <span class="sentence">{{item.sendMsg}}</span>
          </p>
        </div>
        <div class="close_room" v-else>
          聊天室功能暂时关闭
        </div>
      </section>
      <!-- 数据 -->
      <match-detail-data ref="detailData" v-if="curType==2" :matchDetail="matchDetail" :gameIdArray="gameIdArray"
        :socketUrl="socketUrl"></match-detail-data>
      <!-- 图文直播 -->
      <match-detail-live @onChangeData='onChangeData' ref="detailLive" v-if="curType==4" :matchDetail="matchDetail"
        :gameIdArray="gameIdArray" :socketUrl="socketUrl">
      </match-detail-live>
      <!-- 文章 -->
      <section v-if="curType==5">
        <hotRecommend :article="item" :type="0" v-for="(item,index) in articleList" :key="index">
        </hotRecommend>
        <noData v-if="noDataFlag"> </noData>
      </section>
    </div>
    <!-- 聊天发送框 -->
    <footer class="mod_footer" v-if="curType==1&&showChat">
      <div class="chat_line">
        <!-- <input class="chat_line" type="text" name id placeholder="我来发表一点意见" @focus="bindFocus($event)" @blur="bindBlur" ref="inputVal"
          v-model="contentValue" :maxlength="chatContentLen" > -->
        <textarea name id placeholder="我来发表一点意见" rows="1" @focus="bindFocus($event)" @blur="bindBlur" ref="inputVal"
          v-model="contentValue" :maxlength="chatContentLen"></textarea>
        <!-- <i class="iconfont icon-xiaolian"></i> -->
        <a class="send active" @click="sendChat">发送</a>
      </div>
    </footer>
  </div>
</template>

<script>
import matchDetailData from "components/match/detail/match-detail-data";
import matchDetailLive from "components/match/detail/match-detail-live";
import hotRecommend from "components/hot_recommend/index";
import noData from "../../../components/no_data/index.vue";
import navBar from "../../../components/header/nav_bar/index";

export default {
  components: {
    matchDetailData,
    matchDetailLive,
    hotRecommend,
    noData,
    navBar
  },
  data() {
    return {
      menuArray: [
        { name: "聊天室", type: 1 },
        { name: "数据", type: 2 },
        // { name: "会员专享", type: 3 },
        { name: "图文直播", type: 4 },
        { name: "文章", type: 5 }
        // { name: "赔率", type: 6 },
        // { name: "预测下单", type: 7 }
      ],
      curUsrName: "",
      matchId: 0,
      matchDetail: [],
      curType: 1,
      chatList: [],
      timer: [],
      socketUrl: "", //websocket地址
      lockReconnect: false, //默认进来是断开链接的
      initScene: {},
      liveDataList: [],
      gameIdArray: [],
      curGame: "",
      noDataFlag: false,
      initScene: {},
      contentValue: "",
      chatContentLen: 50,
      articleList: [],
      pageNo: 1,
      pageSize: 50,
      userId: "",
      nickName: "",
      showChat: false,//聊天室开关
    };
  },
  computed: {},
  created() {},
  destroyed() {
    this.socketApi.websocketclose(); //离开路由之后断开websocket连接
  },
  mounted() {
    this.matchId = this.$route.params.matchId;
    this.getMatchDetail(this, true);
    this.getChatroomSwitch();
  },
  methods: {
    /** 聊天室开关*/
    getChatroomSwitch() {     
      this.$post("/api/cmsContent/getChatroomSwitch")
        .then(rsp => {
          const dataResponse = rsp;
          // console.log(dataResponse, "聊天室开关");
          if (dataResponse.code == "200"&&dataResponse.data) {
            console.log(dataResponse.data, "聊天室开关");
            this.showChat=true;
          } 
        })
        .catch(error => {
          console.log(error);
        });    
    },

    // 发送聊天信息
    sendChat() {
      this.$refs.inputVal.rows = 1;
      console.log(this.contentValue, "sendChat");
      var content = this.contentValue;
      if (!content) {
        this.$toast("请输入要发送的内容", 2);
        return;
      }
      if (content.length > this.chatContentLen) {
        this.$toast("聊天内容不能超过50个字", 2);
        return;
      }
      this.socketApi.heartCheck.reset().start(content, this);
      this.contentValue = "";
      this.$toast("发送成功", 1);
    },
    bindFocus(e) {
      this.$refs.inputVal.rows = 2;
      console.log(e, "获取焦点");
      // const originRect = e.target.getBoundingClientRect();
      // console.log(originRect, "originRect");
      // let isFirst = false;
      // setTimeout(() => {
      //   let rect = e.target.getBoundingClientRect();
      //   if (isFirst) {
      //     if (rect.top - originRect.top < 0) {
      //       // todo 设置body的height
      //       document.body.style.height =
      //         window.innerHeight - (originRect.top - rect.top) + "px";
      //       e.target.scrollIntoView(false);
      //       return;
      //     }
      //   }
      //   e.target.scrollIntoView(false);
      //   setTimeout(() => {
      //     rect = e.target.getBoundingClientRect();
      //     // 某些机型下，得到的top为负值，直接使用window.innerHeight
      //     if (rect.top > 0) {
      //       document.body.style.height = window.innerHeight + "px";
      //     } else {
      //       document.body.style.height =
      //         window.innerHeight - (originRect.top - rect.top) + "px";
      //     }
      //     e.target.scrollIntoView(false);
      //   }, 100);

      //   isFirst = false;
      // }, 100);

      this.$refs.inputVal.focus();
    },
    bindBlur() {
      //document.body.style.height = "100%";
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 100);
    },
    getConfigResult: function(res) {
      console.log(res, "返回的内容");
    },
    getMatchDetail: function(_self, linkFlag) {
      var matchId = _self.matchId;
      console.log(this.initScene);
      this.$post("/api/league/detail/" + matchId)
        .then(res => {
          console.log(res, "获取赛事详情");
          if (res.code == "200" && res.data) {
            _self.socketUrl = res.data.chatSocketUrl;
            _self.matchDetail = res.data;
            _self.userId = res.data.userId + "";
            _self.nickName = res.data.nickName;
            window.sessionStorage.userId = res.data.userId + "";
            window.sessionStorage.nickName = res.data.nickName;
            var initScene = _self.socketApi.getSceneMsg(
              3,
              21,
              10,
              "R_",
              matchId,
              _self.userId
            );
            _self.initScene = initScene;
            // 【agentData：发送的参数；this.getConfigResult：回调方法】
            // this.socketApi.initWebSocket(_self);
            _self.matchDetail = res.data;
            if (_self.curType == 1 && linkFlag) {
              console.log("jinlai", _self.socketUrl);
              this.socketApi.initWebSocket(_self);
            }
            if (res.data.videogameId == 4) {
              //dota2不支持图文直播
              var menuArray = this.menuArray;
              for (var i = 0; i < menuArray.length; i++) {
                var type = menuArray[i].type;
                if (type === 4) {
                  menuArray.splice(i, 1);
                }
              }
              this.menuArray = menuArray;
            }
          } else {
            this.$toast(res.message, 2);
          }
        })
        .catch(e => {
          console.log(e);
        });

      this.$post("/api/league/match/" + "M_" + matchId)
        .then(res => {
          console.log(res, "/league/match/" + "M_" + matchId);
          _self.gameIdArray = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    onChangeData: function(obj) {
      //赋值到父组件的data集合
      this.liveDataList = obj.liveDataList;
      this.curGame = obj.curGame;
    },
    /**切换tap */
    selectTap: function(curType) {
      var _self = this;
      _self.curType = curType;
      var matchId = _self.matchId,
        matchStatus = _self.matchDetail.status;
      //需要发送消息
      if (curType == 1) {
        _self.chatList = [];
        this.socketApi.toSendSocketMessage(_self.initScene);
      } else if (curType == 2) {
        //数据页tab
        if (matchStatus == 1) {
          console.log("比赛中的数据");
          //比赛中
          var initScene = this.socketApi.getSceneMsg(
            2,
            21,
            16,
            "M_",
            matchId,
            _self.userId
          );
          this.socketApi.toSendSocketMessage(initScene);
        }
      } else if (curType == 5) {
        this.articleList = [];
        this.loadExpertArticle();
      }
    },
    loadExpertArticle() {
      var _self = this;
      var pageNo = _self.pageNo;
      var pageSize = _self.pageSize;
      _self
        .$post("/api/expert/articleList", {
          pageNo: pageNo,
          pageSize: pageSize,
          matchId: _self.matchId
        })
        .then(res => {
          if (res.code == "200") {
            if (res.data.length > 0) {
              //  var newList=[]
              _self.articleList = _self.articleList.concat(res.data);
              // if(pageNo>1){
              //   console.log("文章323", res.data);

              // }

              // _self.articleList = newList;
              console.log("文章", _self.articleList);
              _self.pageNo = pageNo;
              _self.pageSize = pageSize;
            }
            if (_self.articleList.length == 0) {
              _self.noDataFlag = true;
            }
          }
        })
        .catch(e => {});
    },
    canShowChat() {}
  },
  watch: {}
};
</script>

<style lang="scss">
.matchDetailPage {
  .nav_bar {
    position: absolute !important;
    width: 100%;
    color: #fff !important;
    .back {
      &::after,
      &::before {
        background-color: #fff;
      }
    }
  }
}
</style>


<style lang='scss' scoped>
@import "../../../assets/common/_base.scss";
@import "../../../assets/common/_mixin.scss";
@import "../../../assets/common/_var.scss";
@import "../../../assets/common/iconfont.css";

.live_header {
  @include getBgImg("../../../assets/images/expert/expert_bg.png");
  .title {
    padding-top: 25px;
    color: #fff;
    text-align: center;
  }
  .team_pk {
    @extend .flex_v_justify;
    padding: 90px 30px 15px;
    img {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }
  }
  .BO {
    @extend .flex_hc;
    > span {
      font-size: 28px;
      color: #fff;
    }
    > div {
      text-align: center;
      padding: 0 20px;
      span {
        display: block;
        padding: 2px 0;
        color: #fff;
      }
    }
  }
  .team_name {
    @extend .flex_v_justify;
    padding: 0 10px;
    > span {
      @include t_nowrap(80px);
      width: 80px;
      font-size: 17px;
      color: #fff;
      font-weight: bold;
      text-align: center;
    }
  }
  .watch_live {
    @extend .flex_hc;
    padding: 0 5px;
    line-height: 24px;
    border-radius: 24px;
    color: #fff;
    background-color: $color_main;
    .iconfont {
      margin-right: 2px;
      font-size: 16px;
      color: currentColor;
    }
  }
}

.tab_list {
  @extend .flex_v_justify;
  margin-top: 44px;
  padding: 0 12px;
  .item {
    color: #999;
    padding: 11px 20px;
  }
  .active {
    position: relative;
    color: #fff;
    &::after {
      content: "";
      @extend .g_c_mid;
      bottom: 0;
      width: 20px;
      height: 3px;
      background-color: $color_main;
      border-radius: 2px;
    }
  }
}

.chat_room {
  @extend .flex_hc;
  flex-direction: column;
  -webkit-flex-direction: column;
  height: 100%;
  padding: 15px;
  font-size: 14px;
  border-radius: 8px;
  background-color: #f5f6f7;
  p {
    line-height: 24px;
  }
  .warnings {
    color: $color_main;
  }
  .voice_list {
    width: 100%;
    flex: 1;
    -webkit-flex: 1;
    padding-top: 10px;
    color: #666;
  }
  .name {
    color: #0f87ff;
  }
  .tag {
    position: relative;
    font-size: 11px;
    line-height: 14px;
    padding: 0 5px;
    margin-right: 8px;
    color: #fff;
    border-radius: 4px;
    span {
      position: absolute;
      bottom: -7px;
      right: -10px;
      font-size: 18px;
      @include getCircle(24px, currentColor, #fff);
      transform: scale(0.5);
      transform-origin: center;
    }
  }
  .bg_blue {
    background-color: #4dccec;
    border: 1px solid #22bae1;
    span {
      background-color: #76e3ff;
      border: 1px solid #22bae1;
    }
  }
  .bg_green {
    background-color: #5dcf8e;
    border: 1px solid #4fc180;
    span {
      background-color: #76eba8;
      border: 1px solid #4fc180;
    }
  }
  .bg_yellow {
    background-color: #ffcc42;
    border: 1px solid #f0b618;
    span {
      background-color: #ffd972;
      border: 1px solid #f0b618;
    }
  }
  .bg_purple {
    background-color: #f159ff;
    border: 1px solid #d543e3;
    span {
      background-color: #f480ff;
      border: 1px solid #d543e3;
    }
  }
  .bg_orange {
    background-color: #ff8a00;
    border: 1px solid #d3ad90;
    span {
      background-color: #ffa234;
      border: 1px solid #d3ad90;
    }
  }
  .bg_red {
    background-color: #ff4e4e;
    border: 1px solid #f13333;
    span {
      background-color: #ff7a7a;
      border: 1px solid #f13333;
    }
  }
}

.mod_footer {
  background-color: #fff;
  .chat_line {
    @extend .flex;
    align-items: flex-end;
    -webkit-align-items: flex-end;
    padding: 10px;
    textarea,
    input {
      flex: 1;
      -webkit-flex: 1;
      -webkit-user-select: text;
      padding: 5px;
      font-size: 13px;
      line-height: 17px;
      color: #999;
      border-radius: 15px;
      box-shadow: none;
      border: 1px solid #ddd;
      resize: none;
    }
  }
  .icon-xiaolian {
    margin-left: 10px;
    font-size: 26px;
    color: #666;
  }
  .send {
    margin-left: 10px;
    padding: 7px 10px;
    font-size: 13px;
    color: #999;
    background-color: #fafbfc;
    border: 1px solid #ebebeb;
    border-radius: 4px;
    &.active {
      color: #fff;
      background-color: #ff7e00;
    }
  }
}

.close_room {
  @extend .flex_v_h;
  flex: 1;
  -webkit-flex: 1;
  color: #999;
}
</style>
