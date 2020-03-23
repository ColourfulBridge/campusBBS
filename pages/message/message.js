// pages/message/message.js
const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js') 

const app = getApp()
const DB = wx.cloud.database()
const user = DB.collection("User")
const message = DB.collection("Message")
const chatroom = DB.collection("chatroom")
var arr = [];
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
        url: '/pages/room/room?openid=' + user.openid + "&nickname=" + user.name
      })
  },

  visitUser(param){
      user.where({
        _openid: param.link
      }).get().then(res1 => {
        console.log("联系人User读取成功", res1.data)
        this.setData({
          linkInfo: this.data.linkInfo.concat(res1.data)
        });
      })
  },

  visitChatroom(param){
    const db = wx.cloud.database()
    var that = this;
    db.collection('chatroom')
      .orderBy('sendTimeTS', 'desc')
      .where({
        groupId: param.groupId
      })
      .get()
      .then(res2 => {
        console.log("最新记录读取成功", res2.data)
        if (res2.data.length!=0){
          if (res2.data[0].msgType != "image") {
            arr = arr.concat(res2.data[0].textContent)
          } else {
            arr = arr.concat("[图片]")
          }
          for (var index in this.data.linkInfo) {
            var ContentParam = "linkInfo[" + index + "].textContent"
            that.setData({
              [ContentParam]: arr[index] /*"内容"*/
            })
          }
          console.log("arr", arr)
          console.log("linkInfo", this.data.linkInfo)
        }
        
      })
      .catch(console.error)
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    message.where({
      my_openid: app.globalData.my_openid
    }).get().then(res => {
      console.log("message读取成功", res.data)
      for (var i = 0; i < res.data.length; i++) {
        this.visitUser(res.data[i]);
     /*   this.visitChatroom(res.data[i]);*/
      }
    })
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