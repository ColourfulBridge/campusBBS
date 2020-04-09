const cloud = require('wx-server-sdk')
const db = cloud.database()
const _ = db.command
cloud.init({
  env: 'zhangqi-hbcxk'
})


exports.main = async (event, context) => {
  try {
    return await db.collection('Message').where({
      groupId: event.groupId
    }).remove()
  } catch (e) {
    console.error(e)
  }
}