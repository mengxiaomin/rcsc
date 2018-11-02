// pages/city/city.js
const app = getApp();
var utils = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: [],
    cityId: '',
    getChildAddress: []

  },
  changeCity: function(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      cityId: id
    })

    var that = this
    var user_id = wx.getStorageSync('userId');
    wx.request({
      url: app.globalData.publicUrl + '/changeDefaultAddress',
      data: {
        id: id,
        user_id: user_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          wx.reLaunch({
            url: '/pages/index/index?flag='+1,
          })
        } else {
          utils.showToast(res.data.message, 'none');
        }

      }
    })
  },

  getCity: function() {
    var that = this
    wx.request({
      url: app.globalData.publicUrl + '/getProvince',
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          var data = res.data.data
          var id = data[0].id;
          that.setData({
            city: data,
            cityId: id
          })
          // that.getChildAddress(id)
        }

      }
    })
  },
  // getChildAddress: function(id) {
  //   var that = this
  //   wx.request({
  //     url: app.globalData.publicUrl + '/getChildAddress',
  //     data: {
  //       id: id
  //     },
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function(res) {
  //       wx.hideLoading();
  //       if (res.data.status == 'S') {
  //         var data = res.data.data

  //         that.setData({
  //           getChildAddress: data,

  //         })
  //       }

  //     }
  //   })
  // },
  // changeCitychild: function(e) {
  //   var id = e.currentTarget.dataset.id;

  //   var that = this
  //   var user_id = wx.getStorageSync('userId');
  //   wx.request({
  //     url: app.globalData.publicUrl + '/changeDefaultAddress',
  //     data: {
  //       id: id,
  //       user_id: user_id
  //     },
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function(res) {
  //       wx.hideLoading();
  //       if (res.data.status == 'S') {
  //         wx.reLaunch({
  //           url: '/pages/index/index',
  //         })
  //       } else {
  //         utils.showToast(res.data.message, 'none');
  //       }

  //     }
  //   })

  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCity()
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