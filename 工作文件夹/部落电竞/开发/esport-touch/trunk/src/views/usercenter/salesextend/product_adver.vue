<template>
  <div class='Page pullNewsPage'>
    <header class='mod_header'>
      <nav-bar :pageTitle='"产品宣传海报"'></nav-bar>
    </header>
    <div class='main'>
      <ul class="list">
        <li class="item" v-for="(item,index) in 10" :key="index">
          <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3794688268,3669560702&fm=26&gp=0.jpg" alt="">
          <a>点击下载</a>
        </li>
      </ul>
    </div>
    <footer class='mod_footer'>

    </footer>
  </div>
</template>

<script>
import navBar from '../../../components/header/nav_bar/index.vue';

export default {
  components: { navBar },
  props: [],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
.pullNewsPage {
  .back {
    &::before,
    &::after {
      background-color: #fff !important;
    }
  }
}
</style>


<style lang='scss' scoped>
@import '../../../assets/common/_base';
@import '../../../assets/common/_mixin';

.mod_header {
  background-color: #3d3b51;
  .nav_bar {
    color: #fff;
  }
}

.list {
  @extend .flex_v_justify;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  padding: 4.2667vw 10vw 0;
}

.item {
  margin-bottom: 4.2667vw;
  img {
    display: block;
    width: 21.3333vw;
    height: 37.8667vw;
    object-fit: cover;
  }
  a {
    display: block;
    @include getBtn(21.3333vw, 7.7333vw, 3.2vw, #fff, $color_btn, 0.5333vw);
    margin-top: 3.2vw;
  }
}
</style>
