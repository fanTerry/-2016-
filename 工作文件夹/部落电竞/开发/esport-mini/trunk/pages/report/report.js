// pages/report/report.js
const app = getApp();
var api = require('../../libs/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      showType:1,
      pageNo:1,
      pageSize:15,
      matchResultList:[],
      gamesList:[], //游戏列表
      statusList:[],
      gameType:1, //游戏类型
      staustType:3, //默认选赛程
      reportType:1,  //列表展示样式
      loadType:2,  //拼接数据类型，下拉加载 0，上拉加载1,初始化加载 2 当天
      loadDayRange:7 ,//加载数据步长，天单位
      pullPageNo:0, //记录下拉刷新页码
      bottomPageNo:0, //记录上啦刷新页码
      noDataFlag:false,
      subMenuList: [{ name: '赛程' }, { name: '赛事' }],
      liveFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      /*初始化首页*/
      this.loadMatchData();


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
      this.setData({
          loadType:0,
      });
      console.log("监听用户下拉动作");
      this.loadMatchData();
      wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      this.setData({
          loadType:1,
      });
      this.loadMatchData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  upper:function(){
        console.log("顶部滚动");
    },

    /**
     * 获取赛事数据
     */
    loadMatchData:function () {
        console.log("加载数据");
        var  pullPageNo = this.data.pullPageNo;
        var bottomPageNo = this.data.bottomPageNo;
        if (this.data.loadType==1){
            bottomPageNo +=1;
        } else if (this.data.loadType==0) {
            pullPageNo +=1;
        }

        var url = "/league/leagueIndexdata";
        var param ={
            videogameId:this.data.gameType ,  //游戏类型
            status:this.data.staustType,
            loadType:this.data.loadType,
            loadDayRange:this.data.loadDayRange,
            pullPageNo:pullPageNo,
            bottomPageNo:bottomPageNo,
            noShowLoading: true,

        }
        var userInfo =  app.getGlobalUserInfo()
        if (userInfo) {
            param.userId=userInfo.usrId
        }
        api._post(url,param).then(res => {
        wx.hideLoading();
        if(res.code=="200"){
            this.setData({
                gamesList:res.data.gamesList,
                statusList :  res.data.statusList,
                liveFlag: res.data.liveFlag,
            });

            //赛事列表
            var matchResultList;
            matchResultList =res.data.matchResultList;

            // console.log("开始时间",res.data.beginDay);
            // console.log("结束时间",res.data.endDay);
            if (matchResultList && matchResultList.length>0) {
                if (this.data.loadType==1) {
                    //上拉触底加载
                    matchResultList = this.data.matchResultList.concat(matchResultList);
                }else {
                    //下拉刷新加载
                    matchResultList = matchResultList.concat(this.data.matchResultList) ;
                }
                // console.log("设置页码",pullPageNo);
                // console.log("设置页码",bottomPageNo);
                this.setData({
                    matchResultList:matchResultList,
                    pullPageNo:pullPageNo,
                    bottomPageNo:bottomPageNo,
                    noDataFlag:false,
                });
            }

            if (this.data.loadType==2 && this.data.matchResultList.length==0){
                /*当进来赛事首页无数据，进行上翻页，查询历史7天数据*/
                this.onPullDownRefresh();
            }

            if (this.data.matchResultList.length==0){
                this.setData({
                    noDataFlag:true,
                })

            }
          if (this.data.reflushFlag){
            api._showToast('刷新成功', 2);
            this.setData({
              reflushFlag: false
            });
          }
         
        }
        
    }).catch(e => { })

    },

    onMyMatchEvent:function (e) {
        //切换游戏
        if (this.data.gameType == e.detail.videogameId){
            return;
        }
        this.setData({
            gameType:e.detail.videogameId,
            pullPageNo:0, //记录下拉刷新页码
            bottomPageNo:0, //记录上啦刷新页码
            loadType:2,
            matchResultList:[],
        });
        this.loadMatchData();
    },

    selectStatus:function (e) {
        //切换赛事状态
        var curIndex = e.currentTarget.dataset.index;
        console.log(curIndex);
        if (this.data.staustType == curIndex) {
            return;
        }
        this.setData({
            staustType:curIndex,
            pullPageNo:0, //记录下拉刷新页码
            bottomPageNo:0, //记录上啦刷新页码
            loadType:2,
            matchResultList:[],
        });
        this.loadMatchData();
    },
    onClickRefresh: function () {
      var _self=this;
      wx.showLoading({
        title: '刷新中'
      });
      _self.setData({
        gameType: 1,
        pullPageNo: 0, //记录下拉刷新页码
        bottomPageNo: 0, //记录上啦刷新页码
        loadType: 2,
        matchResultList: [],
        reflushFlag: true
      });
      setTimeout(function () {
        _self.loadMatchData();  
      }, 1 * 1000);
     
    },


})