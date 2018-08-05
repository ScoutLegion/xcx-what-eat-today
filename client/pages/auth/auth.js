Page({
  openSettingBack (res) {
    if (res.detail.authSetting['scope.userLocation']) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  }
})