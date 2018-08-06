//app.js
App({
  onLaunch () {
    // 记录用户
    let _this = this
    wx.login({
      success (res) {
        let sendData = {
          code: res.code
        }
        wx.request({
          url: 'https://ggstupid.cn/weapp/user/add',
          method: 'POST',
          data: sendData,
          success (res) {
            _this.globalData.userId = res.data.data.id
          },
          fail (err) {
            console.log(err)
          }
        })
      }
    })
  },
  globalData: {
    userId: null
  }
})