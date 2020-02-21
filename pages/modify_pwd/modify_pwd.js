// pages/modify_pwd/modify_pwd.js
const app = getApp()
const DB = wx.cloud.database()
const user = DB.collection("User")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passwordOld: '',
    passwordBefore: '',
    passwordAfter: '',
  },
  passwordOldInput: function (e) {
    this.setData({
      passwordOld: e.detail.value
    })
  },

  passwordBeforeInput: function (e) {
    this.setData({
      passwordBefore: e.detail.value
    })
  },
  passwordAfterInput: function (e) {
    this.setData({
      passwordAfter: e.detail.value
    })
  },

  passwordInfo: function () {
    if (this.data.passwordAfter === this.data.passwordBefore) { } else {
      wx.showToast({
        title: '确认密码有误',
        image: '/images/shibai.png',
        duration: 2000
      })
      return;
    }
    user.where({
      _openid: app.globalData.my_openid
    }).get()
      .then(res => {
        if (res.data[0].pwd === this.data.passwordOld) {
          user.where({
            _openid: app.globalData.my_openid
          }).update({
            data: {
              pwd: this.data.passwordBefore
            },
            success: function (res) {
              console.log("修改成功", res)
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 2000
              })
              wx.navigateBack({
                url: '/pages/myInfo/myInfo'
              })
            },
            fail: function (res) {
              console.log("修改失败", res)
            },
          })
        } else { 
          wx.showToast({
            title: '旧密码输入不正确',
            icon: 'none',
            duration: 2000
          })
        }
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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