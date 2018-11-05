const app = getApp()

Page({
  data: {
    phone: undefined,
    isgreen: '',
    username1: undefined,
    userpwd1: undefined
  },
  onLoad: function (options) {
    this.setData({
      phone: options.phone
    })
  },
  handleSuccess(e) {
    var data = Object.assign(e.detail.value)
    if (e.detail.value.oldpassword.length == 0 || e.detail.value.password.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '密码不能为空'
      })
      return false;
    }
    if (e.detail.value.password != e.detail.value.oldpassword) {
      wx.showToast({
        icon: 'none',
        title: '两次输入密码不同，请重新输入'
      })
      return false;
    }
    if (!(/^[0-9a-zA-Z]{0,25}$/.test(e.detail.value.password))) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确格式的密码'
      })
      return false;
    }
    app.doctor.setNewPwd({
      phone: this.data.phone,
      password: e.detail.value.password
    }).then((res) => {
      wx.showToast({
        title: '密码设置成功',
        icon: 'success',
        duration: 2000,
        complete: function () {
          app.common.reLaunchTo('/pages/index/index')
        }
      })
    })
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
