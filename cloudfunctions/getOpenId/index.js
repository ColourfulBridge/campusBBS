// 云函数入口文件
const cloud = require('wx-server-sdk') 
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('Message').where({
      my_openid: app.globalData.my_openid
    }).remove()
  } catch (e) {
    console.error(e)
  }
}