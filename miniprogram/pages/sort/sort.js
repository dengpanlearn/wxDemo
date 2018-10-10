// miniprogram/pages/sort/sort.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curClassId: 'type1',
    commodityClass:[{
        id: 'type1',
        name: '果园优选'
      },
      {
        id: 'type2',
        name: '新鲜水果'
      },
    
      {
        id: 'type3',
        name: '水产海鲜'
      },
      {
        id: 'type4',
        name: '肉禽蛋类'
      },
      {
        id: 'type5',
        name: '乳品速食'
      },

      {
        id: 'type6',
        name: '时令鲜蔬'
      },

      {
        id: 'type7',
        name: '时令鲜蔬'
      },
      {
        id: 'type8',
        name: '时令鲜蔬'
      },

      {
        id: 'type9',
        name: '时令鲜蔬'
      },

      {
        id: 'type10',
        name: '时令鲜蔬'
      },


      {
        id: 'type11',
        name: '时令鲜蔬'
      },

      {
        id: 'type12',
        name: '时令鲜蔬'
      }
    ],
    commodityType:[
      {
        id:'a',
        url:'../../images/center/apple.png',
        name:'苹果'
      },

      {
        id:'b',
        url: '../../images/center/apple.png',
        name: '苹果'
      },

      {
        id:'c',
        url: '../../images/center/apple.png',
        name: '苹果'
      },

      {
        id: 'd',
        url: '../../images/center/apple.png',
        name: '苹果'
      }
    ]
  },

  onViewClass:function(opt){
    console.log(opt);
    this.setData({
      curClassId: opt.currentTarget.id
    })
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