const app = getApp()
const url = require('../../utils/api')

Page({
  data: {
    username: undefined,
    userpwd: undefined,
    isgreen: undefined,
    username1: undefined,
    userpwd1: undefined
  },
  onLoad: function () {
  },
  formSubmit(e) {
    var data = Object.assign(e.detail.value, {formId: e.detail.formId})
    if (e.detail.value.phone.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入手机号'
      })
      return false;
    }
    if (e.detail.value.password.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入密码'
      })
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(e.detail.value.phone))) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号'
      })
      return false;
    }
    if (!(/^[0-9a-zA-Z]{0,25}$/.test(e.detail.value.password))) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的密码'
      })
      return false;
    }
    app.doctor.loginUser(data).then((res) => {
      wx.setStorageSync('phone', e.detail.value.phone)
      app.common.reLaunchTo('/pages/index/index')
      app.handleForm(e.detail.formId)
    })
  },
  handleForget() {
    app.common.navigatorTo('/pages/resetpwd/resetpwd')
  },
  handleInput0(e) {
    this.setData({
      username1: e.detail.value
    }, () => {
      this.handleInput()
    })
  },
  handleInput1(e) {
    this.setData({
      userpwd1: e.detail.value
    }, () => {
      this.handleInput()
    })
  },
  handleInput(e) {
    if (this.data.username1 && this.data.userpwd1) {
      this.setData({
        isgreen: 'green_btn'
      })
    } else {
      this.setData({
        isgreen: ''
      })
    }
  }
})
