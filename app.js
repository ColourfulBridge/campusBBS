//app.js

App({
  globalData: {
    my_openid: '', //用户的openid,设为全局变量
    my_name:'',//用户的昵称
    my_headUrl:'',//用户的头像地址
    my_login_state:true,//用户的登录状态
  },
  onLaunch: function () {
    wx.cloud.init({
      env: 'zhangqi-hbcxk',
      traceUser:true
    })
    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs')
    // //logs.unshift(Date.now())  //报错：logs.unshift is not a function;at App lifeCycleMethod onLaunch function
    // wx.setStorageSync('logs', logs)
    // const DB = wx.cloud.database()
    // const users = DB.collection('User')

    // wx.cloud.callFunction({
    //   name: 'getOpenId',
    //   complete: res => {
    //     // this.globalData.my_openid = res.result.openid;
    //     console.log("openid", this.globalData.my_openid);
    //     users.where({
    //         _openid: this.globalData.my_openid
    //       }).get()
    //       .then(res => {
    //         console.log("res", res);
    //         console.log("length:", res.data.length);
    //         if (res.data.length <= 0) {
    //           users.add({
    //             data: {
    //               // _id: , // User数据库自动分配，表示uid
    //               //openId
    //               nickName: '',
    //               avatarUrl: '../../images/touxiang_off.png',
    //               tel: null,
    //               name: '',
    //               number: null,
    //               academy: '',
    //               major: '',
    //               state: 0,
    //               collect: [],
    //               good: []
    //             },
    //             success: function(res) {
    //               console.log("是初次登录，用户注册成功", res)
    //             },
    //             fail: function(res) {
    //               console.log("是初次登录，用户注册失败", res)
    //             }
    //           })
    //         } else {
    //           //直接进入浏览页面
    //           console.log("不是初次登录")
    //         }
    //       })
    //   }
    // })
  }
})

