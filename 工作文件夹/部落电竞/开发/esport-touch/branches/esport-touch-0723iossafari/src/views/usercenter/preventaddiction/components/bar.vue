<!--
 * @Author: your name
 * @Date: 2020-07-13 14:49:22
 * @LastEditTime: 2020-07-15 10:46:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /esport-touch/src/views/usercenter/preventaddiction/components/bar.vue
--> 
<template>
  <div class="bar_item">
    <input v-model="rangeValue" type="range" step="5">
    <span class="num" :class="{active:item == selectNum}" v-for="(item,index) in despositLimit" :key="index">
      <i>{{item}}</i>
    </span>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['despositLimit', 'selectFlag', 'selectNum'],
  data() {
    return {
      rangeValue: 100,
      barArray: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
    };
  },
  watch: {
    selectFlag(newValue, oldValue) {
      this.rangeValue = this.barArray[newValue];
      console.warn(newValue);
    },
    rangeValue(newValue, oldValue) {
      console.log('newValue', newValue);
      if (newValue == 0) {
        this.$emit('changeLimit', 0);
      } else {
        if (newValue) {
          var index = newValue / 5;
          console.log('index', index);
          this.$emit('changeLimit', index);
        }
      }

      // if (newValue == 0) {
      //   this.$emit('changeLimit', 0);
      // } else if (newValue == 25) {
      //   this.$emit('changeLimit', 1);
      // } else if (newValue == 50) {
      //   this.$emit('changeLimit', 2);
      // } else if (newValue == 75) {
      //   this.$emit('changeLimit', 3);
      // } else if (newValue == 100) {
      //   this.$emit('changeLimit', 4);
      // }
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style lang='scss' scoped>
@import '../../../../assets/common/_base';
@import '../../../../assets/common/_mixin';

.bar_item {
  position: relative;
  @extend .flex_v_justify;
  padding: 13.0667vw 3.2vw 3.2vw;
  .num {
    position: relative;
    width: 25%;
    font-size: 3.7333vw;
    line-height: 4.2667vw;
    color: #fff;
    &:last-of-type {
      width: auto;
    }
    &.active {
      color: $color_yellow;
    }
    i {
      padding-left: 3.3333vw;
    }
  }
}

input[type='range'] {
  -webkit-appearance: none;
  position: absolute;
  left: 3.2vw;
  top: 5.8667vw;
  width: 85.0667vw;
  border-radius: 1.3333vw;
  border-radius: 1.3333vw;
}

input[type='range']::-webkit-slider-runnable-track {
  height: 1.3333vw;
  border-radius: 1.3333vw;
  background-color: $color_yellow;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 6.6667vw;
  height: 6.6667vw;
  margin-top: -2.6667vw;
  border: 0.5333vw solid $color_item;
  background-color: $color_yellow;
  border-radius: 50%;
}
</style>
