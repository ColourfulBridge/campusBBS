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

  await comments.add({
    data: {
      pid: event.post_id, //帖子id
      comment: event.commenttext, //评论内容
      comment_date: event.date, //评论时间
      comment_name: event.my_name, //发帖人昵称
      comment_headUrl: event.my_headUrl, //发帖人的头像地址
      comment_goods: [], //给评论点赞用户id
      comment_goods_count: 0, //评论点赞数
    }
  })
    .then(res => {
      console.log(res)

      //评论数自增1
      posts.where({
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
    })
    .catch(res => {
      console.log("评论-add出错");
    })
}