<template>
  <div class='Page'>
    <header class='mod_header'>
      <div class="user_info">
        <div class="left">
          <img :src="userInfo.headimg|getDefaultImg(globalConst.xyxUserDefaultIcon)" alt="">
          <div>
            <p class="name">{{userInfo.nickName|subStr(4)}}</p>
            <div class="asset_num">{{userInfo.ableRecScore}}</div>
          </div>
        </div>
        <div class="right">
          <span class="store"></span>
          <p>敬请期待</p>
        </div>
      </div>
    </header>
    <div class='main'>
      <section>
        <div class="title"><i></i>精彩推荐</div>
        <div class="con">
          <ul>
            <li class="mod_game" @click="goUrlPage('/game/shake')">
              <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=77803909,1821864843&fm=26&gp=0.jpg" alt="">
            </li>
            <li class="mod_game" @click="goUrlPage('/game/goldEmpire')">
              <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595932003823&di=c611b95d1eee9d00a899bed3889cedc3&imgtype=0&src=http%3A%2F%2Fi1.hdslb.com%2Fbfs%2Farchive%2F4cd62e47329e6ef4d56507eab97aecd53196fc30.jpg"
                alt="">
            </li>
          </ul>
        </div>
      </section>
    </div>
    <!-- <div class="ui_pop" v-if="showDemoFlag">
      <div class="pop_demo">
        <a class="close" @click="showDemoFlag = false"></a>
        <p @click="getNewToken()">点击试玩</p>
      </div>
    </div> -->
    <footer class='mod_footer'>

    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {},
  props: [],
  data() {
    return {
      showDemoFlag: true, //试玩弹窗
      token: String
    };
  },
  computed: {
    ...mapGetters({
      getBetData: 'getBetData',
      getGuessData: 'getGuessData',
      userInfo: 'getUserInfo'
    })
  },
  mounted() {
    this.getUserWallet();
  },
  methods: {
    ...mapActions(['setUserInfo']),
    goUrlPage(url) {
      this.$router.push({
        path: url
      });
    },
    getUserWallet() {
      return this.$post('/agency/api/member/getInfo')
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == 200) {
            // console.log(dataResponse.data.ableRecScore, "接口获取用户的星星");
            this.setUserInfo({
              ...this.userInfo,
              ableRecScore: dataResponse.data.balance,
              nickName: dataResponse.data.nickname,
              icon: dataResponse.data.headimg
            });

            // console.log(this.userInfo);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //点击试玩刷新获取token
    getNewToken() {
      this.$post('/agency/api/member/login?phone=13811138111&password=123456')
        .then(res => {
          let dataResponse = res.data;
          localStorage.setItem('eToken', dataResponse.token);
          this.showDemoFlag = false;
          this.getUserWallet();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../../assets/common/_base';
@import '../../assets/common/_mixin';

.Page {
  @include getBgImg('../../assets/images/game/index_bg.png');
}

.mod_header {
  background-color: transparent;
}

.main {
  padding-bottom: 5.3333vw;
}

.user_info {
  @extend .flex_v_justify;
  padding: 4vw 5.3333vw;
  .left {
    @extend .flex_hc;
    img {
      width: 12.5333vw;
      height: 12.5333vw;
      margin-right: 4vw;
      border: 0.5333vw solid #fff;
      border-radius: 50%;
    }
  }
  .name {
    font-size: 4vw;
    color: #fff;
  }
  .asset_num {
    position: relative;
    @extend .flex_v_h;
    width: 33.3333vw;
    height: 6.6667vw;
    margin: 1.8667vw 0 0 0.9333vw;
    font-size: 3.7333vw;
    font-weight: bold;
    color: #fff;
    background-color: #0c3263;
    border: 1px solid #0974bc;
    border-radius: 6.6667vw;
    text-align: center;
    &::before {
      content: '';
      @extend .g_v_mid;
      left: -1.3333vw;
      width: 7.7333vw;
      height: 7.7333vw;
      @include getBgImg('../../assets/images/game/gold_icon.png');
    }
    &::after {
      content: '';
      @extend .g_v_mid;
      right: 0;
      width: 6.1333vw;
      height: 6.1333vw;
      @include getBgImg('../../assets/images/game/add_icon.png');
    }
  }
  .right {
    text-align: center;
    .store {
      display: inline-block;
      width: 9.0667vw;
      height: 9.0667vw;
      @include getBgImg('../../assets/images/game/store_icon.png');
    }
    p {
      @include getBtn(13.3333vw, 3.4667vw, 2.4vw, #fff, #5f9de2, 3.4667vw);
      margin-top: 0.5333vw;
    }
  }
}

.title {
  @extend .flex_hc;
  padding: 2.6667vw 4.2667vw;
  font-size: 4vw;
  color: #fff;
  i {
    width: 6.9333vw;
    height: 6.9333vw;
    margin-right: 1.0667vw;
    @include getBgImg('../../assets/images/game/good_icon.png');
  }
}

.con {
  margin: 0 1.3333vw;
  padding: 0.8vw;
  border-radius: 1.8667vw;
  background-color: #2198ff;
  ul {
    padding: 0.1333vw 3.2vw;
    border-radius: 1.8667vw;
    background-color: #fff;
  }
  li {
    margin: 3.2vw 0;
  }
  img {
    width: 100%;
    height: 33.3333vw;
    object-fit: cover;
    border-radius: 1.8667vw;
  }
}

.pop_demo {
  position: relative;
  width: 53.3333vw;
  padding: 13.3333vw 5.3333vw;
  background-color: #fff;
  .close {
    @include getClose(5.3333vw, #000);
    right: 0;
    top: 0;
  }
  p {
    font-size: 5.3333vw;
    color: #000;
    text-align: center;
  }
}
</style>
