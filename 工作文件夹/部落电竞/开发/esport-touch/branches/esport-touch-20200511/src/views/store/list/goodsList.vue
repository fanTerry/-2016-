<template>
  <div class="Page goodsListPage">
    <header class="mod_header mescroll-touch-x">
      <navBar :pageTitle="pageName"></navBar>
      <navList :dataList="goodTab" @changeTab="relodDataByTab" v-if="tabFlag"></navList>
    </header>
    <div class="main" id='mainId' :class="{flex_v_h:shopGoodList.length==0}">

      <!-- <scroll v-if="dataFlag==2" ref="scroll" :scrollbar="scrollbar" :pullUpLoad="pullUpLoad" :startY="0"
        @pullingUp="onPullingUp"> -->
      <mescroll v-show="dataFlag==2" ref="mescroll" :downLoadAuto="false" :isUseDown="false" @upCallback="upCallback"
        @mescrollInit="mescrollInit">

        <goodsList :goodList="shopGoodList" :type='2' :pageType="pageType" :band="tabFlag"></goodsList>

        <!-- </scroll> -->
      </mescroll>
      <noData v-show="dataFlag==3"> </noData>
      <loading v-show="dataFlag==1"></loading>

    </div>
  </div>
</template>

<script>
import navBar from "../../../components/header/nav_bar";
import navList from "../../../components/header/nav_list";
import goodsList from "../../../components/store/goodsList";
import noData from "components/no_data/index";
import Scroll from "components/common/scroll";
import loading from "components/common/loading";
import mescroll from "../../../components/common/mescroll.vue";

import { mapMutations } from "vuex";

export default {
  components: {
    navBar,
    navList,
    goodsList,
    noData,
    Scroll,
    loading,
    mescroll
  },
  data() {
    return {
      dataFlag: 1,
      shopGoodList: [],
      goodTab: [],
      pageType: Number,
      pageName: "",
      tabFlag: true,
      clientType: 6,
      goodParam: {
        pageNo: 1,
        pageSize: 10,
        contentType: 0
      },
      currPageSize: 10,
      scrollbar: { fade: true },
      pullDownRefresh: { threshold: 90, stop: 40, txt: "刷新成功" },
      pullUpLoad: {
        threshold: 10,
        txt: { more: "加载更多", noMore: "到底啦~" }
      }
    };
  },
  created() {
    if (this.$route.params.pageType) {
      this.pageType = parseInt(this.$route.params.pageType);
      this.pageName = this.$route.params.pageName;
      if (
        this.$route.params.tabFlag == true ||
        this.$route.params.tabFlag == "true"
      ) {
        this.tabFlag = true;
      } else {
        this.tabFlag = false;
      }
      this.MY_GOOD_LIST_TAB(this.$route.params);
    } else if (this.$store.state.myGoodlistParam) {
      let param = this.$store.state.myGoodlistParam;
      this.pageType = param.pageType;
      this.pageName = param.pageName;
      this.tabFlag = param.tabFlag;
    }

    if (this.pageName == "人气排行") {
      this.goodParam.pageSize = 50;
    }

    // if (this.$route.query.tabFlag) {
    // }
    window.sessionStorage.selectedTab = this.pageType;
    this.goodTab.push({
      contentType: 0,
      name: "全部"
    });
  },
  mounted() {
    if (this.tabFlag) {
      this.getTab();
    }
    this.getGoodsData();
  },
  methods: {
    ...mapMutations(["MY_GOOD_LIST_TAB"]),
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      // this.mescroll.setBounce(true)//允许iOS回弹,相当于配置up的isBounce为true
    },
    upCallback() {
      console.log("上拉加载更多");
      this.loadMore();
    },
    relodDataByTab(tabId) {
      this.$store.state.myGoodlistParam.pageType = tabId;
      window.sessionStorage.selectedTab = tabId;
      this.goodParam.pageNo = 1;
      this.goodParam.pageSize = 10;
      this.shopGoodList = [];
      this.pageType = tabId;
      let param = this.goodParam;
      param.clientType = this.clientType;
      param.contentType = this.pageType;
      this.goodTab.forEach(element => {
        if (element.contentType == this.pageType) {
          this.pageName = element.name;
        }
      });
      this.getGoodsData(param).then(data => {
        this.mescroll.endSuccess(this.currPageSize);
      });
    },
    getTab() {
      let param = {};
      param.clientType = this.clientType;
      console.log("切换tab", param);
      this.$post("/api/shop/indexData", param)
        .then(rsp => {
          console.log(rsp);
          const dataResponse = rsp.data;
          if (rsp.code == "200") {
            console.log("getTab---请求成功", dataResponse);
            let temp = [];
            dataResponse.categoryList.forEach(element => {
              temp.push({
                contentType: element.id,
                name: element.name
              });
            });
            this.goodTab = this.goodTab.concat(temp);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getGoodsData(param) {
      if (!param) {
        param = this.goodParam;
        if (!this.tabFlag) {
          param.goodsQueryType = this.pageType;
        } else {
          param.contentType = this.pageType;
        }
      }

      console.log("切换tab", param);
      return this.$post("/api/shop/getGooods", param)
        .then(rsp => {
          console.log(rsp);
          const dataResponse = rsp.data;
          if (rsp.code == "200") {
            console.log("getGoodsData---请求成功", dataResponse);
            this.currPageSize = dataResponse.shopGoodList.length;
            this.shopGoodList = this.shopGoodList.concat(
              dataResponse.shopGoodList
            );

            if (this.shopGoodList.length > 0) {
              this.dataFlag = 2;
            } else {
              this.dataFlag = 3;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onPullingUp() {
      console.log("you are onPullingUp");
      if (this._isDestroyed) {
        return;
      }
      if (this.currPageSize < this.goodParam.pageSize) {
        console.log("currPageSize", this.currPageSize);
        this.$refs.scroll.forceUpdate();
      } else {
        this.loadMore();
      }
    },

    /** 上拉加载*/
    loadMore() {
      this.goodParam.pageNo += 1;
      let param = {};
      param.pageNo = this.goodParam.pageNo;
      param.pageSize = this.goodParam.pageSize;
      if (!this.tabFlag) {
        param.goodsQueryType = this.pageType;
      } else {
        param.contentType = this.pageType;
      }
      this.getGoodsData(param).then(data => {
        this.mescroll.endSuccess(this.currPageSize);
      });
    }
  },
  
};
</script>

<style lang="scss">
@import "../../../assets/common/_base";
@import "../../../assets/common/_mixin";
@import "../../../assets/common/_var";

.goodsListPage {
  .nav_list {
    ul {
      padding-left: 10px !important;
    }
  }
  .goods_list {
    padding-top: 2px;
    padding-bottom: 10px;
    background-color: #fff;
    h3 {
      line-height: 35px;
      font-size: 13px;
      color: #999;
      font-weight: normal;
      text-align: center;
    }
    .goods_item {
      position: relative;
      @extend .flex_v_justify;
      padding: 0 12px;
      margin-top: 8px;
    }
    .goods_img {
      position: relative;
      width: 35.5%;
      padding-top: 35.5%;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 2px;
      }
    }
    .goods_title {
      @extend .flex_v_justify;
      font-size: 18px;
      color: #333;
      font-weight: 500;
    }
    .goods_info {
      @extend .flex_justify;
      flex-direction: column;
      -webkit-flex-direction: column;
      position: absolute;
      left: 35.5%;
      width: calc(100% - 35.5%);
      height: 100%;
      padding: 4px 0 4px 12px;
      flex: 1;
      -webkit-flex: 1;
    }
    .goods_detail {
      @extend .flex;
      align-items: flex-end;
      padding-top: 4px;
      color: #ccc;
      span {
        @extend .flex_hc;
      }
    }
    .rank_first,
    .rank_second,
    .rank_third {
      position: absolute;
      right: 10px;
      top: 0;
    }
    .tag {
      font-size: 13px;
      color: $color_main;
    }
    .num {
      padding-right: 5px;
    }
    .buy_num {
      padding-top: 8px;
    }
  }
}
</style>
<style lang='scss' scoped>
.main {
  padding-top: 8px;
}
</style>
