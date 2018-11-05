// components/saveFormId/formId.j
const doctor = require("../../utils/doctor.js")
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    saveFormId: function (e) {
      if(e.detail.formId != 'the formId is a mock one'){
        doctor.addFormId({
          form_id: e.detail.formId
        }).then(res => {
          console.log(111)
        })
      }
      // this.triggerEvent('formId', e, {capturePhase: true,bubbles: true,composed: true});
    }
  }
})
