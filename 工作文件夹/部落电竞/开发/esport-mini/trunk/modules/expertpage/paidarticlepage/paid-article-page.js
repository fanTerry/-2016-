// pages/expert/paid-article-page.js
const app = getApp();
var api = require('../../../libs/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

      adList:[],
      recExpertList:[],
      articleList:Array,
      pageNo:0,
      pageSize:10,
      haseNext:true,
      noDataFlag:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          pageNo: 0,
          articleList: []
      });
      this.loadExpertArticle();
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

      this.loadExpertArticle();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

    /**
     * 查询热门达人和轮播图
     */
    loadIndexData:function () {
        var that = this
        var url = "/expert/expertIndexdata";
        api._post(url,{
            pageNo:1,
            pageSize:10,
        }).then(res => {
            if(res.code=="200"){
                that.setData({
                    adList:res.data.adList,
                    recExpertList :  res.data.recExpertList,
                });
            }else{
                console.log(res.message);
        }
    }).catch(e => { })

    },

    /**
     * 加载达人文章
     */
    loadExpertArticle:function () {
        if (!this.data.haseNext) {
            return;
        }
        var that = this;
        var pageNo = that.data.pageNo+1;
        var pageSize = that.data.pageSize;

        var url = "/expert/paid/articleList";
        api._postAuth(url,{
            pageNo:pageNo,
            pageSize:pageSize,
        }).then(res => {
            if(res.code=="200"){
            if (res.data.length>0){
                if (res.data.length<10 ){

                    //没有下一页了
                    that.setData({
                        haseNext:false,
                    });
                }
                var newList =  that.data.articleList.concat(res.data)
                that.setData({
                    articleList:newList,
                    pageNo:pageNo,
                    pageSize:pageSize,
                });
            }else {
                that.setData({
                    haseNext:false,
                });
            }
            if (pageNo==1 && res.data.length==0){
                that.setData({
                    noDataFlag:true,
                })
            }

        }
    }).catch(e => { })
    }

})