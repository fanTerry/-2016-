<template>
  <section class="container">
    <SlideRender />
  </section>
</template>

<script>
import SlideRender from "~/components/common/slide/slide-render"
export default {
  components: {
  	SlideRender
  }
}
</script>

<style lang="less" scoped>
p{
  width: 750px;
  height:100px;
  line-height: 100px;
  background-color: #3b8070;
  text-align: center;
  font-size: 32px;
  color: #fff;
  border-radius:5px;
}
</style>
