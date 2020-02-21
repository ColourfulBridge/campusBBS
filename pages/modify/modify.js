// pages/Modify/modify.js
const app = getApp()
const DB = wx.cloud.database()
const user = DB.collection("User")
let openid = app.globalData.openid
let name = ""
let number = ""
let sex = ""
let academy = ""
let major = ""
let flag = 0
let academyArray = ['请选择学院', '计算机信息工程学院', '航空与机械工程学院/飞行学院', '汽车工程学院', '电气信息工程学院', '光电工程学院', '土木建筑工程学院', '理学院', '化工与材料学院',
  '经济与管理学院', '外国语学院', '人文学院', '师范学院', '艺术与设计学院', '马克思主义学院', '体育教学部', '国际交流学院', '创新创业学院', '继续教育学院'
]
let majorArray = [
  ['请选择专业'],
  ['请选择专业', '软件工程', '计算机科学与技术', '物联网工程', '通信工程', ],
  ['请选择专业', '飞行技术', '飞行器制造', '交通运输', '机械设计制造及其自动化', '材料成型及控制工程', '机械电子工程专业'],
  ['请选择专业', '汽车服务工程', '	车辆工程'],
  ['请选择专业', '电气工程及其自动化', '电子信息工程', '自动化', '电子科学与技术', '建筑电气与智能化'],
  ['请选择专业', '测控技术与仪器', '光电信息科学与工程', '新能源科学与工程'],
  ['请选择专业', '土木工程', '建筑学', '工程管理', '城市地下空间工程'],
  ['请选择专业', '数学与应用数学', '应用统计学'],
  ['请选择专业', '化学工程与工艺', '应用化学'],
  ['请选择专业', '工商管理', '物流管理', '工业工程', '国际经济与贸易', '市场营销', '电子商务', '财务管理', '酒店管理'],
  ['请选择专业', '英语', '商务英语', '日语'],
  ['请选择专业', '汉语言文学', '广播电视编导', '秘书学'],
  ['请选择专业', '小学教育', '学前教育', '学前教育（中外合作）', '音乐学'],
  ['请选择专业', '产品设计', '工业设计', '动画', '数字媒体艺术', '环境设计', '视觉传达设计', '公共艺术'],
  ['请选择专业'],
  ['请选择专业'],
  ['请选择专业'],
  ['请选择专业'],
  ['请选择专业'],
]
let pages = getCurrentPages();
let prevPage = pages[pages.length - 2];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    academyArray: academyArray,
    majorArray: majorArray,
    index: 0,
    index1: 0,
  },

  bindAcademyChange: function(e) {
    console.log('学院发送选择改变，携带值为', e.detail.value)
    // console.log(e)
    flag = e.detail.value
    this.setData({
      index: e.detail.value
    })
    console.log("学院为", academyArray[e.detail.value])
    academy = academyArray[e.detail.value]
  },

  bindMajorChange: function(e) {
    console.log('专业发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
    console.log("专业为", majorArray[flag][e.detail.value])
    major = majorArray[flag][e.detail.value]
  },

  updname(e) {
    console.log(e.detail.value)
    name = e.detail.value
  },

  updnumber(e) {
    console.log(e.detail.value)
    number = e.detail.value
  },

  updacademy(e) {
    academy = e.detail.value
  },

  updmajor(e) {
    major = e.detail.value
  },

  updsex(e) {
    sex = e.detail.value
  },

  modifyInfo(e) {
    if (name != "" && number != "" && academy != "" && major != "" && sex != "") {
      user.where({
        _openid: app.globalData.my_openid
      }).update({
        data: {
          name: name,
          number: number,
          academy: academy,
          major: major,
          sex: sex,
        },
        success: function(res) {
          console.log("修改成功", res)
          wx.showToast({
            title: '认证成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({
            url: '/pages/login/login'
          })
        },
        fail: function(res) {
          console.log("修改失败", res)
        },
      })
    } else {
      console.log(this.data.openid),
        console.log("信息有空部分，请注意！")
      wx.showToast({
        title: '信息不能为空',
        image: "../../images/post_fail.ico",
        icon: 'success',
        duration: 2000
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})