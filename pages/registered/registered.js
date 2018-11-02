const app = getApp();
var utils = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSend: true,
    verifyTag: true,
    mobile: '',
    avatarUrl:'',
    flag:''
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


  // 发送验证码
  getcodeText: function() {
    var phone_test = /^[1][3-9][0-9]{9}$/;
    var mobile = this.data.mobile;
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
            utils.showToast(res.data.message, 'none');
          } else {
            utils.showToast(res.data.message, 'none');
          }
        }
      })
    }
  },


  //注册

  formSubmit: function(e) {
    var mobile = e.detail.value.Mobile,
      code = e.detail.value.Code,
      phone_test = /1[3-9]+\d{9}/;
    console.log(mobile)
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
      var user_id = wx.getStorageSync('userId');
      wx.request({
        url: app.globalData.publicUrl + '/registerTalent',
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
            wx.setStorageSync('isregistered', true);
            setTimeout(function() {
              wx.navigateBack()
            }, 1000);
          } else {
            utils.showToast(res.data.message, 'none');
          }
        }
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   var avatarUrl = wx.getStorageSync('avatarUrl');
   this.setData({
     avatarUrl: avatarUrl
   })
  //  var flag=options.detail;
  //   this.setData({
  //     flag: flag
  //   })
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

  },
  // 停止当前页面下拉刷新
  onPullDownRefresh: function() {

  },
  globalData: {
    userInfo: null
  }
})