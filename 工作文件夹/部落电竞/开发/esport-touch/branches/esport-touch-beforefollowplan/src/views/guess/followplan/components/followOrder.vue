<template>
  <!-- 已结束的单加end_order -->
  <li class="follow_order" :class="{'end_order':false}">
    <div class="user_info">
      <img src="" alt="">
      <p class="name">电竞打卡</p>
      <div class="tips">
        <span>近10中5</span>
        <span>近十单收益：1250%</span>
      </div>
    </div>
    <p class="match_info"><img src="https://rs.esportzoo.com/svn/esport-res/ddquiz/images/logo/csgo.png" alt=""> 2020-05-05 21:00 截止</p>
    <ul class="match_table">
      <li class="title">
        <span>自购金额</span>
        <span>预期回报</span>
        <span>跟单人数</span>
        <span>跟单金额</span>
      </li>
      <li>
        <span>1000</span>
        <span>145%</span>
        <span>8</span>
        <span>13200</span>
      </li>
    </ul>
    <a class='follow_plan_btn'>立即跟单</a>

    <!-- 投注弹窗 -->
    <!-- <bet-pop></bet-pop> -->
  </li>
</template>

<script>
import betPop from '../../components/betpops.vue';

export default {
  components: { betPop },
  props: ["planRecommend"],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
@import '../../../../assets/common/_base';
@import '../../../../assets/common/_mixin';

.follow_order {
  margin-top: 2.1334vw;
  padding: 3.2vw;
  border-radius: 1.3334vw;
  background-color: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
}
.end_order {
  background-color: #912d32;
  .user_info,
  .follow_plan_btn {
    display: none;
  }
  .match_table {
    &,
    & span {
      color: #fff;
      border-color: #b7565c;
    }

    .title {
      background-color: #b7565c;
    }
  }
  .match_info {
    color: #fff;
  }
}
.user_info {
  position: relative;
  @extend .flex_hc;
  margin-bottom: 2.4vw;
  img {
    width: 7.4667vw;
    height: 7.4667vw;
    border: 0.2667vw solid #ff9da3;
    border-radius: 50%;
  }
  .name {
    margin-left: 2.1333vw;
    font-size: 3.7333vw;
    @include t_nowrap(26.6667vw);
    line-height: 1.2;
    color: #333;
    font-weight: bold;
  }
  .tips {
    @extend .flex_hc;
    @extend .g_v_mid;
    right: 0;
    span {
      margin-left: 1.3333vw;
      padding: 0.8vw 1.8667vw;
      font-size: 2.4vw;
      color: #fff;
      border-radius: 0.8vw;
      background-color: $color_main;
    }
  }
}
.match_info {
  @extend .flex_hc;
  font-size: 3.7333vw;
  line-height: 4vw;
  color: #333;
  img {
    width: 4.2667vw;
    height: 4.2667vw;
    margin-right: 2.1333vw;
    border-radius: 50%;
    background-color: #32191e;
  }
}
.match_table {
  margin-top: 2vw;
  border: 0.2667vw solid #ddd;
  li {
    @extend .flex;
    span {
      flex: 1;
      -webkit-flex: 1;
      border-left: 0.2667vw solid #ddd;
      font-size: 3.4667vw;
      line-height: 8.8vw;
      text-align: center;
      color: #333;
      &:first-child {
        border: none;
      }
    }
  }
  .title {
    background-color: #f4f4f4;
  }
}
.follow_plan_btn {
  display: block;
  margin-top: 2.1333vw;
  font-size: 3.7333vw;
  line-height: 9.0667vw;
  border-radius: 0.8vw;
  text-align: center;
  color: #fff;
  background-color: $color_main;
}
</style>
