const app = getApp()
Page({
  data: {
    textHeight: '78rpx',
    type: 1,
    status: [
      {},
      {
        title: '在线时间',
        maxLength: '25',
        text: '请简短的描述您的在线时间，便于用户呼叫您！(25个字以内)'
      },
      {
        title: '职称',
        maxLength: '-1'
      },
      {
        title: '擅长',
        maxLength: '-1'
      },
      {
        title: '简介',
        maxLength: '-1'
      }
    ],
    value: undefined,
    isFocus: false,
    preStatus: ['', 'uptime', 'title', 'sections', 'content']
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载中',
      mask: true
    })
    app.doctor.getUserInfor().then((res) => {
      this.setData({
        type: options.detail,
        isFocus: true,
        value: res.data[this.data.preStatus[options.detail]][1]
      }, () => {
        wx.hideLoading()
      })
    })
    // this.setData({
    //   type: options.detail,
    //   value: options.value,
    //   isFocus: true
    // }, () => {
    //   wx.hideLoading()
    // })
  },
  handleLine: function (e) {
    if (e.detail.lineCount < 6) {
      var height = e.detail.lineCount * 40 + 38
      this.setData({
        textHeight: height + 'rpx'
      })
    } else {
      this.setData({
        textHeight: 238 + 'rpx'
      })
    }
  },
  formSubmit(e) {
    app.handleForm(e.detail.formId)
    app.doctor.setUserInfor({
      eventType: 'EVENT' + this.data.type,
      content: e.detail.value.content
    }).then((res) => {
      const pages = getCurrentPages()
      var prevPage = pages[pages.length - 2];
      prevPage.onLoad()
      wx.navigateBack()
    })
  }
})
