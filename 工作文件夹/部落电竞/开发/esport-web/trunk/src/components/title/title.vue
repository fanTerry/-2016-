<template>
  <div class="common_title">
    <title>{{titleTxt}}</title>
    <slot></slot>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["titleTxt"],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
@import "../../assets/common/_mixin";
@import "../../assets/common/_base";

.common_title {
  position: relative;
  width: 1240px;
  padding-left: 20px;
  border-bottom: 1px solid #5e3b23;
  font-size: 24px;
  font-weight: normal;
  color: #fef8ed;
  &::before {
    content: "";
    position: absolute;
    top: 1px;
    left: 0;
    width: 7px;
    height: 24px;
    background: linear-gradient(
      to bottom,
      rgba(246, 215, 75, 1),
      rgba(197, 69, 4, 1)
    );
    background: -ms-linear-gradient(
      top,
      rgba(246, 215, 75, 1),
      rgba(197, 69, 4, 1)
    );
    background: -webkit-linear-gradient(
      top,
      rgba(246, 215, 75, 1),
      rgba(197, 69, 4, 1)
    );
  }
  &::after {
    content: "";
    display: table;
    overflow: hidden;
    clear: both;
  }
}

.tab_container {
  position: relative;
  top: 1px;
  float: left;
  width: 900px;
  margin-left: 50px;
}
.tab {
  li {
    display: inline-block;
    width: auto;
    padding: 13px 30px 12px;
    font-size: 14px;
    line-height: 1.2;
    color: #fedcd7;
    span {
      display: block;
      width: 100%;
      height: 100%;
      line-height: 1.2;
      @include t_nowrap(80px);
    }
    &.active {
      color: #f3d40c;
      font-size: 14px;
      font-weight: 700;
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      background-image: linear-gradient(to right bottom, #4c1d16, #2c131c),
        linear-gradient(to top, #5e3b23, transparent);
      border: 1px transparent solid;
      border-width: 0 1px 0 1px;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(to right, #f1d20c, #35161a);
        background: -webkit-linear-gradient(left, #f1d20c, #35161a);
        background: linear-gradient(left, #f1d20c, #35161a);
      }
      span {
        max-width: none;
      }
    }
  }
}
title {
  float: left;
  display: table;
  padding-bottom: 11px;
  font-size: 24px;
  color: #fef8ed;
  font-weight: 600;
}

.page_tab {
  @extend .g_v_mid;
  right: 0;
  font-size: 0;
  padding: 0 18px;
  .left_icon,
  .right_icon {
    content: "";
    @extend .g_v_mid;
    z-index: 1;
    display: inline-block;
    vertical-align: middle;
    width: 18px;
    height: 18px;
  }
  .left_icon {
    left: 0;
    @include getBgImg("../../assets/images/home/page_to_left.png");
  }
  .right_icon {
    right: 0;
    @include getBgImg("../../assets/images/home/page_to_right.png");
  }
  .page_con {
    width: 102px;
    overflow: hidden;
  }
  ul {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-left: 34px;
    font-size: 0;
    white-space: nowrap;
    overflow: hidden;
  }
  li {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: 0 5px;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    &.active {
      line-height: 22px;
      color: #f7b54b;
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      background-image: linear-gradient(180deg, #1c111e, #1c111e),
        linear-gradient(180deg, #f6d74b, #c54504);
      border: 2px transparent solid;
    }
  }
}
</style>
