<template>
	<div ref='viewport' class="navigator-component">
		<scroll ref='scroll' direction='horizontal' >
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
		</scroll>
	</div>
</template>

<script>
	import Scroll from '~/components/common/scroll'
	import {getData} from '~/plugins/common/util.js'
	export default{
		props: {
			navList: {
				type: Array,
				default: ()=>[]
			},
			currentTabIndex: {
				type: Number,
				default: null
			}
		},
		components: {
			Scroll
		},
		data(){
			return {
        current: null,
				routeName: null
			}
		},
		created(){
      /* if(this.$route.name == 'ssc-cqssc-spanTrend'){
                this.routeName = 'ssc-cqssc-stateTrend'
            }else{
                this.routeName = this.$route.name
      } */
      this.routeName = this.$route.name
		},
		mounted(){
			setTimeout(()=>{
        // this._initWrapWidth()
        this._initTabListWidth()
        this.current = document.querySelector('.nuxt-link-exact-active') ? getData(document.querySelector('.nuxt-link-exact-active'), 'index') : 0
				this._adjust(this.current)
			},20)
		},
		methods: {
			// _initWrapWidth(){
			// 	this.$refs.viewport.style.width = window.innerWidth + 'px'
			// },
			_initTabListWidth(){
				const tabList = this.$refs.tabList
				const items = tabList.children
				let width = 0
				for(let i=0; i<items.length; i++){
					width += items[i].clientWidth
				}
				tabList.style.width = (width + 1) +'px'
			},
			_adjust(tabId){
				const viewportWidth = this.$refs.viewport.clientWidth
				const tabListWidth = this.$refs.tabList.clientWidth
				const minTranslate = Math.min(0, viewportWidth - tabListWidth)
				const middleTranslate = viewportWidth / 2
				const items = this.$refs.tabList.children
				let width = 0
				this.navList.every((item, index)=>{
					if(item.id == tabId) {
						return false
					}
					width += items[index].clientWidth
					return true
				})
				let translate = middleTranslate -width
				translate = Math.max(minTranslate, Math.min(0, translate))
				this.$refs.scroll.scrollTo(translate, 0, 300)
			}
		},
		watch:{
			$route(newVal){
        /* if(newVal.name == 'ssc-cqssc-spanTrend'){
                    this.routeName = 'ssc-cqssc-stateTrend'
                }else{
                    this.routeName = newVal.name
        } */
        this.routeName = newVal.name;
				this.$nextTick(()=>{
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
    .scroll-content {
      display: inline-block;
    }
    .tab-list {
      margin: 0 auto;
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
          padding: 0 .23rem;
          font-size: .14rem;
          color: #818181;
          height: .4rem;
          line-height: .4rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          &.nuxt-link-exact-active {
            color: #ff7e00;
            box-sizing: border-box;
            &::after {
              content: "";
              width: 0.14rem;
              border-bottom: 0.02rem solid #ff7e00;
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
