const db = wx.cloud.database({
  env: 'clouddemo-480e99'
});

function getCommodityById(commodityId){
  return new Promise((resolve, reject)=>{
    db.collection('demo-commodity-info').where({
      _id: commodityId
    }).get({
      success: res=>{
        resolve(res.data);
      },
      fail: res=>{
        reject(res);
      }
    });
  })
}

function loadCommodityByType(typeId){
  return new Promise((resovle, reject)=>{
    db.collection('demo-commodity-info').where({
      typeId: typeId
    }).get({
      success: res=>{
        resovle(res.data);
      },

      fail: res=>{
        reject(res);
      }
    });
  })
}

function loadCommodityType(classId){
  return new Promise(function(resolve, reject){
    db.collection('demo-commodity-type').where({
      classId: classId
    }) .get({
      success:function(res){
        resolve(res.data);
      },
      fail:function(res){
        reject(res);
      }
    })
  })
}


function loadCommodityClass(){
  return new Promise(function(resolve, reject){
    db.collection('demo-class').get({
      success: function(res){
        resolve(res.data);
      },
      fail:function(res){
        console.log(res);
        reject(res);
      }
    })
  })
}

function getDefaultAddr(){
  return new Promise((resolve, rejecct) =>{
    wx.cloud.callFunction({
      name: 'getDefaultAddr'
    }).then(res=>{
      if (res.result.code==0){
       resolve(res.result.data);
     }
     else{
      reject(res.result.data);
     }
    }).catch(res=>{
    reject(res);
    }); 
  })
}


function updateDefaultAddr(addr){
return new Promise((resolve, reject)=>{
    wx.cloud.callFunction({
      name: 'updateDefaultAddr',
      data:{
        cityName: addr.cityName,
        countyName: addr.countyName,
        detailInfo: addr.detailInfo,
        nationalCode: addr.nationalCode,
        postalCode: addr.postalCode,
        provinceName: addr.provinceName,
        telNumber: addr.telNumber,
        userName: addr.userName,
      }
    }).then(res=>{
      console.log(res.result);
      if (res.result.code == 0){
        resolve(res.result.data);
      }else{
        reject(res.result.data);
      }
    }).catch(res =>{
      console(res);
      reject(res);
    });
  });
}
function getShopping(){
  return new Promise((resolve, reject)=>{
    wx.cloud.callFunction({
      name: 'getShopping'
    }).then(res=>{
      if (res.result.code==0){
        resolve(res.result.data);
      }else{
        reject(res.result.data);
      }
    }).catch(res=>{
      reject(res);
    }
    );
  });
}

function addShopping(res){
  return new Promise((resolve, reject)=>{
    wx.cloud.callFunction({
      name: 'addShopping',
      data:{
        commodityId: res.commodityId,
        num: res.num
      }
    }).then(res=>{
      if (res.result.code == 0){
        resolve(res.result.data);
      }else{
        reject(res.result.data);
      }
    }).catch(res=>{
      reject(res);
    });
  });
}

module.exports={
  loadCommodityClass,
  loadCommodityType,
  loadCommodityByType,
  getCommodityById,
  getDefaultAddr,
  updateDefaultAddr,
  getShopping,
  addShopping
}