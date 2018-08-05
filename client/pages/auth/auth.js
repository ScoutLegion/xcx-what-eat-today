Page({
  openSettingBack (res) {
    if (res.detail.authSetting['scope.userLocation']) {
      wx.navigateTo({
        url: '/pages/index/index'
      })
    }
  }
})