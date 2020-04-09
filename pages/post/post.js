// pages/post/post.js
//在数据库中建User、Post、Comment集合
const DB = wx.cloud.database();
const posts = DB.collection('Post');
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    length_content: 0,
    content: '',
    length_title: 0,
    title: '',
    images: [],
    files: [],
    kind: '论坛',
    items: [
      { name: '论坛', value: '论坛', checked: 'true' },
      { name: '求助', value: '求助' },
      { name: '拼单', value: '拼单' },
      { name: '二手转卖', value: '二手转卖' },
      { name: '公示墙', value: '公示墙' },
    ]
  }, //sc修改了items.name,radioChange中e.detail.value：lunTan => 论坛
  
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          images: res.tempFilePaths
        });
        that.data.images = [];
        console.log("res.tempFilePaths", res.tempFilePaths);
        for (var i in res.tempFilePaths) {
          // 将图片上传至云存储空间
          wx.cloud.uploadFile({
            // 指定要上传的文件的小程序临时文件路径
            cloudPath: `${app.globalData.my_openid}/${Math.random()}_${Date.now()}.${res.tempFilePaths[i].match(/\.(\w+)$/)[1]}`,
            filePath: res.tempFilePaths[i],
            // 成功回调
            success: res => {
              that.data.images.push(res.fileID);
              console.log(that.data.images); //image's cloudPath
            },
          })
        }
      }
    })
  },

  /**
   * 删除图片
   */
  removeImg: function(event) {
    var position = event.currentTarget.dataset.index;
    this.data.images.splice(position, 1);
    // 渲染图片
    this.setData({
      images: this.data.images,
    })
  },

  // 预览图片
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      //当前预览的图片 
      current: this.data.images[index],
      //所有要预览的图片
      urls: this.data.images
    })
  },

  /**
   * 获取帖子内容文本框输入长度
   */
  contentInput: function(e) {
    this.setData({
      length_content: e.detail.value.length,
      content: e.detail.value,
    })
  },
  /**
   * 获取标题文本框输入长度
   */
  titleInput: function(e) {
    this.setData({
      length_title: e.detail.value.length,
      title: e.detail.value,
    })
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e);
    this.setData({
      kind: e.detail.value
    });
  },
  /**
   * 用户提交帖子
   */
  commitPost: function() {
    if(app.globalData.my_login_state==false)
    {
      wx.showToast({
        title: '请先完成登录',
        image: '/images/tishi.png',
      })
      return;
    }
    console.log("kind为", this.data.kind);
    var that = this;
    console.log("images",that.data.images);
    if (that.data.length_content <= 0) {
      wx.showToast({
        image: "/images/post_fail.ico",
        title: '帖子不得为空',
      })
    } else if (that.data.length_title <= 0) {
      wx.showToast({
        image: "/images/post_fail.ico",
        title: '标题不得为空',
      })
    } else if (that.data.length_content > 300 || that.data.length_title > 20) {
      wx.showToast({
        image: "/images/post_fail.ico",
        title: '超出字数限制',
      })
    } else {
      posts.add({
        // data 字段表示需新增的 JSON 数据
        data: {
          // _id: , // Post数据库自动分配，表示pid
          //openId
          post: that.data.content,
          title: that.data.title,
          images: that.data.images,
          kind: that.data.kind,
          good_counts: 0,
          comment_counts: 0,
          collect_counts: 0,
          post_date: new Date().toISOString(),
          post_name: app.globalData.my_name,
          post_headUrl: app.globalData.my_headUrl,
        },
        success: function(res) {
          console.log("发布成功", res);
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 1000,
            mask: true
          });
          //清空数据
          that.data.content = '';
          that.data.images = [];
          that.data.title = '';
          that.data.kind = '论坛';
          that.data.length_content = 0;
          that.data.length_title = 0;

          that.setData({
            content: '',
            title: '',
            images: [],
            length_content: 0,
            length_title: 0
          })
        },
        fail: function(res) {
          console.log("发布失败", res);
          wx.showToast({
            image: "/images/post_fail.ico",
            title: '发布失败',
          })
        }
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
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

  },
})