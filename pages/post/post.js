// pages/post/post.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length:0,
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

  },

/**
 * 获取当前文本框输入长度
 */
  userInput:function(e)
  {
    this.setData({
      length: e.detail.value.length
    })
  },
/**
 * 用户提交帖子
 */
  commitPost: function(){
    var that=this;
    if(that.data.length <= 0)
    {
      wx.showToast({
        title: '提交失败',
      })
    }
    else{
      //提交到数据库
      wx.showToast({
        title: '提交成功',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
    }
    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  }
})