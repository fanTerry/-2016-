<template>
  <div class="ui_pop" v-if='step1Flag||step2Flag'>
    <!-- 购买数量 -->
    <section class="exchange_quantity" v-if='step1Flag'>
      <a class="close" @click="step1Flag=false"></a>
      <div class="card" v-if="goodsDetail.imageList&&goodsDetail.imageList.length>0">
        <img :src="goodsDetail.imageList[0]" alt="">
        <div>
          <span>
            <!--<i class="star_coin"></i>-->￥{{goodsDetail.payScore}}</span>
          <p>库存{{goodsDetail.stock?goodsDetail.stock:0}}件
            <span class="noGoods_tips" v-if='goodsDetail.stock==0'>（已抢光）</span>
          </p>
        </div>
      </div>
      <div class="exchange_num">
        <span>购买数量</span>
        <div class="data">
          <span class="reduce" @click="minuNum($event,true)"></span>
          <input class="num" maxlength="4" type="tel" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" @blur="scrollToTop" v-model.number.lazy="finalNum">
          <span class="add" @click="minuNum($event,false)"></span>
        </div>
      </div>
      <!-- 置灰态加类名disabled -->
      <a class="exchange_btn" :class="{'disabled':goodsDetail.stock==0}" @click="toConfirmAddress">确定</a>
    </section>

    <!-- 填写收获地址 -->
    <section class="receive_adress" v-if='step2Flag&&needAddressFlag'>
      <a class="close" @click="closePop"></a>
      <template v-if='!hasDefaultAddress&&receiveAddress==null'>
        <writeAddress @successSave="successSave" @close="closePop"></writeAddress>
      </template>
      <template v-if="hasDefaultAddress||receiveAddress!=null">
        <h3 class="title">确认订单</h3>
        <!-- 地址填写组件 -->
        <router-link :to="{path:'/addressManage', query:{redirect:$route.fullPath}}">
          <locationAddress :address='receiveAddressComp' :showLinkIcon="true"></locationAddress>
        </router-link>
        <div class="order_remarks">
          <span>订单备注</span>
          <textarea v-model="remark" @blur="scrollToTop" cols="30" rows="4" maxlength="50" placeholder="选填,备注您的订单需求,50字以内">
          </textarea>
        </div>
        <div class="confirm_con" v-if='goodsDetail'>
          <div>
            <span class="num">共{{finalNum}}件，</span>
            <span>合计：</span>
            <span class="money">
              <!--<i class="star_coin"></i>-->￥{{(finalNum*goodsDetail.payScore).toFixed(2)}}</span>
            <a class="confirm_btn" @click="confimPayChange">确定</a>
          </div>
        </div>
      </template>
    </section>
    <!--虚拟卡购买-->
    <section class="receive_adress" v-if='step2Flag&&!needAddressFlag'>
      <a class="close" @click="closePop"></a>
      <h3 class="title">确认订单</h3>
      <div class="confirm_con">
        <div>
          <span class="num">共{{finalNum}}件，</span>
          <span>合计：</span>
          <span class="money">
            <!--<i class="star_coin"></i>-->￥{{(finalNum*goodsDetail.payScore).toFixed(2)}}</span>
          <a class="confirm_btn" @click="confimPayChange">确定</a>
        </div>
      </div>
    </section>

    <popUp v-if="showPay" @close="closePayDialog" ref="popUpRef" :price="(finalNum*goodsDetail.payScore).toFixed(2)" unit='星星' @chooseWay="chooseWay">
    </popUp>
    <popAlert :showPop='showPop' @close='showPop=false' @confirm='confirm' btnTxt1="已取消" btnTxt2="已完成支付" type="2">
      <p>请确认微信支付是否已完成</p>
    </popAlert>
  </div>
</template>

<script>
import locationAddress from '../../../components/store/address';
import popUp from '../../../components/pop_up/pay/index';
import writeAddress from './writeAddress';
import { mapGetters, mapActions } from 'vuex';
import { add } from '../../../libs/utils';
import popAlert from 'components/pop_up/pop_alert';
export default {
  components: {
    locationAddress,
    writeAddress,
    popUp,
    popAlert
  },
  props: {
    goodsDetail: Object
  },
  data() {
    return {
      step1Flag: true,
      step2Flag: false,
      receiveAddress: null,
      hasDefaultAddress: false,
      finalNum: 1,
      showPay: false,
      noAddress: [2],
      needAddressFlag: true,
      remark: '',
      orderId: null,
      showPop: false
    };
  },
  computed: {
    ...mapGetters({
      addressObj: 'getUserAddress'
    }),
    receiveAddressComp() {
      console.log(this.addressObj);
      if (this.addressObj.receiverName) {
        return this.addressObj;
      } else {
        return this.receiveAddress;
      }
    }
  },
  created() {},
  mounted() {
    this.getUserAddress();
    this.getWxConfig();
  },
  methods: {
    getWxConfig: function() {
      this.$post('/api/wxlogin/getJsConfig')
        .then(rsp => {
          console.log(rsp, 'rsp');
          if (rsp) {
            this.wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: rsp.appId, // 必填，公众号的唯一标识
              timestamp: rsp.timestamp, // 必填，生成签名的时间戳
              nonceStr: rsp.nonceStr, // 必填，生成签名的随机串
              signature: rsp.signature, // 必填，签名，见附录1
              jsApiList: ['chooseWXPay']
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    closePop() {
      console.log('111');
      this.step1Flag = true;
      this.step2Flag = false;
    },
    successSave(address) {
      // console.log("sdfadsfadfaf");
      //  this.$router.go(-1);
      this.receiveAddress = address;
      console.log(address, 'sss');
    },
    closePayDialog() {
      this.showPay = false;
    },
    confimPayChange() {
      if (null == this.receiveAddress && this.needAddress()) {
        this.$toast('请先填写收货地址', 2);
        return;
      }
      this.showPay = true;
    },
    chooseWay(index) {
      var _self = this;
      console.log(this.globalConst.paypayIndexMap);
      console.log('选择的支付方式');
      let param = {};
      param.choosedPayWay = index;
      if (this.needAddress()) {
        param.addressId = this.receiveAddress.id;
      }
      param.goodsId = this.goodsDetail.id;
      param.num = this.finalNum;
      param.remark = this.remark;
      this.$refs.popUpRef.preventRepeat(false);
      this.$post('/api/shopOrder/submit/' + this.goodsDetail.id, param)
        .then(res => {
          console.log(res);
          this.$refs.popUpRef.preventRepeat(true);
          if ((res.code = '200' && res.data != null)) {
            this.orderId = res.data.outOrderId;
            if (index == this.globalConst.payIndexMap.get('WXH5_PAY')) {
              console.log('微信h5');
              if (res.data.requestUrl != '') {
                var redirect_url = encodeURIComponent(window.location.href);
                console.log(redirect_url, 'redirect_url');
                let u = navigator.userAgent;
                let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isiOS) {
                  window.location.href = res.data.requestUrl + '&redirect_url=' + redirect_url;
                } else {
                  window.location.href = res.data.requestUrl;
                }
                setTimeout(() => {
                  this.showPop = true;
                }, 3000);
              }
              return;
            } else if (index == this.globalConst.payIndexMap.get('WXJSAPI_PAY')) {
              this.weixinPay(res.data.requestParams, _self);
              return;
            }
            this.$toast('购买成功', 2);
            this.closePayDialog();
            this.step1Flag = false;
            this.step2Flag = false;
            setTimeout(() => {
              this.$router.push({
                name: 'orderDetails',
                params: {
                  orderId: res.data.outOrderId
                }
              });
            }, 500);
          } else {
            this.$toast(res.message, 2);
          }
        })
        .catch(error => {
          this.$refs.popUpRef.preventRepeat(true);
          console.log(error);
        });
    },
    toConfirmAddress() {
      if (this.goodsDetail.stock == 0) {
        this.$toast('商品太火爆,被抢光啦~', 2);
        return;
      }
      var re = /^[0-9]+$/;
      var isPositive = re.test(this.finalNum);
      if (!isPositive || this.finalNum == null || this.finalNum <= 0) {
        this.finalNum = 0;
        this.$toast('请先填写购买数量', 2);
        return;
      }
      if (this.finalNum > this.goodsDetail.stock) {
        this.$toast('商品库存不足', 2);
        return;
      }
      this.step1Flag = false;
      this.step2Flag = true;
    },
    getUserAddress() {
      if (!this.needAddress()) {
        return;
      }
      this.$post('/api/shopAddress/default')
        .then(res => {
          console.log(res);
          if ((res.code = '200' && res.data != null)) {
            this.hasDefaultAddress = true;
            this.receiveAddress = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    minuNum(e, isMinu) {
      let curTar = e.target; // 当前元素
      let input, mulInt;
      if (isMinu) {
        input = curTar.nextElementSibling;
        if (parseInt(input.value) <= 1) {
          return;
        }
        mulInt = parseInt(input.value) - 1;
      } else {
        input = curTar.previousElementSibling;
        if (parseInt(input.value) >= 50000) {
          return;
        }
        mulInt = parseInt(input.value) + 1;
      }
      this.finalNum = mulInt;
    },
    needAddress() {
      //true 需要填写地址
      let res = this.noAddress.indexOf(this.goodsDetail.type) == -1;
      this.needAddressFlag = res;
      return res;
    },
    scrollToTop: function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 100);
    },
    refulshBanlance() {
      if (this.$refs.popUpRef) {
        this.$refs.popUpRef.getPayWayList();
      }
    },
    weixinPay: function(params, _self) {
      console.log(params, 'params');
      _self.wx.ready(function() {
        _self.wx.chooseWXPay({
          timestamp: params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: params.nonceStr, // 支付签名随机串，不长于 32 位
          package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: params.paySign, // 支付签名
          success: function(res) {
            _self.$toast('购买成功', 2);
            _self.$router.push({
              name: 'orderDetails',
              params: {
                orderId: _self.orderId
              }
            });
          },
          cancel: function(res) {
            _self.$toast('支付取消', 2);
          },
          fail: function(res) {
            _self.$toast('支付失败', 2);
          }
        });
      });
    },
    confirm: function() {
      this.showPop = false;
      this.closePayDialog();
      this.$router.push({
        name: 'orderDetails',
        params: {
          orderId: _self.orderId
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../../../assets/common/_base';
@import '../../../assets/common/_mixin';
@import '../../../assets/common/_var';
.disabled {
  opacity: 0.2;
}
.noGoods_tips {
  display: inline-block;
  padding-right: 5px;
  color: $color_main;
}
.order_remarks {
  position: relative;
  background: initial !important;
  span {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 13px;
    color: #333;
  }
  textarea {
    width: 100%;
    font-size: 13px;
    text-indent: 68px;
    line-height: 15px;
    &::-webkit-input-placeholder {
      text-indent: 68px;
      font-size: 13px;
      line-height: 15px;
    }
  }
}
.close {
  position: absolute;
  right: 8px;
  top: 8px;
  @include getClose(10px, #999);
  border: 1px solid #999;
  border-radius: 50%;
}
.star_coin {
  width: 20px;
  height: 20px;
  margin-right: 3px;
  @include getBgImg('../../../assets/images/user_center/star_coin.png');
}
.location_address {
  flex: 1;
  -webkit-flex: 1;
  span {
    padding-right: 5px;
    color: #333;
  }
}
.exchange_btn {
  @extend .flex_v_h;
  margin: 4px auto;
  font-size: 17px;
  @include getBtn(147px, 40px, 17px, #fff, transparent, 40px);
  background: linear-gradient(to right, #ffa200, #ff7b1c);
}
.exchange_quantity,
.receive_adress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 10px;
  border-radius: 6px 6px 0 0;
  background-color: #fff;
}
.exchange_quantity {
  .card {
    @extend .flex_hc;
    padding-bottom: 15px;
    margin-top: -10.6vw;
    // @include getBorder(bottom, #eee);
    img {
      width: 45.3vw;
      height: 22.6vw;
      border-radius: 6px;
      background-color: #ddd;
      object-fit: contain;
    }
    > div {
      font-size: 16px;
      padding-left: 15px;
      padding-top: 13vw;
      color: $color_main;
      p {
        font-size: 12px;
        padding-top: 5px;
        color: #999;
      }
    }
  }

  .exchange_num {
    @extend .flex_v_justify;
    padding: 12px 0 13px;
    font-size: 13px;
    color: #666;
    // @include getBorder(bottom, #eee);
    .data {
      @extend .flex_hc;
      span {
        text-align: center;
        background-color: #eee;
      }
    }
    .reduce,
    .add {
      position: relative;
      width: 24px;
      height: 24px;
    }
    .reduce,
    .add {
      &::after {
        content: '';
        @extend .g_v_c_mid;
        width: 10px;
        height: 1px;
        background-color: #999;
      }
    }
    .add {
      &::before {
        content: '';
        @extend .g_v_c_mid;
        height: 10px;
        width: 1px;
        background-color: #999;
      }
    }
    .num {
      width: 35px;
      line-height: 24px;
      margin: 0 1px;
      font-size: 13px;
      color: #333;
      font-weight: 500;
      border: none;
      text-align: center;
      background-color: #eee;
    }
  }
}
.receive_adress {
  .title {
    padding: 13px 0;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    // @include getBorder(bottom, #eee);
  }
  > div {
    @extend .flex_v_justify;
    // @include getBorder(bottom, #eee);
    font-size: 13px;
    color: #999;
  }
  input {
    flex: 1;
    -webkit-flex: 1;
  }
  label {
    width: 94px;
  }
  label,
  input {
    @extend .flex_hc;
    height: 48px;
    font-size: 13px;
  }
  input,
  textarea {
    border: none;
    font-size: 13px;
    color: #333;
  }
  .choose {
    position: relative;
    padding-right: 24px;
    i {
      @extend .g_v_mid;
      right: 0;
      margin-right: 10px;
      @include getArrow(8px, #999, right);
    }
  }
  .detail_adress {
    position: relative;
    padding: 15px 0;
    textarea {
      flex: 1;
      line-height: 15px;
      text-indent: 64px;
    }
    span {
      position: absolute;
      left: 0;
      top: 15px;
      font-size: 13px;
      color: #999;
    }
  }
  .set_address {
    @extend .flex_hc;
    height: 48px;
    span {
      @extend .flex_hc;
      i {
        width: 16px;
        height: 16px;
        margin-right: 7px;
        border: 1px solid #999;
        border-radius: 50%;
      }
      .select {
        @include getBgImg('../../../assets/images/store/select.png');
        border: none;
      }
    }
  }
  .confirm_con {
    @extend .flex_hc;
    justify-content: flex-end;
    padding: 4px 0;
    font-size: 14px;
    color: #333;
    // @include getBorder(top, #eee);
    > div,
    .money {
      @extend .flex_hc;
    }
    .num {
      font-size: 12px;
      color: #999;
    }
    .money {
      color: $color_main;
      font-size: 14px;
    }
    .confirm_btn {
      margin-left: 12px;
      @include getBtn(95px, 40px, 14px, #fff, transparent, 40px);
      background: linear-gradient(to right, #ffa200, #ff7b1c);
    }
  }
}

// iphoneX,iphone Xs max适配
@media only screen and (min-device-width: 375px) and (min-device-height: 812px) and (-webkit-device-pixel-ratio: 3),
  only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
  .exchange_quantity,
  .receive_adress {
    padding-bottom: constant(safe-area-inset-bottom) !important;
    padding-bottom: env(safe-area-inset-bottom) !important;
  }
}
</style>