// miniprogram/pages/center/address/address.js

function addAddres(addressList, address){
  addressList.push({
    name: address.userName,
    postalCode: address.postalCode,
    provinceName: address.provinceName,
    cityName: address.cityName,
    countyName: address.countyName,
    detailInfo: address.detailInfo,
    telNumber: address.telNumber
  });

  return addressList;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresslist: [{}]
  },

  onAddAddress:function(act){
    console.log(act);

    let that = this;
    let tmpList = this.data.addresslist;
    wx.authorize({
      scope: 'scope.address',
     
      success:function(){
        wx.chooseAddress({
          success: res =>{
            console.log(res);
            that.setData({
              addresslist: addAddres(tmpList, res)
            })

          },
          fail: res => {
            wx.showToast({
              title: '地址选择错误',
              duration:2000
            })
          }
        })
      },
      fail: function(){
        wx.showToast({
          title: '请容许添加地址',
          duration: 2000
        })
      }
    })
    /*
    wx.redirectTo({
      url: '../addAddress/addAddress',
    })
    */
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