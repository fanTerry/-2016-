<!--
 * @Author: your name
 * @Date: 2020-06-04 09:23:46
 * @LastEditTime: 2020-06-04 12:00:09
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /esport-touch/src/views/user_center/follow/myFollow.vue
--> 
<template>
  <div class="Page myFollowPage">
    <header class="mod_header">
      <div class="tab">
        <div class="active">关注</div>
        <div @click="community()">热点</div>
        <div @click="matchTool()">发现</div>
      </div>
    </header>
    <div class="main" id='mainId'>
      <template v-if="!noData">
        <mescroll ref="mescroll" @downCallback="downCallback" @upCallback="upCallback" @mescrollInit="mescrollInit">
          <section class="myfollow_tab">
            <!-- 关注列表 -->
            <div class="user_list">
              <user-info v-for="(item,index) in followList" :key="index" :follower="item" :issueUserId="item.userId" @follow='follow'></user-info>
            </div>
          </section>
        </mescroll>
      </template>
      <noData v-if="noData"> </noData>
    </div>

    <footer class="mod_footer">
      <tabbar></tabbar>
    </footer>
  </div>
</template>
<script>
import userInfo from '../../../components/user_info/index.vue';
import tabBar from '../../../components/tabbar/index.vue';
import navBar from '../../../components/header/nav_bar/index';
import topic from '../../../components/user_follow/topic.vue';
import tabbar from 'components/tabbar/index.vue';
import localStorage from '../../../libs/storages/localStorage';
import noData from 'components/no_data/index';
import mescroll from '../../../components/common/mescroll.vue';

export default {
  components: {
    tabBar,
    navBar,
    topic,
    tabbar,
    noData,
    mescroll,
    userInfo
  },
  props: [],
  data() {
    return {
      followList: [],
      cmsContentList: [],
      pageNo: 1,
      pageSize: 10,
      currPageSize: 0,
      contentType: 100,
      scrollbar: { fade: true },
      pullDownRefresh: { threshold: 90, stop: 40, txt: '刷新成功' },
      pullUpLoad: {
        threshold: 10,
        txt: { more: '加载更多', noMore: '没有更多数据了' }
      },
      index: 1,
      turnToPrev: false,
      turnToNext: false,
      showType: 3,
      noData: false,
      loading: false,
      mescroll: null
    };
  },
  mounted() {},
  methods: {
    downCallback() {
      let param = {};
      this.pageNo = 1;
      param.pageNo = this.pageNo;
      param.pageSize = this.pageSize;
      if (this.contentType < 10) {
        param.contentType = this.showType;
      }
      this.followList = [];
      this.getPageData(param).then(data => {
        this.$nextTick(() => {
          this.mescroll.endSuccess(this.currPageSize);
        });
      });
    },
    upCallback() {
      console.log('加载更多');
      this.loadMore();
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    getPageData(param) {
      if (!param) {
        param = {};
        param.pageNo = 1;
        param.pageSize = 10;
      }
      param.followType = 2;
      console.log('分页参数', param);
      return this.$post('/api/user/pageFollowedUser', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == '200') {
            console.log(dataResponse, '关注首页--getPageData--请求成功');
            this.currPageSize = dataResponse.data.followedUserList.length;
            if (dataResponse.data.followedUserList.length > 0) {
              this.followList = this.followList.concat(dataResponse.data.followedUserList);
            }
            if (this.followList.length == 0) {
              this.noData = true;
            } else {
              this.noData = false;
            }
            console.log(this.followList.length, this.followList);
            return this.followList;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    follow(val) {
      console.log(val);
      for (var i = 0; i < this.followList.length; i++) {
        if (this.followList[i].userId == val.userId) {
          let follower = this.followList[i];
          this.updateFollowStatus(val.userId, val.followStatus).then(res => {
            if (res == '200') {
              console.log('res', res);
              follower.followStatus = val.followStatus;
              let param = {
                type: follower.followStatus,
                usrId: val.userId
              };
              this.$bus.$emit('detailFollow', param);
            }
          });
        }
      }
    },
    updateFollowStatus(userId, status) {
      let param = { type: status, usrId: userId };
      let message = '';
      if (status == 1) {
        message = '关注成功';
        localStorage.set('comment_follow_' + userId, true); //新增关注的usrId
      } else {
        message = '取消成功';
        localStorage.remove('comment_follow_' + userId); //删除取消关注的usrId
      }
      console.log('update-关注', param);
      return this.$post('/api/user/follow', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == '200') {
            this.$toast(message);
            return dataResponse.code;
          }
        })
        .catch(error => {
          this.$toast('网络异常，稍后再试');
          console.log(error);
          return dataResponse.code;
        });
    },
    /** 上拉加载*/
    loadMore() {
      this.pageNo = this.pageNo + 1;
      let param = {};
      param.pageNo = this.pageNo;
      param.pageSize = this.pageSize;
      if (this.contentType < 10) {
        param.contentType = this.showType;
      }
      /**
       * 关注列表
       */
      this.getPageData(param).then(data => {
        // this.$refs.scroll.forceUpdate();
        this.$nextTick(() => {
          this.mescroll.endSuccess(this.currPageSize);
        });
      });
    },
    matchTool() {
      this.$router.push({
        path: '/matchTool',
        query: {}
      });
    },
    community() {
      this.$router.push({
        path: '/community',
        query: {}
      });
    }
  }
};
</script>


<style lang='scss'>
.myFollowPage {
  .user_info {
    padding: 5.4667vw 3.2vw !important;
    .user_img {
      width: 14.6667vw !important;
      height: 14.6667vw !important;
      margin-right: 3.2vw !important;
    }
  }
  .myfollow_tab {
    .user_list {
      padding-left: 0 !important;
      background-color: transparent !important;
    }
    .user_info {
      margin: 2.1333vw 4.2667vw;
      background-color: #fff;
      border-radius: 5px;
      .name {
        font-size: 4.8vw;
        line-height: 5.3333vw;
      }
    }
  }
}
</style>

<style lang='scss' scoped>
@import '../../../assets/common/_base.scss';
@import '../../../assets/common/_mixin.scss';
@import '../../../assets/common/_var.scss';
@import '../../../assets/common/iconfont.css';

.no_data {
  @extend .g_v_c_mid;
}

.icon-tianxie {
  @extend .g_v_mid;
  right: 10px;
  font-size: 20px;
  color: #818181;
}

.mod_header {
  .tab {
    @extend .flex_v_h;
    padding: 0 9.3333vw;
    @include getBgLinear(bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 100%);
    background-color: $color_main;
    div {
      position: relative;
      padding: 2.1333vw 8vw 4.2667vw;
      font-size: 3.7333vw;
      line-height: 4.2667vw;
      color: rgba(255, 255, 255, 0.5);
      font-weight: bold;
      text-align: center;
      &.active {
        color: #fff;
        &::after {
          content: '';
          @extend .g_c_mid;
          bottom: 2.1333vw;
          width: 4vw;
          height: 1.0667vw;
          background-color: #fff;
          border-radius: 5px;
        }
      }
    }
  }
}

.main {
  position: relative;
  @include getBgLinear(bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 100%);
  background-color: $color_main;
  scroll-behavior: smooth;
  .nav_list {
    margin-bottom: 7px;
  }
}

.mod_follow {
  .my_follow_topic {
    padding: 0 10px;
    background-color: #fff;
    ul {
      @extend .flex;
      flex-wrap: wrap;
      -webkit-flex-wrap: wrap;
    }
    li {
      position: relative;
      width: 21.7%;
      padding-top: 21.7%;
      margin-right: 4.4%;
      margin-bottom: 14px;
      box-shadow: 0 0 4px rgba(#000000, 0.1);
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
  .team {
    @extend .g_v_c_mid;
    @extend .flex_v_h;
    flex-direction: column;
    -webkit-flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: center;
    img {
      width: 65%;
      height: 65%;
      object-fit: contain;
    }
    p {
      padding-top: 5px;
      font-size: 12px;
      color: #333;
    }
  }
  h3 {
    @extend .flex_v_justify;
    padding: 12px 0 20px;
    font-size: 14px;
    font-weight: normal;
    color: #000;
    a {
      @extend .flex_hc;
      font-size: 12px;
      color: #999;
      span {
        position: relative;
        width: 14px;
        height: 14px;
        @include getArrow(7px, #999, right);
      }
    }
  }
}

.myfollow_tab {
  .user_list,
  .search_result {
    padding-left: 10px;
    background-color: #fff;
  }

  .search_result {
    position: relative;
    padding-left: 0;
    .user_info:last-child:after {
      content: '';
      @extend .g_c_mid;
      bottom: 0;
      width: 80%;
      height: 1px;
      background-color: #ddd;
    }
  }

  .user_list {
    h2 {
      padding-top: 3px;
    }
  }
  .search_con {
    position: relative;
    @extend .flex;
    padding: 0 45px;
    margin-bottom: 10px;
    input {
      flex: 1;
      height: 24px;
      padding-left: 30px;
      border-radius: 24px;
      background-color: #fff;
      border: none;
    }
    .search {
      @extend .g_v_mid;
      left: 52px;
      width: 16px;
      height: 16px;
      @include getBgImg('../../../assets/images/home/search.png');
    }
  }
}

.ui_pop {
  transform: translateY(100%);
  -webkit-transform: translateY(100%);
  .tab {
    position: absolute;
    bottom: 0;
    width: 100%;
    @extend .flex;
    background-color: #fff;
    @media only screen and (min-device-width: 375px) and (min-device-height: 812px) and (-webkit-device-pixel-ratio: 3),
      only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
      padding-bottom: constant(safe-area-inset-bottom) !important;
      padding-bottom: env(safe-area-inset-bottom) !important;
    }
    div {
      position: relative;
      flex: 1;
      -webkit-flex: 1;
      padding: 17px 0;
      font-size: 16px;
      color: #000;
      text-align: center;
      &.active {
        color: $color_main;
      }
    }
  }
}

.sidebar {
  position: fixed;
  z-index: 99;
  bottom: 95px;
  right: 10px;
  color: #c2c2c2;
  text-align: center;
  .icon-sousuo {
    font-size: 12px;
    color: currentColor;
  }
  a {
    display: block;
    padding: 5px 0;
    font-size: 15px;
    color: currentColor;
  }
}
</style>
