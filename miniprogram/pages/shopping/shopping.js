// miniprogram/pages/shopping/shopping.js

var utilService = require('../../util/service.js');
var util = require('../../util/util.js');
var utilShopping = require('../../util/shoppingUtil.js');
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
      totalCnt += tmpList[i].num;
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

  onTicket: function(opt){
    if (this.data.totalItems != '0'){
      wx.navigateTo({
        url: '../ticket/ticket',
      })
    }
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

        utilShopping.updateShoppingItemSelected( tmpList[i].selected, _id );
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

    utilShopping.updateShoppingAllSelected(allSelected);
  },

 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载',
      mask: true
    })
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

          tmpList[i].num += 1;
          let totalPrice = (Number(tmpList[i].num) * Number(tmpList[i].commodity.price.slice(1))).toFixed(2);
          tmpList[i].totalPrice = totalPrice;
          tmpList[i].valid = true;
        }
        else{

        }

        break;
      }
    }
    let calcResult = calcOnOder(tmpList);
    this.setData({
      shoppingList: tmpList,
      allSelected: calcResult.allTmpSelected,
      totalPrice: calcResult.totalPrice.toFixed(2),
      totalItems: calcResult.totalCnt.toString()
    });

    utilShopping.addShoppingItem(curId);
         
  }, 1000),

  onMinus: util.throttle( function (opt) {


    let curId = opt.currentTarget.id;
    let tmpList = this.data.shoppingList;
    for (let i = 0; i < tmpList.length; i++){
      if (tmpList[i].commodity._id == curId){

        if (tmpList[i].valid){
          this.data.shoppingList[i].valid = false;
          if (tmpList[i].num > 1) {
            tmpList[i].num -= 1;
            let totalPrice = (Number(tmpList[i].num) * Number(tmpList[i].commodity.price.slice(1))).toFixed(2);
            tmpList[i].totalPrice = totalPrice;
            tmpList[i].valid = true;

            let calcResult = calcOnOder(tmpList);

            this.setData({
              shoppingList: tmpList,
              allSelected: calcResult.allTmpSelected,
              totalPrice: calcResult.totalPrice.toFixed(2),
              totalItems: calcResult.totalCnt.toString()
            });

            utilShopping.minusShoppingItem(curId);
          }else{
            wx.showModal({
              title: '提示',
              content: '确定要删除该商品吗',
              success: res => {
                if (res.confirm){
                tmpList.splice(i, 1);
                let calcResult = calcOnOder(tmpList);

                this.setData({
                  shoppingList: tmpList,
                  allSelected: calcResult.allTmpSelected,
                  totalPrice: calcResult.totalPrice.toFixed(2),
                  totalItems: calcResult.totalCnt.toString()
                });

                utilShopping.minusShoppingItem(curId);
              }
              }
            });
          }
        }

        break;
      }
    }

   
       
      },1000),

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    utilService.getDefaultAddr().then(res => {
     
      this.setData({
        defaultAddress: res
      });
    }).catch(res=>wx.hideLoading());
   

    if (!utilShopping.getShoppingListLoadStatus()){
      let intNum = setInterval(
        res => {

          if (utilShopping.getShoppingListLoadStatus()) {
            wx.hideLoading();

            let tmpList = utilShopping.getShoppingList();

            let calcResult = calcOnOder(tmpList);
            this.setData({
              shoppingList: tmpList,
              allSelected: calcResult.allTmpSelected,
              totalPrice: calcResult.totalPrice.toFixed(2),
              totalItems: calcResult.totalCnt.toString()
            });
            clearInterval(intNum);
          }
        
        },

         500,
         this
      );
    }
    else
    {
      let tmpList = utilShopping.getShoppingList();
      wx.hideLoading();
      let calcResult = calcOnOder(tmpList);
      this.setData({
        shoppingList: tmpList,
        allSelected: calcResult.allTmpSelected,
        totalPrice: calcResult.totalPrice.toFixed(2),
        totalItems: calcResult.totalCnt.toString()
      });

     
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