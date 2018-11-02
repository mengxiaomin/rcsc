// pages/index/index.js
const app = getApp();
var utils = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty: false,
    inputVal: '',
    hasData: true,
    first_click: false,
    nav: [{
      id: 1,
      name: '地区',
    }, {
      id: 2,
      name: '行业',
    }, {
      id: 3,
      name: '要求',
    }],
    navId: '',
    area: [],
    areaId: '',
    street: [],
    streetId: '',
    show: false,
    data: [],
    Condition: [],
    Industry: [],
    Industryid: [],
    publicData: {},
    isLoad: true,
    // scroll: true,
    headimgurl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getUserInfo()
    var userId = wx.getStorageSync('userId'),
      avatarUrl = wx.getStorageSync('avatarUrl'),
      flag = options.flag;
    if (flag == 1) {
      this.setData({
        show: true,
        navId: 1
      })
    }

    wx.showLoading({
      title: '加载中',
    })
    this.data.publicData.page = 1
    this.data.publicData.user_id = userId
    this.getData(this.data.publicData)
    this.getCondition()
    this.getDefaultAddress()
    this.getIndustry()
    this.setData({
      headimgurl: avatarUrl
    })


  },

  // getUserInfo: function () {
  //   var that = this
  //   var user_id = wx.getStorageSync('userId');
  //   wx.request({
  //     url: app.globalData.publicUrl + '/getUserInfo',
  //     data: {
  //       user_id: user_id
  //     },
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function (res) {
  //       wx.hideLoading();

  //       if (res.data.status == 'S') {
  //         var isregistered = ''
  //         if (res.data.data !== null) {
  //           isregistered = res.data.data.mobile
  //           wx.setStorageSync('mobile', isregistered)
  //         }

  //         var userId = wx.getStorageSync('userId');
  //         if (!userId) {
  //           wx.redirectTo({
  //             url: '../authorization/authorization',
  //           })
  //         } else if (!isregistered) {
  //           console.log(11)
  //           wx.redirectTo({
  //             url: '../registered/registered',
  //           })
  //         }
  //       } else {
  //         utils.showToast(res.data.message, 'none');
  //       }

  //     }
  //   })
  // },
  closePop: function() {
    this.setData({
      show: false,
      navId: ''
    })
  },
  getData(datas) {
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + '/index',
      data: datas,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh()
        if (res.data.status == 'S') {
          var data_Two = []
          var data = res.data.data

          if (data.length > 0) {
            if (that.data.isLoad) {
              data_Two = data
              that.setData({
                isLoad: false
              })
            } else {
              data_Two = that.data.data.concat(data);
            }
            that.setData({
              data: data_Two,
              hasData: true
            })
          } else {


            if (that.data.isLoad) {
              that.setData({
                data: data,
                hasData: false
              })
            }
          }

        }

      }
    })
  },

  // 获取区域
  getDefaultAddress() {
    var that = this;
    var user_id = wx.getStorageSync('userId');
    wx.request({
      url: app.globalData.publicUrl + '/getDefaultAddress',
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
          var data = res.data.data,
            areaId = res.data.data[0].id
          that.setData({
            area: data,
            areaId: areaId,
            firstAreaID: areaId
          })
          that.getChildAddress(areaId)
        }
      }
    })
  },
  // 获取街道
  getChildAddress(areaId) {
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + '/getChildAddress',
      data: {
        id: areaId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          var data = res.data.data,
            streetId = res.data.data[0].id,
            firstnav = res.data.data[0].name
          that.data.nav[0].name = firstnav
          that.setData({
            street: data,
            firstStreetId: streetId,
            firstnav: firstnav,
            streetId: streetId,
            nav: that.data.nav
          })
        }
      }
    })
  },


  //要求重置
  reset: function() {
    this.getCondition()
  },

  //要求确定
  submit: function() {
    this.data.publicData.page = 1
    this.data.publicData.experience_id = this.data.Condition['经验'][1].type
    this.data.publicData.education_id = this.data.Condition['学历'][1].type
    this.data.publicData.dist_id = this.data.Condition['薪酬'][1].type
    this.setData({
      navId: '',
      show: false,
      publicData: this.data.publicData,
      first_click: false,
      // scroll: true,
      isLoad: true
    })


    this.getData(this.data.publicData)
  },

  // 城市确定
  submitCity: function() {
    this.data.publicData.page = 1
    this.data.publicData.id = this.data.streetId
    this.setData({
      show: false,
      navId: '',
      publicData: this.data.publicData,
      first_click: false,
      // scroll: true,
      isLoad: true
    })
    this.getData(this.data.publicData)
  },

  //行业确定
  IndustrySubmit() {
    this.data.publicData.page = 1
    this.data.publicData.industry_id = this.data.Industryid
    this.setData({
      show: false,
      navId: '',
      publicData: this.data.publicData,
      first_click: false,
      // scroll: true,
      isLoad: true
    })
    this.getData(this.data.publicData)
  },
  //行业重置
  Industryreset: function() {
    this.setData({
      Industryid: []
    })
    this.getIndustry()
  },
  // 城市重置
  resetCity: function() {
    this.data.nav[0].name = this.data.firstnav
    let firstAreaID = this.data.firstAreaID
    this.getChildAddress(firstAreaID)
    this.setData({
      areaId:firstAreaID,
      nav:this.data.nav
    })
  },
  changeCity: function() {
    wx.navigateTo({
      url: '/pages/city/city',
    })
  },
  //获取要求
  getCondition: function() {
    var that = this
    wx.request({
      url: app.globalData.publicUrl + '/getCondition',
      data: {},
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          var data = res.data.data

          that.setData({
            Condition: data

          })
        }

      }
    })
  },
  // 获取行业
  getIndustry: function() {
    var that = this
    wx.request({
      url: app.globalData.publicUrl + '/getIndustry',
      data: {},
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 'S') {
          var data = res.data.data

          that.setData({
            Industry: data

          })
        }
      }
    })
  },

  // 选择要求
  choose(e) {
    var id = e.currentTarget.dataset.id,
      idx = e.currentTarget.dataset.idx;
    this.data.Condition[idx][1].type = id
    this.setData({
      Condition: this.data.Condition
    })
  },

  // 选择行业
  chooseIndustry: function(e) {
    var id = e.currentTarget.dataset.id,
      Industryid = this.data.Industryid,
      idx = Industryid.indexOf(id),
      index = "";
    for (var i = 0; i <= this.data.Industry.length - 1; i++) {
      if (this.data.Industry[i].id == id) {
        index = i
      }
    }

    if (idx > -1) {
      Industryid.splice(idx, 1)
      this.data.Industry[index].show = false
    } else {
      Industryid.push(id)
      this.data.Industry[index].show = true
    }

    this.setData({
      Industryid: this.data.Industryid,
      Industry: this.data.Industry
    })
  },
  //点击搜索
  search: function() {
    var inputVal = this.data.inputVal;
    this.data.publicData.page = 1;
    this.data.publicData.position_title = inputVal
    this.setData({
      publicData: this.data.publicData,
      data: [],
      isLoad: true
    })
    this.getData(this.data.publicData)
  },

  //设置清空按钮的显示和隐藏
  changeVal: function(e) {
    if (e.detail.value) {
      this.setData({
        empty: true,
        inputVal: e.detail.value
      })
    } else {
      this.setData({
        empty: false,
        inputVal: ''
      })

    }
  },
  //点击清除按钮
  empty: function() {
    this.setData({
      empty: false,
      inputVal: ''
    })
    this.data.publicData.page = 1;
    this.data.publicData.position_title = ''
    this.setData({
      publicData: this.data.publicData,
      data: [],
      isLoad: true
    })
    this.getData(this.data.publicData)
  },
  changeInputVal(e) {
    // this.setData({
    //   inputVal: e.detail.value
    // })
    var inputVal = e.detail.value;
    if (!inputVal) {
      this.data.publicData.page = 1;
      this.data.publicData.position_title = inputVal
      this.setData({
        publicData: this.data.publicData,
        data: [],
        isLoad: true
      })
      this.getData(this.data.publicData)
    }

  },
  //显示隐藏弹窗
  showPop: function(e) {
    var id = e.currentTarget.dataset.id;
    if (id == this.data.navId) {
      this.setData({
        navId: '',
        show: false,
        // scroll: true,
        first_click: false,
      })
    } else {
      this.setData({
        navId: id,
        show: true,
        scroll: false,
        first_click: true,
      })


    }
  },
  // topersonalCenter: function() {
  //   wx.navigateTo({
  //     url: '/pages/personalCenter/personalCenter',
  //   })
  // },
  changeArea: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      areaId: id
    })
    this.getChildAddress(id)
  },
  changeStreet: function(e) {
    var id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name
    console.log(name)
    this.data.nav[0].name = name
    this.setData({
      streetId: id,
      nav: this.data.nav
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onShow: function() {

  },
  toDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/PositionDetails/PositionDetails?id=' + id
    })
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
    this.data.publicData.page = 1
    this.setData({
      publicData: this.data.publicData,
      data: [],
      isLoad: true
    })
    this.getData(this.data.publicData)
  },

  bindscrolltolower: function() {
    console.log(111)
    var page = this.data.publicData.page + 1
    console.log(page + 1)
    this.data.publicData.page = page
    this.setData({
      publicData: this.data.publicData
    })
    this.getData(this.data.publicData)
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