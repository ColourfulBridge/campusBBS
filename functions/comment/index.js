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

 
      //评论数自增1
     await posts.where({
        _id: event.post_id//
      }).update({
        data: {
          comment_counts: _.inc(1)
        }
      })
        .then(console.log)
        .catch(res => {
          console.log("评论-帖子出错");
        })

}