<template>
  <div class="ui_pop" v-if="showPop">
    <!-- 投注弹窗 -->
    <div class="bet" v-if="type == 1">
      <a class='close'></a>
      <div class="bet_failed" v-if="1">
        <p>余额不足，请充值</p>
        <div>
          <a>取消</a>
          <a>立即充值</a>
        </div>
      </div>
      <div class="bet_success" v-else>
        <p>投注成功</p>
        <span>投注结果详见竞猜记录</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["type", "showPop"],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
@import "../../../assets/common/_base";
@import "../../../assets/common/_mixin";

.close {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 20px;
  height: 20px;
}
.bet {
  position: relative;
  @extend .flex_v_h;
  width: 450px;
  height: 173px;
  background: linear-gradient(-16deg, rgba(42, 24, 28, 1), rgba(52, 32, 29, 1));
  background: -webkit-linear-gradient(
    164deg,
    rgba(42, 24, 28, 1),
    rgba(52, 32, 29, 1)
  );
  background: -ms-linear-gradient(
    -16deg,
    rgba(42, 24, 28, 1),
    rgba(52, 32, 29, 1)
  );
  box-shadow: 0px 0px 15px 0px rgba(10, 2, 4, 0.5);
  border-radius: 10px;
}
.bet_failed {
  font-size: 24px;
  color: #ffdcd7;
  text-align: center;
  div {
    @extend .flex_hc;
    margin: 25px auto 0;
  }
  a {
    width: 179px;
    margin: 0 10px;
    font-size: 20px;
    line-height: 42px;
    color: #6e4c47;
    text-align: center;
    border: 1px solid #463025;
    border-radius: 5px;
    background-color: #2c191c;
    &:last-child {
      color: #fff;
      background-color: #f9994c;
      border: none;
    }
  }
}
.bet_success {
  font-size: 30px;
  color: #ffdcd7;
  span {
    color: #6e4c47;
  }
}
</style>
