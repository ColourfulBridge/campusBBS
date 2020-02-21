// pages/myInfo/myInfo.js
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
    myinfo: [],
    switchName: true,
    switchNumber: true,
    switchSex: true,
    switchAcademy: true,
    switchMajor: true,
    modalHidden: false,
  },
  /** 
   * 隐藏开关
   */
  switchChangeName: function () {
    console.log('1-switchName', this.data.switchName);
    this.setData({
      switchName: !this.data.switchName
    });
    console.log('2-switchName', this.data.switchName);
      hide.where({
        _openid: app.globalData.my_openid
      }).update({
        data: {
          name: this.data.switchName
        },
        success: function (res) {
          console.log("开关修改成功", res)
        },
        fail: function (res) {
          console.log("开关修改失败", res)
        },
      })
  },
  switchChangeNumber: function () {
    console.log('1-switchNumber', this.data.switchNumber);
    this.setData({
      switchNumber: !this.data.switchNumber
    });
    console.log('2-switchNumber', this.data.switchNumber);
    hide.where({
      _openid: app.globalData.my_openid
    }).update({
      data: {
        number: this.data.switchNumber
      },
      success: function (res) {
        console.log("开关修改成功", res)
      },
      fail: function (res) {
        console.log("开关修改失败", res)
      },
    })
  },
  switchChangeSex: function () {
    console.log('1-switchSex', this.data.switchSex);
    this.setData({
      switchSex: !this.data.switchSex
    });
    console.log('2-switchSex', this.data.switchSex);
    hide.where({
      _openid: app.globalData.my_openid
    }).update({
      data: {
        sex: this.data.switchSex
      },
      success: function (res) {
        console.log("开关修改成功", res)
      },
      fail: function (res) {
        console.log("开关修改失败", res)
      },
    })
  },
  switchChangeAcademy: function () {
    console.log('1-switchAcademy', this.data.switchAcademy);
    this.setData({
      switchAcademy: !this.data.switchAcademy
    });
    console.log('2-switchAcademy', this.data.switchAcademy);
    hide.where({
      _openid: app.globalData.my_openid
    }).update({
      data: {
        academy: this.data.switchAcademy
      },
      success: function (res) {
        console.log("开关修改成功", res)
      },
      fail: function (res) {
        console.log("开关修改失败", res)
      },
    })
  },
  switchChangeMajor: function () {
    console.log('1-switchMajor', this.data.switchMajor);
    this.setData({
      switchMajor: !this.data.switchMajor
    });
    console.log('2-switchMajor', this.data.switchMajor);
    hide.where({
      _openid: app.globalData.my_openid
    }).update({
      data: {
        major: this.data.switchMajor
      },
      success: function (res) {
        console.log("开关修改成功", res)
      },
      fail: function (res) {
        console.log("开关修改失败", res)
      },
    })
  },

  /**
   * 隐藏开关弹窗提示信息
   */
  modalChange: function (e) {
    this.setData({
      modalHidden: true
    })
  },

  /**
   * 客服功能
   */
  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    user.where({
      _openid: app.globalData.my_openid 
    }).get().then(res => {
      this.setData({
        myinfo: res.data[0]
      })
      console.log("user读取成功", res.data)
    })
    
    hide.where({
      _openid: app.globalData.my_openid
    }).get().then(res => {
      this.setData({
        switchName: res.data[0].name,
        switchNumber: res.data[0].number,
        switchSex: res.data[0].sex,
        switchAcademy: res.data[0].academy,
        switchMajor: res.data[0].major,
      });
      console.log("hide读取成功", res.data)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    user.where({
      _openid: app.globalData.my_openid
    }).get().then(res => {
      this.setData({
        myinfo: res.data[0]
      })
      console.log("刷新成功", res)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  },
})