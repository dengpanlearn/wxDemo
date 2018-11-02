/*为加快购物车页面响应速度，增加一个shoppingUtil，购物车数据获取和更新都通过shoppingUtil获取 */

var utilService = require('./service.js');
var util = require('./util.js');
let  shoppingListLoaded = false;

let shoppingList = [];


function getShoppingItem(res) {
  return new Promise((resolve, reject) => {
    let commodityId = res.commodityId;
    utilService.getCommodityById(commodityId).then(result => {
      if (result.length != 0) {
        let totalPrice = (Number(res.num) * Number(result[0].price.slice(1))).toFixed(2);

        let shoppingItem = {
          _id: result[0]._id,
          totalPrice: totalPrice,
          num: res.num,
          valid: true,
          selected: false,
          commodity: result[0]
        }

        resolve(shoppingItem)
      }
      resolve();
    }).catch(res => {
      resolve();
    });
  });
}

function loadShoppingList(){
  return new Promise((resolve, reject)=>{
    utilService.getShopping().then(res => {

      let arrayPromise = [];
      for (let i = 0; i < res.length; i++) {
        arrayPromise.push(getShoppingItem(res[i]));

      }

      Promise.all(arrayPromise).then(res => {
        shoppingList = res;
        shoppingListLoaded = true;
        resolve(res);
      }).catch(res => {
        shoppingListLoaded = true;
        reject(res);
      });
    }).catch(res => {
      shoppingListLoaded = true;
      reject(res);
    });
  });
  
}

function setShoppingListLoadStatus(loaded){
  shoppingListLoaded = loaded;
}

function getShoppingListLoadStatus() {
  return shoppingListLoaded;
}

function addShoppingItem(commodityId){
  return new Promise((resolve, reject) =>{
    console.log(commodityId);
    utilService.addShopping({
      commodityId: commodityId,
      num: 1
    }).then(res => {
      let i = 0;
      for (; i < shoppingList.length; i++) {
        if (shoppingList[i]._id == commodityId) {

          shoppingList[i].num += 1;
          let totalPrice = (Number(shoppingList[i].num) * Number(shoppingList[i].commodity.price.slice(1))).toFixed(2);
          shoppingList[i].totalPrice = totalPrice;
          break;
        }
      }

      if (i == shoppingList.length) {
        utilService.getCommodityById(commodityId).then(result => {
          if (result.length != 0) {
            let totalPrice = (Number(result[0].price.slice(1))).toFixed(2);

            let shoppingItem = {
              _id: commodityId,
              totalPrice: totalPrice,
              num: 1,
              valid: true,
              selected: false,
              commodity: result[0]
            }

            shoppingList.push(shoppingItem);
          }
        });
      }
     
      resolve(res);
    }).catch(res => {
     
      reject(res);
    });
  });
  
}


function minusShoppingItem(commodityId){

  return new Promise((resolve, reject)=>{
    utilService.addShopping({
      commodityId: commodityId,
      num: -1
    }).then(res => {
      for (let i = 0; i < shoppingList.length; i++) {
        if (shoppingList[i]._id == commodityId) {
          if (shoppingList[i].num > 1) {
            shoppingList[i].num -= 1;
            let totalPrice = (Number(shoppingList[i].num) * Number(shoppingList[i].commodity.price.slice(1))).toFixed(2);
            shoppingList[i].totalPrice = totalPrice;
          } else {
            shoppingList.splice(i, 1);
          }
          break;
        }
      }

      resolve(res);
    }).catch(res => {
      reject(res);
    });
  })

  
}

function updateShoppingItemSelected(selected, commodityId){
  for (let i = 0; i < shoppingList.length; i++) {
    if (shoppingList[i]._id == commodityId) {
      shoppingList[i].selected = selected;
      break;
    }
  }
}

function updateShoppingAllSelected(selected) {
  for (let i = 0; i < shoppingList.length; i++) {
  
      shoppingList[i].selected = selected;
      
    
  }
}

function getShoppingList(){
  return shoppingList;
}

function getSelectedShoppingList() {

  let tmpShoppingList = [];
  for (let i = 0; i < shoppingList.length; i++){
    if (shoppingList[i].selected){
      tmpShoppingList.push(shoppingList[i]);
    }
  }
  return tmpShoppingList;
}

module.exports = {
  loadShoppingList,
  setShoppingListLoadStatus,
  getShoppingListLoadStatus,
  addShoppingItem,
  minusShoppingItem,
  updateShoppingItemSelected,
  updateShoppingAllSelected,
  getShoppingList,
  getSelectedShoppingList
}