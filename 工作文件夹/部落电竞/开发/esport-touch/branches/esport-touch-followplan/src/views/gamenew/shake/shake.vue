<template>
  <div class='Page' v-if='pageReady'>
    <game-header ref="ref" @openPopAlert="openPopAlert"></game-header>
    <!-- 星星回流，放在这里是为了防止fixed属性被干扰 -->
    <div class="gold_list">
      <div class="gold_coin" :class="{'active':gameShake.showAward}" v-for="(item,index) in 10" :key="index">
        <span></span>
      </div>
    </div>
    <div class='main'>
      <div>
        <div class="tree">
          <!-- 树前面 -->
          <div class="tree_leaf" :class="{'active':gameShake.bitTree}" @animationend="treeShakeEnd()"></div>
          <!-- 树背面 -->
          <div class="tree_back" :class="{'active':gameShake.bitTree}"></div>
          <!-- 树干 -->
          <div class="tree_body"></div>
          <!-- 奖品掉落球 -->
          <img class="prize_img" :class="{'active':gameShake.gameBingo}" @animationend="ballDropOut()"
            src="../../../assets/images/game/newshake/ball.png" alt="" style="">
          <!-- 中奖物品 -->
          <template v-if='gameShake.playRes'>
            <div class="awards"
              :class="{'more_awards':gameShake.playRes.awardScoreValue/gameShake.playRes.consumeScore>1}">
              <div class="award_packs" :class="{'active':gameShake.showAwardBg}">
                <!-- 中奖星星 -->
                <div class="award_content" :class="{'active':gameShake.ballDrop}"
                  v-for="(award,index) in gameShake.playRes.awardList" :key="index">
                  <img :src="award.awardIcon" alt="">
                  <span>X {{award.awardNum}}</span>
                  <span class="fireworks"></span>
                </div>
              </div>
              <p class="award_num" :class="{'active':gameShake.ballDrop}">+{{gameShake.playRes.awardScoreValue}}</p>
            </div>
          </template>
          <!--背景音乐-->
          <div class="voice" :class="{'muted':gameShake.mutedVoice}" @click="bgm()">
            <audio class="player" ref="bgm" loop autoplay controls>
              <source :src="roomInfo.audioSrc[0]">
            </audio>
          </div>
          <audio class="player" ref="bit" preload controls muted>
            <source :src="roomInfo.audioSrc[1]">
          </audio>
          <audio class="player" ref="win" preload controls muted>
            <source :src="roomInfo.audioSrc[2]">
          </audio>

          <div class='songshu_await' :class="{'active':gameShake.gameStatus}"></div>
          <!-- 小松鼠锤树 -->
          <div class='songshu' :class="{'active':gameShake.gameStatus}"></div>
        </div>
        <footer class='mod_footer'>
          <div class="play">
            <div class="bet" v-if='roomInfo.playItems'>
              <div class="power" @click="showPowerList( $event)">
                <!-- <span class="bet_star"></span> -->
                <ul v-if="shutFlag">
                  <li>摇晃力量</li>
                  <li v-for="(item,index) in roomInfo.playItems" :key="index"
                    :class="{'active':roomInfo.selectPlayItem.itemScore == item.itemScore}"
                    @click="selectPower(index,$event)">{{item.itemScore}}
                  </li>
                </ul>
                <span class="num">{{roomInfo.selectPlayItem.itemScore}}</span>
                <span class="open" :class="{'shut':shutFlag}"></span>
              </div>
            </div>
            <!-- 按钮 -->
            <div class='play_btn'>
              <a :class="{'active': gameShake.gameStatus}" @click="playGame(false)"></a>
            </div>
            <div class="treasure_box"><span>敬请期待</span></div>
            <div class='game_hook' :class="{'active':gameShake.autoPlay}" @click="startAutoPlay()">
              托管
              <span v-if="gameShake.autoPlayTips">{{gameShake.autoPlay?'您已开启托管':'您已关闭托管'}}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>

    <bet-failed v-if='betFailedFlag' @closeBetPop='betFailedFlag = false' @toCharge='toCharge'></bet-failed>
    <pop-Alert :showPop="showPop" @close="showPop=false" @confirm="confirm" btnTxt1="已取消" btnTxt2="已完成支付" type="2">
      <p>请确认微信支付是否已完成</p>
    </pop-Alert>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import gameHeader from "../components/header.vue";
import betFailed from "../components/betFailed.vue";
import popAlert from "../../../components/pop_up/pop_alert.vue";
// import {throttle} from '../../../libs/utils';
export default {
  components: {
    gameHeader,
    betFailed,
    popAlert
  },
  props: [],
  data() {
    return {
      autoTimer: null, //托管定时器
      shutFlag: false, //是否收起摇晃力量列表标识
      pageReady: false, //页面请求数据标识
      showPop: false,
      gameShake: {
        //摇一摇动画关键字
        gameStatus: false, //游戏状态:true表示游戏进行中
        bitTree: false, //撞树
        mutedVoice: false, //关闭音乐
        gameBingo: false, //中奖了
        ballDrop: false, //星星球掉落状态
        showAward: false, //展示获奖奖品
        showAwardBg: false, //展示星星背景，并展示奖品2s
        playRes: null, //游戏结果
        isSubmit: false, //游戏提交标识
        autoPlay: false, //是否启动托管标识
        autoPlayTips: false //开启托管小提示
        // songshu: require("../../../assets/images/game/newshake/songshu.png")
      },
      roomInfo: {
        //房间信息
        playItems: null, //房间档位
        roomNo: "", //房间编号
        selectPlayItem: null, //选择的档位对象
        audioSrc: [
          "http://rs.esportzoo.com/upload/game/bg.mp3",
          "http://rs.esportzoo.com/upload/game/bit.mp3",
          "http://rs.esportzoo.com/upload/game/win.mp3"
        ]
      },
      betFailedFlag: false
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  watch: {},
  created() {
    // if (location.href.indexOf("#reloaded") == -1) {
    //   location.href = location.href + "#reloaded";
    //   location.reload();
    // }
  },
  mounted() {
    this.roomInfo.roomNo = this.$route.query.roomNo || "100102";
    this.roomData();
    document.addEventListener("click", e => {
      let bet = document.querySelector(".bet");
      if (bet && !bet.contains(e.target)) {
        this.shutFlag = false;
      }
    });
    // setTimeout(() => {
    this.iosAutoPlayBgm();
    // }, 1000);
  },
  methods: {
    ...mapActions(["setUserInfo"]),
    roomData() {
      this.$post("/api/game/shake/roomData", { roomNo: this.roomInfo.roomNo })
        .then(data => {
          this.pageReady = true;
          if (data.code == 200) {
            this.roomInfo.playItems = data.data.playItems;
            this.roomInfo.selectPlayItem = data.data.defaultPlayItem;
          } else {
          }
        })
        .catch(error => {
          console.log(error, "获取档位异常");
        });
    },
    //选择摇晃力量
    selectPower(index, e) {
      e.stopPropagation();
      this.roomInfo.selectPlayItem = this.roomInfo.playItems[index];
      this.shutFlag = !this.shutFlag;
    },
    showPowerList(e) {
      e.stopPropagation();
      this.shutFlag = !this.shutFlag;
    },
    // 点击play按钮
    playGame(autoPlay) {
      if (!autoPlay && this.gameShake.autoPlay) {
        this.$toast("游戏托管中,可先取消托管~");
        return;
      }
      console.log("触发游戏按钮-start");
      if (this.roomInfo.isSubmit || this.gameShake.gameStatus) {
        // this.$toast("游戏进行中");
        console.log(
          "this.roomInfo.isSubmit=" +
            this.roomInfo.isSubmit +
            ",this.gameShake.gameStatus=" +
            this.gameShake.gameStatus,
          "游戏进行中"
        );
        return;
      } else {
        if (!this.checkBalance()) {
          console.log("当前用户余额不足");
          return;
        }
        this.roomInfo.isSubmit = true;
        let playData = {
          roomNo: this.roomInfo.roomNo,
          gamePlayItemId: this.roomInfo.selectPlayItem.id,
          autoPlay: autoPlay || false
        };
        this.doSubmitPlay(playData).then(data => {
          console.log(data, "调用提交游戏数据接口");
          this.roomInfo.isSubmit = false;
          if (data.code == "200") {
            if (!data.data.balanceEnough) {
              this.betFailedFlag = true;
              return;
            }
            //游戏成功处理
            this.playSuccess(data);
          } else {
            //游戏失败处理
            this.$toast(data.message);
          }
        });
      }
      console.log("触发游戏按钮-end");
    },
    //树抖动动画结束
    treeShakeEnd() {
      console.log("树抖动动画结束");
      this.gameShake.bitTree = false;
      // this.gameShake.songshu = require("../../../assets/images/game/newshake/songshu.png");
      if (!this.gameShake.gameStatus) {
        //一般不会出现这个情况,先加上观察
        this.$toast("抖动-游戏不是进行中");
        console.log("抖动-游戏不是进行中");
      }
      //判断是否中奖
      let playData = this.gameShake.playRes;
      if (!playData) {
        this.$toast("参与游戏异常");
        this.gameShake.gameStatus = false;
        return;
      }
      if (playData.winFlag) {
        //中奖
        this.gameShake.gameBingo = true; //中奖了设置为true
      } else {
        this.$toast("未中奖,刮一阵风。。。");
        this.gameShake.gameStatus = false;
      }
    },
    // 掉落星星球结束
    ballDropOut() {
      this.gameShake.gameBingo = false; // 清除掉落球动画的状态
      this.gameShake.ballDrop = true;

      console.log("掉落星星球");
      this.awardShow();
    },
    // 展示获奖产品结束
    awardShow() {
      setTimeout(() => {
        // 清除展示奖品动画的状态
        this.gameShake.showAwardBg = true;
        setTimeout(() => {
          this.awardClose(); //奖品单个展示完毕，还要在树上挂两秒钟
        }, 2000);
      }, 500 * (this.gameShake.playRes.awardList.length - 1));
      console.log("获奖,展示获奖信息");
    },
    // 收起奖品
    awardClose() {
      this.gameShake.ballDrop = false; //清除奖品状态
      this.gameShake.showAwardBg = false; //清除星星背景
      this.gameShake.showAward = true; //两秒钟展示完毕后，星星回流
      setTimeout(() => {
        if (!this.gameShake.mutedVoice) {
          this.$refs.win.muted = false;
        }
        this.$refs.win.play();
        this.shakeEnd();
      }, 1500); //星星回流时间一秒钟，故延迟一秒执行
    },
    // 奖品回流动画结束
    shakeEnd() {
      // if (!this.gameShake.mutedVoice) {
      //   this.$refs.bgm.play();
      // }
      this.gameShake.showAward = false; // 清除奖品回流动画的状态
      this.gameShake.gameStatus = false;

      //刷新用户余额
      this.reflushBanlance();
      console.log("整个流程结束(不包含余额刷新动画)");
    },
    //减星星
    reduceStar(starNum) {
      let userNowStar = this.userInfo.ableRecScore;
      // console.log("减星星,用户目前的星星余额", userNowStar);
      this.setUserInfo({
        ...this.userInfo,
        ableRecScore: userNowStar - starNum
      });
    },
    //刷新用户余额
    reflushBanlance() {
      this.$refs.ref.getUserWallet();
    },
    //提交游戏订单
    doSubmitPlay(playData) {
      return this.$post("/api/game/shake/startPlay", playData)
        .then(data => {
          return data;
        })
        .catch(error => {
          console.log(error, "调用游戏接口异常");
        });
    },
    //游戏成功处理
    playSuccess(data) {
      // 点击按钮gameStatus不需要判断中奖情况
      // this.gameShake.songshu =
      //   require("../../../assets/images/game/newshake/songshu.gif") +
      //   "?" +
      //   Math.random();
      this.gameShake.gameStatus = true;
      setTimeout(() => {
        this.gameShake.bitTree = true;

        if (!this.gameShake.mutedVoice) {
          this.$refs.bit.muted = false;
        }
        // this.$refs.bit.play();
      }, 1000);
      // setTimeout(() => {
      //   this.gameShake.bitTree = true;
      // }, 1500);

      this.gameShake.playRes = data.data;
      let useStar = this.roomInfo.selectPlayItem.itemScore;
      this.reduceStar(useStar);
    },
    //游戏失败处理
    playFail(data) {},
    //检查账户余额
    checkBalance() {
      let userPowerNum = this.roomInfo.selectPlayItem.itemScore;
      if (!userPowerNum) {
        this.$toast("请先选择摇晃力量~");
        return false;
      }
      if (userPowerNum > this.userInfo.ableRecScore) {
        this.betFailedFlag = true;
        this.gameShake.autoPlay = false;
        return false;
      }
      return true;
    },
    bgm() {
      if (!this.gameShake.mutedVoice) {
        this.$refs.bgm.pause();
        this.$refs.bit.muted = true;
        this.$refs.win.muted = true;
        this.gameShake.mutedVoice = true;
      } else {
        this.$refs.bgm.play();
        this.$refs.bit.muted = false;
        this.$refs.win.muted = false;
        this.gameShake.mutedVoice = false;
      }
    },
    toCharge() {
      this.betFailedFlag = false;
      this.$refs.ref.toCharge();
    },
    iosAutoPlayBgm() {
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (!isiOS) {
        console.log("不是ios不处理");
        return;
      }
      this.$post("/api/wxlogin/getJsConfig")
        .then(rsp => {
          console.log(rsp, "rsp");
          if (rsp.appId != "") {
            this.wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: rsp.appId, // 必填，公众号的唯一标识
              timestamp: rsp.timestamp, // 必填，生成签名的时间戳
              nonceStr: rsp.nonceStr, // 必填，生成签名的随机串
              signature: rsp.signature, // 必填，签名，见附录1
              jsApiList: ["chooseWXPay"]
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.wx.ready(() => {
        this.$refs.bgm.play();
        this.$refs.bit.play();
        this.$refs.win.play();
      });
    },

    startAutoPlay() {
      if (!this.checkBalance()) {
        console.log(this.gameShake.autoPlay, "当前用户余额不足");
        return;
      }
      this.gameShake.autoPlayTips = !this.gameShake.autoPlayTips;
      setTimeout(() => {
        this.gameShake.autoPlayTips = !this.gameShake.autoPlayTips;
      }, 2000);
      this.gameShake.autoPlay = !this.gameShake.autoPlay;
      console.log(this.gameShake.autoPlay, "startAutoPlay");
      if (this.gameShake.autoPlay) {
        this.playGame(true);
      }
      this.autoTimer = setInterval(() => {
        if (this.gameShake.autoPlay) {
          this.playGame(true);
        }
      }, 10 * 1000);
    },

    openPopAlert() {
      this.showPop = true;
    },
    /**h5支付后 */
    confirm() {
      this.showPop = false;
      this.$refs.ref.getUserWallet();
    }
  },
  beforeDestroy() {
    if (this.autoTimer) {
      //如果定时器还在运行
      clearInterval(this.autoTimer); //关闭
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../../assets/common/_base";
@import "../../../assets/common/_mixin";

.Page {
  background-color: #1e7fff;
  &::before {
    content: "";
    position: absolute;
    bottom: 13.3333vw;
    width: 100%;
    height: 100%;
    @include getBgImg("../../../assets/images/game/newshake/shake_bg.png");
    background-size: 100% auto;
    background-position: center bottom;
  }
}

.main {
  position: relative;
  @extend .flex_hc;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
  flex-direction: column;
  -webkit-flex-direction: column;
  > div {
    width: 100%;
  }
}

.gold_coin {
  position: fixed;
  left: 50%;
  top: 43%;
  z-index: 10;
  width: 12vw;
  height: 12vw;
  transform: translate3d(-50%, -50%, 0) scale(0);
  -webkit-transform: translate3d(-50%, -50%, 0) scale(0);
  &.active {
    will-change: transform;
    &:first-child {
      animation: moveTop 0.6s cubic-bezier(0, 0, 0.36, 1) forwards;
      span {
        animation: moveLeft 0.6s cubic-bezier(0.66, 0.01, 1, 1) forwards;
      }
    }
    &:nth-child(2) {
      animation: moveTop 0.6s cubic-bezier(0, 0, 0.36, 1) 0.1s forwards;
      span {
        animation: moveLeft 0.6s cubic-bezier(0.66, 0.01, 1, 1) 0.1s forwards;
      }
    }
    &:nth-child(3) {
      animation: moveTop 0.6s cubic-bezier(0, 0, 0.36, 1) 0.2s forwards;
      span {
        animation: moveLeft 0.6s cubic-bezier(0.66, 0.01, 1, 1) 0.2s forwards;
      }
    }
    &:nth-child(4) {
      animation: moveTop 0.6s cubic-bezier(0, 0, 0.36, 1) 0.3s forwards;
      span {
        animation: moveLeft 0.6s cubic-bezier(0.66, 0.01, 1, 1) 0.3s forwards;
      }
    }
    &:nth-child(5) {
      animation: moveTop 0.6s cubic-bezier(0, 0, 0.36, 1) 0.4s forwards;
      span {
        animation: moveLeft 0.6s cubic-bezier(0.66, 0.01, 1, 1) 0.4s forwards;
      }
    }
    &:nth-child(6) {
      animation: moveTop 0.6s cubic-bezier(0, 0, 0.36, 1) 0.5s forwards;
      span {
        animation: moveLeft 0.6s cubic-bezier(0.66, 0.01, 1, 1) 0.5s forwards;
      }
    }
    &:nth-child(7) {
      animation: moveTop 0.6s cubic-bezier(0, 0, 0.36, 1) 0.6s forwards;
      span {
        animation: moveLeft 0.6s cubic-bezier(0.66, 0.01, 1, 1) 0.6s forwards;
      }
    }
    &:nth-child(8) {
      animation: moveTop 0.6s cubic-bezier(0, 0, 0.36, 1) 0.7s forwards;
      span {
        animation: moveLeft 0.6s cubic-bezier(0.66, 0.01, 1, 1) 0.7s forwards;
      }
    }
    &:nth-child(9) {
      animation: moveTop 0.6s cubic-bezier(0, 0, 0.36, 1) 0.8s forwards;
      span {
        animation: moveLeft 0.6s cubic-bezier(0.66, 0.01, 1, 1) 0.8s forwards;
      }
    }
    &:nth-child(10) {
      animation: moveTop 0.6s cubic-bezier(0, 0, 0.36, 1) 0.9s forwards;
      span {
        animation: moveLeft 0.6s cubic-bezier(0.66, 0.01, 1, 1) 0.9s forwards;
      }
    }
  }
  span {
    @extend .g_v_c_mid;
    display: block;
    z-index: 10;
    width: 12vw;
    height: 12vw;
    @include getBgImg("../../../assets/images/game/newshake/star_icon.png");
  }
}

.tree {
  position: relative;
  width: 100%;
  height: 114.9333vw;
  top: 10.6667vw;
  .tree_leaf {
    &.active {
      animation: shaking 0.75s;
      will-change: transform;
    }
  }
  .tree_leaf {
    position: absolute;
    top: -1.0667vw;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 90.9333vw;
    @include getBgImg("../../../assets/images/game/newshake/tree_leaf.gif");
    // &::after {
    //   content: "";
    //   @extend .g_c_mid;
    //   top: 35.2vw;
    //   margin-left: 3.6667vw;
    //   width: 44.5333vw;
    //   height: 10vw;
    //   @include getBgImg("../../../assets/images/game/newshake/tree_name.png");
    // }
  }
  .tree_back {
    z-index: 1;
    position: absolute;
    left: 13.6vw;
    bottom: 28.8vw;
    width: 78.1333vw;
    height: 26vw;
    @include getBgImg("../../../assets/images/game/newshake/leaf_back.png");
  }
  .tree_body {
    @extend .g_c_mid;
    bottom: 2.6667vw;
    z-index: 2;
    width: 37.6vw;
    height: 44vw;
    margin-left: 1.8667vw;
    @include getBgImg("../../../assets/images/game/newshake/tree_body.png");
  }
  .prize_img {
    position: absolute;
    top: 20%;
    z-index: 2;
    left: 39.6vw;
    width: 25.3333vw;
    &.active {
      animation: dropout 1s ease-out;
      will-change: transform;
    }
  }

  .awards {
    @extend .flex_v_h;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 81.3333vw;
    z-index: 4;
  }
  .award_packs {
    width: 66.6667vw;
    height: 53.3333vw;
    margin: 0 auto;
    &.active {
      @include getBgImg("../../../assets/images/game/newshake/shine.gif");
      background-position: center -6.6667vw;
      animation: shining 2s linear forwards;
      font-size: 10px;
    }
  }
  .more_awards .award_packs {
    width: 89.3333vw;
    height: 77.3333vw;
    &.active {
      @include getBgImg(
        "../../../assets/images/game/newshake/shine_strong.gif"
      );
    }
  }
  .award_num {
    position: absolute;
    left: 50%;
    top: 10.6667vw;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    opacity: 0;
    font-size: 7.7333vw;
    color: #fff;
    &.active {
      animation: showAwardNum 2.4s linear 0.4s;
    }
  }
  .award_content {
    position: absolute;
    @extend .flex_v_h;
    width: 21.3333vw;
    height: 21.3333vw;
    transform: scale(0);
    -webkit-transform: scale(0);
    &.active {
      .fireworks,
      &::before,
      &::after {
        content: "";
        @extend .g_v_c_mid;
        width: 42.6667vw;
        height: 42.6667vw;
        animation: changeBg 0.5s;
      }
      &::before {
        width: 21.3333vw;
        height: 21.3333vw;
      }
      &::after {
        width: 10.6667vw;
        height: 10.6667vw;
      }
    }

    img {
      width: 100%;
    }
    &:first-of-type {
      left: 40%;
      top: 30%;
      z-index: 6;
      &.active {
        animation: blowUp 0.5s linear forwards;
        .fireworks,
        &::before,
        &::after {
          animation: changeBg 0.5s linear;
        }
      }
    }
    &:nth-of-type(2) {
      left: 32%;
      top: 49%;
      z-index: 5;
      &.active {
        animation: blowUp 0.5s linear 0.5s forwards;
        .fireworks,
        &::before,
        &::after {
          animation: changeBg 0.5s linear 0.5s;
        }
      }
    }
    &:nth-of-type(3) {
      left: 50%;
      top: 49%;
      z-index: 4;
      &.active {
        animation: blowUp 0.5s linear 1s forwards;
        .fireworks,
        &::before,
        &::after {
          animation: changeBg 0.5s linear 1s;
        }
      }
    }
    &:nth-of-type(4) {
      left: 26%;
      top: 30%;
      z-index: 3;
      &.active {
        animation: blowUp 0.5s linear 1.5s forwards;
        .fireworks,
        &::before,
        &::after {
          animation: changeBg 0.5s linear 1.5s;
        }
      }
    }

    &:nth-of-type(5) {
      left: 55%;
      top: 30%;
      z-index: 2;
      &.active {
        animation: blowUp 0.5s linear 2s forwards;
        .fireworks,
        &::before,
        &::after {
          animation: changeBg 0.5s linear 2s;
        }
      }
    }

    &:nth-of-type(6) {
      left: 41%;
      top: 12%;
      z-index: 1;
      &.active {
        animation: blowUp 0.5s linear 2.5s forwards;
        .fireworks,
        &::before,
        &::after {
          animation: changeBg 0.5s linear 2.5s;
        }
      }
    }
    span {
      @extend .g_v_c_mid;
      font-size: 4.8vw;
      color: #fff;
    }
  }
  .songshu {
    position: absolute;
    right: 18.6667vw;
    bottom: 3.7333vw;
    z-index: 3;
    width: 22.5333vw;
    height: 40.9333vw;
    @include getBgImg("../../../assets/images/game/newshake/songshu_await.png");
    background-position: 0 0;
    background-size: 112.6667vw;
    animation: awaitAnimate 2s step-end infinite both;

    &.active {
      width: 25.7333vw;
      height: 39.4667vw;
      @include getBgImg(
        "../../../assets/images/game/newshake/songshu_sprite.png"
      );
      background-position: 0 0;
      background-size: 102.9333vw;
      animation: bitTreeAnimate 0.8s step-end both;
    }
  }
  .songshu_await {
    position: absolute;
    left: 13.3333vw;
    bottom: 3.7333vw;
    z-index: 3;
  }
}

@keyframes awaitAnimate {
  0% {
    background-position: 0 0;
  }
  7% {
    background-position: -22.5333vw 0;
  }
  14% {
    background-position: -45.0667vw 0;
  }
  21% {
    background-position: -67.6vw 0;
  }
  28% {
    background-position: -90.1333vw 0;
  }
  35% {
    background-position: 0 -40.9333vw;
  }
  42% {
    background-position: -22.5333vw -40.9333vw;
  }
  49% {
    background-position: -45.0667vw -40.9333vw;
  }
  56% {
    background-position: -67.6vw -40.9333vw;
  }
  63% {
    background-position: -90.1333vw -40.9333vw;
  }
  70% {
    background-position: 0 -81.8667vw;
  }
  77% {
    background-position: -22.5333vw -81.8667vw;
  }
  84% {
    background-position: -45.0667vw -81.8667vw;
  }
  91% {
    background-position: -67.6vw -81.8667vw;
  }
  98% {
    background-position: -90.1333vw -81.8667vw;
  }
}

.voice {
  position: fixed;
  left: 1.0667vw;
  top: 24.2667vw;
  z-index: 10;
  width: 14.9333vw;
  height: 14.9333vw;
  @include getBgImg("../../../assets/images/game/newshake/voice.png");
  &.muted {
    @include getBgImg(
      "../../../assets/images/game/newshake/voice_forbidden.png"
    );
  }
}

.player {
  position: fixed;
  left: -1333.2vw;
  display: block;
}

.mod_footer {
  position: relative;
  z-index: 5;
  @include getBgImg("../../../assets/images/game/newshake/footer_bg.png");
  .play {
    @extend .flex_hc;
    height: 24vw;
    padding: 7.7333vw 0.8vw 0;
  }
  .bet {
    @extend .flex_hc;
    margin-top: 2.6667vw;
  }
  .bet_star {
    @extend .g_v_mid;
    z-index: 10;
    left: 0.8vw;
    width: 7.4667vw;
    height: 7.4667vw;
    @include getBgImg("../../../assets/images/game/newshake/bet_star.png");
  }
  .open {
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0.8vw;
    width: 9.6vw;
    height: 9.6vw;
    @include getBgImg("../../../assets/images/game/newshake/open.png");
    &.shut {
      @include getBgImg("../../../assets/images/game/newshake/shut.png");
    }
  }
  .power {
    position: relative;
    ul {
      @extend .g_c_mid;
      bottom: 5.3333vw;
      z-index: 4;
      width: 25.2vw;
      padding-bottom: 5.3333vw;
      background: #fff;
      border-radius: 5.3333vw;
      li {
        width: 25.2vw;
        height: 10.1333vw;
        font-size: 4.5333vw;
        line-height: 8vw;
        text-align: center;
        color: #fff;
        @include getBgImg(
          "../../../assets/images/game/newshake/shangla_off.png"
        );
        border-radius: 8.8vw;
        &:first-child {
          width: 100%;
          height: 10.6667vw;
          margin-top: 0;
          border-radius: 0;
        }
        &.active {
          font-weight: bold;
          color: #f64500;
          @include getBgImg(
            "../../../assets/images/game/newshake/shangla_on.png"
          );
        }
      }
    }
    .num {
      position: relative;
      z-index: 5;
      display: block;
      line-height: 30px;
      text-align: center;
      width: 33.6vw;
      height: 11.8667vw;
      font-size: 4.5333vw;
      color: #fff;
      @include getBgImg("../../../assets/images/game/newshake/shangla_bg.png");
    }
  }
  .play_btn {
    position: relative;
    width: 31.2vw;
    height: 12.5333vw;
    margin-left: 1.3333vw;
    @include getBgImg("../../../assets/images/game/newshake/btn_bg.png");
    background-size: 100% auto;
    a {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      @include getBgImg("../../../assets/images/game/newshake/play_btn.png");
      background-size: 100% auto;
      background-position: center bottom;
      &.active {
        animation: playBtn 8s linear forwards;
        will-change: transform;
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
      }
    }
  }
  .treasure_box {
    position: relative;
    width: 9.3333vw;
    height: 9.3333vw;
    margin: 0 2.4vw;
    @include getBgImg("../../../assets/images/game/newshake/treasure_box.png");
    span {
      @extend .g_c_mid;
      bottom: 0.6667vw;
      padding: 0 1.6vw;
      font-size: 2.1333vw;
      line-height: 2.6667vw;
      color: #fff;
      background-color: #999;
      border-radius: 2.6667vw;
      white-space: nowrap;
    }
  }
  .game_hook {
    position: relative;
    width: 19.2vw;
    height: 12.9333vw;
    line-height: 16vw;
    font-size: 3.7333vw;
    font-weight: bold;
    text-align: center;
    color: #fff;
    @include getBgImg("../../../assets/images/game/newshake/game_hook.png");
    &.active {
      @include getBgImg(
        "../../../assets/images/game/newshake/game_hooking.png"
      );
    }
    span {
      @extend .g_c_mid;
      top: -6.6667vw;
      width: 18.4vw;
      height: 6.1333vw;
      padding-top: 1.3333vw;
      font-size: 2.4vw;
      border-radius: 4.8vw;
      white-space: nowrap;
      color: #fff;
      @include getBgImg("../../../assets/images/game/newshake/hook_tips.png");
    }
  }
}

// 按钮
@keyframes playBtn {
  from {
    height: 1%;
  }
  to {
    height: 100%;
  }
}

//松鼠砸树
@keyframes bitTreeAnimate {
  0% {
    background-position: 0 0;
  }
  11% {
    background-position: -25.7333vw 0;
  }
  22% {
    background-position: -51.4667vw 0;
  }
  33% {
    background-position: -77.2vw 0;
  }
  44% {
    background-position: 0 -39.4667vw;
  }
  55% {
    background-position: -25.7333vw -39.4667vw;
  }
  66% {
    background-position: -51.4667vw -39.4667vw;
  }
  77% {
    background-position: -77.2vw -39.4667vw;
  }
  88% {
    background-position: 0 -78.9333vw;
  }
  99% {
    background-position: -25.7333vw -78.9333vw;
  }
}

// 奖品掉落
@keyframes dropout {
  0% {
    transform: translate(0) translateZ(0);
    -webkit-transform: translateY(0) translateZ(0);
  }
  100% {
    transform: translateY(60vw) translateZ(0);
    -webkit-transform: translateY(60vw) translateZ(0);
  }
}

// 奖品一个一个呈现
@keyframes blowUp {
  0%,
  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
  20%,
  80% {
    transform: scale(2);
    -webkit-transform: scale(2);
  }
}

// 奖品闪耀
@keyframes shining {
  0%,
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

// 获奖星星展示
@keyframes showAwardNum {
  0%,
  93% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes changeBg {
  0%,
  92% {
    @include getBgImg("../../../assets/images/game/newshake/fireworks.gif");
    background-size: contain;
  }
  93%,
  100% {
    background: none;
  }
}

// 大树摇晃
@keyframes shaking {
  25% {
    transform: rotate(5deg);
    -webkit-transform: rotate(5deg);
  }
  50% {
    transform: rotate(-5deg);
    -webkit-transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
    -webkit-transform: rotate(5deg);
  }
  0%,
  100% {
    transform: rotate(0);
    -webkit-transform: rotate(0);
  }
}

//星星左移
@keyframes moveLeft {
  0% {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0) scale(1.5);
    -webkit-transform: translate3d(-50%, -50%, 0) scale(1.5);
  }

  99% {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-290%, -50%, 0) scale(1);
    -webkit-transform: translate3d(-290%, -50%, 0) scale(1);
  }
}
// 星星上移
@keyframes moveTop {
  0% {
    position: fixed;
    top: 43%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0) scale(1);
    -webkit-transform: translate3d(-50%, -50%, 0) scale(1);
  }

  99% {
    position: fixed;
    top: 6.4vw;
    left: 50%;
    transform: translate3d(-50%, -50%, 0) scale(1);
    -webkit-transform: translate3d(-50%, -50%, 0) scale(1);
  }
  100% {
    position: fixed;
    top: 6.4vw;
    left: 50%;
    transform: translate3d(-50%, -50%, 0) scale(0);
    -webkit-transform: translate3d(-50%, -50%, 0) scale(0);
  }
}
</style>
