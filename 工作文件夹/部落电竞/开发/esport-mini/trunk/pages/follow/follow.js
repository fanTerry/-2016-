// pages/follow/follow.js
const app = getApp();
var api = require('../../libs/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      menuArr: ['全部', '视频', '文章', '短文', '话题'],
      letterArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      pageNo: 0,
      pageSize: 10,
      followedUserList:[],
      noDataFlag:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      this.setData({
          pageNo: 0,
          pageSize: 15,
          followedUserList:[],
      });
      this.pageFollowedUser();

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
      this.setData({
          pageNo: 0,
          pageSize: 15,
          followedUserList:[],
      });
      this.pageFollowedUser();

      setTimeout(function () {
          wx.stopPullDownRefresh();
      },"500")

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      this.pageFollowedUser();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


    //查询关注的用户
    pageFollowedUser:function () {

        var url = "/user/pageFollowedUser";
        var pageNo = this.data.pageNo+1
        api._postAuth(url,{
            pageNo: pageNo,
            pageSize: 10,
            noShowLoading:true,
            showAuthPage:true,
            returnUrl: api.getCurrentPageUrlWithArgs()
        }).then(res =>{
        if(res.code=="200"){
            var followedUserList ;
            followedUserList = res.data.followedUserList;
            if (followedUserList && followedUserList.length>0){
                followedUserList =  this.data.followedUserList.concat(followedUserList);
                this.setData({
                    pageNo: pageNo,
                    followedUserList:followedUserList,
                    noDataFlag:false,
                });

            }else {
               // api._showToast("暂无数据",1.5);
            }
            if (this.data.followedUserList.length==0) {
                this.setData({
                    noDataFlag:true,
                })
            }

        }else {
            api._showToast(res.message,1.5);
        }

    }).catch(e => { })

    }



})