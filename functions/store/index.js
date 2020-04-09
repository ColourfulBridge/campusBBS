// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const posts = DB.collection('Post')
  const users = DB.collection("User")
  const comments = DB.collection("Comment")
  const _ = DB.command;
  if (!event.isstore) {
    await users.where({
      _openid: event.my_openid
    }).update({
      data: {
        collect: _.push(event.post_id)
      }
    })
      .then(console.log)
      .catch(res => {
        console.log("收藏-用户出错1");
        wx.showToast({
          title: '网络出错o(TヘTo)',
          icon: 'none',
          duration: 2000
        })
      })

    await posts.where({
      _id: event.post_id
    }).update({
      data: {
        collect_counts: _.inc(1)
      }
    })
      .then(console.log)
      .catch(res => {
        console.log("收藏-帖子出错1");
        wx.showToast({
          title: '网络出错o(TヘTo)',
          icon: 'none',
          duration: 2000
        })
      })

  } else {
    await users.where({
      _openid: event.my_openid
    }).update({
      data: {
        collect: _.pull(event.post_id) //从collect数组中删除对应的post_id
      }
    })
      .then(console.log)
      .catch(res => {
        console.log("收藏-用户出错2");
        wx.showToast({
          title: '网络出错o(TヘTo)',
          icon: 'none',
          duration: 2000
        })
      })

    await posts.where({
      _id: event.post_id
    }).update({
      data: {
        collect_counts: _.inc(-1)
      }
    })
      .then(console.log)
      .catch(res => {
        console.log("收藏-帖子出错2");
        wx.showToast({
          title: '网络出错o(TヘTo)',
          icon: 'none',
          duration: 2000
        })
      })

  }
}