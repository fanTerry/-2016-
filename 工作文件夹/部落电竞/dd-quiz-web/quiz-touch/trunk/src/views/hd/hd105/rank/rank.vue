<template>
  <div class='Page guessRankPage'>
    <header class='mod_header'>
      <nav-bar>
        <div class="slot">
          <ul class="tab">
            <li :class="{active:tabCheck==index}" @click="tabClick(index)" v-for="(item,index) in rankTab" :key="index">
              {{item}}</li>
          </ul>
          <a class="rules" @click="rules()">规则</a>
        </div>
      </nav-bar>
    </header>
    <div class="award" v-if="!noData">
      <div class="award_info">
        <img :src="userWinTop.icon|getDefaultImg(globalConst.userDefaultIcon)" alt="">
        <div>
          <p class="award_name">{{userWinTop.nickName}}</p>
          <p class="award_rank" v-if="userWinTop.rownum">No.{{userWinTop.rownum}}</p>
        </div>
      </div>
      <div class="award_gift">
        <p class="gift_name" v-if="userWinTop.hd105GiftResponse!=null">{{userWinTop.hd105GiftResponse.hdGiftName}}
        </p>
        <p class="award_num" v-if="userWinTop.winPrize!=null"><span>{{userWinTop.winPrize}}</span>星星</p>
      </div>
    </div>
    <div class='main'>
      <div v-if="!noData">
        <h3>
          <span class="rank">排名</span>
          <span class="id">用户昵称</span>
          <span class="num">中奖金额</span>
          <span class="reward">奖励</span>
        </h3>
        <ul class="award_list">
          <li v-for="(item,index) in winTopList" :key="index">
            <span class="rank">{{item.rownum}}</span>
            <p class="users">
              <img :src="item.icon|getDefaultImg(globalConst.userDefaultIcon)" alt="">
              <span>{{item.nickName |formatNickName}}</span>
              <!--只显示名字第一个字符 -->
            </p>
            <span class="num">{{item.winPrize}}</span>
            <span class="gift_name" v-if="item.hd105GiftResponse">{{item.hd105GiftResponse.hdGiftName}}</span>
            <!-- <span class="gift_name" v-else>---</span> -->
          </li>
        </ul>
      </div>
      <!-- 没有数据时展示 -->
      <noData v-if="noData" :text="'暂时还没有排行榜哦'"> </noData>
    </div>

    <div class="ui_pop" v-if="showRules">
      <div class="rules">
        <h3>大神预测榜单规则<a class="close" @click="showRules = false"></a></h3>
        <div class="content">
          1，大神实时排行统计自然周内玩家赛事预测中奖星星总数；<br>
          2，大神实时排行仅展示当前中奖星星排名TOP30的玩家；<br>
          3，榜单统计周期为自然周，即周一的00:00至周日的24:00；<br>
          4，玩家也可通过上周排行查看上期的个人排名及奖励情况；<br>
          5，大神榜单将不定期更新每期奖励，敬请关注榜单奖励说明；<br>
          6，当周榜单获取实物奖励的用户请联系橘子微信客服:jzdj08；<br>
          7，当周榜单获取的星星奖励将于下周一排名确立后自动派发；<br>
          8，当周榜单获取的星星奖励具备7日使用有效期，预期将作废
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "../../../../components/header/nav_bar/index.vue";
import noData from "../../../../components/no_data/index.vue";
export default {
  components: {
    navBar,
    noData
  },
  props: [],
  data() {
    return {
      rankTab: ["实时排行", "上周排行"],
      tabCheck: 0,
      noData: false,
      showRules: false,
      param: {
        dateType: 0, //0本周，1上周
        isOneself: false
      },
      winTopList: [],
      userWinTop: {}
    };
  },
  mounted() {
    this.queryWinTop(this.param);
  },
  methods: {
    queryWinTop(param) {
      console.log(param, "参数");
      return this.$post("/api/quizTop/winTop", param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            console.log("查询排行榜");
            if (dataResponse.data.winTopType) {
              this.noData = false;
              this.winTopList = dataResponse.data.winTop;
              this.userWinTop = dataResponse.data.userWinTop[0];
              console.log("shuju", this.winTopList, this.userWinTop);
            } else {
              this.noData = true;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    rules() {
      this.showRules = true;
    },
    tabClick(index) {
      console.log("下标", index);
      this.tabCheck = index;
      this.winTopList = [];
      this.userWinTop = {};
      this.param.dateType = index;
      this.queryWinTop(this.param);
    }
  }
};
</script>


<style lang="scss">
.guessRankPage {
  .nav_bar .back {
    &::before,
    &::after {
      background-color: #fedcd7;
    }
  }
}
</style>

<style lang='scss' scoped>
@import "../../../../assets/common/_base";
@import "../../../../assets/common/_mixin";

.mod_header {
  background-color: #321919;
  .slot {
    height: 44px;
  }
  .tab {
    @extend .g_v_c_mid;
    @extend .flex_hc;
    background-color: #4e2823;
    border-radius: 1.3333vw;
    overflow: hidden;
  }
  .tab li {
    padding: 0 8.4vw;
    font-size: 3.7333vw;
    line-height: 8.5333vw;
    color: #fedcd7;
    &.active {
      background-color: #ba3129;
    }
  }
  .rules {
    @extend .g_v_mid;
    right: 4.6667vw;
    font-size: 3.4667vw;
    color: #733633;
  }
}

.award {
  @extend .flex_v_justify;
  padding: 6.6667vw 5.6vw 3.7333vw 5.3333vw;
  @include getBgImg("../../../../assets/images/hd/rank/rank_bg.png");
  color: #fedcd7;
}

.award_info {
  @extend .flex_hc;
  img {
    width: 12vw;
    height: 12vw;
    border-radius: 50%;
  }
}

.award_name {
  padding-left: 5.0667vw;
  font-size: 3.4667vw;
}

.award_rank {
  padding-left: 4.5333vw;
  padding-top: 2vw;
  font-size: 5.3333vw;
  font-style: italic;
  font-weight: bold;
}

.award_gift {
  font-size: 3.4667vw;
  text-align: right;
}

.award_num {
  padding-top: 1.7333vw;
  font-size: 3.4667vw;
  span {
    padding-right: 0.9333vw;
    font-size: 4vw;
  }
}

.main {
  padding: 0 2.6667vw;
  background-color: #1f1212;
  h3 {
    padding: 3.7333vw 0 2.9333vw 0;
    font-size: 0;
    .rank {
      padding-left: 2.6667vw;
    }
    .id {
      padding-left: 4.6667vw;
    }
    .num {
      padding-left: 14.4vw;
    }
    .reward {
      padding-left: 27.4667vw;
    }
  }
  h3 span {
    font-size: 3.4667vw;
    font-weight: normal;
    color: #733633;
  }
}

.award_list li {
  @extend .flex_hc;
  position: relative;
  height: 12vw;
  margin-bottom: 2.6667vw;
  border-radius: 1.3333vw;
  background-color: #321919;
  &:first-child,
  &:nth-child(2),
  &:nth-child(3) {
    @include getBgLinear(right, #ba3129, #321919);
    .rank {
      font-size: 8vw;
      color: #fedcd7;
    }
    .gift_name {
      color: #fde200;
    }
  }
  .rank {
    width: 14vw;
    padding-left: 1.8667vw;
    font-size: 6.6667vw;
    font-weight: bold;
    font-style: italic;
    color: #733633;
  }
  .users {
    @extend .flex_hc;
    img {
      width: 8vw;
      height: 8vw;
      border-radius: 50%;
    }
    span {
      width: 13.8667vw;
      padding-left: 2.6667vw;
      font-size: 3.4667vw;
      letter-spacing: 2px;
      color: #fedcd7;
    }
  }
  .num {
    padding-left: 6.4vw;
    font-size: 3.4667vw;
    font-weight: bold;
    color: #fedcd7;
  }
  .gift_name {
    @extend .g_v_mid;
    @include t_nowrap(29.0667vw);
    line-height: 1.2;
    right: 4vw;
    font-size: 3.7333vw;
    color: #fedcd7;
  }
}

.ui_pop {
  .rules {
    width: 94.6667vw;
    padding-bottom: 3.7333vw;
    background-color: #391a1c;
  }
  h3 {
    position: relative;
    line-height: 8.8vw;
    font-size: 4.8vw;
    color: #fff;
    text-align: center;
    background-color: #482527;
  }
  .close {
    @extend .g_v_mid;
    right: 2.6667vw;
    width: 5.3333vw;
    height: 5.3333vw;
    @include getBgImg("../../../../assets/images/guess/close.png");
  }
  .content {
    height: 68.7333vw;
    margin-top: 2.7333vw;
    padding: 0 5.3333vw 0;
    font-size: 4vw;
    line-height: 6.6667vw;
    color: #c08c85;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
