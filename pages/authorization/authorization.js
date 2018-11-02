const app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    this.getPermissions()
  },

  bindGetUserInfo: function(e) {
    // console.log(111)
    console.log(e.detail.userInfo)

    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      this.getPermissions()
    } else {
      //用户按了拒绝按钮
      this.Toauthorize()
    }


  },

  //点击允许授权按钮
  getPermissions: function() {
    // 查看是否授权
    var that = this,
      data = {};
    wx.login({
      success: function(code) {
        wx.getSetting({
          success: function(res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res_user) {
                  // console.log(111)
                  console.log(res_user)
                  wx.request({
                    //后台接口地址
                    url: app.globalData.publicUrl + '/auth',
                    data: {
                      code: code.code
                    },
                    dataType: 'json',
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function(res) {
                      app.globalData.userInfo = res_user.userInfo;

                      wx.setStorageSync('openId', res.data.data.openid);
                      wx.setStorageSync('session_key', res.data.data.session_key);
                      wx.setStorageSync('avatarUrl', res_user.userInfo.avatarUrl);
                      data.nickName = res_user.userInfo.nickName;
                      data.avatarUrl = res_user.userInfo.avatarUrl;
                      data.gender = res_user.userInfo.gender;
                      data.city = res_user.userInfo.city;
                      data.province = res_user.userInfo.province;
                      data.country = res_user.userInfo.country;
                      data.language = res_user.userInfo.language;
                      data.openid = res.data.data.openid;
                      data.session_key = res.data.data.session_key;
                      // wx.showLoading({
                      //   title: '加载中',
                      // })
                      that.saveUser(data);
                    },
                    fail: function(res) {
                      console.log(res)
                    }
                  })
                },
                fail: function() {

                }
              })
            }
          }
        })
      }
    })
  },


  //点击拒绝授权按钮
  Toauthorize: function() {
    var that = this,
      data = {};

    wx.hideLoading()
    wx.showModal({
      title: '警告通知',
      content: '您点击了拒绝授权,将无法进入小程序,点击确定重新获取授权。',
      showCancel: false,
      success: function(res) {
        var codes = res.code;
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting["scope.userInfo"]) { ////如果用户重新同意了授权登录
                wx.login({
                  success: function(res_login) {
                    if (res_login.code) {
                      wx.getUserInfo({
                        withCredentials: true,
                        success: function(res_user) {
                          wx.request({
                            url: app.globalData.publicUrl + '/auth',
                            data: {
                              code: res_login.code
                            },
                            method: 'POST',
                            header: {
                              'content-type': 'application/x-www-form-urlencoded'
                            },
                            success: function(res) {
                              app.globalData.userInfo = res_user.userInfo;


                              wx.setStorageSync('openId', res.data.data.openid);
                              wx.setStorageSync('session_key', res.data.data.session_key);
                              wx.setStorageSync('avatarUrl', res_user.userInfo.avatarUrl);

                              data.nickName = res_user.userInfo.nickName;
                              data.avatarUrl = res_user.userInfo.avatarUrl;
                              data.gender = res_user.userInfo.gender;
                              data.city = res_user.userInfo.city;
                              data.province = res_user.userInfo.province;
                              data.country = res_user.userInfo.country;
                              data.language = res_user.userInfo.language;
                              data.openid = res.data.data.openid;
                              data.session_key = res.data.data.session_key;
                              wx.showLoading({
                                title: '加载中',
                              })
                              that.saveUser(data);
                            }
                          })

                        }
                      })
                    }
                  }
                });
              } else {
                wx.redirectTo({ //跳转至未授权页面
                  url: '/pages/index/index'
                });
              }
            },
            fail: function(res) {}
          })

        }
      }
    })
  },

  //将拿到的用户信息传给后台，获取wechatUserLetsId
  saveUser: function(data) {
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + '/getUserId',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var userId = res.data.data;
        wx.setStorageSync('userId', userId);
        that.getUserInfo(userId);


      }
    })
  },
  getUserInfo: function(user_id) {
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + '/getUserInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          // var mobile = res.data.data[0].mobile
          // wx.setStorageSync('mobile', mobile)
          wx.switchTab({
            url: '../information/information',
          })
          // if (!mobile) {
        
          //   wx.redirectTo({
          //     url: '../registered/registered',
          //   })
          // }else{
          //   wx.switchTab({
          //     url: '/pages/information/information'
          //   })
          // }
        } else {
          utils.showToast(res.data.message, 'none');
        }

      }
    })
  },
})