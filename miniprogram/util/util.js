
var userInfo= { };
var logged= false;

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

function setUserInfo(info) {
  return userInfo = info;
}

function loadWxUserInfo(){
  return new Promise(function(resovle, reject){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success: res => {
              userInfo = res.userInfo;
              resovle(res);
            },
            fail: res => {
              reject(res);
            }
          })
        }else{
          reject(res);
        }
         
      },
      fail: res => {
        reject(res);
      }
    })
  })
}

module.exports = {
  getIsUpdateInfo,
  getAvatarUrl,
  getUserInfo,
  setUserInfo,
  getIsLogged,
  loadWxUserInfo,
  objectIsEmpty,
}