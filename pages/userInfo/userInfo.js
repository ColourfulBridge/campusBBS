// pages/userInfo/userInfo.js
const app = getApp()
const DB = wx.cloud.database()
const user = DB.collection("User")
const hide = DB.collection("Hide")
const _ = DB.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    number:'',
    sex:'',
    academy:'',
    major:'',
    head:'',
    nickname:'',
    openid:''
  },

  chatroom: function (e) {
    var user = e.currentTarget.dataset
    if (user.openid != app.globalData.my_openid){
      wx.navigateTo({
        url: '/pages/room/room?openid=' + user.openid + "&nickname=" + user.nickname + "&head=" + user.head
      })
    }else{
      wx.showToast({
        title: '不可以自己和自己对话哦o(TヘTo)',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var arr = [];
    var userhide = [];

    this.setData({
      head : e.head,
      nickname : e.nickname,
      openid: e.openid
    })

    hide.where({
      _openid: e.openid
    }).get().then(res => {
      userhide = res.data[0]
      console.log("hide读取成功", res.data)

      user.where({
        _openid: e.openid
      }).get().then(res => {
        if (userhide.name !== true) {
          arr.name = "保密"
        } else {
          arr.name = res.data[0].name
        }
        if (userhide.number !== true) {
          arr.number = "保密"
        } else {
          arr.number = res.data[0].number
        }
        if (userhide.sex !== true) {
          arr.sex = "保密"
        } else {
          arr.sex = res.data[0].sex
        }
        if (userhide.academy !== true) {
          arr.academy = "保密"
        }
        else {
          arr.academy = res.data[0].academy
        }
        if (userhide.major !== true) {
          arr.major = "保密"
        } else {
          arr.major = res.data[0].major
        }
        this.setData({
          name:arr.name,
          number:arr.number,
          sex:arr.sex,
          academy: arr.academy,
          major: arr.major,
        })
        console.log("user读取成功", res.data)
        console.log("arr：", arr);
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})