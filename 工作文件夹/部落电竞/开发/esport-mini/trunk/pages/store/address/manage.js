// modules/store/index.js
const app = getApp();
var api = require('../../../libs/http.js')
var strUtil = require('../../../libs/strUtil')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopAddressList: [],
    returnUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.listAddress()
    this.setData({
      returnUrl: options.returnUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
	this.listAddress()
    this.setData({
      returnUrl: options.returnUrl
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadShopGoods()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 查询商品和广告轮播图
   */
  listAddress: function() {
    var that = this
    var url = "/shopAddress/listAddress";
    api._postAuth(url, {

    }).then(res => {
      if (res.code == "200") {
        that.setData({
          shopAddressList: res.data.shopAddressList
        });
      } else {
        console.log(res.message);
      }
    }).catch(e => {})

  },

  goToDetailAddress: function(e) {
    var curIndex = e.currentTarget.dataset.index;
    console.log(curIndex);
    var address = this.data.shopAddressList[curIndex]
    console.log(address);
    wx.navigateTo({
      url: '/pages/store/address/edit?addressId=' + address.id
    })

  },

  addAdress: function() {
    if(this.data.returnUrl){
      wx.redirectTo({
        url: '/pages/store/address/edit?returnUrl=' + this.data.returnUrl
      })
    }else{
      wx.navigateTo({
        url: '/pages/store/address/edit'
      })
    }
    
  },


  changeTag: function(e) {
    var curIndex = e.currentTarget.dataset.index;
    if (curIndex == 0) {
      return
    }
    var arry = this.data.subMenuList
    var goodsQueryType = arry[curIndex].contentType
    var name = arry[curIndex].name
    console.log(name);
    wx.navigateTo({
      url: '/pages/store/list/goodsList?goodsQueryType=' + goodsQueryType + "&name=" + name
    })
  },

  goShopList: function(e) {
    var curIndex = e.currentTarget.dataset.index;
    var arry = this.data.categoryList;
    console.log(arry);
    var contentType = arry[curIndex].id;
    var name = arry[curIndex].name
    wx.navigateTo({
      url: '/pages/store/list/goodsList?contentType=' + contentType + "&name=" + name
    })

  },
  toSelectAddress: function(e) {
    console.log(e.currentTarget.dataset.address, 'toSelectAddress');
    var address = e.currentTarget.dataset.address;
    // var returnUrl = strUtil.base64decode(this.data.returnUrl);
    // console.log(returnUrl, '选择地址需要回跳的地址');
    // if (returnUrl.indexOf("goodsDetai") > -1) {
    //   wx.navigateBack();
    // }

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; // 当前页
    var prevPage = pages[pages.length - 2]; // 上一个页面
    // 如果存在上一页
    if (prevPage && prevPage.route.indexOf("goodsDetai") > -1) {
      // 可以修改上一页的数据
      prevPage.selectComponent("#goods_exchange").setData({
        receiveAddress: address
      })
      // 返回上一页
      wx.navigateBack();
    }
  }

})