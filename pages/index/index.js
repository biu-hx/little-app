//index.js
//获取应用实例
const app = getApp()
var intervals

Page({
  data: {
    isChecked: false,
    classmsg: '_nomsg',
    data: false,
    callId: undefined,
    name: '',
    hidden: true,
    setData: false,
    intervals: undefined
  },
  onLoad: function () {
    wx.onNetworkStatusChange((res)=>{
      if(res.isConnected){
        if(this.data.name == ''){
          this.getBasic()
        }
      }
    })
    this.getBasic()
  },
  getBasic(){
    app.doctor.getBasicInfor().then((res) => {
      this.setData({
        isChecked: res.data.auto.online == 0 ? false : true,
        name: res.data.name
      })
      //获取问诊消息
      this.setIntervalCall()
    })
  },
  setIntervalCall() {
    intervals = setInterval(() => {
      app.doctor.getNewInquiryMsg().then((res) => {
        if (res.code == 10000) {
          if (res.data.callId != this.data.callId) {
            this.setData({
              callId: res.data.callId,
              msgId: res.data.msgId,
              hidden: false,
              setData: res.data
            })
          } else {
            this.setData({
              setData: res.data
            })
          }
        } else {
          if (res.code == '33107' || res.code == '33108' || res.code == '33109' || res.code == '31104') {
            clearInterval(intervals)
          }
          this.setData({
            classmsg: '_nomsg',
            data: false,
            hidden: true
          })
        }
      })
    }, 1000)
    this.setData({
      intervals: intervals
    })
  },
  switchChange(e) {
    this.setData({
      isChecked: !e.detail.value
    })
    app.doctor.setOnline({
      online: e.detail.value ? 1 : 0
    }).then((res) => {
      this.setData({
        isChecked: e.detail.value
      })
      wx.showToast({
        title: '设置成功',
        icon: 'success'
      })
    })
  },
  goIncome() {
    app.common.navigatorTo('/pages/income/income')
  },
  goRecord() {
    app.common.navigatorTo('/pages/record/record')
  },
  handleCall() {
    clearInterval(intervals)
    app.common.reLaunchTo('/pages/video/video?callId=' + this.data.data.callId + '&msgId=' + this.data.data.msgId)
  },
  handlePer: function () {
    app.common.navigatorTo('/pages/personal/personal')
  },
  handlepwd: function () {
    app.common.navigatorTo('/pages/setpwd/setpwd')
  },
  handleLogout: function () {
    wx.showModal({
      title: '操作提示',
      content: '确认退出当前账户？',
      confirmColor: '#1fcd86',
      success: function (res) {
        if (res.confirm) {
          app.doctor.logout().then((res) => {
            wx.removeStorageSync('phone')
            wx.removeStorageSync('accessToken')
            wx.removeStorageSync('api')
            wx.showToast({
              title: '退出成功',
              icon: 'success',
              complete: function () {
                clearInterval(intervals)
                app.common.reLaunchTo('/pages/getuserinfor/getuserinfor')
              }
            })
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  saveFormId(e) {
    app.handleForm(e.detail.formId)
  },
  handleCallConfirm(e) {
    this.setData({
      classmsg: '_nomsg',
      data: false,
      hidden: true
    })
    clearInterval(intervals)
    app.common.reLaunchTo('/pages/video/video?callId=' + this.data.callId + '&msgId=' + this.data.msgId)
  },
  handleCallCancel() {
    this.setData({
      classmsg: '',
      data: this.data.setData,
      hidden: true
    })
  },
  goHelp() {
    app.common.navigatorTo('/pages/usehelp/usehelp')
  }
})
