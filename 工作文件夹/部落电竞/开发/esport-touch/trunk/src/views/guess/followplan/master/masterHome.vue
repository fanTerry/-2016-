<template>
  <div class='Page godPage'>
    <header class='mod_header'>
      <nav-bar :pageTitle="'大神主页'"></nav-bar>
    </header>
    <div class='main' id="mainId">
      <mescroll ref="mescroll" @downCallback="downCallback" @upCallback="upCallback" @mescrollInit="mescrollInit" :isShowEmpty="false">
        <!-- 大神信息 -->
        <master-info ref="masterInfo"></master-info>
        <!-- 10场红单情况 -->
        <ul class="bills" v-if="tenScore!=null">
          <li :class="{right:item==1,wrong:item==0}" v-for="(item,index) in tenScore" :key='index'>
            {{item==1?'红':'黑'}}</li>
          <!-- <li class="wrong">黑</li> -->
        </ul>
        <!-- 投单列表 -->
        <ul class="orders">
          <follow-plan-item :recommendDetail="item" :orderType="false" v-for="(item,index) in this.planRecommendInfo.dataList" :key='index'></follow-plan-item>
        </ul>
      </mescroll>
    </div>
    <footer class='mod_footer'>

    </footer>
  </div>
</template>

<script>
import navBar from '../../../../components/header/nav_bar/index.vue';
import masterInfo from '../components/masterInfo.vue';
import followPlanItem from '../components/followPlanItem';
import mescroll from '../../../../components/common/mescroll.vue';

export default {
  components: { navBar, masterInfo, followPlanItem, mescroll },
  props: [],
  data() {
    return {
      mescroll: null,
      userId: null,
      tenScore: null,
      planRecommendInfo: {
        loadMore: true,
        currPageSize: 10,
        dataList: [],
        requestParam: {
          pageNo: 1,
          pageSize: 10,
          followQueryType: 1 //我的发单
        },
        userScore: ''
      }
    };
  },
  mounted() {
    this.userId = this.$route.query.uid;
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      // this.mescroll.setBounce(true)//允许iOS回弹,相当于配置up的isBounce为true
    },
    downCallback() {
      console.log('下拉刷新');
      // this.refresh(true);
      // this.mescroll.setPageNum(2);
      this.$refs.masterInfo.getTenWinInfo().then(data => {
        this.tenScore = this.$refs.masterInfo.tenwinUserInfo.bet10WinDetail;
      });
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
      param.userId = this.userId;
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
    }
  }
};
</script>

<style lang="scss">
@import '../../../../assets/common/_base';
.godPage {
  .user_info {
    display: none !important;
  }
  .mod_header {
    background-color: $color_item;
  }
  .nav_bar {
    color: #fff !important;
    .back {
      &::before,
      &::after {
        background-color: #fff !important;
      }
    }
  }
}
</style>


<style lang='scss' scoped>
@import '../../../../assets/common/_base';
@import '../../../../assets/common/_mixin';

.bills {
  @extend .flex_hc;
  margin-top: 2.1333vw;
  padding: 3.2vw 2.9333vw;
  background-color: $color_item;
  li {
    @extend .flex_v_h;
    width: 6.6667vw;
    height: 6.6667vw;
    margin: 0 1.3333vw;
    border-radius: 50%;
    font-size: 3.2vw;
    color: #fff;
  }
  .right {
    background-color: #c85958;
  }
  .wrong {
    background-color: #191822;
  }
}

.orders {
  margin: 0 4.2667vw;
}
</style>
