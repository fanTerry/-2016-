<template>

  <div>
    <section class="bannerPage" v-if="bannerType == 1">
      <figure :class="{oneBanner:this.bannerUrl.length == 1}" class="mod_banner swiper-container swiper-no-swiping">
        <ul class="swiper-wrapper">
          <li class="swiper-slide" v-for="(item,index) in bannerUrl" :key="index">
            <img :src='item.picUrl' alt />
          </li>
        </ul>
        <div class="swiper-pagination banner_pagination"></div>
      </figure>
    </section>
    <section class="mod_poster  swiper-container" v-if="bannerType == 2&&posterUrl&&posterUrl.length>0">
      <div class="swiper-wrapper">
        <img class="swiper-slide" v-for="(item,index) in posterUrl" :key="index" :src="item.picUrl" alt />
      </div>
    </section>
  </div>
</template>

<script>
import Swiper from "swiper";

export default {
  components: {},
  props: ["bannerType"],
  data() {
    return {
      bannerUrl: [],
      posterUrl: []
    };
  },
  mounted() {
    this.getBannerUrl().then(() => {
      this.$nextTick(() => {
        this.initSwiper();
      });
    });
  },
  methods: {
    getBannerUrl() {
      let param = { typeStr: "1,5" };
      return this.$post("/api/getAdList", param)
        .then(rsp => {
          const dataResponse = rsp.data;
          console.log(dataResponse, "广告位置");
          this.bannerUrl = dataResponse.adList1;
          this.posterUrl = dataResponse.adList5;
        })
        .catch(error => {
          console.log(error, 122222222222213111111111111111111111);
        });
    },
    initSwiper() {
      let swiper1 = new Swiper(".mod_banner", {
        autoplay: this.bannerUrl.length >= 2 ? 3000 : false,
        autoplayDisableOnInteraction: false,
        loop: this.bannerUrl.length >= 2 ? true : false,
        slidesPerView: 2,
        pagination: ".swiper-pagination.banner_pagination",
        paginationClickable: true
      });
      let swiper2 = new Swiper(".mod_poster", {
        autoplay: this.posterUrl.length >= 2 ? 3000 : false,
        autoplayDisableOnInteraction: false,
        loop: this.posterUrl.length >= 2 ? true : false,
        direction: "vertical"
      });
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/common/_base";
.bannerPage {
  position: relative;
  width: 1240px;
  height: 220px;
  margin: 46px auto 0;
  overflow: hidden;
  .oneBanner {
    .swiper-slide {
      transform: translateX(920px);
    }
  }
}

.mod_banner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 1840px;
  height: 220px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .swiper-slide {
    position: relative;
    @extend .flex_v_h;
    transition: 600ms;
    transform: translateX(670px) scale(0.8);
    transform-origin: bottom center;
    text-align: center;
  }

  .swiper-slide-next,
  .swiper-slide-duplicate-next {
    z-index: 1;
    transform: scale(1);
    transform-origin: bottom center;
  }
  .swiper-pagination-bullets {
    left: auto;
    bottom: 10px;
    right: 460px;
    transform: translateX(50%);
    width: 100%;
  }
}

.mod_poster {
  width: 1240px;
  height: 100px;
  margin: 30px auto 0;
  overflow: hidden;
  img {
    width: 1240px;
    height: 100px;
    object-fit: cover;
  }
}
</style>
