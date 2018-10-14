
var userInfo= { };
var logged= false;
var appCode = '';

function objectIsEmpty(obj){
  for (var key in obj) {
    return false;
  }

  return true;
}
function getIsLogged() {
  return logged;
}

function getUserInfo() {
  return userInfo;
}

function getAvatarUrl() {
  return userInfo.avatarUrl;
}

function getIsUpdateInfo() {
  return !objectIsEmpty(userInfo);
}



function registerUser(){
  return new Promise(function(resolve, reject){
    wx.cloud.callFunction({
      name: 'registerUser',
      data: {
        userName: userInfo.nickName,
        gender: userInfo.gender,
        city: userInfo.city,
        province: userInfo.province,
        country: userInfo.country,
        avatarUrl: userInfo.avatarUrl,
        language: userInfo.language
      }
    }).then(res => {
      if (res.result.code == 0) { 
        console.log(res.result.data);
        logged = true;
        resolve(logged);
      }else {
        reject(logged);
      } 
    }).catch(res => {
      reject(res);
    })
  })
}

function setUserInfo(info) {
  userInfo = info;
}
// get wx userInfo
function loadWxUserInfo(){

  return new Promise(function (resovle, reject){
    wx.cloud.callFunction({
      name: 'getUserId',
      data: {
        secret: 'f6a008cab77ada27c16a9d2b0ab6c9be',
        code: 'appCode'
      }
    }).then(res =>{
      if (res.result.code == 0) {
        console.log(res.result.data);
        let serverUserInfo = res.result.data[0];
        userInfo.nickName = serverUserInfo.userName;
        userInfo.gender = serverUserInfo.gender;
        userInfo.country = serverUserInfo.country;
        userInfo.province = serverUserInfo.province;
        userInfo.city = serverUserInfo.city;
        userInfo.language = serverUserInfo.language;
        userInfo.avatarUrl = serverUserInfo.avatarUrl;
      }
    }).catch(res=>{
      reject(res);
    });
  });
  
    
           
  /*通过云函数可以直接获取到openId,暂时不用获取unionId
  return new Promise(function(resovle, reject){
    wx.login({
      success: res=>{
        if (res.code){
          console.log('logon get code:' + res.code);
          appCode =res.code;

          wx.cloud.callFunction({
            name: 'getUserId',
            data: {
              secret: 'f6a008cab77ada27c16a9d2b0ab6c9be',
              code: appCode
            }
          }).then(res => {
            if (res.result.code == 0) {
              console.log('user open id:' + res.result.data);
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: res => {
                        userInfo = res.userInfo;
                        resovle(res);
                      },
                      fail: res => {
                        reject(res);
                      }
                    })
                  } else {
                    reject(res);
                  }

                },
                fail: res => {
                  reject(res);
                }
              })

            } else {
              reject(res.result.data);
            }


          }).catch(res => {
            reject(res);
          })
          
        }else{
          reject(res.errMsg);
        }
      }
    })
   
  })*/
}

module.exports = {
  getIsUpdateInfo,
  getAvatarUrl,
  getUserInfo,
  setUserInfo,
  getIsLogged,
  loadWxUserInfo,
  objectIsEmpty,
  registerUser
}