// 云函数入口文件
const cloud = require('wx-server-sdk')
var requestUrl = require('request');

const getUserId = (user) => {
  return new Promise((resolve, reject)=> {
    let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code';

    let tmpUrl = url.replace('APPID', user.appId);
    tmpUrl = tmpUrl.replace('SECRET', user.secret);
    tmpUrl = tmpUrl.replace('JSCODE', user.code);

    requestUrl(tmpUrl, function (err, respone, body) {
      if (!err && respone.statusCode == 200) {
        resolve(body);
        }

        reject(err);
      })
  })
}

cloud.init({
  env:'clouddemo-480e99'
})


// 云函数入口函数
exports.main = async (event, context) => {
  let {
    secret,
    code,
    userInfo
  } = event;

  let openId = userInfo.openId; 
  let appId = userInfo.appId;

  return {
    code: 0,
    data: appId
  }
 /*
  try{

    const val = await getUserId({ 
      appId: appId, 
      secret: secret,
      code: code
      });

    let result = JSON.parse(val);
      return {
        code: 0,
        data: result.openid
      }
  
  }catch (e){
    return {
      code: -1,
      data: e
    }
  }

  */
}


