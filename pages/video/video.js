//index.js
//获取应用实例
const app = getApp()
var loading, getStatus
Page({
  data: {
    animation: '',
    callId: false,
    isLoading: true,
    pushUrl: '',
    playUrl: '',
    inquiryId: '',
    status: false
  },
  onReady: function () {
    var that = this;
    var i = 0;
    loading = setInterval(function () {
      that.rotateAni(i++)
    }, 2)
  },
  onLoad: function (options) {
    this.setData({
      callId: options.callId,
      msgId: options.msgId
    }, () => {
      this.handleShouquan()
    })
  },
  onUnload: function () {
    if(this.data.status){
      wx.showModal({
        title: '提示',
        content: '您有一条异常中断的记录，请去问诊记录处理',
        confirmText: "去处理",
        confirmColor: "#1fcd86",
        success: res => {
          if (res.confirm) {
            app.common.navigatorTo('/pages/record/record')
          }
        }
      })
    }
  },
  consultPlay(obj, msg) {
    this.setData({
      isLoading: true
    }, () => {
      app.doctor.getInquiryUrl({
        callId: this.data.callId,
        msgId: this.data.msgId
      })
        .then(res => {
          if (res.code == 10000) {
            this.setData({
              isLoading: false,
              pushUrl: res.data.pushUrl,
              playUrl: res.data.playUrl,
              inquiryId: res.data.inquiryId
            }, () => {
              clearInterval(loading)
              getStatus = setInterval(() => {
                app.doctor.getInquiryStauts({
                  callId: this.data.callId,
                  inquiryId: this.data.inquiryId
                }).then(res => {
                  if (res.code == 10000) {
                    if (res.data.status == 1) {
                      //视频中
                    } else if (res.data.status == 2) {
                      clearInterval(getStatus)
                      wx.showToast({
                        title: '视频已中断，即将返回首页',
                        icon: 'none',
                        complete: ()=> {
                          setTimeout(()=>{
                            app.common.reLaunchTo('/pages/index/index')
                          },1500)
                        }
                      })
                    } else {
                      //异常
                      clearInterval(getStatus)
                      wx.showToast({
                        title: '视频异常中断，即将返回首页',
                        icon: 'none',
                        complete: ()=> {
                          this.setData({
                            status: true
                          })
                          setTimeout(()=>{
                            app.common.reLaunchTo('/pages/index/index')
                          },1500)
                        }
                      })
                    }
                  }
                })
              }, 1000)
            })
          } else {
            clearInterval(getStatus)
            wx.showToast({
              title: res.msg,
              icon: 'none',
              complete: ()=> {
                this.setData({
                  status: true
                })
                setTimeout(()=>{
                  app.common.reLaunchTo('/pages/index/index')
                },1500)
              }
            })
          }
        })
    })
  },
  pushError(e) {
    console.error('live-pusher error:', e.detail.errMsg)
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
    if(e.detail.code == '-2301'){
      clearInterval(getStatus)
      wx.showToast({
        title: '网络中断',
        icon: 'none',
        complete: function () {
          setTimeout(()=>{
            app.common.reLaunchTo('/pages/index/index')
          },1500)
        }
      })
    }
  },
  statechange1(e) {
    console.log('live-pusher code:', e.detail.code)
    if(e.detail.code == '-1307'){
      clearInterval(getStatus)
      wx.showToast({
        title: '网络中断',
        icon: 'none',
        complete: function () {
          setTimeout(()=>{
            app.common.reLaunchTo('/pages/index/index')
          },1500)
        }
      })
    }
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  playerChange(e) {
    console.log('live-player infor:', e.detail.info)
  },
  pusherChange(e) {
    console.log('live-pusher infor:', e.detail.info)
  },
  onShow: function () {
    this.animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50%',
      success: function (res) {
      }
    })
  },
  rotateAni: function (n) {
    this.animation.rotate(n).step()
    this.setData({
      animation: this.animation.export()
    })
  },
  handleCall: function () {
    wx.showModal({
      title: '温馨提示',
      content: '确认完成咨询并挂断？',
      confirmColor: '#1fcd86',
      success: res => {
        if (res.confirm) {
          app.doctor.markRecord({
            eventType: 'EVENT_OVER',
            inquiryId: this.data.inquiryId,
            callId: this.data.callId
          }).then((res) => {
            clearInterval(getStatus)
            app.common.reLaunchTo('/pages/index/index')
          })
        }
      }
    })
  },
  handleYiZhu: function () {
    wx.showToast({
      title: '暂未开通...',
      icon: 'none',
      duration: 2000
    })
  },
  handleBingLi: function () {
    app.doctor.getReport({
      inquiryId: this.data.inquiryId
    }).then((res) => {
      if (res.code == 10000) {
        if (res.data.report && res.data.report.length != 0) {
          app.common.navigatorTo('/pages/bingli/bingli?report=' + JSON.stringify(res.data.report))
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  handleShouquan() {
    wx.authorize({
      scope: 'scope.record',
      success: res => {
        this.recordSuccess()
      },
      fail: res => {
        this.handleRecord()
      }
    })
  },
  handleRecord() {
    wx.showModal({
      title: '提示',
      content: '您未授权录音，功能将无法使用',
      showCancel: false,
      confirmText: "授权",
      confirmColor: "#1fcd86",
      success: res => {
        if (res.confirm) {
          wx.openSetting({
            success: res => {
              if (!res.authSetting['scope.record']) {
                this.handleRecord()
              } else {
                this.recordSuccess()
              }
            },
            fail: () => {
              this.scopeWarn()
            }
          })
        }
      },
      fail: () => {
        this.scopeWarn()
      }
    })
  },
  recordSuccess() {
    wx.authorize({
      scope: 'scope.camera',
      success: () => {
        this.scopeSuccess()
      },
      fail: () => {
        this.handleCamera()
      }
    })
  },
  handleCamera() {
    wx.showModal({
      title: '提示',
      content: '您未授权摄像头，功能将无法使用',
      showCancel: false,
      confirmText: "授权",
      confirmColor: "#1fcd86",
      success: res => {
        if (res.confirm) {
          wx.openSetting({
            success: res => {
              if (!res.authSetting['scope.camera']) {
                this.handleCamera()
              } else {
                this.scopeSuccess()
              }
            },
            fail: () => {
              this.scopeWarn()
            }
          })
        }
      },
      fail: () => {
        this.scopeWarn()
      }
    })
  },
  scopeSuccess() {
    this.consultPlay()
  },
  scopeWarn() {
    wx.showModal({
      title: '授权提示',
      content: '视频通话需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权'
    })
  }
})
