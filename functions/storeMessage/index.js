// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  message.where({
    groupId: this.data.groupId
  }).update({
    data: {
      msgType: 'text',
      textContent: e.detail.value,
      sendTime: util.formatTime(new Date()),
      sendTimeTS: Date.now(), // fallback
    },
    success: function (res) {
      console.log("message修改成功", res)
    },
    fail: function (res) {
      console.log("message修改失败", res)
    },
  })
}