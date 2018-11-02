// pages/informationDetail/informationDetail.js
const app = getApp();
var utils = require("../../utils/util.js")
var WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id
    console.log(id)
    this.getArticleDetail(id)
  },
  back: function() {
    wx.switchTab({
      url: '/pages/information/information'
    })
  },
  getArticleDetail: function(id) {
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + '/getArticleDetail',
      data: {
        id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          that.setData({
            datas: res.data.data
          })

          var article = res.data.data.content;
          /** 
           * WxParse.wxParse(bindName , type, data, target,imagePadding) 
           * 1.bindName绑定的数据名(必填) 
           * 2.type可以为html或者md(必填) 
           * 3.data为传入的具体数据(必填) 
           * 4.target为Page对象,一般为this(必填) 
           * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选) 
           */
          // var that = this;
          WxParse.wxParse('article', 'html', article, that, 5);

        } else {
          utils.showToast(res.data.message, 'none');
        }

      }
    })
  },
  Link: function(e) {
    var url = e.currentTarget.dataset.url,
      idx = url.indexOf('index'),
      cen = url.indexOf('personalCenter'),
      inf = url.indexOf('information')
    if (idx > -1 || cen > -1 || inf > -1) {
      wx.switchTab({
        url: url,
      })
    } else {
      wx.navigateTo({
        url: url,
      })
    }

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