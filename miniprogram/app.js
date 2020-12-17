//app.js
App({
  globalData : {
    userId:'',//用户id
    userInfo:null,//用户信息
    auth:{//授权信息
      'scope.useInfo':false
    },
    logged:false//登录状态
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-wtt3j',
        traceUser: true,
      })
    }
    
  }
})
