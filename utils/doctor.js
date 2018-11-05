// api

//api根路径
const API = require("api.js")
//引入fetch
const fetchjs = require("fetch.js")


function fetchAPI(url, params, method) {
  var api;
  //处理测试版本
  if(url == 'user/getTesterList'){
    api = API
  }else if(wx.getStorageSync('api')){
    api = wx.getStorageSync('api')
  }else {
    api = API
  }
  return fetchjs(api, url, params, method)
}

//用户认证
function loginVerify(params) {
  return fetchAPI('user/littleapp/login', params, 'post').then(res => res.data)
}

//用户登录
function loginUser(params) {
  return fetchAPI('user/login', params, 'post').then(res => res.data)
}

//发送验证码
function sendVerify(params) {
  return fetchAPI('user/code', params, 'post').then(res => res.data)
}

//验证验证码
function verifyVerify(params) {
  return fetchAPI('user/verify', params, 'post').then(res => res.data)
}

//设置新密码
function setNewPwd(params) {
  return fetchAPI('user/password/modify', params, 'post').then(res => res.data)
}

//首页
//设置上下线
function setOnline(params) {
  return fetchAPI('user/auto/online', params, 'post').then(res => res.data)
}

//个人收入
function getIncome(params) {
  return fetchAPI('user/income', params, 'post').then(res => res.data)
}

//问诊记录
function getRecord(params) {
  return fetchAPI('inquiry/list', params, 'post').then(res => res.data)
}

//标记通话结束
function markRecord(params) {
  return fetchAPI('inquiry/mark', params, 'post').then(res => res.data)
}

//问诊记录详情
function recordDetail(params) {
  return fetchAPI('inquiry/detail', params, 'post').then(res => res.data)
}

//获取个人资料
function getUserInfor(params) {
  return fetchAPI('user/info', params).then(res => res.data)
}

//修改个人资料
function setUserInfor(params) {
  return fetchAPI('user/modify/info', params, 'post').then(res => res.data)
}

//获取基本信息
function getBasicInfor(params) {
  return fetchAPI('user/basic', params, 'post').then(res => res.data)
}

//获取问诊消息
function getNewInquiryMsg(params) {
  return fetchAPI('inquiry/newInquiryMsg', params, 'post').then(res => res.data)
}

//获取问诊地址
function getInquiryUrl(params) {
  return fetchAPI('inquiry/inquiryVideo', params, 'post').then(res => res.data)
}

//获取问诊报告
function getReport(params) {
  return fetchAPI('inquiry/report', params, 'post').then(res => res.data)
}

//获取视频通话状态
function getInquiryStauts(params) {
  return fetchAPI('inquiry/getInquiryStauts', params, 'post').then(res => res.data)
}


//退出登录
function logout(params) {
  return fetchAPI('user/loginout', params).then(res => res.data)
}

//修改密码
function setPwd(params) {
  return fetchAPI('user/password/reset', params, 'post').then(res => res.data)
}

//接收formId
function addFormId(params) {
  return fetchAPI('inquiry/addFormId', params, 'post').then(res => res.data)
}
//设置问诊状态
function setStatus(params) {
  return fetchAPI('inquiry/setStatus', params, 'post').then(res => res.data)
}
//获取测试人员
function getTesterList(params) {
  return fetchAPI('user/getTesterList', params).then(res => res.data)
}


module.exports = {
  fetchAPI: fetchAPI,
  loginVerify: loginVerify,
  loginUser: loginUser,
  sendVerify: sendVerify,
  verifyVerify: verifyVerify,
  setNewPwd: setNewPwd,
  setOnline: setOnline,
  getIncome: getIncome,
  getRecord: getRecord,
  markRecord: markRecord,
  recordDetail: recordDetail,
  getUserInfor: getUserInfor,
  setUserInfor: setUserInfor,
  getBasicInfor: getBasicInfor,
  getNewInquiryMsg: getNewInquiryMsg,
  logout: logout,
  setPwd: setPwd,
  getInquiryUrl: getInquiryUrl,
  getReport: getReport,
  getInquiryStauts: getInquiryStauts,
  addFormId: addFormId,
  setStatus: setStatus,
  getTesterList: getTesterList
}

