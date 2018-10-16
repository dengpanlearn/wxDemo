// miniprogram/pages/center/index/index.js
var util = require('../../../util/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../../images/home/user-unlogin.png',
    userInfo: {},
    userName: 'Hi，你好！',
    userInfoIsGetted: false,
    userCars:[
      {
       title:'我的会员卡',
       pages:'../vipCard/vipCard'
      },
      {
        title: '我的返现',
        pages: '../vipCard/vipCard'
      },
      {
        title: '我的礼品卡',
        pages: '../vipCard/vipCard'
      },
      {
        title: '我的积分',
        pages: '../vipCard/vipCard'
      },
      {
        title: '我的优惠卷',
        pages: '../vipCard/vipCard'
      },
      {
        title: '我的优惠码',
        pages: '../vipCard/vipCard'
      },

      {
        title: '我的礼物',
        pages: '../vipCard/vipCard'
      }
      ],

    orderMenus:[
      {
        id:'0',
        url: '../order/order',
        icon: '../../../images/center/waitpay.png',
        title: '待付款',
      },

      {
        id: '1',
        url: '../order/order',
        icon: '../../../images/center/waitdelivery.png',
        title: '待发货',
      },

      {
        id:'2',
        url: '../order/order',
        icon: '../../../images/center/deliveryed.png',
        title: '已发货',
      },

      {
        id: '3',
        url: '../order/order',
        icon: '../../../images/center/payed.png',
        title: '已付款',
      },

      {
        id: '4',
        url: '../address/address',
        icon: '../../../images/center/address.png',
        title: '地址',
      }

    ]
  },
 

  onGetUserInfo: function(e){
    if (!util.objectIsEmpty(e.detail.userInfo)){
      util.setUserInfo(e.detail.userInfo);

      util.registerUser().then((res) =>{
        this.setData({
          avatarUrl: e.detail.userInfo.avatarUrl,
          userInfo: e.detail.userInfo,
          userName: e.detail.userInfo.nickName,
          userInfoIsGetted: true
        })
      }).catch(err=>{
        console.log(err);
      });
        
      
     
    }
  },

  onLookupMyOder:function(e){

  },

  onLookupOrderMenu:function(e){
    console.log(e);
    let curId = e.currentTarget.id;
    let length =this.data.orderMenus.length;
    for (let i = 0; i < length; i++){
      if (this.data.orderMenus[i].id == curId){
        console.log(this.data.orderMenus[i]);
        if (i < 4){
          wx.navigateTo({
            url: this.data.orderMenus[i].url,
          })
        }else{
          wx.authorize({
            scope: 'scope.address',

            success: function () {
              wx.chooseAddress({
                success: res => {
                 console.log(res);

                },
                fail: res => {
                  wx.showToast({
                    title: '地址选择错误',
                    duration: 2000
                  });
                  console.log(res);
                }
              })
            },
            fail: function () {
              wx.showToast({
                title: '请容许添加地址',
                duration: 2000
              })
            }
          })


        }
      }
    }
  },

  onEnterShopping: function(e){

  },

  onEnterVip: function(e){

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
    if (util.getIsUpdateInfo()) {
      this.setData({
        avatarUrl: util.getAvatarUrl(),
        userInfo: util.getUserInfo(),
        userName: util.getUserInfo().nickName,
        userInfoIsGetted: true,
      })
    }
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