const DB = wx.cloud.database().collection("list")
let name = ""
let age = ""
let id = ""


Page({
    addData(){
      DB.add({
        data:{
          // name:"Clay_Guo",
          // age: 22
          name: name,
          age: age
        },
        success(res){
          console.log("添加成功" + res)
        },
        fail(res){
          console.log("添加失败" + res)
        }
      })
    },
    getData(){
      DB.get({
        success(res){
          console.log("查询数据成功",res)
        },
        fail(res){
          console.log("查询数据失败",res)
        }
      })
    },
    inputName(event){
      name = event.detail.value
    },
    inputAge(event){
      age = event.detail.value
    },
    delinput(event){
      console.log("要删除的id",event.detail.value)
      id = event.detail.value
    },
    delData(){
      DB.doc(id).remove({
        success(res){
          console.log("删除成功",res)
        },
        fail(res){
          console.log("删除失败",res)
        }
      })
    }
})
