const app = getApp()
const url = require('../../utils/api')
Page({
  data: {},
  onLoad: function () {
  },
  goLogin: function () {
    app.common.reLaunchTo('/pages/login/login')
  }
})
