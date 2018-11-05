//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    animation: '',
    type: 0,
    arr: ['EVENT_ALL', 'EVENT_BREAK', 'EVENT_OVER'],
    page: 1,
    totalPage: 1,
    list: [],
    list1: [],
    isLoading: true,
    status: ['待问诊', '问诊中', '2', '3', '4', '5', '6', '7', '已完成', '无效订单', '10', '异常结束']
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
    this.getRecordList(0)
  },
  rotateAni: function (n) {
    this.animation.rotate(n).step()
    this.setData({
      animation: this.animation.export()
    })
  },
  getRecordList: function (obj) {
    app.doctor.getRecord({
      eventType: this.data.arr[this.data.type],
      page: this.data.page || 1
    }).then((res) => {
      this.setData({
        list: this.data.list.concat(res.data.list),
        page: res.data.page,
        totalPage: res.data.totalPage,
        isLoading: true
      })
    })
    if (obj == 0 && obj != undefined) {
      app.doctor.getRecord({
        eventType: 'EVENT_DOING',
      }).then((res) => {
        this.setData({
          list1: res.data.list
        })
      })
    }
  },
  handlePage() {
    this.setData({
      isLoading: false,
      page: Number(this.data.page) + 1,
    }, () => {
      this.getRecordList()
    })
  },
  handleType(e) {
    if(this.data.type != e.currentTarget.dataset.datatype){
      this.setData({
        type: e.currentTarget.dataset.datatype,
        isLoading: true,
        page: 1,
        list: [],
        list1: []
      }, () => {
        this.getRecordList(e.currentTarget.dataset.datatype == 0 ? 0 : e.currentTarget.dataset.datatype)
      })
    }
  },
  handleApiOver(obj1, obj2) {
    app.doctor.setStatus({
      orderNum: obj1,
      inquiryStatus: obj2
    }).then((res) => {
      this.getRecordList(0)
    })
  },
  handleElseOver(e) {
    this.handleApiOver(e.currentTarget.dataset.datatype,11)
  },
  handleOver(e) {
    this.handleApiOver(e.currentTarget.dataset.datatype,8)
  },
  handleDetail(e) {
    app.common.navigatorTo('/pages/recorddetail/recorddetail?id=' + e.currentTarget.dataset.datatype)
  }
})
