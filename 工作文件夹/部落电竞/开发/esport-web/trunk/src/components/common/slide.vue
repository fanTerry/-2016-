<template>
  <div class="slide" ref="slide">
    <div class="slide-group" ref="slideGroup">
      <slot>
      </slot>
    </div>
    <div v-if="showDot" class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
    <!-- <p v-for="(item,i) in items" v-if="currentPageIndex === i">
      {{item.id}}
    </p> -->
  </div>
</template>

<script type="text/ecmascript-6">
import { addClass } from "../../libs/dom";
import BScroll from "better-scroll";
const COMPONENT_NAME = "slide";

export default {
  name: COMPONENT_NAME,
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    showDot: {
      type: Boolean,
      default: true
    },
    click: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
    },
    noLoop:false,
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0,
      // items: [
      //   {
      //     linkUrl: "http://y.qq.com/w/album.html?albummid=0044K2vN1sT5mE",
      //     picUrl: "http://pic2.nipic.com/20090409/948554_163256089_2.jpg",
      //     id: 11351
      //   },
      //   {
      //     linkUrl:
      //       "https://y.qq.com/m/digitalbum/gold/index.html?_video=true&id=2197820&g_f=shoujijiaodian",
      //     picUrl: "http://pic8.nipic.com/20100719/4589836_104029038516_2.jpg",
      //     id: 11372
      //   }
      // ]
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.update();
    });

    window.addEventListener("resize", () => {
      if (!this.slide || !this.slide.enabled) {
        return;
      }
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.slide.isInTransition) {
          this._onScrollEnd();
        } else {
          if (this.autoPlay) {
            this._play();
          }
        }
        this.refresh();
      }, 60);
    });
  },
  activated() {
    if (!this.slide) {
      return;
    }

    this.slide.enable();
    let pageIndex = this.slide.getCurrentPage().pageX;
    this.slide.goToPage(pageIndex, 0, 0);
    this.currentPageIndex = pageIndex;
    if (this.autoPlay) {
      this._play();
    }
  },
  deactivated() {
    this.slide.disable();
    clearTimeout(this.timer);
  },
  beforeDestroy() {
    this.slide.disable();
    clearTimeout(this.timer);
  },
  methods: {
    update() {
      if (this.slide) {
        this.slide.destroy();
      }
      this.$nextTick(() => {
        this.init();
      });
    },
    refresh() {
      this._setSlideWidth(true);
      this.slide.refresh();
    },
    prev() {
      this.slide.prev();
    },
    next() {
      this.slide.next();
    },
    init() {
      clearTimeout(this.timer);
      this.currentPageIndex = 0;
      this._setSlideWidth();
      if (this.showDot) {
        this._initDots();
      }
      this._initSlide();

      if (this.autoPlay) {
        this._play();
      }
    },
    _setSlideWidth(isResize) {
      this.children = this.$refs.slideGroup.children;

      let width = 0;
      let slideWidth = this.$refs.slide.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slide-item");

        child.style.width = slideWidth + "px";
        width += slideWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * slideWidth;
      }
      
      if(this.children.length>1){
        this.$refs.slideGroup.style.width = width + "px";
      }
     
    },
    _initSlide() {
      console.log(this.threshold);
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        },
        bounce: false,
        stopPropagation: true,
        click: this.click
      });

      this.slide.on("scrollEnd", this._onScrollEnd);

      this.slide.on("touchEnd", () => {
        if (this.autoPlay) {
          this._play();
        }
      });

      this.slide.on("beforeScrollStart", () => {
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });
    },
    _onScrollEnd() {
      let pageIndex = this.slide.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    _play() {
      this.$emit("changePic", this.currentPageIndex);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slide.next();
      }, this.interval);
    }
  },
  watch: {
    loop() {
      this.update();
    },
    autoPlay() {
      this.update();
    },
    speed() {
      this.update();
    },
    threshold() {
      this.update();
    }
  }
};
</script>

<style lang="scss" scoped>
.slide {
  position: relative;
  overflow: hidden;
  .slide-group {
    overflow: hidden;
    .slide-item {
      float: left;
      box-sizing: border-box;
      text-align: center;
      &::after {
        content: "";
        display: table;
        clear: both;
      }
    }
  }
  .dots {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ccc;
      &.active {
        width: 20px;
        border-radius: 5px;
        background: #fff;
      }
    }
  }
}
</style>
