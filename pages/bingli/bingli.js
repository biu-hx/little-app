//index.js
//获取应用实例
const app = getApp()
var loading
Page({
  data: {
    animation: '',
    isbig: true,
    isBingli: false,
    bigImage: false,
    currentId: 1,
    report: [],
    inquiryId: ''
  },
  onReady: function () {
  },
  onLoad: function (options) {
    this.setData({
      report: JSON.parse(options.report).map((item) => {
        return {
          'img': item
        }
      })
    })
  },
  handleBig: function (e) {
    this.setData({
      bigImage: true,
      currentId: Number(e.currentTarget.dataset.dataid) + 1
    })
  },
  closeImage: function () {
    this.setData({
      bigImage: false
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentId: e.detail.current + 1
    })
    if (e.detail.current > 0 && e.detail.current < (this.data.report.length - 1)) {
      var authority1 = 'report[' + (e.detail.current - 1) + '].scale'
      var authority2 = 'report[' + (e.detail.current + 1) + '].scale'
      this.setData({
        [authority1]: 1,
        [authority2]: 1
      })
    } else if (e.detail.current == 0) {
      var authority = 'report[1].scale'
      this.setData({
        [authority]: 1
      })
    } else if (e.detail.current == (this.data.report.length - 1)) {
      var authority = 'report[' + (e.detail.current - 1) + '].scale'
      this.setData({
        [authority]: 1
      })
    }
  }
})
