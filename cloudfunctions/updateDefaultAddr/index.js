// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
  cityName,
  countyName,
  detailInfo,
  nationalCode,
  postalCode,
  provinceName,
  telNumber,
  userInfo,
  userName
  } = event;

  let openId = userInfo.openId;
  let appId = userInfo.appId;;

  const db = cloud.database();
  const collection = db.collection('demo-default-addr');

  try{
    let result = await collection.get({
      openId: openId
    });

    if (result.data.length != 0){
      let _id = result.data[0]._id;
      result = await collection.doc(_id).update({
        cityName: cityName,
        countyName: countyName,
        detailInfo: detailInfo,
        nationalCode: nationalCode,
        postalCode: postalCode,
        provinceName: provinceName,
        telNumber: telNumber,
        userName: userName,
        time: db.serverDate
      });
      
      return {
        code: 0,
        data: result
      }

    }else{
      result = await collection.add({
        data:{
          openId: openId,
          appId: appId,
          cityName: cityName,
          countyName: countyName,
          detailInfo: detailInfo,
          nationalCode: nationalCode,
          postalCode: postalCode,
          provinceName: provinceName,
          telNumber: telNumber,
          userName: userName,
          time: db.serverDate
        }
      });

      return {
        code: 0,
        data: result
      };
    }

  }catch(err){
    return {
      code: -1,
      data: err
    }
  }
  
  
}