<template>
  <div class="user_info">
    <div @click="toDetailTopic(topicItem.id)">
      <div class="user_img " :class="{active:!topicItem.attention}">
        <img :src="topicItem.iconUrl|getDefaultImg(globalConst.topicDefaultIcon)" alt="">
      </div>
      <div>
        <div class="name">{{topicItem.name}}</div>
        <p class="tips">
          <span>{{topicItem.description}}</span>
          <!-- <span>100万阅读</span> -->
        </p>
      </div>
    </div>
    <div :class="{'followed_btn':topicItem.attention,'follow_btn':!topicItem.attention}"
      @click="follow(topicItem,topicItem.id,!topicItem.attention)">
      {{topicItem.attention==true?"- 已关注":"+ 关注"}}
    </div>

  </div>
</template>

<script>
export default {
  props: ["topicItem", "type", "itemIndex"],
  data() {
    return {};
  },
  created() {
    this.$bus.$on("followBus", params => {
      //获取传递的参数并进行操作
      //todo something
      console.log("监听事件接受", params);
      if (params.topicId == this.topicItem.id) {
        this.topicItem.attention = params.followStatus;
        if (this.topicItem.attention) {
          topicItem.fans += 1;
        } else {
          topicItem.fans -= 1;
        }
      }
    });
  },
  // 最好在组件销毁前
  // 清除事件监听
  beforeDestroy() {
    this.$bus.$off("followBus");
  },
  methods: {
    follow(topicItem, topicId, followStatus) {
      console.log("999999");
      let param = {};
      if (followStatus) {
        param.status = 1;
      } else {
        param.status = 0;
      }
      return this.$post("/api/cmsTopic/followCmsTopic/" + topicId, param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == "200") {
            this.$toast(dataResponse.message);
            topicItem.attention = followStatus;
            if (topicItem.attention) {
              topicItem.fans += 1;
            } else {
              topicItem.fans -= 1;
            }
            let param = {};
            param.followStatus = followStatus;
            param.topicId = topicId;
            this.$bus.$emit("followBus", param);

            // param.itemIndex = itemIndex
            //  this.$emit("follow",param)
            return dataResponse.code;
          } else {
            this.$toast(dataResponse.message);
          }
        })
        .catch(error => {
          this.$toast("网络异常，稍后再试");
          console.log(error);
          // return dataResponse.code;
        });
    },
    toDetailTopic(topicId) {
      var obj = {};
      obj[topicId] = "true";
      MtaH5.clickStat("topic_list", obj);
      this.$router.push({
        // path: "/detailTopic",
        // query: {
        //   id: topicId
        // }
        name: "detailTopic",
        params: {
          id: topicId
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
  padding: 14px 20px 14px 0;
  > div {
    @extend .flex_hc;
  }
  .user_img {
    position: relative;
    width: 28px;
    height: 28px;
    flex: none;
    -webkit-flex: none;
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
    font-weight: 500;
    color: #000;
  }
  .tips {
    width: 53.3333vw;
    padding-top: 5px;
    span {
      @include line_clamp(2);
      padding-right: 10px;
      font-size: 11px;
      line-height: 13px;
      color: $black_50;
      // color: #ec9805;
    }
  }
}
</style>
