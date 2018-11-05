//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    getUserInfoFail: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    versionList: [],
    currentApi: undefined,
    index: 0,
    pickerShow: false,
    code: undefined,
    encryptedData: undefined,
    iv: undefined
  },
  //事件处理函数
  onShow: function () {
    this.login();
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      console.log(1)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      console.log(2)
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(12)
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log(3)
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        withCredentials: true,
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: res => {
          console.log(4);
          this.setData({
            getUserInfoFail: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      }, () => {
        this.login()
      })
    } else {
      this.openSetting();
    }

  },
  login: function () {
    console.log(111)
    var that = this
    var OPEN_ID='';//储存获取到openid
    app.common.login().then(res=>{
      that.setData({
        code: res.code
      })
      return app.common.getUserInfo()
      //获取user信息
    })
    .then(res => {
      that.setData({
        encryptedData: res.encryptedData,
        iv: res.iv
      })
      console.log(7);
      app.globalData.userInfo = res.userInfo
      that.setData({
        getUserInfoFail: false,
        userInfo: res.userInfo,
        hasUserInfo: true
      })
      //处理选择版本
      if(!wx.getStorageSync('api')){
        //获取openid接口
        const APP_ID ='wxb41f73aefb0d097b';//输入小程序appid
        const APP_SECRET ='8ec04e0a773707e339aa4fe0458d7475';//输入小程序app_secret
        app.common.getOpenid(APP_ID,APP_SECRET,that.data.code)
        .then(res=>{
          OPEN_ID = res.data.openid;//获取到的openid
          return app.doctor.getTesterList()
        })
        .then(res1 => {
          app.common.login().then(res=>{
            that.setData({
              code: res.code
            },()=>{
                  if(res1.data.testers.indexOf(OPEN_ID) != -1){
                that.setData({
                  versionList: res1.data.versionList
                },()=>{
                    that.setData({
                        pickerShow: true,
                    })
                })
              }else {
                that.loginVerify()
              }
            })
          })
        })
      }else {
        that.loginVerify()
      }
      //平台登录
    }).catch(() => {
        that.setData({
            getUserInfoFail: true
        })
    })
  },
  //跳转设置页面授权
  openSetting: function () {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          console.log(9);
          //尝试再次登录
          that.login()
        }
      })
    } else {
      console.log(10);
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  },
  loginVerify: function () {
    var that = this
    app.doctor.loginVerify({
      js_code: that.data.code,
      encryptedData: that.data.encryptedData,
      iv: that.data.iv
    }).then(res => {
      wx.setStorageSync('accessToken', res.data.token)
      if (res.data.bind_doctor && res.data.bind_doctor != 0) {
        wx.setStorageSync('phone', res.data.bind_doctor)
        app.common.reLaunchTo('/pages/index/index')
      } else {
        app.common.redirectTo('/pages/nologin/nologin')
      }
    }).catch(() => {
        that.setData({
            getUserInfoFail: true
        })
    })
  },
  bindPickerChange: function (e) {
    //选择版本
    wx.setStorageSync('api',this.data.versionList[e.detail.value].apiUrl)
    this.loginVerify()
  },
  bindPickerCancel: function () {
  }
})