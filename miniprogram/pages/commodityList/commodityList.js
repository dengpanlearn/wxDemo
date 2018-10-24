// miniprogram/pages/commodityList/commodityList.js

var utilService = require('../../util/service.js');
var util = require('../../util/util.js');
var shoppingUtil = require('../../util/shoppingUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curClassId:'',
    commodityType:[],
    currentTypeId:'',

    commodityList:[
    ],
    currentCommodity:''
  },

  onSelectType:function(opt){
    this.setData({
      currentTypeId: opt.currentTarget.id
    });

    utilService.loadCommodityByType(opt.currentTarget.id).then(res => {
      this.setData({
        commodityList: res
      });
    }, res=>{
      this.setData({
        commodityList:[]
      })
    })
  },

  onAddShopping: util.throttle(function(opt){
 
    shoppingUtil.addShoppingItem(
       opt.currentTarget.id
    ).then(res=>{
      wx.showToast({
        title: '成功加入购物车',
      });
    }).catch(err=>{
      wx.showToast({
        title: '加入购物车失败',
        icon: 'none'
      })
    });
  }, 1000),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let classId = options.classId;
   let typeId = options.typeId;

    this.setData({
      curClassId: classId,
      currentTypeId: typeId
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
    let classId = this.data.curClassId;
    let typeId = this.data.currentTypeId;

    utilService.loadCommodityType(classId).then(res => {
      console.log(res);
      this.setData({
        commodityType: res,
        currentTypeId: typeId
      });

      utilService.loadCommodityByType(typeId).then(res=>{
        this.setData({
          commodityList:res
        });
      }, res=>{
        this.setData({
          commodityList:[]
        });
      })

    }); 
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