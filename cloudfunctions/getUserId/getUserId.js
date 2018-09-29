// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    secret,
    code,
    content,
    userInfo
  } = event;

  let openId = userInfo.openId; 
  let appId = userInfo.appId;
  let result = null;
  let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code';
  url.replace('APPID', appId).replace('secret', secret).replace('js_code', code);

  wx.request({
    url: url,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: res=>{
      return res.data;
    }
  })
}


