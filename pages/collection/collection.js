// pages/collection/collection.js
const app = getApp();
var utils = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [{
      id: 2,
      name: '职位'
    }, {
      id: 1,
      name: '公司'
    }],
    navId: '2',
    data:[],
    hasData:true
  },

  changeNav: function(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      navId: id
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getCollection(id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    var id = this.data.nav[0].id;
    this.setData({
      navId: id
    })
    this.getCollection(id)
  },
  getCollection: function (id) {
    var that = this;
    var user_id = wx.getStorageSync('userId');
    wx.request({
      url: app.globalData.publicUrl + '/getCollection',
      data: {
        type: id,
        user_id: user_id
      },
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          wx.stopPullDownRefresh()
          var data = res.data.data
          
          if (data.length > 0) {
            that.setData({
              data: data,
              hasData: true
            })
          } else {
            that.setData({
              data: data,
              hasData: false
            })
          }

        }

      }
    })
  },
  toPositionDetails: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/PositionDetails/PositionDetails?id=' + id
    })
  },
  tocompanyDetails: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/companyDetails/companyDetails?id=' + id
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
    var id = this.data.navId;
    this.getCollection(id)
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