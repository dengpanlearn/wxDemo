// miniprogram/pages/center/index/index.js
var util = require('../../../util/util.js');
var utilService = require('../../../util/service.js');
var shoppingUtil = require('../../../util/shoppingUtil.js');
const app = getApp();
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
      wx.showLoading({
        title: '注册中',
      })

     
      util.registerUser(app.globalData.appName).then((res) =>{
        this.setData({
          avatarUrl: e.detail.userInfo.avatarUrl,
          userInfo: e.detail.userInfo,
          userName: e.detail.userInfo.nickName,
          userInfoIsGetted: true
        })

        shoppingUtil.loadShoppingList().then(res=>{
        wx.hideLoading();
        }).catch(res=>{
          wx.hideLoading();
        });
      }).catch(err=>{
        console.log(err);
        wx.hideLoading();
      });
    }
  },

  onLookupMyOder:function(e){

  },

  onOpenSetting:function(e){
    wx.openSetting({
      success:res=>{
        console.log(res);
      }
    })
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

                  utilService.updateDefaultAddr(res);


                },
                
              })
            },
            fail: function () {
              wx.showToast({
                title: '请容许添加地址',
                icon:'none',
                duration: 2000
              });


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