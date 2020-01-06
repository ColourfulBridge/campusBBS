// pages/myInfo/myInfo.js
const DB = wx.cloud.database().collection("User")
let uid = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"未设置",
    num:"未设置",
    academy:"未设置",
    major:"未设置",
    tel: "未设置",
    authState:"未认证"
  },
  getOpenId(){
    wx.cloud.callFunction({
      uid:"getOpenId",
      success(res){
        console.log("OpenID获取成功",res)
      },
      fail(res){
        console.log("OpenID获取失败",res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.navigateTo({
      url: 'pages/modify/modify'
    })
    
    //获取当前用户的openID
    this.getPageId()


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

  },
})