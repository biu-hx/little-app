const app = getApp()

Page({
  data: {
    data: undefined,
    status: ['', 'uptime', 'title', 'sections', 'content'],
    nodes: [{

    }]
  },
  onLoad: function () {
    app.doctor.getUserInfor().then((res) => {
      this.setData({
        data: res.data
      })
    })
  },
  handleCheck(e) {
    app.common.navigatorTo('/pages/changeinfor/changeinfor?detail=' + e.currentTarget.dataset.datatype)
  }
})
