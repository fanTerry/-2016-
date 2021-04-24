// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subMenuArr: ["aa推荐", "视频", "LOL", "王者", "PUBG", "绝地求生", "绝地求生2", "绝地求生3"],
    swiperOpt: {
      indColor: "#fff",
      indActColor: "#075fe7",
    },
    swiperArr: [{
        "imageSrc": "swiper1.png",
        "textContent": "新起点！2019年TGA腾讯电竞运动会三月分站赛赛程公布"
      },
      {
        "imageSrc": "swiper1.png",
        "textContent": "新起点！222222222222"
      }
    ],
    newsList: [{
        "type": 1,
        "imageSrc": "/resources/images/swiper1.png",
        "tag": "TGA新闻",
        "detail": "新起点！2019年TGA腾讯电竞运动会三月分站赛赛程公月分站赛赛程公布",
        "seeNum": 12032,
        "discussNum": 13234
      },
      {
        "type": 1,
        "imageSrc": "/resources/images/swiper1.png",
        "tag": "TGA新闻",
        "detail": "新起点！222222222222",
        "seeNum": 12032,
        "discussNum": 13234
      },
      {
        "type": 2,
        "imageSrc": "/resources/images/swiper1.png",
        "tag": "TGA新闻",
        "detail": "新起点！2019年TGA腾讯电竞运动会三月分站赛赛程公布",
        "seeNum": 12032,
        "discussNum": 13234
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    console.log("onShow------", this.data.titleArray)
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
  onShareAppMessage: function() {

  }
})