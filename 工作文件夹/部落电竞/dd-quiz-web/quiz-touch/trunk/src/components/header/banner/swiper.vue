<template>
  <div class="swiper-container banner_swiper">
    <ul class="swiper-wrapper">
      <li class="swiper-slide" @click="goUrlPage(item.location,item.locationType)" v-for="(item,index) in adList "
        :key="index">
        <div class="adver_img" :style="'background-image:url('+item.picUrl+')'"></div>
        <!-- <img v-if="item.picUrl" :src="item.picUrl" alt=""> -->
      </li>
    </ul>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
import Swiper from "swiper";

export default {
  components: {},
  props: ["adList"],
  data() {
    return {
      commonSwiper: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(newValue.length, 111111111111111111111);
      this.initSwiper();
    });
  },
  methods: {
    initSwiper() {
      this.commonSwiper = new Swiper(".banner_swiper", {
        loop: true, // 循环模式选项

        // 如果需要分页器
        pagination: {
          el: ".swiper-pagination"
        },
        autoplay: {
          disableOnInteraction: false,
          delay: 3000
        },
        speed: 1000,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        updateOnWindowResize: true
      });
    },
    goUrlPage(location, locationType) {
      console.log(location, locationType, "跳转信息");
      //0：不跳转；1：功能弹窗；2：跳转url
      if (locationType == 2) {
        window.open(location, "_self");
      } else if (locationType == 1) {
        //跳转相应的弹窗
        this.$emit("toPop", location);
      } else {
        return;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
ul,
li {
  width: 100%;
  height: 100%;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.adver_img {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center center;
}
</style>

