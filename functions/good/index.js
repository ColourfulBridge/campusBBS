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
  console.log("进入云函数中");
  if (!event.isgood) {
    await users.where({
      _openid: event.my_openid
    }).update({
      data: {
        good: _.push(event.post_id)
      }
    })
      .then(console.log)
      .catch(res => {
        console.log("点赞-用户出错1");
      })

    await posts.where({
      _id: event.post_id
    }).update({
      data: {
        good_counts: _.inc(1)
      }
    })
      .then(console.log)
      .catch(res => {
        console.log("点赞-帖子出错1");
      })
  } else {
    await users.where({
      _openid: event.my_openid
    }).update({
      data: {
        good: _.pull(event.post_id) //从post数组中删除对应的post_id//
      }
    })
      .then(console.log)
      .catch(res => {
        console.log("点赞-用户出错2");
  
      })

    await posts.where({
      _id: event.post_id
    }).update({
      data: {
        good_counts: _.inc(-1)
      }
    })
      .then(console.log)
      .catch(res => {
        console.log("点赞-帖子出错2");
      
      })
  }
}