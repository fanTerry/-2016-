// component/reportlist/reportitem/report-item.js
const app = getApp();
var api = require('../../../libs/http.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      matchResult:Object,
      liveFlag:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

      userFollow:function (e) {
          var status = e.currentTarget.dataset.index;
          var userId =  app.globalData.userInfo.usrId;
          var _self = this;
          var url = "/league/userfollow";
          api._postAuth(url,{
              matchId:_self.data.matchResult.id,
              status:status,
              userId:userId,
              noShowLoading: true,
          }).then(res =>{
              console.log(res);
          if(res.code=="200"){
              var  matchResult = _self.data.matchResult;
              matchResult.followType = status;
              _self.setData({
                  matchResult:matchResult
              });

              if (status==1) {
                  api._showToast("关注成功",1.5)
              }else if (status==0) {
                  api._showToast("取消关注",1.5)
              }
          }else {
              api._showToast(res.message,1.5);
          }

      }).catch(e => { })
      },

      goToDetailPage:function () {
          wx.navigateTo({
              url:'/modules/reportpage/report-page?matchId='+this.data.matchResult.matchId
          })
      }

  }
})
