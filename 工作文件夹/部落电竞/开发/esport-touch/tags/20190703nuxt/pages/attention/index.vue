<template>
  <section class="container">
    <p>关注</p>
    <Footer />
  </section>
</template>

<script>
import Footer from "~/components/common/footer/index"
import Expert from "~/components/attention/expert.vue"

export default {
  components: {
    Footer,
    Expert
  },
  data() {
    return {
    };
  },
}
</script>

<style lang="less" scoped>
.list{
  width: 732px;
  background: #fff;
  border-radius: 13px;
  margin:0 auto;
}

</style>
