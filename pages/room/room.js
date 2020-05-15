const app = getApp()
const DB = wx.cloud.database()
const message = DB.collection("Message")

Page({
  data: {
    avatarUrl: '/images/user-unlogin.png',
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
    // chatRoomEnvId: 'release-f8415a',//改成自己云开发的id 
    chatRoomCollection: 'chatroom',//数据库集合 
    chatRoomLink: 'Message',
    chatRoomGroupId: '',//唯一定义聊天组，可以建立群，或者好友聊天 
    chatRoomGroupName: '',//聊天的群名，或者好友的昵称 
    chatRoomOpenId: '',//对方的openid
    chatRoomHead:'',//对方的头像
    // functions for used in chatroom components 
    onGetUserInfo: null,
    getOpenID: null,
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.nickname
    })
    this.setData({
      onGetUserInfo: this.onGetUserInfo,
      getOpenID: this.getOpenID,
      chatRoomGroupName: options.nickname,
      chatRoomOpenId: options.openid,
      chatRoomHead: options.head,
    })
    if (options.openid.localeCompare(app.globalData.my_openid) <= 0) {
      this.setData({
        chatRoomGroupId: options.openid + app.globalData.my_openid,
      })
    } else {
      this.setData({
        chatRoomGroupId: app.globalData.my_openid + options.openid,
      })
    }

    // 获取用户信息 
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框 
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    wx.getSystemInfo({
      success: res => {
        console.log('system info', res)
        if (res.safeArea) {
          const { top, bottom } = res.safeArea
          this.setData({
            containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
          })
        }
      },
    })
  },

  getOpenID: async function () {
    if (this.openid) {
      return this.openid
    }
    const { result } = await wx.cloud.callFunction({
      name: 'getOpenId',
    })
    return result.openid
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onShareAppMessage() {
    return {
      title: '私信',
      path: '/pages/room/room',
    }
  },
}) 