<template>
  <div ref='viewport' :class="{'navigator-component':true,
          'isIos':$store.state.appBoolen.isIos&&!$store.state.appBoolen.isIphoneX&&$store.state.appBoolen.isApp,
          'isIphoneX':$store.state.appBoolen.isIphoneX&&$store.state.appBoolen.isApp
          }">
    <!--<scroll ref='scroll' direction='horizontal' >-->
    <div class="scroll" ref='scroll'>
      <ul class="tab-list" ref='tabList'>
        <li v-for='(item, index) in navList' class="tab-item" :key='index'>
          <nuxt-link class='tab-name'
                     :to='item.path'
                     :data-index='item.id'
                     :class="{'nuxt-link-active nuxt-link-exact-active':routeName.indexOf(item.routeName)>=0}"
          >
            {{item.name}}
          </nuxt-link>
        </li>
      </ul>
    </div>

    <!--</scroll>-->
  </div>
</template>

<script>
  import Scroll from '~/components/common/scroll'
  import {getData} from '~/plugins/common/util2.js'

  export default {
    props: {
      navList: {
        type: Array,
        default: () => []
      },
      currentTabIndex: {
        type: Number,
        default: null
      }
    },
    components: {
      Scroll
    },
    data() {
      return {
        current: null,
        routeName: null
      }
    },
    created() {
      this.routeName = this.$route.name
    },
    mounted() {
      setTimeout(() => {
        this._initTabListWidth()
        if (process.browser) {
          this.current = document.querySelector('.nuxt-link-exact-active') ? getData(document.querySelector('.nuxt-link-exact-active'), 'index') : 0
          this._adjust(this.current)
        }
      }, 20)
    },
    methods: {
      _initTabListWidth() {
        const tabList = this.$refs.tabList,
          items = tabList.children;
        let width = 0;
        for (let i = 0; i < items.length; i++) {
          width += items[i].clientWidth
        }
        tabList.style.width = (width - 5) + 'px'
      },
      _adjust(tabId) {
        const viewportWidth = this.$refs.viewport.clientWidth,
          tabListWidth = this.$refs.tabList.clientWidth,
          minTranslate = Math.min(0, viewportWidth - tabListWidth),
          middleTranslate = viewportWidth / 2,
          items = this.$refs.tabList.children;
        let width = 0
        this.navList.every((item, index) => {
          if (item.id == tabId) {
            return false
          }
          width += items[index].clientWidth
          return true
        })
        let translate = middleTranslate - width
        translate = Math.max(minTranslate, Math.min(0, translate))
        if (document.querySelector(".nuxt-link-exact-active")) {
          document.querySelector(".nuxt-link-exact-active").scrollIntoView()
        }
      }
    },
    watch: {
      $route(newVal) {
        this.routeName = newVal.name;
        this.$nextTick(() => {
          this.current = document.querySelector('.nuxt-link-exact-active') ? getData(document.querySelector('.nuxt-link-exact-active'), 'index') : 0
          this._adjust(this.current)
        })
      }
    }
  }
</script>
<style lang="less">
  .navigator-component {
    background: #F5F5F5;
    width: 100%;
    overflow: scroll;

    .scroll-content {
      display: inline-block;
    }
    .tab-list {
      margin: 0 !important;
      display: flex;
      flex-wrap: nowrap;
      flex-shrink: 0;
      .tab-item {
        display: inline-block;
        .tab-name {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 0 .1rem;
          font-size: .14rem;
          color: #222;
          height: .4rem;
          line-height: .4rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          &.nuxt-link-exact-active {
            color: #0085e1;
            box-sizing: border-box;
            &::after {
              content: "";
              width: 0.14rem;
              border-bottom: 0.02rem solid #0085e1;
              position: absolute;
              bottom: 0;
              left: 35%;
            }
          }
        }
      }
    }
  }
</style>
