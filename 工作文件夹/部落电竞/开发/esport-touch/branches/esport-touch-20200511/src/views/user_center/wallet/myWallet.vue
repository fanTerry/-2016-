<template>
  <div class="Page myWalletPage">
    <header class="mod_header">
      <navBar></navBar>
      <!-- 枫叶余额 -->
      <section class="banlance">
        <p>星星余额</p>
        <div>
          <span class="num">138000.00</span>
          <a @click="popUps.showRechargePop = true">星星获取</a>
        </div>
      </section>
      <!-- <div class="recharge">
        <a class="recharge_btn" @click="goRecharge()">充值</a>
        <div>
          <p>拥有星星数量</p>
          <span>{{balance}}</span>
        </div>
        <div>
          <p>账户限额</p>
          <span>0</span>
        </div>
      </div> -->
      <!-- <ul class="recharge_list">
				<li class="active">金币明细</li>
				<li>限额明细</li>
				<li>充值明细</li>
				<div class="game_list">
					<span class="active">LOL</span>
					<span>LOL</span>
					<span>LOL</span>
					<span>LOL</span>
					<span>LOL</span>
				</div>
			</ul> -->
    </header>

    <div class="main" id='mainId'>
      <!-- <scroll v-if="!noData" ref="scroll" :scrollbar="scrollbar" :pullUpLoad="pullUpLoad" :startY="0"
        @pullingUp="onPullingUp"> -->
      <mescroll ref="mescroll" @downCallback="downCallback" @upCallback="upCallback" @mescrollInit="mescrollInit">
        <section class="bought_record" v-for="(item ,index) in  dataMap" :key=index>
          <h3>{{item.time}}</h3>
          <section class="record_list">
            <div class="item" v-for="(walletLog,index) in item.dataList" :key="index">
              <div class="flex_hc">
                <!-- <img src="" alt=""> -->
                <div>
                  <p class="goods"><span>{{walletLog.remark?walletLog.remark:'购买'}}</span><span> </span></p>
                  <span class="time">{{walletLog.createTime}}</span>
                </div>
              </div>
              <div class="tar">
                <p class="cost">{{walletLog.walletOprType==1?'+':'-'}} {{walletLog.recHappenScore}}</p>
                <span class="balance">余额 {{walletLog.recEndAbleScore}}</span>
              </div>
              <!-- <span class="link"></span> -->
            </div>
          </section>

        </section>
      </mescroll>
      <!-- </scroll> -->
      <noData v-if="noData"> </noData>
      <recharge-pop v-if="popUps.showRechargePop" @closeRechargePop="popUps.showRechargePop = false"
        @getUserWallet="getUserWallet()">
      </recharge-pop>
    </div>

  </div>
</template>

<script>
// import Scroll from "components/common/scroll";
import noData from "components/no_data/index";
import navBar from "../../../components/header/nav_bar/index";
import mescroll from "../../../components/common/mescroll.vue";
import rechargePop from "../../guess/recharge/recharge.vue";

export default {
  components: {
    // Scroll,
    noData,
    navBar,
    mescroll,
    rechargePop
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      type: 0,
      balance: 0,
      dataMap: [],
      hasNextPage: false,
      noData: false,
      scrollbar: { fade: true },
      pullUpLoad: {
        threshold: 10,
        txt: { more: "加载更多", noMore: "没有更多数据了" }
      },
      index: 1,
      turnToPrev: false,
      turnToNext: false,
      currPageSize: 10,
      mescroll: null,
      mescrollConfig: {
        warpId: "mainId", //设置置顶时，必须设置父容器ID
        hasToTop: true //默认不开启回到顶部项
      },
      popUps: {
        showRechargePop: false
      }
    };
  },
  mounted() {
    this.$refs.mescroll.config = this.mescrollConfig;
    // this.getPageData();
  },
  methods: {
    goBack() {
      this.$router.back(-1);
    },
    getPageData(param) {
      if (!param) {
        param = {};
        param.pageNo = 1;
        param.pageSize = 10;
        param.type = 0;
      }
      console.log("分页参数", param);
      return this.$post("/api/usercenter/getWalletLog", param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == "200") {
            console.log(dataResponse, "钱包流水查询--getPageData--请求成功");
            if (dataResponse.data) {
              if (param.type === 0) {
                this.balance = dataResponse.data.balance;
              }
              this.hasNextPage = dataResponse.data.hasNextPage;
              this.hanldDataLog(dataResponse.data.listMap);
              if (param.pageNo == 1 && !dataResponse.data.listMap) {
                this.noData = true;
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    hanldDataLog(data) {
      let listMap = [];
      for (var key in data) {
        var el = {
          time: key,
          dataList: data[key]
        };
        listMap.push(el);
      }

      let selfMap = this.dataMap;
      if (selfMap.length > 0) {
        var index = selfMap.length - 1;
        if (selfMap[index].time === listMap[0].time) {
          selfMap[index].dataList = selfMap[index].dataList.concat(
            listMap[0].dataList
          );
          listMap.shift();
        }
      }
      for (var i = 0; i < listMap.length; i++) {
        selfMap.push(listMap[i]);
      }
      this.dataMap = selfMap;
    },
    goRecharge() {
      let clientType = this.$route.query.clientType;
      if (clientType == 4) {
        this.$router.push({
          path: "/iosRecharge",
          query: {}
        });
      } else {
        this.$router.push({
          path: "/recharge",
          query: {
            redirect: this.$route.path
          }
        });
      }
    },

    // onPullingUp() {
    //   console.log("you are onPullingUp");
    //   if (this._isDestroyed) {
    //     return;
    //   }
    //   console.log("--", this.hasNextPage);
    //   if (!this.hasNextPage) {
    //     console.log("hasNextPage", this.hasNextPage);
    //     this.$refs.scroll.forceUpdate();
    //   } else {
    //     this.loadMore();
    //   }
    // },

    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      this.mescroll.setBounce(true);
    },
    downCallback() {
      console.log("下拉刷新");
      let param = {};
      this.pageNo = 1;
      param.pageNo = 1;
      param.pageSize = 10;
      param.type = 0;
      this.dataMap = [];
      this.getPageData(param).then(() => {
        this.$nextTick(() => {
          this.mescroll.endSuccess(this.currPageSize, this.hasNextPage);
        });
      });
    },
    upCallback() {
      console.log("上拉加载更多6666");
      this.loadMore();
    },

    /** 上拉加载*/
    loadMore() {
      let param = {};
      this.pageNo = this.pageNo + 1;
      param.pageNo = this.pageNo;
      param.pageSize = this.pageSize;
      param.type = 1;
      this.getPageData(param).then(() => {
        this.$nextTick(() => {
          this.mescroll.endSuccess(this.currPageSize, this.hasNextPage);
        });
      });
    }
  }
};
</script>

<style lang="scss">
.myWalletPage {
  .back {
    &::before,
    &::after {
      background-color: #fff !important;
    }
  }
  .nav_bar {
    min-height: 44px;
  }
}
</style>


<style lang='scss' scoped>
@import "../../../assets/common/_base.scss";
@import "../../../assets/common/_mixin.scss";
@import "../../../assets/common/_var.scss";


.mod_header {
  @include getBgImg("../../../assets/images/guess/wallet_bg.png");
  background-size: 29.4667vw auto;
  background-position: top center;
  background-color: transparent;
}

.banlance {
  margin: 21.0667vw 4.2667vw 2.1333vw;
  padding: 4vw 4.2667vw;
  background-color: #fff;
  border-radius: 1.3333vw;
  p {
    font-size: 3.2vw;
    color: #333;
  }
  div {
    @extend .flex_v_justify;
    margin-top: 1.3333vw;
  }
  .num {
    font-size: 9.3333vw;
    font-weight: bold;
    color: #d33940;
  }
  a {
    padding: 2.1333vw;
    font-size: 3.2vw;
    border-radius: 0.8vw;
    color: #fff;
    background-color: #d13840;
  }
}

.recharge {
  position: relative;
  margin: 10px 5px;
  padding: 15px 20px;
  border-radius: 8px;
  @include getBgImg("../../../assets/images/user_center/wallet.png");
  > div {
    padding-bottom: 20px;
    &:last-child {
      padding-bottom: 0;
    }
  }
  p {
    font-size: 14px;
    color: #fffe93;
  }
  span {
    display: block;
    padding-top: 10px;
    font-size: 21px;
    color: #ffffff;
  }
  .recharge_btn {
    position: absolute;
    right: 5px;
    bottom: 15px;
    padding: 6px 25px;
    font-size: 14px;
    border-radius: 40px;
    border: 1px solid #fff;
    color: #fff;
  }
}
.recharge_list {
  position: relative;
  @extend .flex_v_justify;
  margin: 0 5px;
  padding: 3px 20px 3px 10px;
  border-radius: 8px;
  background-color: #fff;
  li {
    position: relative;
    padding: 8px 3px;
    color: #818181;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(100%, 50%);
      -webkit-transform: translate(100%, 50%);
      @include getTriangle(4px, currentColor, down);
    }
    &.active {
      color: $color_main;
      border-bottom: 1px solid currentColor;
      &::after {
        @include getTriangle(4px, currentColor, down);
      }
    }
  }
  .game_list {
    @extend .flex_v_justify;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    position: absolute;
    z-index: 999;
    top: 100%;
    left: 0;
    width: 100%;
    padding: 10px 5px;
    border-radius: 8px 8px 0 0;
    background-color: #fff;
    span {
      @extend .flex_v_h;
      width: 20%;
      height: 20px;
      margin: 0 5px 10px;
      color: #818181;
      border: 1px solid #999;
      border-radius: 20px;
    }
    .active {
      color: $color_main;
      border: 1px solid currentColor;
    }
  }
}

.bought_record {
  margin: 0 4.2667vw;
  .record_list {
    margin-bottom: 2.1333vw;
    border-radius: 8px;
    background-color: #fff;
  }
  h3 {
    padding-bottom: 2.1333vw;
    font-size: 3.7333vw;
    line-height: 4.2667vw;
    color: #fff;
  }
  .item {
    position: relative;
    padding: 3.7333vw 3.2vw;
    @extend .flex_v_justify;
    @include getBorder(bottom, #ddd);
    &:last-child {
      background: none;
    }
  }
  .link {
    position: absolute;
    right: 15px;
    @include getArrow(8px, rgba(0, 0, 0, 0.5), right);
  }
  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 50%;
    object-fit: cover;
  }
  .goods {
    font-size: 3.7333vw;
    line-height: 4.2667vw;
    color: #333;
    span {
      padding-right: 10px;
    }
  }
  .time,
  .balance {
    display: block;
    margin-top: 1.0667vw;
    color: #999;
  }
  .cost {
    font-size: 4.2667vw;
    line-height: 4.8vw;
    color: #333;
    font-weight: 500;
  }
}
</style>
