//app.js

//在全局APP中导入工具类类
const common = require("./utils/common.js")
const doctor = require("./utils/doctor.js")
App({
  onLaunch: function () {
  },
  globalData: {},
  common: common,
  doctor: doctor,
  handleForm(obj) {
    if(obj != 'the formId is a mock one'){
      doctor.addFormId({
        form_id: obj
      }).then(res => {
        console.log(111)
      })
    }
  }
})