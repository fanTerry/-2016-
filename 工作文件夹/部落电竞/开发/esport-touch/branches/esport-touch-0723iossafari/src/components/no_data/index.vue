<template>
  <div class="no_data">
    <div :class="{'small':this.imgUrl}">
      <!-- <img :src="imgUrlData" alt=""> -->
      <p>{{text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: String,
    text: ''
  },
  mounted() {
    console.log(this.imgUrl, this.text);
    this.imgUrlData = this.imgUrl ? this.imgUrl : require('../../assets/images/no_data/no_data.png');
    // this.textData = this.text ? this.text : '';
  },
  data() {
    return {
      imgUrlData: '',
      textData: ''
    };
  },
  methods: {},
  components: {}
};
</script>

<style lang='scss' scoped>
@import '../../assets/common/_base';

.no_data {
  @extend .flex_v_h;
  width: 100%;
  flex: 1;
  -webkit-flex: 1;
  text-align: center;
  img {
    width: 51.4667vw;
  }
  .small {
    margin-top: 0;
    img {
      width: 9.07vw;
    }
  }
  p {
    font-size: 14px;
    // color: #fff;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
