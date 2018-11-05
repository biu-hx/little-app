//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    animation: '',
    income: {},
    list: [],
    page: 1,
    totalPage: 1,
    isLoading: true
  },
  onLoad: function () {
    var that = this;
    var i = 0;
    setInterval(function () {
      i = i + 10
      that.rotateAni(i)
    }, 20)
    this.animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50%'
    })
    this.handleIncome(1)
  },
  rotateAni: function (n) {
    this.animation.rotate(n).step()
    this.setData({
      animation: this.animation.export()
    })
  },
  handleIncome(obj) {
    app.doctor.getIncome({
      page: obj
    }).then((res) => {
      this.setData({
        income: Object.assign({}, this.data.income, res.data),
        page: res.data.page,
        totalPage: res.data.totalPage,
        list: this.data.list.concat(res.data.list),
        isLoading: true
      })
    })
  },
  handlePage() {
    this.setData({
      isLoading: false
    })
    this.handleIncome(Number(this.data.page) + 1)
    this.setData({
      page: Number(this.data.page) + 1,
    })
  }
})
