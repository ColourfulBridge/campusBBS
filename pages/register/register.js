// pages/register/register.js
const app = getApp()
const DB = wx.cloud.database()
const users = DB.collection("User")
const hide = DB.collection("Hide")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: '',
    passwordBefore: '',
    passwordAfter: '',
  },

  numberInput: function(e) {
    this.setData({
      number: e.detail.value
    })
  },

  passwordBeforeInput: function(e) {
    this.setData({
      passwordBefore: e.detail.value
    })
  },
  passwordAfterInput: function(e) {
    this.setData({
      passwordAfter: e.detail.value
    })
  },

  registerInfo: function() {
    if (this.data.passwordAfter === this.data.passwordBefore) {} else {
      wx.showToast({
        title: '确认密码有误',
        image: '/images/shibai.png',
        duration: 2000
      })
      return;
    }

    users.where({
        _openid: app.globalData.my_openid
      }).get()
      .then(res => {
        //已存在账号
        if (res.data.length > 0) {
          wx.showToast({
            title: '一个微信账号仅能注册一次，您已注册',
            icon: 'none',
            duration: 2000
          })
        } else { //新创建账号

          //提示注册成功
          wx.showToast({
            title: '注册成功(๑•̀ㅂ•́)و✧',
            icon: 'success',
            duration: 2000
          })

          //返回登录页面
          wx.navigateBack({
            url: '/pages/login/login'
          })

          //向user表中添加新注册用户的信息
          users.add({
            data: {
              name: app.globalData.my_name, //昵称
              avatarUrl: app.globalData.my_headUrl, //头像地址
              number: this.data.number, //账号（学号）
              pwd: this.data.passwordBefore, //密码
              academy: '', //学院
              major: '', //专业
              state: 0, //登录状态
              collect: [], //收藏帖子数组
              good: [], //点赞帖子数组
              sex:'',//性别
            },
          }).catch(res => {
            console.log("注册-user-add出错");
            wx.showToast({
              title: '网络出错o(TヘTo)',
              icon: 'none',
              duration: 2000
            })
          })
          //向hide表中添加新注册用户的信息
          hide.add({
            data: {
              name: 'true', //昵称
              number: 'true', //账号（学号）
              academy: 'true', //学院
              major: 'true', //专业
              sex: 'true',//性别
            },
          }).catch(res => {
            console.log("添加hide出错");
          })
        }
      }).catch(res => {
        console.log("注册出错");
        wx.showToast({
          title: '网络出错o(TヘTo)',
          icon: 'none',
          duration: 2000
        })
      })
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
    if (this.data.number == '' || this.data.passwordBefore == '' || this.data.passwordAfter == '') {
      this.setData({
        disabled: true
      });
    } else {
      this.setData({
        disabled: false
      });
    }
  },
})