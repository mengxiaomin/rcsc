// pages/companyDetails/companyDetails.js
const app = getApp();
var utils = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    star: false,
    phone: '18758187943',
    data: [],
    nav: [{
      id: 1,
      name: '公司详情'
    }, {
      id: 2,
      name: '招聘岗位'
    }],
    navId: '',
    company_id: '',
    Position: []
  },
  back: function() {

    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  changeNav: function(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      navId: id
    })
  },
  changeStar: function() {
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
          // that.setData({
          //   UserInfo: res.data.data
          // })
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
              url: '../registered/registered?detail=1',
            })
          } else {
            wx.showLoading({
              title: '加载中',
            })
            this.setData({
              star: !this.data.star
            })
            var status = ''
            if (this.data.star) {
              status = 1
            } else {
              status = 2
            }
            this.addCollection(status)
          }
        } else {
          utils.showToast(res.data.message, 'none');
        }

      }
    })
  },

  addCollection: function(status) {
    var user_id = wx.getStorageSync('userId');
    wx.request({
      url: app.globalData.publicUrl + '/addCollection',
      data: {
        id: this.data.company_id,
        type: 1,
        status: status,
        user_id: user_id
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          utils.showToast(res.data.message, 'success');
        } else {
          utils.showToast(res.data.message, 'none');
        }

      }
    })
  },
  call: function() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    var id = this.data.nav[0].id,
      company_id = options.id;
    this.setData({
      navId: id,
      company_id: company_id
    })
    this.companyDetail(company_id)
    this.getPositionByCompanyId(company_id)
  },
  companyDetail: function(company_id) {
    var that = this
    var user_id = wx.getStorageSync('userId');
    wx.request({
      url: app.globalData.publicUrl + '/companyDetail',
      data: {
        id: company_id,
        user_id: user_id
      },
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          var data = res.data.data[0]
          var is_collection = res.data.is_collection
          if (is_collection == 0) {
            that.setData({
              star: false
            })
          } else if (is_collection == 1) {
            that.setData({
              star: true
            })
          }
          that.setData({
            data: data,
            phone: data.mobile
          })
        }

      }
    })
  },
  getPositionByCompanyId: function(company_id) {
    var that = this
    wx.request({
      url: app.globalData.publicUrl + '/getPositionByCompanyId',
      data: {
        id: company_id
      },
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          that.setData({
            Position: res.data.data
          })
        }

      }
    })
  },
  toDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/PositionDetails/PositionDetails?id=' + id
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