<template>
	<div ref='wrapper' class="list-wrapper">
		<div class="scroll-content">
			<div ref='listWrapper'>
				<slot>
					<ul class="list-content">
						<li class="list-item"
							v-for='(item,index) in data'
							:key='index'
							@click='clickItem($event,item)'>
							{{item}}
						</li>
					</ul>
				</slot>
			</div>
			<slot name='pullup'
					:pullUpLoad='pullUpLoad'
					:isPullUpLoad='isPullUpLoad'
			>
				<div class="pullup-wrapper" v-if='pullUpLoad'>
					<div class="before-trigger" v-if='!isPullUpLoad'>
						<span>{pullUpTxt}</span>
					</div>
					<div class="after-trigger" v-else>
						<loading></loading>
					</div>
				</div>
			</slot>
		</div>
		<slot  name='pulldown'
				:pullDownRefresh='pullDownRefresh'
				:pullDownStyle='pullDownStyle'
				:beforePullDown='beforePullDown'
				:isPullingDown='isPullingDown'
				:bubbleY='bubbleY'
		>
			<div ref='pulldown'
					class="pulldown-wrapper"
					:style='pullDownStyle'
					v-if='pullDownRefresh'
			>
				<div class="before-trigger" v-if='beforePullDown'>
					<bubble :y='bubbleY'>
					</bubble>
				</div>
				<div class="after-trigger" v-else>
					<div class="loading" v-if='isPullingDown'>
						<loading></loading>
					</div>
					<div v-else><span>{{refreshTxt}}</span></div>
				</div>
			</div>
		</slot>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
  import Loading from '../loading'
  import Bubble from '../bubble'

	import {getRect} from '~/plugins/common/util.js'
	const COMPONENT_NAME = 'scroll'
	const DIRECTION_H = 'horizontal'
	const DIRECTION_V = 'vertical'
	export default{
		name: COMPONENT_NAME,
		props:{
			data: {
				type: Array,
				default: ()=>[]
			},
			probeType: {
				type: Number,
				default: 1
			},
			click: {
				type: Boolean,
				default: true
			},
			listenScroll: {
				type: Boolean,
				default: false
			},
			listenBeforeScroll: {
				type: Boolean,
				default: false
			},
			direction: {
				type: String,
				default: DIRECTION_V
			},
			scrollbar: {
				type: null,
				default: false
			},
			pullDownRefresh: {
				type: null,
				default: false
			},
			pullUpLoad: {
				type: null,
				default: false
			},
			startY: {
				type: Number,
				default: 0
			},
			refreshDelay: {
				type: Number,
				default: 20
			},
			freeScroll: {
				type: Boolean,
				default: false
			},
			mouseWheel:{
				type: Boolean,
				default: false
			},
      bounce: {
        type: Object,
        default: () => {
          return {
          top: false,
          bottom: false,
          left: false,
          right: false
        }
        }
      }
		},
		data(){
			return{
				beforePullDown: true,
				isRebounding: false,
				isPullingDown: false,
				isPullUpLoad: false,
				pullUpDirty: true,
				pullDownStyle: '',
				bubbleY: 0
			}
		},
		computed: {
			pullUpTxt(){
				const moreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more ||this.$i18n.t('scrollComponent.defaultLoadTxtMore')
				const noMoreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore || this.$i18n.t('scrollComponent.defaultLoadTxtNoMore')
				return this.pullUpDirty? moreTxt: noMoreTxt
			},
			refreshTxt(){
				return this.pullDownRefresh && this.pullDownRefresh.txt || this.$i18n.t('scrollComponent.defaultRefreshTxt')
			}
		},
		created(){
			this.pullDownInitTop = -50
		},
		mounted(){
			setTimeout(()=>{
				this.initScroll()
		}, 20)
		},
		methods: {
			initScroll(){
				if(!this.$refs.wrapper){
					return
				}
				if(this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)){
					this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`
				}
				let options = {
					probeType: this.probeType,
					click: this.click,
					scrollY: this.freeScroll || this.direction === DIRECTION_V,
					scrollX: this.freeScroll || this.direction === DIRECTION_H,
					scrollbar: this.scrollbar,
					pullDownRefresh: this.pullDownRefresh,
					pullUpLoad: this.pullUpLoad,
					startY: this.startY,
					freeScroll: this.freeScroll,
					mouseWheel: this.mouseWheel,
          bounce: this.bounce
				}
				this.scroll = new BScroll(this.$refs.wrapper, options)
				if(this.listenScroll){
					this.scroll.on('scroll', (pos)=>{
						this.$emit('scroll', pos)
					})
				}

				if(this.listenBeforeScroll){
					this.scroll.on('beforeScrollStart', ()=>{
						this.$emit('beforeScrollStart')
					})
				}
				if(this.pullDownRefresh){
					this._initPullDownRefresh()
				}
				if(this.pullUpLoad){
					this._initPullUpLoad()
				}
			},
				disable(){
					this.scroll && this.scroll.disable()
				},
				enable(){
					this.scroll && this.scroll.enable()
				},
				refresh(){
					this.scroll && this.scroll.refresh()
				},
				scrollTo(){
					this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
				},
				scrollToElement(){
					this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
				},
				clickItem(e, item){
					this.$emit('click', item)
				},
				destory(){
					this.scroll.destory()
				},
				forceUpdate(dirty){
					if(this.pullDownRefresh && this.isPullingDown){
						this.isPullingDown = false
						this._reboundPullDown().then(()=>{
							this._agterPullDown()
						})
					}else if(this.pullUpLoad && this.isPullUpLoad){
						this.isPullUpLoad = false
						this.scroll.finishPullUp()
						this.pullUpDirty = dirty
						this.refresh()
					}else{
						this.refesh()
					}
				},
				_initPullDownRefresh(){
					this.scroll.on('pullingDown', ()=>{
						this.beforePullDown = false
						this.isPullingDown = true
						this.$emit('pullingDown')
					})
					this.scroll.on('scroll', (pos)=>{
						if(!this.pullDownRefresh){
							return
						}
						if(this.beforePullDown){
							this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
						this.pullDownStyle = `top:${Math.min(pos.y+this.pullDownInitTop, 10)}px`
					}else{
						this.bubbleY = 0
					}
					if(this.isRebounding){
						this.pullDownStyle = `top:${10-(this.pullDownRefresh.stop - pos.y)}px`
					}

					})
				},
				_initPullUpLoad(){
					this.scroll.on('pullingUp', ()=>{
						this.isPullUpLoad = true
						this.$emit('pullingUp')
					})
				},
				_reboundPullDown(){
					const {stopTime = 600} = this.pullDownRefresh
					return new Promise((resolve)=>{
						setTimeout(()=>{
							this.isRebounding = true
							this.scroll.finishPullDown()
							resolve()
						}, stopTime)
					})
				},
				_afterPullDown(){
					setTimeout(()=>{
						this.pullDownStyle = `top:${this.pullDownInitTop}px`
						this.beforePullDown = true
						this.isRebounding = false
						this.refresh()
					}, this.scroll.options.bounceTime)
				}

		},
		watch: {
			data(){
				setTimeout(()=>{
					this.forceUpdate(true)
				}, this.refreshDelay)
			}
		},
		components:{
			Loading,
			Bubble
		}
	}
</script>

<style lang='less'>
	.list-wrapper{
		position: relative;
		height: 100%;
		overflow: hidden;
		// background: #fff;
		.scroll-content{
			position: relative;
			z-index: 1;
			// display: inline-block;
		}
		.list-content{
			position: relative;
			z-index: 10;
			background: #fff;
			.list-item{
				height: 60px;
				line-height: 60px;
				font-size: 18px;
				padding-left: 20px;
				border-bottom: 1px solid #e5e5e5;
			}
		}
	}
	.pulldown-wrapper{
		position: absolute;
		width: 100%;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: alll;
		.after-trigger{
			margin-top: 10px;
		}
	}
	.pullup-wrapper{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 16px 0;
	}
</style>
















