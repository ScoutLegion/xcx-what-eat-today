Page({
  openSettingBack (res) {
    if (res.detail.authSetting['scope.userLocation']) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    } else if (res.detail.authSetting['scope.userInfo']) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  }
})