// miniprogram/pages/ticket/ticket.js
var utilService = require('../../util/service.js');
var utilShopping = require('../../util/shoppingUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultAddress: {},
    totalItems: '0',
    forSelectDataTime:[],
    ticketList:[],
    selectedDataTimeIdx:[],
    selectedDataTime:'请选择',
    dispatch:'0',

    selectedCoupon:'无可用',
    grandTotalValue:'0',
    totalPrice:'0'
  },

  onSelectDateTime:function(opt){
    let selectedId = opt.detail.value;
    let dateTime = this.data.forSelectDataTime[0][selectedId[0]] + ' '+((selectedId[1] == 0)?'08:00-18:00':'18:00-22:00');
   
    this.setData({
      selectedDataTime: dateTime
    });
  },

  onModifyAddress: function (arg) {
    wx.authorize({
      scope: 'scope.address',

      success: function () {
        wx.chooseAddress({
          success: res => {
            console.log(res);

            utilService.updateDefaultAddr(res)

          },

        })
      },
      fail: function () {
        wx.showToast({
          title: '请容许添加地址',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '加载',
    });
    let date = new Date();
    let a = new Array("日", "一", "二", "三", "四", "五", "六");
    let curStringDate = Number(date.getMonth()) + '月' + Number(date.getDate()) + '日|周' +a[date.getDay()];
    let nextTime = date.getTime() + 1000*60*60*24;
    date.setTime(nextTime);
    let nextStringDate = Number(date.getMonth()) + '月' + Number(date.getDate()) + '日|周' + a[date.getDay()];


  this.setData({
    forSelectDataTime: [[curStringDate, nextStringDate], ['全天08:00-18:00', '晚上18:00-22:00']]
  });

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
    utilService.getDefaultAddr().then(res => {

      this.setData({
        defaultAddress: res
      });
    });

    setInterval(res=>{
      let tmpTicketList = utilShopping.getSelectedShoppingList();
      wx.hideLoading();
      let dispatch;
      let totalPrice = '0.00';
      let  totalItems=0;
      for (let i = 0; i < tmpTicketList.length; i++){
        totalPrice = (Number(totalPrice) + Number(tmpTicketList[i].totalPrice)).toFixed(2);
        totalItems += tmpTicketList[i].num;
      }

      if (Number(totalPrice) < 100.00){
        totalPrice = (Number(totalPrice) + Number(10.00)).toFixed(2);
        dispatch = '10.00';
      }else{
        dispatch = '0.00'
      }

       
      this.setData({
        ticketList: tmpTicketList,
        totalItems: Number(totalItems).toString(),
        totalPrice: totalPrice,
        dispatch: dispatch
      });

     
     
    },
    1000,
    this)
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

  }
})