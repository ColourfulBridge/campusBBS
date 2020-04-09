const cloud = require('wx-server-sdk')
//环境变量 ID
cloud.init({
  env: 'zhangqi-hbcxk'
})
cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Message').where({
      groupId: event.groupId
    }).update({
      data: {
        msgType: event.msgType,
        textContent: event.textContent,
        sendTime: event.sendTime,
        sendTimeTS: event.sendTimeTS, // fallback
      }
    })
  } catch (e) {
    console.error(e)
  }
}
