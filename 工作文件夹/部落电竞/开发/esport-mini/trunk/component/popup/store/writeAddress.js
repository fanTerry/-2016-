// component/popup/store/writeAddress.js
const app = getApp();
var api = require('../../../libs/http.js')
var util = require("../../../utils/util")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    // region: []
    // region: ['广东省', '广州市', '海珠区'],
    addressId: null,
    adderess: null,
    region: [],
    customItem: '请选择',
    defaulted: false,
    addressId: null,
    showTextArea:false,


    adderess: {
      id: Number,
      receiverName: "",
      receiverPhone: "",
      receiverProvince: "",
      receiverCity: "",
      receiverDistrict: "",
      receiverAddress: "",
      defaulted: 0
    },
    addressDetail:null,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindRegionChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      console.log(e.detail.value);
      this.setData({
        region: e.detail.value
      })
    },

    formSubmit: function(e) {

      var param = {}
      param.receiverName = e.detail.value.receiverName
      param.receiverPhone = e.detail.value.receiverPhone
      param.receiverAddress = e.detail.value.receiverAddress
      if (this.data.defaulted) {
        param.defaulted = 1
      } else {
        param.defaulted = 0
      }
      if (this.data.addressId) {
        param.id = this.data.addressId
      }

      param.receiverProvince = this.data.region[0]
      param.receiverCity = this.data.region[1]
      param.receiverDistrict = this.data.region[2]

      console.log(param);

      if (!param.receiverName) {
        api._showToast("请填写收货人", 1);
        return
      }

      if (!param.receiverPhone || !util.checkPhone(param.receiverPhone)) {
        api._showToast("请填写正确手机号码", 1);
        return
      }

      if (!param.receiverAddress) {
        api._showToast("请填写详细地址", 1);
        return
      }
      var url = "/shopAddress/saveAddress"
      wx.showLoading({
        title: '正在保存'
      });
      api._postAuth(url, param).then(res => {
        if (res.code == "200") {
          console.log(res, "添加完成");
          wx.hideLoading();
          console.log(this.data.adderess, 'this.data.adderess');
          param.id = res.data.addressId;
          this.triggerEvent("successSave", param)
          // wx.navigateTo({
          //   url: '/pages/store/address/manage'
          // })
        } else {
          api._showToast("添加失败", 1);
          console.log(res.message);
        }
      }).catch(e => {})


    },

    chooseDefault: function() {
      var checked = !this.data.defaulted
      this.setData({
        defaulted: checked
      })
    },

    deleteAdderess: function(e) {
      let addresId = this.data.addressId
      wx.showModal({
        title: '温馨提示',
        content: '是否删除改地址',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            console.log(addresId);
            api._postAuth("/shopAddress/deleteAddress", {
              addresId: addresId
            }).then(res => {
              if (res.code == "200") {
                console.log("删除完成");
                wx.navigateTo({
                  url: '/pages/store/address/manage'
                })
              } else {
                api._showToast("删除失败", 1);
                console.log(res.message);
              }
            }).catch(e => {})


          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })


    },

    showInput:function(){

      this.setData({
        showTextArea:!this.data.showTextArea
      })

    },
    showView:function(e){
      let addressDetail = e.detail.value
      // let adderess =   this.data.adderess
      // adderess.receiverAddress = addressDetail
      // console.log(address);
      this.setData({
        showTextArea:!this.data.showTextArea,
        addressDetail:addressDetail,
      })
    }
  }
})