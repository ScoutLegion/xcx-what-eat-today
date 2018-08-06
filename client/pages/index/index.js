//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isAuth: true,
    hasUserInfo: false,
    code: '',
    noSelect: true,
    isShowMapBtn: false,
    locaionInfo: null,
    timeLine: null,
    foodInfo: null
  },
  fetchFood () {
    let _this = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://ggstupid.cn/weapp/food',
      data: {
        lat: this.data.locaionInfo.latitude,
        lon: this.data.locaionInfo.longitude
      },
      success (res) {
        wx.hideLoading()
        if (res.data.success) {
          if (res.data.data.name) {
            res.data.data.price = res.data.data.price.toFixed(2)
            _this.setData({
              foodInfo: res.data.data
            })
          } else {
            wx.navigateTo({
              url: '/pages/nofood/nofood'
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail (err) {
        wx.hideLoading()
        console.log(err)
      }
    })
  },
  // 获取经纬度
  getWhatEat (e) {
    let _this = this
    // 获取用户授权的相关信息，进行针对性处理
    wx.getSetting({
      success (res) {
        // 用户授权时，获取用户经纬度，并请求接口去获取推荐的美食
        if (res.authSetting['scope.userLocation']) {
          if (!_this.data.timeLine || Date.now() - _this.data.timeLine >= 60000) {
            wx.getLocation({
              type: 'wgs84',
              complete (res) {
                if (res.errMsg === 'getLocation:ok') {
                  _this.setData({
                    noSelect: false,
                    locaionInfo: res,
                    timeLine: Date.now()
                  })
                  _this.fetchFood()
                } else {
                  wx.navigateTo({
                    url: '/pages/nofood/nofood'
                  })
                }
              }
            })
          } else {
            //当时间间隔小于一分钟时直接去取经纬度请求接口
            _this.fetchFood()
          }
        } else {
          // 用户未授权时，说明原因并去进行授权操作
          wx.getLocation({
            type: 'wgs84',
            complete (res) {
              if (res.errMsg === "getLocation:ok") {
                _this.setData({
                  noSelect: false,
                  locaionInfo: res,
                  timeLine: Date.now()
                })
                _this.fetchFood()
              } else {
                wx.showModal({
                  title: '提示',
                  content: '无法获取位置，不能推荐附近美食',
                  confirmText: '授权',
                  complete (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/auth/auth'
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  // 换一换
  changeFood () {
    this.fetchFood()
  },
  // 登录授权
  goAuth (res) {
    let _this = this
    if (res.detail.errMsg === 'getUserInfo:ok') {
      let postData = { ...res.detail.userInfo, ...{ code: app.globalData.code } }
      wx.request({
        url: 'https://ggstupid.cn/weapp/user/add',
        data: postData,
        method: 'POST',
        success (res) {
          _this.setData({
            isAuth: true
          })
        },
        fail (err) {
          console.log(err)
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
    }
  },
  // 显示高德地图mask
  showMapBtn () {
    console.log(app)
    let sendData = { ...this.data.foodInfo, ...{ userId: app.globalData.userId } }
    wx.request({
      url: 'https://ggstupid.cn/weapp/food/add',
      method: 'POST',
      data: sendData,
      success (res) {
        console.log(res)
      },
      fail (err) {
        console.log(err)
      }
    })
    this.setData({
      isShowMapBtn: true
    })
  },
  // 隐藏高德地图mask
  hiddenMapBtn () {
    this.setData({
      isShowMapBtn: false
    })
  },
  // 导航地图
  getLocation () {
    let _this = this
    wx.openLocation({
      latitude: _this.data.foodInfo.latitude,
      longitude: _this.data.foodInfo.longitude,
      name: _this.data.foodInfo.name,
      address: _this.data.foodInfo.shopName,
      complete () {
        _this.setData({
          isShowMapBtn: false
        })
      }
    })
  }
})
