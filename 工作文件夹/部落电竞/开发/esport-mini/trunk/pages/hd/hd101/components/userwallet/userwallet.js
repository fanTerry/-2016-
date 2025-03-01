// pages/hd/hd101/userwallet/userwallet.js
const app = getApp();
var api = require('../../../../../libs/http');
Component({

	/**
	 * 页面的初始数据
	 */
	data: {
		flagNum:2,
		userInfo: {},
		answerRecord: {},
		createTime:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// this.getAnswerRecord();
    // this.getUserInfo();
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
	methods:{
		getMoney() {
			api._postAuth("/hd101/checkWithdraw")
				.then(rsp => {
					const dataResponse = rsp;
					if (dataResponse.code == 200) {
						let canWithdraw = dataResponse.data.todayGetMoney;
						this.$refs.propRef.openWithdarwDialog(canWithdraw);
					} else if (dataResponse.code == 1999) {
						this.$toast("每天只可以提现一次");
					} else if (dataResponse.code == 1998) {
						this.$toast(dataResponse.message);
					} else {
						this.$toast("提现失败");
					}
				})
				.catch(error => {
					console.log(error);
				});
		},
		getAnswerRecord() {
			let param = {};
			param.showUser = true;
			param.clientType=5;
			api._postAuth("/hd101/listUserGift", param)
				.then(rsp => {
					const dataResponse = rsp;
					if (dataResponse.code == 200) {
						console.log(rsp, "---答题记录", param);
						this.setData({answerRecord:dataResponse.data});
						console.log(dataResponse.data);
						this.data.answerRecord.forEach((item, index) => {
							this.data.answerRecord[index].createTime = this.toDateMD(this.data.answerRecord[index].createTime);
						});
						this.setData({answerRecord:this.data.answerRecord});
						console.log(this.data.answerRecord,this.data.createTime);
					}
				})
				.catch(error => {
					console.log(error);
				});
		},
		getUserInfo() {
			let param = {};
			api._postAuth("/hd101/showUserWallet", param)
				.then(rsp => {
					const dataResponse = rsp;
					if (dataResponse.code == 200) {
						console.log(rsp, "-----用户信息", param);
						this.setData({userInfo:dataResponse.data});
					}
				})
				.catch(error => {
					console.log(error);
				});
		},
		toDateMD(date) {
			let month = new Date(date).getMonth() + 1;
			let day = new Date(date).getDate();
			if (month < 10) {
				month = "0" + month;
			}
			if (day < 10) {
				day = "0" + day;
			}
			return month + "月" + day + "日";
		},
		toRecordList() {
			wx.navigateTo({
				url: "/pages/hd/hd101/record/record"
			})
		}
	}
})