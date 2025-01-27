var api = require('../../libs/http.js')
const app = getApp()
var chatSocketService = require('../../service/SocketService')
Page({

  /**页面的初始数据*/
  data: {
    menuArray: [{
        name: "聊天室",
        type: 1
      },
      {
        name: "数据",
        type: 2
      },
      // { name: "会员专享", type: 3 },
      {
        name: "图文直播",
        type: 4
      },
      {
        name: "文章",
        type: 5
      },
      // { name: "赔率", type: 6 },
      // { name: "竞猜投注", type: 7 }
    ],
    curUsrName: '',
    matchId: 0,
    matchDetail: [],
    curType: 1,
    chatList: [],
    timer: [],
    socketUrl: '', //websocket地址
    lockReconnect: false, //默认进来是断开链接的
    limit: 0, //重连次数
    scene: 'chat', //聊天场景
    initScene: {},
    liveDataList: [],
    gameIdArray: [],
    curGame: '',
    noDataFlag: false
  },

  /**生命周期函数--监听页面加载*/
  onLoad: function(options) {
    console.log(options.matchId, '当前赛事id');
    if (!options.matchId) {
      api._showToast("获取赛事详情异常", 2);
      return;
    }
    this.setData({
      matchId: options.matchId
    })
    this.getMatchDetail(this, options.matchId, true);
  },

  onShow: function() {
    console.log("on show");
    this.setData({
      chatList: []
    });
    this.getMatchDetail(this, this.data.matchId, false);
  },


  /**切换tap */
  selectTap: function(e) {
    var _self = this;
    var curType = e.currentTarget.dataset.type;
    this.setData({
      curType: curType
    })
    var matchId = _self.data.matchId,
      matchStatus = _self.data.matchDetail.status;
    //需要发送消息
    if (curType == 1) {
      _self.setData({
        chatList: []
      });
      chatSocketService.toSendSocketMessage(_self.data.initScene);
    } else if (curType == 2) { //数据页tab
      if (matchStatus == 1) { //比赛中
        var initScene = chatSocketService.getSceneMsg(2, 21, 16, 'M_', matchId);
        chatSocketService.toSendSocketMessage(initScene);
      }
    } 
  },

  usrSendMsg: function(e) {
    var content = e.detail.content;
    chatSocketService.heartCheck.reset().start(content, this);
    this.selectComponent("#chat_id").reflushData('');
    api._showToast('发送成功', 1);
    this.scrollTo(0);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('onUnload');
    wx.closeSocket();
  },

  getMatchDetail: function(_self, matchId, linkFlag) {
    var initScene = chatSocketService.getSceneMsg(3, 21, 10, 'R_', matchId);
    api._postAuth('/league/detail/' + matchId, {
      showAuthPage: true,
      returnUrl: api.getCurrentPageUrlWithArgs()
    }).then(res => {
      console.log(res, '获取赛事详情');
      if (res.code == "200" && res.data) {
        _self.setData({
          matchId: matchId,
          socketUrl: res.data.chatSocketUrl,
          curUsrName: app.getGlobalUserInfo().nickName,
          matchDetail: res.data,
          initScene: initScene
        });
        if (_self.data.curType == 1 && linkFlag) {
          chatSocketService.linkSocket(_self);
          //chatSocketService.toSendSocketMessage(_self.data.initScene);
        }
        if (res.data.videogameId == 4) { //dota2不支持图文直播
          var menuArray = this.data.menuArray;
          for (var i = 0; i < menuArray.length; i++) {
            var type = menuArray[i].type;
            if (type === 4) {
              menuArray.splice(i, 1);
            }
          }
          _self.setData({
            menuArray: menuArray
          });
        }
        _self.getGameIdArray(matchId);
        return null;
      } else {
        api._showToast(res.message, 2);
      }
    }).catch(e => {
      console.log(e)
    })

    // api._postAuth('/league/match/' + 'M_' + matchId).then(res => {
    //   console.log(res, '/league/match/' + 'M_' + matchId);
    //   _self.setData({
    //     gameIdArray: res.data,
    //   });

    // }).catch(e => {
    //   console.log(e)
    // })
  },
  onChangeData: function(e) {
    console.log(e);
    this.setData({
      liveDataList: e.detail.liveDataList, //赋值到父组件的data集合
      curGame: e.detail.curGame
    })
  },

  onShareAppMessage: function() {

  },

  scrollTo: function(num) {
    if (!num) {
      num = 0;
    }
    wx.pageScrollTo({
      scrollTop: num,
      duration: 300
    })
  },
  getGameIdArray(matchId) {
    var _self = this;
    api._postAuth('/league/match/' + 'M_' + matchId).then(res => {
      console.log(res, '/league/match/' + 'M_' + matchId);
      _self.setData({
        gameIdArray: res.data,
      });
    }).catch(e => {
      console.log(e)
    })
  }
})