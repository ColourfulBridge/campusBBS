// favorite.js
const app = getApp()
const DB = wx.cloud.database()
const posts = DB.collection('Post')
const users = DB.collection("User")
const comments = DB.collection("Comment")
const _ = DB.command;
var isGoodSort = false; //是否按照点赞数对帖子排序
const formatTime = require('../../utils/util.js')

Page({
  data: {
    inputShowed: false,
    inputVal: "", //搜索框的内容
    feed: [], //存储数据库post表内调取内容
    page: 0, //当前调取表内记录编号
    floorstatus: false, //回到顶部按钮的显示状态
  },

  userInfo: function (e) {
    var user = e.currentTarget.dataset
    console.log("获得用户openid:" + user.openid)
    console.log("获得用户头像:" + user.head)
    console.log("获得用户昵称:" + user.nickname)

    wx.navigateTo({
      url: '/pages/userInfo/userInfo?openid=' + user.openid + "&head=" + user.head + "&nickname=" + user.nickname
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  //搜索框的"确定"按钮事件
  hideInput: function () {
    //在帖子表内进行模糊查询,关键字：标题
    let tempArr = [];
    var that = this;
    posts.where(
      _.or([{
        title: DB.RegExp({
          regexp: '.*' + this.data.inputVal,
          options: '1'
        }),
        _openid: app.globalData.my_openid, // 填入当前用户 openid
      },
      {
        post_name: DB.RegExp({
          regexp: '.*' + this.data.inputVal,
          options: '1'
        }),
        _openid: app.globalData.my_openid, // 填入当前用户 openid
      }
      ])).get().then(res => {
        console.log("模糊搜索结果:", res);
        tempArr = tempArr.concat(res.data);
        console.log("搜索结果：", tempArr);
        if (tempArr.length <= 0) {
          console.log('搜索为空！');
        } else { //数组中去除重复的
          let array = [];
          for (let temp = 0; temp < tempArr.length; temp++) {
            if (!array.includes(tempArr[temp])) { //includes 检测数组是否有某个值
              array.push(tempArr[temp]);
              tempArr[temp].post_date = formatTime.formatTime(tempArr[temp].post_date);
            }
          };
          that.setData({
            feed: array
          })
        }
      }).then(function () {
        let arr = that.data.feed.concat();
        users
          .where({
            _openid: app.globalData.my_openid, // 填入当前用户 openid
          })
          .get().then(res => {
            var url;
            for (let i = 0; i < arr.length; i++) {
              Object.assign(arr[i], {
                "isStore": res.data[0].collect.includes(arr[i]["_id"]),
                "isGood": res.data[0].good.includes(arr[i]["_id"]),
                "commentText": "", //评论输入框内容
                "commentFeed": [], //评论数组
              });
              that.updateFeed(); //刷新界面
            }
            console.log("点赞收藏情况添加hot_80", arr);
          }).catch(res => {
            console.log("加载-用户出错");
            wx.showToast({
              title: '网络出错o(TヘTo)',
              icon: 'none',
              duration: 2000
            })
          })

        var url;
        for (let i = 0; i < arr.length; i++) {
          comments.where({
            pid: arr[i]._id
          }).get().then(res => { //把comment数组中comment部分剥离出来放入feed的commentFeed中
            var newData = res.data.map(item => {
              const {
                comment,
                comment_date,
                comment_name,
                comment_headUrl,
                comment_goods_count
              } = item
              return {
                comment,
                comment_date,
                comment_name,
                comment_headUrl,
                comment_goods_count
              }
            })

            //在comment中加入点赞状态
            for (let j = 0; j < newData.length; j++) {
              Object.assign(newData[j], {
                "isGood": res.data[j].comment_goods.includes(app.globalData.my_openid)
                //每一条评论点赞数组里是否含有当前用户的id
              });
              newData[j].comment_date = formatTime.formatTime(newData[j].comment_date);
            }

            //渲染commentFeed
            var commentfeed = "feed[" + i + "].commentFeed";
            that.setData({
              [commentfeed]: newData
            })
          }).catch(res => {
            console.log("加载-评论出错");
            wx.showToast({
              title: '网络出错o(TヘTo)',
              icon: 'none',
              duration: 2000
            })
          })
        }
      })
  },

  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 评论输入框
   */
  inputComment: function (e) {
    var post_index = e.currentTarget.dataset.index;
    var post_id = e.currentTarget.dataset.id;
    var arr = this.data.feed.concat();
    arr[post_index].commentText = e.detail.value;
    this.setData({
      feed: arr
    })
  },

  /**
   * 帖子的代码折叠
   */
  showAll: function (e) {
    var post_index = e.currentTarget.dataset.index;
    var isFold = "feed[" + post_index + "].isFold";
    var isfold = this.data.feed[post_index].isFold;
    this.setData({
      [isFold]: !isfold
    })
  },

  /**
   * 帖子的代码折叠
   */
  cshowAll: function (e) {
    var post_index = e.currentTarget.dataset.index;
    var isShow = "feed[" + post_index + "].isShow";
    var isshow = this.data.feed[post_index].isShow;
    this.setData({
      [isShow]: !isshow
    })
  },

  /**
   * 帖子的代码折叠
   */
  showAll: function (e) {
    var post_index = e.currentTarget.dataset.index;
    var isFold = "feed[" + post_index + "].isFold";
    var isfold = this.data.feed[post_index].isFold;
    this.setData({
      [isFold]: !isfold
    })
  },

  /**
   * 帖子的代码折叠
   */
  cshowAll: function (e) {
    var post_index = e.currentTarget.dataset.index;
    var isShow = "feed[" + post_index + "].isShow";
    var isshow = this.data.feed[post_index].isShow;
    this.setData({
      [isShow]: !isshow
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    let array = [];
    console.log("放入hot全局的openid", app.globalData.my_openid);
    //从数据库读取记录加载到页面
    users
      .where({
        _openid: app.globalData.my_openid,
      }).get().then(res => {
        for (let i = 0; i < res.data[0]["collect"].length; i++) { //遍历收藏集合
          posts.where({
            _id: res.data[0]["collect"][i], // 填入收藏帖子编号
          }).get().then(result => {
            console.log("res", result.data.length);
            if (result.data.length != 0) {
              result.data[0].post_date = formatTime.formatTime(result.data[0].post_date);
              array.push(result.data[0]);
              that.setData({
                feed: array,
              });
            }
            else if (result.data.length == 0) { //解决删帖后用户的收藏记录的问题
              users.where({
                _openid: app.globalData.my_openid
              }).update({
                data: {
                  collect: _.pull(res.data[0]["collect"][i]) //从collect数组中删除对应的post_id
                }
              })
                .then(console.log("测试 删帖后修改collect数组出错成功！"))
                .catch(res => {
                  console.log("删帖后 修改collect数组出错");
                  wx.showToast({
                    title: '网络出错o(TヘTo)',
                    icon: 'none',
                    duration: 2000
                  })
                })
            }
          })
        }
      })
      .then(res => {
        console.log("812", array);
        that.setData({
          feed: array,
        });
        let arr = that.data.feed.concat();
        users
          .where({
            _openid: app.globalData.my_openid, // 填入当前用户 openid
          })
          .get().then(res => {
            var url;
            arr = that.data.feed.concat();
            for (let i = 0; i < arr.length; i++) {
              Object.assign(arr[i], {
                "isStore": res.data[0].collect.includes(arr[i]["_id"]),
                "isGood": res.data[0].good.includes(arr[i]["_id"]),
                "isFold": true, //帖子内容是否折叠
                "isShow": false, //评论内容是否展示
                "commentText": "", //评论输入框内容
                "commentFeed": [], //评论数组
              });
              console.log(arr[i]);
              this.updateFeed(); //刷新界面
            }
          }).catch(res => {
            console.log("加载-用户出错1");
            wx.showToast({
              title: '网络出错o(TヘTo)',
              icon: 'none',
              duration: 2000
            })
          })

        var url;
        for (let i = 0; i < arr.length; i++) {
          comments.where({
            pid: arr[i]._id
          }).get().then(res => {

            //把comment数组中comment部分剥离出来放入feed的commentFeed中
            var newData = res.data.map(item => {
              const {
                comment,
                comment_date,
                comment_name,
                comment_headUrl,
                comment_goods_count,
                _id
              } = item
              return {
                comment,
                comment_date,
                comment_name,
                comment_headUrl,
                comment_goods_count,
                _id
              }
            })

            //在comment中加入点赞状态
            for (let j = 0; j < newData.length; j++) {
              Object.assign(newData[j], {
                "isGood": res.data[j].comment_goods.includes(app.globalData.my_openid)
                //每一条评论点赞数组里是否含有当前用户的id
              });
              newData[j].comment_date = formatTime.formatTime(newData[j].comment_date);
            }

            //渲染commentFeed
            var commentfeed = "feed[" + i + "].commentFeed";
            this.setData({
              [commentfeed]: newData
            })
          }).catch(res => {
            console.log("加载-评论出错");
            wx.showToast({
              title: '网络出错o(TヘTo)',
              icon: 'none',
              duration: 2000
            })
          })
        }
      })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("触底了");
    let page = this.data.page + 20;
    console.log(page);
    posts.orderBy('post_date', 'desc').skip(page).get().then(res => {
      let new_data = res.data; //获取的新调取数据
      let old_data = this.data.feed; //获取原调取数据
      if (new_data) {
        users
          .where({
            _openid: app.globalData.my_openid, // 填入当前用户 openid
          })
          .get().then(res => {
            for (let i = 0; i < new_data.length; i++) {
              Object.assign(new_data[i], {
                "isGood": res.data[0].good.includes(new_data[i]["_id"]),
                "isStore": res.data[0].collect.includes(new_data[i]["_id"]),
                "isFold": true, //帖子内容是否折叠
                "isShow": false, //评论内容是否展示
                "commentText": "",
                "commentFeed": [], //评论数组
              });
            }
          }).catch(res => {
            console.log("上拉触底");

          })

        var url;
        for (let i = 0; i < new_data.length; i++) {
          comments.where({
            pid: new_data[i]._id
          }).get().then(res => {

            //把comment数组中comment部分剥离出来放入feed的commentFeed中
            var newData = res.data.map(item => {
              const {
                comment,
                comment_date,
                comment_name,
                comment_headUrl,
                comment_goods_count,
                _id
              } = item
              return {
                comment,
                comment_date,
                comment_name,
                comment_headUrl,
                comment_goods_count,
                _id
              }
            })

            //在comment中加入点赞状态
            for (var j = 0; j < newData.length; j++) {
              Object.assign(newData[i], {
                "isGood": res.data[j].comment_goods.includes(app.globalData.my_openid),
                //每一条评论点赞数组里是否含有当前用户的id
              });
              newData[j].comment_date = formatTime.formatTime(newData[j].comment_date);
            }


            var oldData = old_data[i].commentFeed;
            var allData = oldData.concat(newData);

            //渲染commentFeed
            var commentfeed = "feed[" + i + "].commentFeed";
            this.setData({
              [commentfeed]: allData,
              page: page //修改当前调取表内记录编号
            })
          })
            .catch(res => {
              console.log("上拉触底-评论出错");

            })
        }
      }
    })
  },

  /**
   * 用户下拉刷新事件的处理函数
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: 'w(ﾟДﾟ)w冲鸭',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    this.updatePage();
  },

  /**返回页面时刷新 */
  onShow: function () {
    this.updatePage();
  },

  /**
   * 点赞
   */
  goodComment: function (e) {
    var post_index = e.currentTarget.dataset.index;
    var post_id = e.currentTarget.dataset.id;
    var isGood = "feed[" + post_index + "].isGood";
    var good_counts = "feed[" + post_index + "].good_counts";

    var isgood = this.data.feed[post_index].isGood;
    var count = this.data.feed[post_index].good_counts;
    this.setData({
      [isGood]: !isgood
    })
    isgood ? this.setData({
      [good_counts]: count - 1
    }) : this.setData({
      [good_counts]: count + 1
    });
    wx.cloud.callFunction({
      name: 'good',
      data: {
        my_openid: app.globalData.my_openid,
        isgood: isgood,
        post_id: post_id,
      },
      success: function (res) {
        console.log(res)
      },
      fail: console.error
    })

    // if (!isgood) {
    //   users.where({
    //     _openid: app.globalData.my_openid
    //   }).update({
    //     data: {
    //       good: _.push(post_id)
    //     }
    //   })
    //     .then(console.log)
    //     .catch(res => {
    //       console.log("点赞-用户出错1");
    //       wx.showToast({
    //         title: '网络出错o(TヘTo)',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     })

    //   posts.where({
    //     _id: post_id
    //   }).update({
    //     data: {
    //       good_counts: _.inc(1)
    //     }
    //   })
    //     .then(console.log)
    //     .catch(res => {
    //       console.log("点赞-帖子出错1");
    //       wx.showToast({
    //         title: '网络出错o(TヘTo)',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     })
    // } else {
    //   users.where({
    //     _openid: app.globalData.my_openid
    //   }).update({
    //     data: {
    //       good: _.pull(post_id) //从post数组中删除对应的post_id
    //     }
    //   })
    //     .then(console.log)
    //     .catch(res => {
    //       console.log("点赞-用户出错2");
    //       wx.showToast({
    //         title: '网络出错o(TヘTo)',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     })

    //   posts.where({
    //     _id: post_id
    //   }).update({
    //     data: {
    //       good_counts: _.inc(-1)
    //     }
    //   })
    //     .then(console.log)
    //     .catch(res => {
    //       console.log("点赞-帖子出错2");
    //       wx.showToast({
    //         title: '网络出错o(TヘTo)',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     })
    // }
  },
  /**
   * 为评论点赞
   */
  cGoodComment: function (e) {
    var post_index = e.currentTarget.dataset.index;
    var post_id = e.currentTarget.dataset.id;
    var comment_index = e.currentTarget.dataset.cindex;
    var comment_id = e.currentTarget.dataset.cid;

    var isGood = "feed[" + post_index + "].commentFeed[" + comment_index + "].isGood";
    var good_counts = "feed[" + post_index + "].commentFeed[" + comment_index + "].comment_goods_count";
    var isgood = this.data.feed[post_index].commentFeed[comment_index].isGood;
    var count = this.data.feed[post_index].commentFeed[comment_index].comment_goods_count;

    this.setData({
      [isGood]: !isgood
    })

    isgood ? this.setData({
      [good_counts]: count - 1
    }) : this.setData({
      [good_counts]: count + 1
    });
    wx.cloud.callFunction({
      name: 'goodcomment',
      data: {
        my_openid: app.globalData.my_openid,
        isgood: isgood,
        comment_id: comment_id,
      },
      success: function (res) {
        console.log(res)
      },
      fail: console.error
    })
    // if (!isgood) {
    //   comments.where({
    //     _id: comment_id
    //   }).update({
    //     data: {
    //       comment_goods: _.push(app.globalData.my_openid),
    //       comment_goods_count: _.inc(1)
    //     }
    //   })
    //     .then(console.log)
    //     .catch(res => {
    //       console.log("评论点赞-comment出错");
    //       wx.showToast({
    //         title: '网络出错o(TヘTo)',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     })
    // } else {
    //   comments.where({
    //     _id: comment_id
    //   }).update({
    //     data: {
    //       comment_goods: _.pull(app.globalData.my_openid),
    //       comment_goods_count: _.inc(-1)
    //     }
    //   })
    //     .then(console.log)
    //     .catch(res => {
    //       console.log("评论取消点赞-comment出错");
    //       wx.showToast({
    //         title: '网络出错o(TヘTo)',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     })
    // }
  },

  /**
   * 收藏
   */
  store: function (e) {
    console.log("收藏");
    var post_index = e.currentTarget.dataset.index;
    var post_id = e.currentTarget.dataset.id;
    var isStore = "feed[" + post_index + "].isStore";
    var collect_counts = "feed[" + post_index + "].collect_counts";

    var isstore = this.data.feed[post_index].isStore;
    var count = this.data.feed[post_index].collect_counts;

    this.setData({
      [isStore]: !isstore
    })

    isstore ? this.setData({
      [collect_counts]: count - 1
    }) : this.setData({
      [collect_counts]: count + 1
    });
    wx.cloud.callFunction({
      name: 'store',
      data: {
        my_openid: app.globalData.my_openid,
        isstore: isstore,
        post_id: post_id,
      },
      success: function (res) {
        console.log(res)
      },
      fail: console.error
    })

    // if (!isstore) {
    //   users.where({
    //     _openid: app.globalData.my_openid
    //   }).update({
    //     data: {
    //       collect: _.push(post_id)
    //     }
    //   })
    //     .then(console.log)
    //     .catch(res => {
    //       console.log("收藏-用户出错1");
    //       wx.showToast({
    //         title: '网络出错o(TヘTo)',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     })

    //   posts.where({
    //     _id: post_id
    //   }).update({
    //     data: {
    //       collect_counts: _.inc(1)
    //     }
    //   })
    //     .then(console.log)
    //     .catch(res => {
    //       console.log("收藏-帖子出错1");
    //       wx.showToast({
    //         title: '网络出错o(TヘTo)',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     })

    // } else {
    //   users.where({
    //     _openid: app.globalData.my_openid
    //   }).update({
    //     data: {
    //       collect: _.pull(post_id) //从collect数组中删除对应的post_id
    //     }
    //   })
    //     .then(console.log)
    //     .catch(res => {
    //       console.log("收藏-用户出错2");
    //       wx.showToast({
    //         title: '网络出错o(TヘTo)',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     })

    //   posts.where({
    //     _id: post_id
    //   }).update({
    //     data: {
    //       collect_counts: _.inc(-1)
    //     }
    //   })
    //     .then(console.log)
    //     .catch(res => {
    //       console.log("收藏-帖子出错2");
    //       wx.showToast({
    //         title: '网络出错o(TヘTo)',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     })

    // }
  },


  /**
   * 提交评论
   */
  commitComment: function (e) {
    var post_index = e.currentTarget.dataset.index;
    var post_id = e.currentTarget.dataset.id;
    var commenttext = this.data.feed[post_index].commentText;
    var date = new Date().toISOString();
    var comment_date = formatTime.formatTime(date);
    if (commenttext == "") {
      wx.showToast({
        image: '/images/shibai.png',
        title: '评论失败',
      })
    } else {
      var commentFeed = "feed[" + post_index + "].commentFeed";
      var commentText = "feed[" + post_index + "].commentText";
      var comment_counts = "feed[" + post_index + "].comment_counts";
      this.data.feed[post_index].commentFeed.push({
        "comment": commenttext, //评论内容
        "comment_date": comment_date, //评论时间
        "comment_name": app.globalData.my_name, //评论用户名
        "comment_headUrl": app.globalData.my_headUrl, //评论用户头像
        "comment_goods_count": 0, //点赞人数
        "isGood": false //当前用户的点赞状态
      }); //放入新的一项评论

      this.setData({
        [commentFeed]: this.data.feed[post_index].commentFeed,
        [commentText]: "",
        [comment_counts]: this.data.feed[post_index].comment_counts + 1
      })

      comments.add({
        data: {
          pid: post_id, //帖子id
          comment: commenttext, //评论内容
          comment_date: new Date().toISOString(), //评论时间
          comment_name: app.globalData.my_name, //发帖人昵称
          comment_headUrl: app.globalData.my_headUrl, //发帖人的头像地址
          comment_goods: [], //给评论点赞用户id
          comment_goods_count: 0, //评论点赞数
        }
      })
        .then(res => {
          console.log(res)
          //评论成功提示
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })

          //评论数自增1
          posts.where({
            _id: post_id
          }).update({
            data: {
              comment_counts: _.inc(1)
            }
          })
            .then(console.log)
            .catch(res => {
              console.log("评论-帖子出错");
              wx.showToast({
                title: '网络出错o(TヘTo)',
                icon: 'none',
                duration: 2000
              })
            })
        })
        .catch(res => {
          console.log("评论-add出错");
          wx.showToast({
            title: '网络出错o(TヘTo)',
            icon: 'none',
            duration: 2000
          })
        })
    }
  },


  /**
   * 刷新数据
   */
  updateFeed: function () {
    var arr = this.data.feed;
    this.setData({
      feed: arr,
    })
  },

  /**
   * 更新界面
   */
  updatePage() {
    var that = this;
    let array = [];
    console.log("放入hot全局的openid", app.globalData.my_openid);
    //从数据库读取记录加载到页面
    users
      .where({
        _openid: app.globalData.my_openid,
      }).get().then(res => {
        for (let i = 0; i < res.data[0]["collect"].length; i++) { //遍历收藏集合
          posts.where({
            _id: res.data[0]["collect"][i], // 填入收藏帖子编号
          }).get().then(result => {
            console.log("res", result.data.length);
            if (result.data.length != 0) {
              result.data[0].post_date = formatTime.formatTime(result.data[0].post_date);
              array.push(result.data[0]);
              that.setData({
                feed: array,
              });
            }
            else if (result.data.length == 0){ //解决删帖后用户的收藏记录的问题
              users.where({
                _openid: app.globalData.my_openid
              }).update({
                data: {
                  collect: _.pull(res.data[0]["collect"][i]) //从collect数组中删除对应的post_id
                }
              })
                .then(console.log("测试 删帖后修改collect数组出错成功！"))
                .catch(res => {
                  console.log("删帖后 修改collect数组出错");
                  wx.showToast({
                    title: '网络出错o(TヘTo)',
                    icon: 'none',
                    duration: 2000
                  })
                })
            }
          })
        }
      })
      .then(res => {
        console.log("812", array);
        that.setData({
          feed: array,
        });
        let arr = that.data.feed.concat();
        users
          .where({
            _openid: app.globalData.my_openid, // 填入当前用户 openid
          })
          .get().then(res => {
            var url;
            arr = that.data.feed.concat();
            for (let i = 0; i < arr.length; i++) {
              Object.assign(arr[i], {
                "isStore": res.data[0].collect.includes(arr[i]["_id"]),
                "isGood": res.data[0].good.includes(arr[i]["_id"]),
                "isFold": true, //帖子内容是否折叠
                "isShow": false, //评论内容是否展示
                "commentText": "", //评论输入框内容
                "commentFeed": [], //评论数组
              });
              console.log(arr[i]);
              this.updateFeed(); //刷新界面
            }
          }).catch(res => {
            console.log("加载-用户出错1");
            wx.showToast({
              title: '网络出错o(TヘTo)',
              icon: 'none',
              duration: 2000
            })
          })

        var url;
        for (let i = 0; i < arr.length; i++) {
          comments.where({
            pid: arr[i]._id
          }).get().then(res => {

            //把comment数组中comment部分剥离出来放入feed的commentFeed中
            var newData = res.data.map(item => {
              const {
                comment,
                comment_date,
                comment_name,
                comment_headUrl,
                comment_goods_count,
                _id
              } = item
              return {
                comment,
                comment_date,
                comment_name,
                comment_headUrl,
                comment_goods_count,
                _id
              }
            })

            //在comment中加入点赞状态
            for (let j = 0; j < newData.length; j++) {
              Object.assign(newData[j], {
                "isGood": res.data[j].comment_goods.includes(app.globalData.my_openid)
                //每一条评论点赞数组里是否含有当前用户的id
              });
              newData[j].comment_date = formatTime.formatTime(newData[j].comment_date);
            }

            //渲染commentFeed
            var commentfeed = "feed[" + i + "].commentFeed";
            this.setData({
              [commentfeed]: newData
            })
          }).catch(res => {
            console.log("加载-评论出错");
            wx.showToast({
              title: '网络出错o(TヘTo)',
              icon: 'none',
              duration: 2000
            })
          })
        }
      })

  },

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    console.log(e)
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  // 按点赞数对当前页面进行排序
  goodSort: function (e) {
    if (!isGoodSort) {
      this.setData({
        feed: this.data.feed.sort(function (a, b) {
          return b.good_counts - a.good_counts;
        })
      })
      isGoodSort = !isGoodSort;
    } else {
      this.setData({
        feed: this.data.feed.sort(function (a, b) {
          if (a.post_date < b.post_date)
            return 1;
          else if (a.post_date == b.post_date) {
            return 0;
          } else {
            return -1;
          }
        })
      })
      isGoodSort = !isGoodSort;
    }
  }
})