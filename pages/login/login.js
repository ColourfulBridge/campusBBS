//登录页面
const app = getApp()
const DB = wx.cloud.database()
const users = DB.collection("User")
const _ = DB.command;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    no: '',//账号
    pwd: '',//密码
    noinput: false,
    pwdinput: false,
  },

  // 账号
  noinput: function (e) {
    this.setData({ no: e.detail.value });
    this.setData({ noinput: true });
    if (this.data.noinput == true && this.data.pwdinput == true) {
      this.setData({ disabled: false });
    }
  },

  //密码
  pwdinput: function (e) {
    this.setData({ pwd: e.detail.value });
    this.setData({ pwdinput: true });
    if (this.data.noinput == true && this.data.pwdinput == true) {
      this.setData({ disabled: false });
    }
  },

  //登录按钮
  bindLogin: function () {
    if(this.data.no.length!=8)
    {
      wx.showToast({
        title: '学号长度无效',
      })
      return;
    }
    wx.showLoading({
      title: '登录中...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)

    this.setData({ disabled: true });
    console.log("app.globalData.my_openid",app.globalData.my_openid);
    //校验登录
    users
      .where({
        _openid: app.globalData.my_openid, 
      })
      .get().then(res => {
        if (res.data.length <= 0) {
          //未注册提示
          wx.showToast({
            title: 'Σ( ° △ °|||)︴还没注册',
            icon: 'none',
            duration: 2000
          })
        } else {
          if (res.data[0].number===this.data.no&&res.data[0].pwd===this.data.pwd) {
            //登录成功
            //修改登录状态
            wx.showToast({
              title: '登录成功(๑•̀ㅂ•́)و✧',
              icon: 'success',
              duration: 2000
            })

            //跳转到tabBar主页面 
            wx.switchTab({
              url: '/pages/hot/hot'
            }) 
          }
          else{
            //登录失败
            wx.showToast({
              title: '登录失败╥﹏╥',
              image: '/images/shibai.png',
              duration: 2000
            })
          }
        }
      }).catch(res => {
        wx.showToast({
          title: '网络出错o(TヘTo)',
          icon: 'none',
          duration: 2000
        })
      })
    
  },

  //注册跳转
  bindModify: function () {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.data.no == '' || this.data.pwd == '') {
      this.setData({ disabled: true });
    } else {
      this.setData({ disabled: false });
    }
    this.getOpenid();
    
    //获取用户的微信昵称和头像地址
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        getApp().globalData.my_name = res.userInfo.nickName;
        getApp().globalData.my_headUrl = res.userInfo.avatarUrl;
      }
    })
  },

  getOpenid(){
    let that=this;
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        console.log('云函数获取到的openid',res.result.openid);
        getApp().globalData.my_openid = res.result.openid;
      }
    })

  },

  //处理游客登录
  vister_handle:function(){
    //将登录状态变为未登录
    app.globalData.my_login_state=false;
    if (app.globalData.my_login_state == false)
    {
      //跳转到tabBar主页面
      wx.switchTab({
        url: '/pages/hot/hot'
      })
    }
  },
})
