// pages/information/information.js
const app = getApp();
var utils = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    indicatorColor: '#ccc',
    indicatorActiveColor: '#14DDD6',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    tab: [],
    datas: [],
    RecommendCompany: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userId = wx.getStorageSync('userId');
    if (!userId) {
      wx.redirectTo({
        url: '../authorization/authorization',
      })
    }
    // this.getUserInfo()
    this.getBanner()
    this.getCats()
    this.getArticles()
    this.getRecommendCompany()

  },
  bannerToDetail: function(e) {
    var url = e.currentTarget.dataset.url,
      idx = url.indexOf('index'),
      cen = url.indexOf('personalCenter')
    if (idx > -1 || cen > -1) {
      wx.switchTab({
        url: url,
      })
    } else {
      console.log(11)
      wx.navigateTo({
        url: url,
      })
    }
    console.log(url)
  },
  //点击tab
  tabClick: function(e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    if (id == 1) {
      wx.navigateTo({
        url: '/pages/EmploymentNews/EmploymentNews',
      })
    } else if (id == 2) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '该模块暂未开放，敬请期待！',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }

  },
  getBanner: function() {
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + '/getBanner',
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          that.setData({
            imgUrls: res.data.data
          })
          console.log(res.data.data)
        } else {
          utils.showToast(res.data.message, 'none');
        }

      }
    })
  },
  getCats: function() {
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + '/getCats',
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          that.setData({
            tab: res.data.data
          })
        } else {
          utils.showToast(res.data.message, 'none');
        }

      }
    })
  },
  getArticles: function() {
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + '/getArticles',
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh()
        if (res.data.status == 'S') {
          that.setData({
            datas: res.data.data.slice(0, 4)
          })
        } else {
          utils.showToast(res.data.message, 'none');
        }

      }
    })
  },
  toDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../informationDetail/informationDetail?id=' + id,
    })
  },

  getRecommendCompany: function() {
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + '/getRecommendCompany',
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh()
        if (res.data.status == 'S') {
          that.setData({
            RecommendCompany: res.data.data
          })
        } else {
          utils.showToast(res.data.message, 'none');
        }

      }
    })
  },
  companyDetails: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/companyDetails/companyDetails?id=' + id
    })
  },
  toIndex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  toNews: function() {
    wx.navigateTo({
      url: '/pages/EmploymentNews/EmploymentNews',
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
    this.getArticles()
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