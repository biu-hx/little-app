const app = getApp()

Page({
  data: {
    phone: undefined,
    isgreen: undefined,
    oldpassword: undefined,
    newpassword: undefined,
    password: undefined
  },
  onLoad: function () {
  },
  handleSuccess(e) {
    app.handleForm(e.detail.formId)
    var data = Object.assign(e.detail.value)
    if (e.detail.value.oldpassword.length == 0 || e.detail.value.password.length == 0 || e.detail.value.newpassword.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '密码不能为空'
      })
      return false;
    }
    if (e.detail.value.newpassword != e.detail.value.password) {
      wx.showToast({
        icon: 'none',
        title: '两次输入新密码不同'
      })
      return false;
    }
    if ((!(/^[0-9a-zA-Z]{0,25}$/.test(e.detail.value.oldpassword))) || (!(/^[0-9a-zA-Z]{0,25}$/.test(e.detail.value.password)))) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确格式的密码'
      })
      return false;
    }
    app.doctor.setPwd({
      old_password: e.detail.value.oldpassword,
      password: e.detail.value.password
    }).then((res) => {
      wx.showToast({
        title: '密码设置成功',
        icon: 'success',
        duration: 2000,
        complete: function () {
          wx.removeStorageSync('phone')
          app.common.reLaunchTo('/pages/getuserinfor/getuserinfor')
        }
      })
    })
  },
  handleInput0(e) {
    this.setData({
      oldpassword: e.detail.value
    }, () => {
      this.handleInput()
    })
  },
  handleInput1(e) {
    this.setData({
      newpassword: e.detail.value
    }, () => {
      this.handleInput()
    })
  },
  handleInput2(e) {
    this.setData({
      password: e.detail.value
    }, () => {
      this.handleInput()
    })
  },
  handleInput(e) {
    if (this.data.oldpassword && this.data.newpassword && this.data.password) {
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
