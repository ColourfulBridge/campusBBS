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

  if (!event.isgood) {//
    await comments.where({
      _id: event.comment_id//
    }).update({
      data: {
        comment_goods: _.push(event.my_openid),//
        comment_goods_count: _.inc(1)
      }
    })
      .then(console.log)
      .catch(res => {
        console.log("评论点赞-comment出错");
        
      })
  } else {
    await comments.where({
      _id: event.comment_id
    }).update({
      data: {
        comment_goods: _.pull(event.my_openid),
        comment_goods_count: _.inc(-1)
      }
    })
      .then(console.log)
      .catch(res => {
        console.log("评论取消点赞-comment出错");
       
      })
  }
}