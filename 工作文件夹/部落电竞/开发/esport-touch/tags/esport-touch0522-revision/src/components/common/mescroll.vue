<template>

  <mescroll-vue ref="mescroll" id="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
    <slot></slot>
  </mescroll-vue>

</template>


<script>
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    MescrollVue
  },
  props: {
    warpId: { type: String, default: "mainId" }, //设置置顶时，必须设置父容器ID
    hasToTop: { type: Boolean, default: true }, //默认不开启回到顶部项
    isUseUp: { type: Boolean, default: true }, //禁用下拉加载,默认开启
    isUseDown: { type: Boolean, default: true }, //禁用下拉加载，默认开启
    downLoadAuto: { type: Boolean, default: true }, //是否首次自动执行一次下拉刷新,默认配置true
    upLoadAuto: { type: Boolean, default: false }, //是否首次自动执行一次上拉加载,默认配置false
    isShowEmpty: { type: Boolean, default: true } //是否显示暂无数据
  },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollTop: Number,
      scrollY: Number,
      mescrollDown: {
        callback: this.downCallback,
        outOffsetRate: 0.1,
        offset: 80,
        inOffsetRate: 0.3
      },
      mescrollUp: {
        callback: this.upCallback,
        auto: false,
        offset: 100,
        isBounce: true,
        noMoreSize: 1,
        htmlNodata: '<p class="upwarp-nodata">没有更多数据了</p>',
        lazyLoad: {
          use: true, // 是否开启懒加载,默认false
          //img标签: <img imgurl="网络图" src="占位图"/> //占位图直接在src设置; 图片加载成功,就会替换src的占位图
          //div或其他标签: <div imgurl="网络图" style="background-image: url(占位图)"><div> // 占位图在css中设置; 图片以背景图的形式展示
          attr: "imgurl", // 网络地址的属性名 (图片加载成功会移除该属性):
          showClass: "mescroll-lazy-in", // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
          delay: 300, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
          offset: 300 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
        },
        //列表第一页无任何数据时,显示的空布局 (需配置warpId才生效)
        empty: {
          warpId: "mainId", //父布局的id (1.3.5版本支持传入dom元素)
          icon:
            "https://rs.esportzoo.com/svn/esport-res/mini/images/iconimg/no-data.png", //空布局的图标路径,默认null,支持网络图
          tip: "" // 提示文本:暂无相关数据~
          // btntext: "", //按钮文本
          // btnClick: null, // 点击按钮的回调
          // supportTap: false //如果您的运行环境支持tap,则可配置true,可减少点击延时,快速响应事件;默认false,通过onclick添加点击事件; (v 1.3.0 新增) (注:微信和PC无法响应tap事件)
        }
      }
    };
  },
  created() {
    console.log("this.hasToTop", this.hasToTop);
    if (this.hasToTop) {
      this.setToTop();
    }
    if (!this.isUseUp) {
      console.log("this.mescrollUp.use");
      this.mescrollUp.use = false;
    }
    if (!this.isUseDown) {
      console.log("this.mescrollDown.use");
      this.mescrollDown.use = false;
    }
    if (!this.isShowEmpty) {
      this.mescrollUp.empty = {};
    }
    this.mescrollDown.auto = this.downLoadAuto;
    this.mescrollUp.auto = this.upLoadAuto;

    this.$nextTick(() => {
      document
        .querySelector("#mescroll")
        .addEventListener("scroll", this.handleMescrollY, true);
    });
  },
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  activated() {
    //滚动回原来的列表位置
    console.log(this.scrollY);
    this.mescroll.scrollTo(this.mescroll.preScrollY, 0);
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  methods: {
    downCallback() {
      this.$emit("downCallback");
      // this.$nextTick(() => {
      //   this.mescroll.endSuccess(this.currPageSize);
      // });
    },
    upCallback() {
      console.log("下拉刷新");
      this.$emit("upCallback");
      //   this.$nextTick(() => {
      //     this.mescroll.endSuccess(this.currPageSize);
      //   });
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      this.mescroll.setBounce(true); //允许iOS回弹,相当于配置up的isBounce为true(解决了其他没有使用该插件的页面 横向和纵向不能滚动或滚动很卡的问题19-12-17)
      this.$emit("mescrollInit", mescroll);
      this.mescroll.lazyLoad(); //图片不用滑动自行在可视区域加载
    },
    setToTop() {
      let toTop = {
        warpId: null,
        src: null,
        html: null,
        offset: 1000,
        warpClass: "mescroll-totop",
        showClass: "mescroll-fade-in",
        hideClass: "mescroll-fade-out",
        duration: 0,
        supportTap: false,
        btnClick: null
      };
      toTop.src = require("../../assets/images/common/back_top.png");
      if (this.warpId) {
        toTop.warpId = this.warpId;
        console.log("容器ID", toTop.warpId);
      }
      this.mescrollUp.toTop = toTop;
    },
    handleMescrollY() {
      this.mescrollTop = document.querySelector("#mescroll").scrollTop;
      // console.log(this.mescrollTop);
    }
  },
  watch: {
    mescrollTop(newValue, oldValue) {
      this.$emit("handleScroll");
      let mescrollToTop = document.querySelector(".mescroll-totop");
      if (mescrollToTop) {
        mescrollToTop.addEventListener("click", e => {
          e.preventDefault();
        });
      }
      if (this.mescrollTop >= 1300) {
        // ios回弹会改变这个值，注意
        if (newValue - oldValue > 10) {
          mescrollToTop.setAttribute("style", "opacity:0 ");
        } else if (newValue - oldValue < -10) {
          mescrollToTop.setAttribute("style", "opacity:1 ");
          if (this.mescrollTop < 1350) {
            mescrollToTop.setAttribute("style", "opacity:0");
            // console.log("小于1300");
          }
        }
      } else if (this.mescrollTop == 0 && mescrollToTop) {
        mescrollToTop.setAttribute("style", "opacity:0");
      }
    }
  }
};
</script>

<style lang="scss">
.mescroll {
  overflow-x: hidden;
}

.mescroll-totop {
  bottom: 110px !important;
  opacity: 0;
  transition: all 0.3s;
  animation: none !important;
}
</style>
