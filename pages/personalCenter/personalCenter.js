// pages/personalCenter/personalCenter.js
const app = getApp();
var utils = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPop: false,
    isSend: true,
    verifyTag: true,
    data: [],
    mobile: '',
    code: '',
    guide: false
  },

  close:function(){
    this.setData({
      guide: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (wx.openBluetoothAdapter) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    this.getUserInfo()
  },
  getUserInfo: function() {

    var that = this
    var user_id = wx.getStorageSync('userId');
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
          that.setData({
            data: res.data.data
          })
          var isregistered = ''
          if (res.data.data !== null) {
            isregistered = res.data.data.mobile
            wx.setStorageSync('mobile', isregistered)
          }

          var userId = wx.getStorageSync('userId');
          if (!userId) {
            wx.redirectTo({
              url: '../authorization/authorization',
            })
          } else if (!isregistered) {
            wx.redirectTo({
              url: '../registered/registered',
            })
          }
        } else {
          utils.showToast(res.data.message, 'none');
        }

      }
    })
  },

  //修改手机号码
  changePhone: function() {
    this.setData({
      showPop: true
    })
  },
  cancel: function() {
    this.setData({
      showPop: false
    })
  },

  // 点击发送验证码事件
  onSendTap: function() {
    if (this.data.verifyTag) {
      this.getcodeText();
    } else {
      return false;
    }
  },
  getMobileval: function(event) {
    var Mobile = event.detail.value;
    this.setData({
      mobile: Mobile
    })
  },
  getCodeval: function(event) {
    var code = event.detail.value;
    this.setData({
      code: code
    })
  },


  // 发送验证码
  getcodeText: function() {
    var phone_test = /^[1][3-9][0-9]{9}$/;
    var mobile = this.data.mobile;
    console.log(phone_test.test(mobile))
    if (!mobile) {
      utils.showToast('请输入手机号', 'none');
    } else if (!phone_test.test(mobile)) {
      utils.showToast('请输入正确的手机号', 'none');
    } else {
      wx.showLoading({
        title: '加载中',
      })
      var that = this;
      wx.request({
        url: app.globalData.publicUrl + '/sendCode',
        data: {
          mobile: mobile
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          wx.hideLoading();
          if (res.data.status == 'S') {
            var seconds = 59;
            that.setData({
              time: seconds,
              isSend: false
            })
            that.timeCountDown(seconds);
            utils.showToast(res.data.msg, 'none');
          } else {
            utils.showToast(res.data.msg, 'none');
          }
        }
      })
    }
  },

  // 倒计时
  timeCountDown: function(seconds) {
    this.setData({
      verifyTag: false,
      time: seconds
    });
    var that = this;
    var time = setInterval(function() {
      if (seconds > 0) {
        seconds--;
        that.setData({
          time: seconds
        });
      } else {
        that.setData({
          isSend: true,
          verifyTag: true,
        });
        clearInterval(time)
      }
    }, 1000);
  },


  register: function() {
    var mobile = this.data.mobile,
      code = this.data.code,
      user_id = wx.getStorageSync('userId'),
      that = this,
      phone_test = /1[3-9]+\d{9}/;
    if (!mobile) {
      utils.showToast('请输入手机号码', 'none');
    } else if (!phone_test.test(mobile)) {
      utils.showToast('请输入正确的手机号', 'none');
    } else if (!code) {
      utils.showToast('请输入验证码', 'none');
    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.publicUrl + '/changeUserMobile',
        data: {
          mobile: mobile,
          smsCode: code,
          user_id: user_id
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          wx.hideLoading();
          if (res.data.status == 'S') {
            utils.showToast(res.data.message, 'none');
            that.setData({
              showPop: false
            })
            that.getUserInfo()
          } else {
            utils.showToast(res.data.message, 'none');
          }
        }
      })
    }
  },

  toCollection: function() {
    wx.navigateTo({
      url: '/pages/collection/collection',
    })
  },
  toCode: function() {
    this.setData({
      guide: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})