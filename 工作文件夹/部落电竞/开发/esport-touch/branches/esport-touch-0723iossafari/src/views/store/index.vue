<template>
  <div class="Page store_Page">
    <header class="mod_header">
      <!-- <nav-bar :pageTitle="'商城'"></nav-bar> -->
    </header>
    <div class="main" id='mainId'>
      <template v-if="!showNodata">
        <mescroll ref="mescroll" :downLoadAuto="false" :isUseDown="false" @upCallback="upCallback" @mescrollInit="mescrollInit">
          <section class="product_group">
            <ul class="list">
              <li class="cur">全部</li>
              <li class="item" v-for="(item,index) in categoryList" :key="index" @click="goMore(item.id,item.name)">
                <!-- <i class="" :style="{'background-image':'url('+item.image+')'}"></i> -->
                {{item.name}}
              </li>
            </ul>
          </section>
          <banner class="banner" v-if="adList.length" ref="banner" :styleObject="styleObject" :adList="adList"></banner>
          <navList ref="navList" :dataList="goodTab" @changeTab="relodDataByTab"></navList>
          <goods-list :goodList="shopGoodList" :type='1'></goods-list>
        </mescroll>
      </template>
      <noData v-if="showNodata"> </noData>
    </div>

    <footer class="mod_footer">
      <tabbar></tabbar>
    </footer>

    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import navBar from '../../components/header/nav_bar/index';
import navList from '../../components/header/nav_list/index';
import goodsList from '../../components/store/goodsList.vue';
import Scroll from 'components/common/scroll';
import tabbar from '../../components/tabbar/index';
import noData from 'components/no_data/index';
import banner from '../../components/header/banner/swiper';
import mescroll from '../../components/common/mescroll.vue';

export default {
  components: {
    navBar,
    navList,
    goodsList,
    Scroll,
    tabbar,
    noData,
    banner,
    mescroll
  },
  data() {
    return {
      showNodata: false,
      categoryList: [],
      adList: [],
      clientType: 6,
      goodTab: [{ contentType: 1, name: '热门推荐' }, { contentType: 2, name: '上新' }, { contentType: 3, name: '人气排行' }],
      shopGoodList: [],
      goodParam: {
        pageNo: 1,
        pageSize: 10,
        goodsQueryType: 1
      },
      currPageSize: 0,
      scrollbar: { fade: true },
      pullDownRefresh: { threshold: 90, stop: 40, txt: '刷新成功' },
      pullUpLoad: {
        threshold: 10,
        txt: { more: '加载更多', noMore: '到底啦~' }
      }
    };
  },
  created() {
    window.sessionStorage.selectedTab = this.goodParam.goodsQueryType;
  },
  mounted() {
    this.getIndexData();
    this.getGoodsData().then(() => {
      if (this.shopGoodList.length == 0) {
        this.showNodata = true;
      }
    });
    this.$wxApi.wxRegister({
      title: '赢加竞技-商城',
      desc: '种草热门手办、动漫游戏周边、数码产品。',
      imgUrl: 'http://rs.esportzoo.com/svn/esport-res/mini/images/default/juzi_logo.jpg'
    });
  },
  computed: {
    // swiper() {
    //   return this.$refs.mySwiper.swiper;
    // }
  },
  deactivated() {
    console.log('sdsddsd');
    // this.shopGoodList = []
    console.log(this.goodParam.goodsQueryType);
    this.$refs.navList.selectedTab = this.goodParam.goodsQueryType;
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      // this.mescroll.setBounce(true)//允许iOS回弹,相当于配置up的isBounce为true
    },
    upCallback() {
      console.log('上拉加载更多');
      this.loadMore();
    },
    getIndexData() {
      let param = {};
      param.clientType = this.clientType;
      console.log('切换tab', param);
      this.$post('/api/shop/indexData', param)
        .then(rsp => {
          console.log(rsp);
          const dataResponse = rsp.data;
          if (rsp.code == '200') {
            console.log('setHeader---请求成功', dataResponse);
            this.categoryList = dataResponse.categoryList;
            this.adList = dataResponse.adList;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goMore(id, name) {
      console.log(id);
      this.$router.push({
        name: 'goodsList',
        params: {
          pageType: id,
          pageName: name,
          tabFlag: true
        }
      });
    },
    relodDataByTab(tabId) {
      let name = '上新';
      if (tabId == 3) {
        name = '人气排行';
      }
      this.$router.push({
        name: 'goodsList',
        params: {
          pageType: tabId,
          band: 1,
          pageName: name,
          tabFlag: false
        }
      });
      // console.log(tabId);
      // let param = this.goodParam
      // param.clientType = this.clientType;
      // this.contentType = tabId
      // param.contentType = this.contentType
      // this.getGoodsData(param)
    },
    getGoodsData(param) {
      if (!param) {
        param = {};
        param.pageNo = this.goodParam.pageNo;
        param.pageSize = this.goodParam.pageSize;
        param.goodsQueryType = this.goodParam.goodsQueryType;
      }
      console.log('切换tab', param);
      return this.$post('/api/shop/getGooods', param)
        .then(rsp => {
          console.log(rsp);
          const dataResponse = rsp.data;
          if (rsp.code == '200') {
            console.log('setHeader---请求成功', dataResponse);
            this.currPageSize = dataResponse.shopGoodList.length;
            this.shopGoodList = this.shopGoodList.concat(dataResponse.shopGoodList);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    onPullingUp() {
      console.log('you are onPullingUp');
      if (this._isDestroyed) {
        return;
      }
      if (this.currPageSize < this.goodParam.pageSize) {
        console.log('currPageSize', this.currPageSize);
        this.$refs.scroll.forceUpdate();
      } else {
        this.loadMore();
      }
    },

    /** 上拉加载*/
    loadMore() {
      let param = {};
      this.goodParam.pageNo += 1;
      param.pageNo = this.goodParam.pageNo;
      param.pageSize = this.goodParam.pageSize;
      param.goodsQueryType = this.goodParam.goodsQueryType;
      this.getGoodsData(param).then(data => {
        // this.$refs.scroll.forceUpdate();
        this.mescroll.endSuccess(this.currPageSize);
      });
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/common/_base';
@import '../../assets/common/_mixin';
@import '../../assets/common/_var';

.store_Page {
  .nav_list {
    margin-top: 8px;
    padding: 12px 0 0 12px;
    box-sizing: content-box;
    ul {
      padding-left: 0;
    }
    li {
      padding: 8px 12px;
      @include getRadiusBorder(#ddd, all, 6px);
      border-radius: 3px;
      &.active {
        color: #fff;
        background-color: #ff7e00;
        @include getRadiusBorder(#c36000, all, 6px);
      }
    }
  }
  .goods_list {
    padding: 6px;
    background-color: #fff;
    ul {
      @extend .flex_hc;
      flex-wrap: wrap;
      -webkit-flex-wrap: wrap;
    }
    .goods_name {
      display: block;
      @include t_nowrap(100%);
      line-height: 1.2;
    }
    .goods_item {
      width: 47%;
      margin: 1.5%;
      padding-bottom: 12px;
      border-radius: 9px;
      background-color: #fff;
      box-shadow: 0 0 4px rgba($color: #000000, $alpha: 0.1);
    }
    .goods_img {
      position: relative;
      width: 100%;
      padding-top: 100%;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 9px 9px 0 0;
      }
    }
    .goods_title {
      padding-top: 12px;
      font-size: 15px;
      color: #333;
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
    .num {
      padding-right: 5px;
    }
  }
  .back {
    display: none;
  }
  .nav_bar {
    color: #ff7e00 !important;
    font-weight: bold;
  }
}
</style>



<style lang='scss' scoped>
@import '../../assets/common/_var';
@import '../../assets/common/_base';
@import '../../assets/common/_mixin';

.mod_footer {
  background-color: #fff;
}

.product_group {
  background-color: #fff;
  height: 36px;
  overflow: hidden;
  ul {
    @extend .flex;
    height: calc(100% + 6px);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    li {
      height: 36px;
      font-size: 16px;
      padding: 10px 30px;
      color: #333;
      text-align: center;
      white-space: nowrap;
      &.cur {
        position: relative;
        color: #ff7e00;
        &::after {
          content: '';
          @extend .g_c_mid;
          bottom: 0;
          width: 20px;
          height: 3px;
          background-color: #ff7e00;
          border-radius: 2px;
        }
      }
    }
  }
  // .item {
  //   width: 25%;
  //   padding-bottom: 12px;
  //   text-align: center;
  //   i {
  //     display: block;
  //     width: 39px;
  //     height: 39px;
  //     margin: 0 auto;
  //     background-repeat: no-repeat;
  //     background-position: center;
  //     background-size: 32px;
  //   }
  //   span {
  //     font-size: 13px;
  //     color: #666;
  //   }
  // }
  .around_icon {
    @include getBgImg('../../assets/images/store/around_icon.png');
  }
  .garage_icon {
    @include getBgImg('../../assets/images/store/garage_icon.png');
  }
  .skin_icon {
    @include getBgImg('../../assets/images/store/skin_icon.png');
  }
  .digital_icon {
    @include getBgImg('../../assets/images/store/digital_icon.png');
  }
  .earphone_icon {
    @include getBgImg('../../assets/images/store/earphone_icon.png');
  }
  .computer_icon {
    @include getBgImg('../../assets/images/store/computer_icon.png');
  }
  .rat_icon {
    @include getBgImg('../../assets/images/store/rat_icon.png');
  }
  .hardware_icon {
    @include getBgImg('../../assets/images/store/hardware_icon.png');
  }
}

.banner {
  height: 32vw;
  margin-top: 8px;
}
</style>

