//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    detail: undefined,
    status: ['待问诊', '问诊中', '2', '3', '4', '5', '6', '7', '已完成', '无效订单', '10', '异常结束'],
  },
  onLoad: function (options) {
    app.doctor.recordDetail({
      inquiryId: options.id
    }).then((res) => {
      this.setData({
        detail: res.data
      },()=>{
      })
    })
  }
})
