Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		myClass:String,
		listGoods:Array,
		type:Number,
		band:Number
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},
	attached: function () {
		// 在组件实例进入页面节点树时执行

		console.log("在组件实例进入页面节点树时执行",this.data.listGoods);
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		bindViewTap: function (e) {
			console.log("12333333",e.currentTarget);
			var curIndex = e.currentTarget.dataset.index;
			var arry = this.data.listGoods;
			var goodsId = arry[curIndex].id;
			console.log(goodsId)
			wx.navigateTo({
				url: '/pages/store/detail/goodsDetail?goodsId=' + goodsId,
			})
			console.log(this.data.listGoods);
		},

    goToOrderDetail: function (e) {
      var orderId = e.currentTarget.dataset.orderid;
      wx.navigateTo({
        url: '/pages/store/order/orderDetails?orderId=' + orderId,
      })
    }

	}
})