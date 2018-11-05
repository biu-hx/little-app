// 发送请求
const common = require("./common.js")

module.exports = function (api, url, params, method) {
  var header = {
    'user-equip': 'littleApp',
    'token': wx.getStorageSync('accessToken')
  }
  header['Content-Type'] = 'json'
  if (method == 'post') {
    header['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${api}/${url}`,
      data: Object.assign({}, params),
      method: method ? method : 'GET',
      header: header,
      success: function (res) {
        // console.log(res)
        if (url != 'inquiry/newInquiryMsg' && url != 'user/addFormId') {
          if (res.data.code == '33107' || res.data.code == '33108' || res.data.code == '33109' || res.data.code == '31104') {
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
              complete: function () {
                wx.removeStorageSync('phone')
                wx.removeStorageSync('accessToken')
                wx.removeStorageSync('api')
                common.reLaunchTo('/pages/getuserinfor/getuserinfor')
              }
            })
          } else if (res.data.code != '10000' && res.data.code != '20000') {
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
              complete: function () {
                resolve()
              }
            })
          } else {
            resolve(res)
          }
        } else {
          resolve(res)
        }
      },
      fail: function (err) {
        console.log(err)
        wx.showToast({
          icon: 'none',
          title: err,
          complete: function () {
            reject(err)
          }
        })
      }
    })
  })
}