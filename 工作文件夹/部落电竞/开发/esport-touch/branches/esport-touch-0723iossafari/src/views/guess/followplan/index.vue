<template>
  <div class='Page followPlanPage' ref="followPlanPage">
    <header class='mod_header'>

    </header>
    <div class='main' id='mainId'>
      <mescroll class="mescroll" ref="mescroll" @downCallback="downCallback" @upCallback="upCallback" @mescrollInit="mescrollInit" :isShowEmpty="false">
        <!-- banner图 -->
        <section class="banner" v-if="adList.length >0 && isKeep">
          <banner ref="banner" :adList="adList">
          </banner>
        </section>
        <!-- tab选项卡 -->
        <figure class="mod_tab">
          <!-- <div class="active">大神跟单</div>
          <div>专家方案</div> -->
        </figure>
        <!-- 大神跟单和专家方案 -->
        <section class="mod_expert" v-if="planRecommendInfo.tenWinList.length>0">
          <div class="title">
            <span>大神跟单</span>
            <span class="percent">(十单胜率)</span>
            <a class="my_god" @click="goUrlPage('/myFollow')">我的大神</a>
          </div>
          <div class="god_list">
            <ul>
              <li class="item" v-for="(item,index) in planRecommendInfo.tenWinList" :key="index" @click="goUrlPageWithUserId('/followPlan/masterHome',item.userId)">
                <div class="user_img">
                  <img :src="item.icon |getDefaultImg(globalConst.userDefaultIcon)" alt="">
                </div>
                <p class="name">{{item.nickName}}</p>
                <p class="percent_num">{{item.tenWinRate}}</p>
              </li>
            </ul>
          </div>
        </section>
        <!-- 排行榜tab -->
        <section class="mod_rank">
          <ul class="tab">
            <li @click="changeBnad(item.type)" :class="{active:planRecommendInfo.currBandType==item.type}" v-for='(item,index) in planRecommendInfo.bandTypeArr' :key="index">{{item.name}}</li>
          </ul>
          <!-- 大神跟单 -->
          <ul class="orders">
            <follow-plan-item :recommendDetail="item" :orderType="false" v-for="(item,index) in this.planRecommendInfo.dataList" :key="index"></follow-plan-item>
          </ul>
          <!-- 专家方案 -->
          <!-- <ul class="projects">
            <expert-project-item></expert-project-item>
          </ul> -->
        </section>
      </mescroll>
      <no-data v-if="noData" :text="'暂无数据'"> </no-data>
    </div>
    <footer class='mod_footer' v-show="isShowFooter">
      <tabbar></tabbar>
    </footer>
  </div>
</template>

<script>
import tabbar from '../../../components/tabbar/index.vue';
import banner from '../../../components/header/banner/swiper.vue';
import followPlanItem from './components/followPlanItem.vue';
import expertProjectItem from '../expert/components/expertProjectItem.vue';
import mescroll from '../../../components/common/mescroll.vue';
import noData from '../../../components/no_data/index.vue';

export default {
  components: { tabbar, banner, followPlanItem, expertProjectItem, mescroll, noData },
  props: [],
  data() {
    return {
      adList: [],
      noData: false,
      mescroll: null,
      isShowFooter: true,
      isKeep: false,
      planRecommendInfo: {
        tenWinList: [],
        loadMore: true,
        currPageSize: 10,
        dataList: [],
        requestParam: {
          pageNo: 1,
          pageSize: 10,
          followQueryType: 4 //4金额、5人气、6、命中 2、我关注
        },
        currBandType: 4,
        bandTypeArr: [
          {
            type: 4,
            name: '金额榜'
          },
          {
            type: 5,
            name: '人气榜'
          },
          {
            type: 6,
            name: '命中榜'
          },
          {
            type: 2,
            name: '我关注的'
          }
        ]
      }
    };
  },
  mounted() {
    this.getBannerUrl();
    this.getTenWinBand();

    this.$bus.$off('showFooter').$on('showFooter', this.showFooter);
  },
  activated() {
    this.isKeep = true;
  },
  deactivated() {
    this.isKeep = false;
  },
  methods: {
    // 弹起投注弹窗的时候关闭底部栏
    showFooter(param) {
      this.isShowFooter = param;
      console.log(this.isShowFooter);
    },
    //预测大神跟单页广告
    getBannerUrl() {
      let param = { typeStr: '10' };
      return this.$post('/api/getAdList', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            console.log(dataResponse, '大神跟单页广告');
            this.adList = dataResponse.data.adList10;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goUrlPageWithUserId(url, userId) {
      console.log('用户ID', userId);
      this.$router.push({
        path: url,
        query: { uid: userId }
      });
    },
    goUrlPage(url) {
      this.$router.push({
        path: url
      });
    },
    goToGodPage(userId) {
      console.log('跳转大神主页', userId);
    },
    //近10场胜率榜单
    getTenWinBand() {
      return this.$post('/api/planRecommend/getTenWinBand')
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            let dataList = dataResponse.data;
            if (dataList.length > 0) {
              this.planRecommendInfo.tenWinList = dataList;
            }
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
      this.getTenWinBand();
      this.planRecommendInfo.dataList = [];
      this.planRecommendInfo.requestParam.pageNo = 1;
      this.pageData().then(data => {
        this.$nextTick(() => {
          this.mescroll.endSuccess(this.planRecommendInfo.currPageSize, this.planRecommendInfo.loadMore);
        });
      });
    },
    upCallback() {
      console.log('上拉加载更多');
      this.planRecommendInfo.requestParam.pageNo += 1;
      this.pageData().then(data => {
        this.$nextTick(() => {
          this.mescroll.endSuccess(this.planRecommendInfo.currPageSize, this.planRecommendInfo.loadMore);
        });
      });
    },
    //分页数据查询
    pageData() {
      let param = {};
      param = this.planRecommendInfo.requestParam;
      return this.$post('/api/planRecommend/pageData', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            let dataList = dataResponse.data.dataList;
            if (dataList) {
              this.planRecommendInfo.currPageSize = dataList.length;
            }
            this.planRecommendInfo.loadMore = dataResponse.data.hasNext;
            this.planRecommendInfo.dataList = this.planRecommendInfo.dataList.concat(dataList);
            this.planRecommendInfo.requestParam.pageNo = dataResponse.data.pageNo;
          }
          if (this.planRecommendInfo.dataList.length > 0) {
            this.noData = false;
          } else {
            this.noData = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //切换榜单
    changeBnad(bandType) {
      if (bandType == this.planRecommendInfo.currBandType) {
        return;
      }
      this.planRecommendInfo.dataList = [];
      this.planRecommendInfo.currBandType = bandType;
      this.planRecommendInfo.requestParam.pageNo = 1;
      this.planRecommendInfo.requestParam.followQueryType = bandType;
      this.pageData().then(data => {
        this.$nextTick(() => {
          this.mescroll.endSuccess(this.planRecommendInfo.currPageSize, this.planRecommendInfo.loadMore);
        });
        setTimeout(() => {
          $('.upwarp-nodata').hide();
        }, 50);
      });
    }
  }
};
</script>

<style lang="scss">
.followPlanPage {
  .follow_order {
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>


<style lang='scss' scoped>
@import '../../../assets/common/_base';
@import '../../../assets/common/_mixin';

.mescroll {
  background-color: $color_main;
}

.banner {
  margin: 3.2vw 4.2667vw;
  padding: 1.0667vw;
  border-radius: $border_radius;
  background-color: $color_item;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
}

.mod_tab {
  @extend .flex_v_h;
  div {
    padding: 4.2667vw 8vw;
    font-size: 3.7333vw;
    line-height: 4.2667vw;
    color: rgba(255, 255, 255, 0.5);
    font-weight: bold;
    &.active {
      position: relative;
      color: #fff;
      &::after {
        content: '';
        @extend .g_c_mid;
        bottom: 2.1333vw;
        width: 4vw;
        height: 1.0667vw;
        background-color: #fff;
        border-radius: 0.6667vw;
      }
    }
  }
}

.mod_expert {
  margin: 2.9333vw 4.2667vw 0;
  .title {
    position: relative;
    font-size: 4.2667vw;
    line-height: 4.8vw;
    color: #fff;
    font-weight: bold;
  }
  .percent {
    padding-left: 1.0667vw;
    font-size: 2.6667vw;
    color: rgba(255, 255, 255, 0.5);
  }
  .my_god {
    @extend .g_v_mid;
    right: 0;
    padding: 1.6vw;
    font-size: 3.2vw;
    border-radius: $border_radius;
    color: #fff;
    background-color: #666695;
  }
  .god_list {
    height: 25.8667vw;
    overflow: hidden;
    ul {
      @extend .flex_hc;
      flex-wrap: nowrap;
      -webkit-flex-wrap: nowrap;
      height: calc(100% + 6px);
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
    .item {
      padding: 3.2vw 5.0667vw 3.2vw 3.2vw;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      p {
        font-size: 2.6667vw;
        line-height: 3.2vw;
        white-space: nowrap;
      }
    }
    .user_img {
      width: 10.4vw;
      height: 10.4vw;
      margin: 0 auto;
      @include getRadiusBorder(#fff, all, 50%);
      border-radius: 50%;
    }
    .name {
      @include t_nowrap(13.8667vw);
      margin-top: 2.1333vw;
      color: #fff;
    }
    .percent_num {
      margin-top: 0.5334vw;
      font-weight: bold;
      color: $color_yellow;
    }
  }
}

.mod_rank {
  .tab {
    position: sticky;
    top: 0;
    z-index: 1;
    @extend .flex_v_justify;
    padding: 2.1333vw 4.2667vw;
    background-color: $color_main;
    li {
      padding: 1.3334vw 3.4667vw;
      font-size: 3.7333vw;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.5);
      &.active {
        border-radius: $border_radius;
        color: #fff !important;
        background-color: #666695;
      }
    }
  }
  .orders,
  .projects {
    overflow: hidden;
    margin: 0 4.2667vw;
  }
}
</style>
