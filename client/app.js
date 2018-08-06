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
          url: 'http://192.168.199.162:5757/weapp/user/add',
          method: 'POST',
          data: sendData,
          success (res) {
            console.log(res)
            _this.globalData.userId = res.data.id
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