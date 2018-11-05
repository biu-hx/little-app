const app = getApp()

Page({
  data: {
    isSend: false,
    time: 60,
    phone: '',
    title: '发送验证码',
    code: '',
    isgreen: undefined,
    username1: undefined,
    userpwd1: undefined,
  },
  onLoad: function () {
  },
  handleSend(e) {
    if (!this.data.phone || this.data.phone.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入手机号'
      })
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.phone))) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号'
      })
      return false;
    }
    app.doctor.sendVerify({
      phone: this.data.phone
    }).then(res => {
      if (res.code == 10000) {
        var that = this
        this.setData({
          isSend: true,
          time: 60
        }, () => {
          var timeInterVal = setInterval(() => {
            if (that.data.time == 1) {
              clearInterval(timeInterVal)
              that.setData({
                isSend: false,
                title: '重新发送'
              })
            } else {
              that.setData({
                time: that.data.time - 1
              })
            }
          }, 1000)
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg
        })
      }
    })
  },
  handleSuccess(e) {
    var data = Object.assign(e.detail.value)
    if (e.detail.value.phone.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入手机号'
      })
      return false;
    }
    if (e.detail.value.code.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入验证码'
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
    if (!(/^[0-9a-zA-Z]{0,25}$/.test(e.detail.value.code))) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的验证码'
      })
      return false;
    }
    app.doctor.verifyVerify(data).then((res) => {
      app.common.navigatorTo('/pages/forgetpwd/forgetpwd?phone=' + this.data.phone)
    }).catch(() => {
      this.setData({
        code: ''
      })
    })
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value,
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
