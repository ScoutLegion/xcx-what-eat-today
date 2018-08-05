//app.js
App({
  onLaunch () {
    // 获取用户信息
    let _this = this
    wx.login({
      success (res) {
        _this.globalData.code = res.code
      }
    })
    wx.getSetting({
      success (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              _this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (_this.userInfoReadyCallback) {
                _this.userInfoReadyCallback(res)
              }
            }
          })
        }
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            type: 'wgs84',
            success (res) {
              _this.globalData.locationTimeLine = Date.now()
              _this.globalData.locaionInfo = res
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    locaionInfo: null,
    locationTimeLine: null,
    code: null
  }
})