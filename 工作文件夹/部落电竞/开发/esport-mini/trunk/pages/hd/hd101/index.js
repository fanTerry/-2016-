// pages/hd/hd101/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flagNum: 0,
    tabList: [{
        class: "rank_record"
      },
      {
        class: "rules_lists"
      },
      {
        class: "user_wallet"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.selectComponent("#home").getGift();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '一战到底，答题赢大奖',
      path: '/pages/hd/hd101/index',
      imageUrl: 'https://rs.esportzoo.com/svn/esport-res/mini/images/icon/subject_share.jpg',
      success: function (res) { //无法检测
        console.log(res);
      },
    }
  },

  showTab(event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      flagNum: index
    });

    if (index == 0) {
      this.selectComponent("#home").getGift();
    } else if (index == 1) {
      this.selectComponent("#rules").getAwardUserInfo();
    } else {
      this.selectComponent("#users").getAnswerRecord();
      this.selectComponent("#users").getUserInfo();
    }
  }
})