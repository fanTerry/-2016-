<template>
  <div class="ui_pop">
    <!-- 填写收获地址 -->
    <section class="receive_adress">
      <a class="close" @click="close"></a>
      <h3 class="title">请添加一个收货地址</h3>
      <div>
        <label for="receive_user">收货人</label>
        <input v-model="address.receiverName" @blur="scrollToTop" type="text" id="receive_user" placeholder="请输入姓名">
      </div>
      <div>
        <label for="phone_num">手机号码</label>
        <input v-model="address.receiverPhone" @blur="scrollToTop" type="tel" maxlength="11" id="phone_num" placeholder="请输入手机号码">
      </div>
      <div>
        <label>所在地区</label>
        <p id="sel_address" ref="address" class="user_address">
          <span>{{address.receiverProvince}}</span><span>{{address.receiverCity}}</span><span>{{address.receiverDistrict}}</span>
        </p>
        <span id="sel_city" class="choose" ref="city">请选择<i></i></span>
      </div>
      <div class="detail_adress">
        <span>详细地址：</span>
        <textarea v-model="address.receiverAddress" @blur="scrollToTop" name="" id="" cols="30" rows="4" placeholder="如道路、门牌号、小区、楼栋号、单元室等">
        </textarea>
      </div>
      <div class="set_address" @click="setDefault()">
        <span><i :class="{select:address.defaulted==1}"></i>设置为默认地址</span>
      </div>
      <!-- <div class="location_address">
        <i class="location_icon"></i>
        <div>
          <label for="receive_user">收货人</label>
          <input type="text" id="receive_user" placeholder="">
        </div>
        <span class="link_icon"></span>
      </div> -->
      <a class="exchange_btn" @click="submit()">确定</a>
    </section>
    <a class="delete_address" v-if="type==2" @click="showDeleteDialog()">删除收货地址</a>

  </div>

</template>

<script>
import chooseAddress from '../../../assets/js/addresschoose';
import { getCheck } from '../../../libs/utils';

export default {
  data() {
    return {
      type: 1,

      address: {
        id: Number,
        receiverName: '',
        receiverPhone: '',
        receiverProvince: '',
        receiverCity: '',
        receiverDistrict: '',
        receiverAddress: '',
        defaulted: 0
      }
    };
  },
  created() {
    if (this.$route.query.type) {
      this.type = this.$route.query.type;
    }
  },
  mounted() {
    chooseAddress();
    // $("#sel_city").html(this.address.receiverProvince)
    //   console.log(this.$refs.city);
    // $("#sel_city").text(this.address.receiverProvince)
    // this.$refs.city.text()
    // this.$refs.city.html = ;
  },
  methods: {
    close() {
      this.$emit('close');
    },
    showDeleteDialog() {
      this.$emit('showDialog');
    },

    setDefault() {
      if (this.address.defaulted == 0) {
        this.address.defaulted = 1;
      } else {
        this.address.defaulted = 0;
      }
    },
    update() {
      this.type = 1;
      this.address.receiverProvince = '';
      this.address.receiverCity = '';
      this.address.receiverDistrict = '';
    },
    submit() {
      let str = this.$refs.address.textContent;
      if (this.type == 1) {
        this.address.receiverProvince = str;
      }

      if (!this.address.receiverPhone) {
        this.$toast('请填写收货人');
        return;
      }
      if (!getCheck.checkPhone(this.address.receiverPhone)) {
        this.$toast('请填写正确的手机号码');
        return;
      }
      if (!this.address.receiverProvince) {
        this.$toast('请填写地区');
        return;
      }

      if (!this.address.receiverAddress) {
        this.$toast('请填写详细地址');
        return;
      }
      console.log('----', this.address);
      return this.$post('/agency/shopAddress/saveAddress', this.address)
        .then(rsp => {
          console.log(rsp);
          if (rsp.code === '200' && null != rsp.data) {
            this.address.id = rsp.data.addressId;
            this.$emit('successSave', this.address);
          } else {
            this.$toast(rsp.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    scrollToTop: function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 100);
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
@import '../../../assets/common/_base';
@import '../../../assets/common/_mixin';
@import '../../../assets/common/_var';
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
.user_address {
  flex: 1;
  -webkit-flex: 1;
  color: #333;
  span {
    padding-right: 5px;
  }
}
.exchange_btn {
  @extend .flex_v_h;
  margin: 4px auto;
  font-size: 17px;
  @include getBtn(147px, 40px, 17px, #fff, transparent, 40px);
  background: linear-gradient(to right, #ffa200, #ff7b1c);
}

.receive_adress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 10px;
  border-radius: 6px 6px 0 0;
  background-color: #fff;
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
      -webkit-flex: 1;
      line-height: 15px;
      text-indent: 64px;
      &::-webkit-input-placeholder {
        text-indent: 64px;
      }
    }
    span {
      position: absolute;
      left: 0;
      top: 15px;
      font-size: 13px;
      line-height: 15px;
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
