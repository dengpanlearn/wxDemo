const db = wx.cloud.database({
  env: 'clouddemo-480e99'
});

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


module.exports={
  loadCommodityClass,
  loadCommodityType
}