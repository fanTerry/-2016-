<template>
  <div ref='viewport' class="navigator-component">
    <scroll ref='scroll' direction='horizontal'>
      <ul class="tab-list" ref='tabList'>
        <li v-for='(item, index) in tabs' :class="{active:index == num}" :key="index"
            @click="tab(index)" :data-index='index'>
          <span v-if="item">{{item}}</span>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script>
  import Scroll from "~/components/common/scroll";
  import {getData} from "~/plugins/common/util.js";

  export default {
    props: {
      tabs: {
        type: Array,
        default: () => []
      }
    },
    components: {
      Scroll
    },
    data() {
      return {
        num: 0,
        childByValue: null
      };
    },
    created() {
    },
    mounted() {
      setTimeout(() => {
        this._initTabListWidth();
        this._adjust(this.num);
      }, 20);
    },
    methods: {
      tab(index) {
        this.num = index;
        this.$emit("childByValue", this.num);
      },
      _initTabListWidth() {
        const tabList = this.$refs.tabList;

        const items = tabList.children;
        let width = 0;
        for (let i = 0; i < items.length; i++) {
          width += items[i].clientWidth;
        }
        tabList.style.width = width + (items.length - 1) * 10 + "px";
      },
      _adjust(tabId) {
        const viewportWidth = this.$refs.viewport.clientWidth,
          tabListWidth = this.$refs.tabList.clientWidth,
          minTranslate = Math.min(0, viewportWidth - tabListWidth) - 10,
          middleTranslate = viewportWidth / 2,
          items = this.$refs.tabList.children;
        let width = 0;
        if (this.tabs && this.tabs.length > 0) {
          this.tabs.every((item, index) => {
            if (parseFloat(index) == parseFloat(tabId)) {
              return false;
            }
            width += (items[index].clientWidth + 10);
            return true;
          });
        }
        let translate = middleTranslate - width;
        translate = Math.max(minTranslate, Math.min(0, translate));
        this.$refs.scroll.scrollTo(translate, 0, 300);
      }
    },
    watch: {
      num: function (newVal, oldVal) {
        this._adjust(newVal);
      }
    }
  };
</script>
<style lang="less" scoped>
  .navigator-component {
    background: #fff;
    .scroll-content {
      display: inline-block;
    }
    ul {
      display: flex;
      flex-wrap: nowrap;
      flex-shrink: 0;
      li {
        display: inline-block;
        color: #818181;
        padding: 23px;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          display: block;
          font-size: 26px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;

        }
        &:last-child {
          margin-right: 0;
        }
        &.active {
          color: #ff7e00;
          border-bottom: 1px solid #ff7e00;
        }
      }
    }
  }
</style>
