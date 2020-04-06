// pages/message/message.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkInfo: [],
  },

  goToRoom: function(e) {
      var user = e.currentTarget.dataset
      wx.navigateTo({
        url: '/pages/room/room?openid=' + user.openid+ "&nickname=" + user.nickname + "&head=" + user.head
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const db = wx.cloud.database()
    var that = this;
    db.collection('Message')
      .orderBy('sendTimeTS', 'desc')
      .where({
        my_openid: app.globalData.my_openid
      }).get().then(res => {
        console.log("message读取成功", res.data)
        this.setData({
          linkInfo: res.data
        });
        for (var i = 0; i < this.data.linkInfo.length; i++) {
          if (this.data.linkInfo[i].msgType != "image") {

          } else {
            var ContentParam = "linkInfo[" + i + "].textContent"
            that.setData({
              [ContentParam]: "[图片]"
            })
          }
        }
      }).catch(console.error)
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
    const db = wx.cloud.database()
    var that = this;
    db.collection('Message')
      .orderBy('sendTimeTS', 'desc')
      .where({
        my_openid: app.globalData.my_openid
      }).get().then(res => {
        console.log("message读取成功", res.data)
        this.setData({
          linkInfo: res.data
        });
        for (var i = 0; i < this.data.linkInfo.length; i++) {
          if (this.data.linkInfo[i].msgType != "image") {

          } else {
            var ContentParam = "linkInfo[" + i + "].textContent"
            that.setData({
              [ContentParam]: "[图片]"
            })
          }
        }
      }).catch(console.error)
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