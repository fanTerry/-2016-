<template>
  <div class="user_info">
    <div v-on:click.stop="toAuthorDetail(issueUserId)">
      <div class="user_img " :class="{active:follower.followStatus==0}">
        <img :src="follower.userIcon|getDefaultImg(globalConst.userDefaultIcon)" alt="">
      </div>
      <div>
        <div class="name">{{follower.userNickName}}</div>
        <p class="tips">
          <span>{{follower.fans}}粉丝</span>
          <!-- <span>100万阅读</span> -->
        </p>
      </div>
    </div>
    <div class="follow_btn" @click="follow(follower.userId,1)" v-if="follower.followStatus==0&&type!=1">+ 关注</div>
    <div class="followed_btn" @click="follow(follower.userId,0)" v-if="follower.followStatus==1&&type!=1">- 已关注</div>
  </div>
</template>

<script>
export default {
  props: ["follower", "type", "issueUserId"],
  data() {
    return {};
  },
  methods: {
    follow(userId, followStatus) {
      let param = {};
      param.userId = userId;
      param.followStatus = followStatus;
      this.$emit("follow", param);
    },
    toAuthorDetail(userId) {
      this.$router.push({
        path: "/userCenter/userPublishArticle",
        query: {
          id: userId
        }
      });
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
@import "../../assets/common/_base.scss";
@import "../../assets/common/_mixin.scss";
@import "../../assets/common/_var.scss";

.user_info {
  @extend .flex_v_justify;
  padding: 12px 20px 14px 0;
  > div {
    @extend .flex_hc;
  }
  .user_img {
    position: relative;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    &.active::after {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      transform: translate(30%, -30%);
      width: 9px;
      height: 9px;
      border: 1px solid #fff;
      border-radius: 50%;
      background-color: #ff3b30;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .name {
    @include t_nowrap(150px);
    line-height: 1.2;
    font-size: 13px;
    padding-bottom: 4px;
    font-weight: bold;
    color: #333;
  }
  .tips span {
    display: block;
    padding-right: 10px;
    font-size: 11px;
    color: #818181;
  }
}
</style>
