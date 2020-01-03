// pages/post/post.js
//在数据库中建User、Post、Comment、Collect集合
wx.cloud.init({
  env: 'citbbs-zrpck'
})
const DB = wx.cloud.database()
const posts = DB.collection('Post')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length: 0,
    content: '',
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

  },

  /**
   * 获取当前文本框输入长度
   */
  userInput: function(e) {
    this.setData({
      length: e.detail.value.length,
      content: e.detail.value,
    })
  },
  /**
   * 用户提交帖子
   */
  commitPost: function() {
    var that = this;
    if (that.data.length <= 0) {
      wx.showToast({
        image:"../../images/post_fail.ico",
        title: '提交失败',
      })
    } else {
      posts.add({
        // data 字段表示需新增的 JSON 数据
        data: {
          // _id: , // Post数据库自动分配，表示pid
          //openId
          post: that.data.content,
          good_counts: 0,
          comment_counts: 0,
          collect_counts: 0,
          post_date: new Date().toISOString(),
        },
        success: function(res) {
          console.log("发布成功", res)
        },
        fail: function(res) {
          console.log("发布失败", res)
        }
      })

      this.setData({
        content: "", 
        length:0,//此处修复了发送贴子之后仍显显示长度问题
      }),

        wx.showToast({
          title: '提交成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })

      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    }
    }
    
})