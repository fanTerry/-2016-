<!--已废弃-->
<template>
  <div>
    <div v-if='type == 1'>
      <ul :class="{team:type == 1}">
        <bet-item :quizMatchGame="quizGame" :showType='1'></bet-item>
      </ul>
     
    </div>
    <ul :class="{personal:type == 2}" v-if="type == 2">
      <bet-item :quizMatchGame="quizGame" :showType='1' :showStyle='hot_personal'></bet-item>
    </ul>
  </div>
</template>

<script>
import betItem from "../../../components/guessbet/bet_item.vue";

export default {
  components: { betItem },
  props: ["type", "guessOptionVos", "quizGame"],
  data() {
    return {
      currIndex: null,
      showBet: false
    };
  },
  methods: {
    goBet(index) {
      if (this.currIndex == index) {
        this.currIndex = null;
        //关闭投注窗口
        // this.$emit("goBet",index,false)
        this.showBet = false;
        return;
      }
      this.currIndex = index;
      //打开投注窗口
      this.showBet = true;
      // this.$emit("goBet",index,true)
    }
  }
};
</script>

<style lang='scss' scoped>
.team {
  position: relative;
  display: table;
  margin-top: 28px;
  border-width: 1px 0 0 1px;
  border-style: solid;
  border-color: #5e3b23;
  &::after {
    content: "";
    display: table;
    clear: both;
    overflow: hidden;
  }
  .item {
    position: relative;
    float: left;
    width: 170px;
    padding: 16px 0 0 16px;
    border-width: 0 1px 1px 0;
    border-style: solid;
    border-color: #5e3b23;
    background: linear-gradient(135deg, rgba(176, 72, 64, 0.2), #201217);
    background: -ms-linear-gradient(135deg, rgba(176, 72, 64, 0.2), #201217);
    &::after {
      content: "";
      display: table;
      clear: both;
      overflow: hidden;
    }
    &.active {
      background: linear-gradient(135deg, #f7d064, #8a5a26);
      background: -ms-linear-gradient(135deg, #f7d064, #8a5a26);
      .progress_bar {
        color: #fff;
        background-color: #dfb453;
      }
      .support_num {
        color: #fff;
      }
    }
    .info {
      float: left;
    }
    .player_img {
      float: left;
      width: 50px;
      height: 50px;
      margin-right: 15px;
      border: 1px solid #4a3220;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .success_tips {
      padding-top: 5px;
      font-size: 18px;
      color: #ffdcd7;
    }
    .ratio_tips {
      padding-top: 5px;
      font-size: 14px;
      color: #ffdcd7;
    }
    .support_num {
      padding: 18px 0 12px;
      font-size: 14px;
      color: #51423a;
    }
  }
}

.progress {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.progress_bar {
  display: block;
  height: 3px;
  background-color: #995226;
}
.personal {
  position: relative;
  display: table;
  margin-top: 32px;
  &::after {
    content: "";
    display: table;
    overflow: hidden;
    clear: both;
  }
  .item {
    position: relative;
    float: left;
    width: 169px;
    padding-bottom: 16px;
    text-align: center;
    border: 1px solid #5e3b23;
    &:nth-last-of-type(1) {
      border-left: none;
    }
    background: linear-gradient(135deg, rgba(176, 72, 64, 0.2), #201217);
    background: -ms-linear-gradient(135deg, rgba(176, 72, 64, 0.2), #201217);
    &.active {
      background: linear-gradient(135deg, #f7d064, #8a5a26);
      background: -ms-linear-gradient(135deg, #f7d064, #8a5a26);
    }
    .decision {
      padding-top: 20px;
      font-size: 30px;
      color: #fff;
    }
    .odds {
      padding-top: 8px;
      font-size: 18px;
      color: #6e4c47;
    }
    .rate {
      padding-top: 14px;
      font-size: 14px;
      color: #3f2d2d;
    }
  }
}
</style>
