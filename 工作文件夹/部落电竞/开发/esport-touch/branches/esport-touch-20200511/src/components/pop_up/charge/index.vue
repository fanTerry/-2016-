<template>
  <div class="ui_pop">
    <div class="pop_pay">
      <div class="order">充值方式选择
        <a class="close" @click="close()"></a>
      </div>
      <div class="pay_method" v-for="item in chargeWayList " @click="choose(item)">
        <div>
          <img :src="item.payIcon" alt="">{{item.payName}}
          <span v-if='item.showBalance==1'>(余额:{{item.balance}})</span>
        </div>
        <i class="select_icon" :class="choosedPayWay.payIndex==item.payIndex?'selected':''"></i>
      </div>
      <a class="exchange_btn" @click="confirm()">{{buttonText}}</a>
      <div class="att_tips" v-for="item in chargeWayList">
        <template v-if="item.payIndex==2"> 温馨提示:1元友宝余额价值与1星星价值一致</template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["price", "chargeWayList"],
  data() {
    return {
      choosedPayWay: {},
      buttonText: "确认",
      notEnough: false
    };
  },
  watch: {
    choosedPayWay(newData, oldData) {
      console.log(newData, oldData);
      if (newData.showBalance == 0) {
        this.buttonText = "确认";
        return;
      }
      if (parseFloat(newData.balance) < parseFloat(this.price)) {
        this.buttonText = "余额不足,去充值";
        this.notEnough = true;
      }
    }
  },
  mounted() {
    let _self = this;
    if (_self.chargeWayList) {
      _self.chargeWayList.forEach(function(item) {
        console.log(item);
        if (parseFloat(item.showBalance) >= parseFloat(_self.price)) {
          _self.choosedPayWay = item;
          return;
        } else {
          _self.choosedPayWay = _self.chargeWayList[0];
        }
      });
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    choose(item) {
      this.choosedPayWay = item;

    },
    confirm() {
      console.log(1);
      if (this.choosedPayWay.payIndex == -1) {
        this.$toast("请先选择充值方式");
        return;
      }
      if (this.notEnough) {
        this.toCharge();
        return;
      }
      this.$emit(
        "confirmCharge",
        this.choosedPayWay.payIndex,
        this.chargeWayBalance
      );
    },
    toCharge() {
      let chooseIndex = this.choosedPayWay.payIndex;
      if (chooseIndex == 2) {
        window.location.href = this.globalConst.uboxCharge;
      }
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
@import "../../../assets/common/_base";
@import "../../../assets/common/_mixin";
@import "../../../assets/common/_var";

.pop_pay {
  position: relative;
  width: 100%;
  margin: 0 20px;
  padding-bottom: 25px;
  border-radius: 8px;
  background-color: #fff;
  color: #b7b7b7;

  .close {
    @include getClose(20px, #000);
    @extend .g_v_mid;
    right: 0;
  }
  .order,
  .discount,
  .balance {
    @extend .flex_v_justify;
  }
  .order {
    position: relative;
    padding: 18px 0 14px 15px;
    font-size: 17px;
    color: #000;
    border-bottom: 1px solid #ddd;
  }
  .discount {
    margin: 0 15px;
    padding: 12px 0;
    font-size: 15px;
    border-bottom: 1px solid #ddd;
    .icon-xiangyou {
      font-size: 15px;
    }
    div {
      @extend .flex_hc;
    }
  }
  .balance {
    margin: 0 15px;
    padding: 12px 0;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
  }
  .pay_num {
    padding: 10px 0 15px;
    font-size: 42px;
    text-align: center;
    color: #ee322b;
  }
  .pay_num span {
    font-size: 19px;
  }
  .pay_method {
    @extend .flex_v_justify;
    position: relative;
    margin: 0 15px 10px;
    height: 45px;
    font-size: 16px;
    color: #000;
    > div {
      @extend .flex_hc;
    }
    img {
      width: 26px;
      height: 26px;
      object-fit: cover;
      margin-right: 5px;
    }
    span {
      padding-left: 10px;
      font-size: 13px;
      color: #ee322b;
    }
    .select_icon {
      width: 20px;
      height: 20px;
      // @include getRadiusBorder(#999, all, 100%);
      border: 1px solid #999;
      border-radius: 50%;
    }
    .selected {
      @include getBgImg("../../../assets/images/store/select.png");
      border: none;
    }
  }
  .yb_icon {
    @include getBgImg("../../../assets/images/user_center/yb_coin.png");
  }
  .att_tips {
    padding: 4px 0 8px;
    text-align: center;
  }
  .pay_title {
    padding-top: 20px;
    font-size: 15px;
    text-align: center;
    color: #000;
  }
  .warn_tips {
    @extend .g_c_mid;
    bottom: 10px;
    color: $color_red;
    text-align: center;
  }
  .exchange_btn {
    display: table;
    margin: 0 auto 10px;
    padding: 0 30px;
    font-size: 17px;
    line-height: 40px;
    @include getBtn(auto, auto, transparent, #fff, 40px);
    background: linear-gradient(to right, #ffa200, #ff7b1c);
  }
}
</style>