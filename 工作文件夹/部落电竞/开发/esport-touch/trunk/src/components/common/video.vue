<template>
  <div>
    <Xgplayer :ref="'player_'+videoId" :config="config" @player="initPlay($event,videoId)" />
  </div>
</template>

<script>
import Xgplayer from 'xgplayer-vue';
export default {
  components: {
    Xgplayer
  },
  /**
   * videoUrl:视频地址,
   * poster:视频封面,
   * videoId:视频id,
   * scene:视频场景(防止页面缓存)
   */
  props: ['videoUrl', 'poster', 'videoId', 'scene'],
  data() {
    return {
      player: null,
      id: Number,
      config: {
        id: this.scene + '_' + this.videoId,
        url: this.videoUrl,
        muted: 'muted',
        poster: this.poster,
        playsinline: true,
        'x5-video-player-fullscreen': 'false',
        fluid: true,
        closeVideoTouch: true,
        playbackRate: [0.5, 0.75, 1, 1.5, 2]
      }
    };
  },
  mounted() {
    let that = this;
    this.$bus.$on('videoPause', videoId => {
      // console.log("监听视频暂停事件", videoId);
      //关闭其他的弹出
      if (videoId != that.id) {
        if (that.player.hasStart) {
          that.player.pause();
        }
      }
    });

    this.$bus.$on('videoPauseByAll', videoId => {
      // console.log("监听视频暂停事件", videoId);
      //暂停视频
      if (that.player.hasStart) {
        that.player.pause();
      }
    });
  },
  created() {},
  beforeDestroy() {
    this.$bus.$off('videoPause');
  },
  methods: {
    /**
     * 初始化播放器实例
     */
    initPlay(e, videoId) {
      this.player = e;
      // console.log("初始化播放器");
      // console.log(this.player);
      this.id = videoId;
      //监听播放事件
      let that = this;
      this.player.on('play', function() {
        //暂停其他视频的播放
        that.pauSeOther();
      });
      // 将视频加入到dom里面
      this.player.start();
    },
    pauSeOther() {
      console.log('暂停其他视频');
      this.$bus.$emit('videoPause', this.id);
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/common/_mixin';
.xgplayer-skin-default .xgplayer-enter .xgplayer-enter-spinner {
  width: 50px !important;
  height: 50px !important;
}
.xgplayer-skin-default.xgplayer-nostart .xgplayer-poster,
.xgplayer-skin-default {
  border-radius: 5px;
}
.xgplayer-skin-default video {
  border-radius: 5px;
}

.xgplayer-skin-default .xgplayer-start {
  background: url('../../assets/images/home/video_icon.png') no-repeat center !important;
  background-size: contain !important;
  .xgplayer-icon-play {
    display: none !important;
  }
}
</style>
