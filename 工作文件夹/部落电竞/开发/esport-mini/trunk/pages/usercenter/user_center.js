// pages/usercenter/user_center.js
const app = getApp();
var api = require('../../libs/http.js')
Page({

  /**
   * 页面的初始数据
   */
	data: { 
		userInfo: Object,
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {

		this.loadIndexData(true);

	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {

	},

  /**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {
		this.loadIndexData(false);
	},

  /**
   * 生命周期函数--监听页面隐藏
   */
	onHide: function () {

	},

  /**
   * 生命周期函数--监听页面卸载
   */
	onUnload: function () {

	},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
	onPullDownRefresh: function () {

	},

  /**
   * 页面上拉触底事件的处理函数
   */
	onReachBottom: function () {

	},

  /**
   * 用户点击右上角分享
   */
	onShareAppMessage: function () {

	},

	toFollowTab: function () {
		wx.switchTab({
			url: '/pages/follow/follow'
		})
	},

	toMyWallet:function(){
		wx.navigateTo({
			url: '/modules/mypage/mywallet/my-wallet?userId='+this.data.userInfo.usrId,
		})
	},

	toExpertPage: function () {
		wx.navigateTo({
			url: '/modules/expertpage/expertapplypage/expert-apply-page?nickName='+ this.data.userInfo.nickName,
		})
	},

	toMyRecharge: function () {
		wx.navigateTo({
			url: '/modules/mypage/myrecharge/my-recharge?returnUrl=/pages/my/my',
		})
	},

	toPaidArticle: function () {
		wx.navigateTo({
			url: '/modules/expertpage/paidarticlepage/paid-article-page',
		})
	},

	toMyChange: function () {
		wx.navigateTo({
			url: '/pages/store/my_exchange/my_exchange',
		})
	},

  toShop:function(){
    wx.navigateTo({
      url: '/pages/store/store',
    })
	},
	toFeedBackSubmit:function(){
    wx.navigateTo({
      url: "/pages/help/feedBackSubmit/feedBackSubmit",
    })
  },


	/**
	 * 加载首页数据
	 */
	loadIndexData: function (flag) {
		var _self = this;
		var url = "/usercenter/ucIndexdata";
		api._postAuth(url, {
			noShowLoading: true,
			showAuthPage: flag,
			returnUrl: api.getCurrentPageUrlWithArgs()
		}).then(res => {
			if (res.code == "200") {
				_self.setData({
					userInfo: res.data,
				})

			}

		}).catch(e => { })

	},


	getPhoneNumber: function (e) {
		console.log('点击获取手机号');
		if ("getPhoneNumber:ok" != e.detail.errMsg) {
			return;
		}
		wx.checkSession({
			success(res) {//session_key 未过期，并且在本生命周期一直有效
				console.log("session_key 未过期")
				var sid = wx.getStorageSync('sid');
				console.log(sid, "sid")
				api._post("/wxapp/decodephone", {
					sid: sid,
					iv: e.detail.iv,
					encryptedData: e.detail.encryptedData
				}).then(res => {
					console.log(res)
					if (res.code == "200") {
						wx.showToast({
							icon: 'none',
							title: '同步手机号成功' + res.data.phoneNumber
						})
					} else {
						console.log(res.message);
						wx.showToast({
							icon: 'none',
							title: '系统异常请稍后重试或者退出重新登录'
						})
					}
				}).catch(e => { })
			},
			fail() {// session_key 已经失效，需要重新执行登录流程
				console.log("session_key 已经失效")
				wx.login({
					success: function (loginRes) {
						if (loginRes) {//获取用户信息
							wx.getUserInfo({
								withCredentials: true,//非必填  默认为true
								success: function (infoRes) {
									console.log(infoRes, '>>>');
									//请求服务端的登录接口
									api._post('/login', {
										code: loginRes.code,//临时登录凭证
										rawData: infoRes.rawData,//用户非敏感信息
										signature: infoRes.signature,//签名
										encrypteData: infoRes.encryptedData,//用户敏感信息
										iv: infoRes.iv//解密算法的向量
									}).then(res => {
										if (res.code == 200) {
											app.globalData.userInfo = res.data;
											wx.setStorageSync('userInfo', JSON.stringify(res.data));
											wx.setStorageSync('sid', res.data.sid);
											api._post("/wxapp/decodephone", {
												sid: sid,
												iv: e.detail.iv,
												encryptedData: e.detail.encryptedData
											}).then(res => {
												console.log(res)
												if (res.code == "200") {
													wx.showToast({
														icon: 'none',
														title: '同步手机号成功' + res.data.phoneNumber
													})
												} else {
													console.log(res.message);
													wx.showToast({
														icon: 'none',
														title: '系统异常请稍后重试或者退出重新登录'
													})
												}
											}).catch(e => { })
										} else {
											api._showToast("登录异常,稍后重试", 2);
										}
									}).catch(e => {
										console.log(e)
									})
								}
							});
						} else {

						}
					}
				});
			}
		})
	},


})