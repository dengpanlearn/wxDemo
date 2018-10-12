// miniprogram/pages/sort/sort.js

var utilService = require('../../util/service.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curClassId: '',
    commodityClass:[
    ],
    commodityType:[
    ]
  },

  onViewClass:function(opt){
    console.log(opt);
    this.setData({
      curClassId: opt.currentTarget.id
    })

    utilService.loadCommodityType(opt.currentTarget.id).then(res =>{
      if (res.length != 0){
        console.log(res);
        this.setData({

        commodityType: res
       })
      } else {
        this.setData({
          commodityType: []
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utilService.loadCommodityClass().then(res =>{
      if (res.length != 0){

        this.setData({
          curClassId: res[0]._id,
          commodityClass: res,
        });

        utilService.loadCommodityType(res[0]._id).then(res => {
          if (res.length != 0) {
      
            this.setData({
              commodityType: res
            })
          }
        })

      }
    
    })
  },

  onEnterType:function(opt){
    let urlNext = '../commodityList/commodityList?typeId=' + opt.currentTarget.id;
    urlNext = urlNext + '&classId=' + this.data.curClassId;
    wx.navigateTo({
      
      url: urlNext,
    })
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