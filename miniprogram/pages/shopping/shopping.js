// miniprogram/pages/shopping/shopping.js

var utilService = require('../../util/service.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultAddress:{},
    totalPrice:'0',
    totalItems:'0',
    shoppingList:[]
  },

  onModifyAddress:function(arg){
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
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onAdd:function(opt){
    utilService.addShopping({
        commodityId: opt.currentTarget.id,
        num: 1
      }).then(result =>{

        let curId = opt.currentTarget.id;
        let tmpList = this.data.shoppingList;
        for (let i = 0; i < tmpList.length; i++) {
          if (tmpList[i].commodity._id == curId) {
            tmpList[i].num+=1;

          }
        }
        this.setData({
          shoppingList: tmpList
        });
      })
    
  },

  onMinus: function (opt) {
    let curId = opt.currentTarget.id;
    let tmpList = this.data.shoppingList;
    for (let i = 0; i < tmpList.length; i++){
      if (tmpList[i].commodity._id == curId){
        if (tmpList[i].num > 1){
          utilService.addShopping({
            commodityId: opt.currentTarget.id,
            num: -1
          }).then(res=>{
            tmpList[i].num -= 1;

            this.setData({
              shoppingList: tmpList
            });
          });
        }else{
            wx.showModal({
              title: '提示',
              content: '确定要删除该商品吗',
              success: res=>{
                if (res.confirm){
                  utilService.addShopping({
                    commodityId: opt.currentTarget.id,
                    num: -1
                  }).then(res=>{
                    tmpList.splice(i, 1);
                    this.setData({
                      shoppingList: tmpList
                    });

                  }).catch(err=>{
                    wx.showToast({
                      title: '删除失败',
                      icon: 'none'
                    })
                  });
                }
              }
            })
        }
      }
    }
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
    let shoppingListTmp = [];
    utilService.getShopping().then(res => {
   
      for (let i = 0; i < res.length; i++) {
        let commodityId = res[i].commodityId;
        utilService.getCommodityById(commodityId).then(commodity => {
          if (commodity.length != 0) {
            let totalPrice = (Number(res[i].num) * Number(commodity[0].price.slice(1))).toFixed(2);
            
            let shoppingItem = {
              _id: res[i]._id,
              totalPrice: totalPrice,
              num: res[i].num,
              commodity: commodity[0]
            }

            shoppingListTmp.push(shoppingItem);
           
            this.setData({
              shoppingList: shoppingListTmp
            });
          }
        });
      }


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