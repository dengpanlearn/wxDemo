// miniprogram/pages/shopping/shopping.js

var utilService = require('../../util/service.js');
var util = require('../../util/util.js');

function getShoppinig(res){
  return new Promise((resolve, reject)=>{
    let commodityId = res.commodityId;
    utilService.getCommodityById(commodityId).then(result=>{
      if (result.length != 0) {
        let totalPrice = (Number(res.num) * Number(result[0].price.slice(1))).toFixed(2);

        let shoppingItem = {
          _id: res._id,
          totalPrice: totalPrice,
          num: res.num,
          valid: true,
          selected:false,
          commodity: result[0]
        }

        resolve(shoppingItem)
      }
      resolve();
    }).catch(res=>{
      resolve();
    });
  });
}

function calcOnOder(tmpList){
  let totalCnt = 0;
  let totalPrice = 0.00;
  let allTmpSelected = true;
  for (let i = 0; i < tmpList.length; i++) {
    if (tmpList[i].selected) {
      totalPrice += Number(tmpList[i].totalPrice);
      totalCnt++;
    } else {
      allTmpSelected = false;
    }
  }

  return {
    totalCnt: totalCnt,
    totalPrice: totalPrice,
    allTmpSelected: allTmpSelected
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultAddress:{},
    totalPrice:'0',
    totalItems:'0',
    shoppingList:[],
    allSelected:false
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

  onSelect:function(opt){
    let _id = opt.currentTarget.id;
    let tmpList = this.data.shoppingList;

    for (let i = 0; i < tmpList.length; i++) {
      if (tmpList[i]._id == _id) {
        tmpList[i].selected = !tmpList[i].selected;
        break;
      }
    }

    let calcResult = calcOnOder(tmpList)
    this.setData({
      shoppingList: tmpList,
      allSelected: calcResult.allTmpSelected,
      totalPrice: calcResult.totalPrice.toFixed(2),
      totalItems: calcResult.totalCnt.toString()
    });
  },

  onAllSelect:function(opt){
    let tmpList = this.data.shoppingList;
    let allSelected =!this.data.allSelected;
    for (let i = 0; i < tmpList.length; i++) {
      tmpList[i].selected = allSelected;
    }

    let calcResult = calcOnOder(tmpList)
    this.setData({
      shoppingList: tmpList,
      allSelected: calcResult.allTmpSelected,
      totalPrice: calcResult.totalPrice.toFixed(2),
      totalItems: calcResult.totalCnt.toString()
    });
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

  onAdd: util.throttle(function(opt){

    let curId = opt.currentTarget.id;
    let tmpList = this.data.shoppingList;

    for (let i = 0; i < tmpList.length; i++){
      if (tmpList[i].commodity._id == curId){
        if (tmpList[i].valid){
          this.data.shoppingList[i].valid = false;
          utilService.addShopping({
            commodityId: curId,
            num: 1
          }).then(result=>{
            tmpList[i].num += 1;
            let totalPrice = (Number(tmpList[i].num) * Number(tmpList[i].commodity.price.slice(1))).toFixed(2);
            let totalCalcPrice = this.data.totalPrice;
            
            if (tmpList[i].selected){
              totalCalcPrice = (Number(totalCalcPrice) + Number(tmpList[i].commodity.price.slice(1))).toFixed(2);
              
            }
            tmpList[i].totalPrice = totalPrice;
            tmpList[i].valid = true;
            this.setData({
              shoppingList: tmpList,
              totalPrice: totalCalcPrice
            });
          }).catch(err=>{
            this.data.shoppingList[i].valid = true;
          });
        }else{
          return;
        }
      }
    }
  }, 1500),

  onMinus: util.throttle( function (opt) {


    let curId = opt.currentTarget.id;
    let tmpList = this.data.shoppingList;
    for (let i = 0; i < tmpList.length; i++){
      if (tmpList[i].commodity._id == curId){

        if (tmpList[i].valid){
          this.data.shoppingList[i].valid = false;
          if (tmpList[i].num > 1){
            utilService.addShopping({
              commodityId: opt.currentTarget.id,
              num: -1
            }).then(res=>{
              tmpList[i].num -= 1;
              let totalPrice = (Number(tmpList[i].num) * Number(tmpList[i].commodity.price.slice(1))).toFixed(2);

              let totalCalcPrice = this.data.totalPrice;
              if (tmpList[i].selected) {
                totalCalcPrice = (Number(totalCalcPrice) - Number(tmpList[i].commodity.price.slice(1))).toFixed(2);

              }
              tmpList[i].totalPrice = totalPrice;
              tmpList[i].valid = true;
              this.setData({
              shoppingList: tmpList,
              totalPrice: totalCalcPrice
            });
          }).catch(res=>{
            this.data.shoppingList[i].valid = true;
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

                    let totalCalcPrice = this.data.totalPrice;
                    if (tmpList[i].selected) {
                      totalCalcPrice = (Number(totalCalcPrice) - Number(tmpList[i].commodity.price.slice(1))).toFixed(2);

                    }
                    tmpList.splice(i, 1);
                    this.setData({
                      shoppingList: tmpList,
                      totalPrice: totalCalcPrice
                    });

                  }).catch(err=>{
                    wx.showToast({
                      title: '删除失败',
                      icon: 'none'
                    });
                    this.data.shoppingList[i].valid = true;
                  });
                }else{
                  this.data.shoppingList[i].valid = true;
                }
              },
              complete: res=>{
                this.data.shoppingList[i].valid = true;
              }
            })
        }
        }else{
          return;
        }
      }
  }},1500),

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    utilService.getDefaultAddr().then(res => {
     
      this.setData({
        defaultAddress: res
      });
    });
    
    
    utilService.getShopping().then(res => {

      let arrayPromise = [];
      let allSelected = this.data.allSelected;
      for (let i = 0; i < res.length; i++) {
        arrayPromise.push(getShoppinig(res[i]));

       }
      Promise.all(arrayPromise).then(res => {
          for (let i = 0; i < res.length; i++){

            for (let j = 0; j < this.data.shoppingList.length; j++){
              if (res[i]._id == this.data.shoppingList[j]._id){
                res[i].selected = this.data.shoppingList[j].selected;
                break;
              }
            }
          }
        let calcResult = calcOnOder(res)
        this.setData({
          shoppingList: res,
          allSelected: calcResult.allTmpSelected,
          totalPrice: calcResult.totalPrice.toFixed(2),
          totalItems: calcResult.totalCnt.toString()
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