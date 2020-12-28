//app.js
!function(){
  var PageTmp = Page;
  Page =function (pageConfig) {
    // 设置全局默认分享
    pageConfig = Object.assign({
            //右上角分享功能
            onShareAppMessage () {
                return {
                    title: '足之迹',//分享标题
                    path: '/pages/index/index',//分享用户点开后页面
                    success (res) {
                        console.log('分享成功！')
                    }
                }
            }
    },pageConfig);
    PageTmp(pageConfig);
  };
}();
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
    this.overShare()
  },
  data: {
  },
  setSkin:function(that){
    wx.getStorage({
      key: 'skin',
      success: function(res) {
        if(res){
          that.setData({
            skin: res.data
          })
          var fcolor = res.data == 'normal-skin' ? '#ffffff' : '#000000',
          //fcolor = res.data == 'black-skin' ? '#ffffff' : '#000000',
              obj = {
                'normal-skin':{
                  color:'#ffffff',
                  background:'#000056'///////////////
                },
                'black-skin': {
                  color: '#ffffff',
                  background: '#353b41'
                },
                'red-skin': {
                  color: '#000000',
                  background: '#f9e5ee'
                },
                'yellow-skin': {
                  color: '#000000',
                  background: '#f6e1c9'
                },
                'blue-skin': {
                  color: '#000000',
                  background: '#a2e9ff'
                },
                'green-skin': {
                  color: '#000000',
                  background: '#c0ffa7'
                },
                'purple-skin': {
                  color: '#000000',
                  background: '#e7bcff'
                },
                'white-skin': {
                  color: '#000000',
                  background: '#ffffff'
                },
                'grey-skin': {
                  color: '#000000',
                  background: '#ededed'
                },
              },
              item = obj[res.data],
              tcolor = item.color,
              bcolor = item.background;

          wx.setNavigationBarColor({
            frontColor: tcolor,//fcolor
            backgroundColor: bcolor,
          })
        }
      }
    })
  },
  //重写分享方法
  overShare: function () {
    //监听路由切换
    //间接实现全局设置分享内容
    wx.onAppRoute(function (res) {
        //获取加载的页面
        let pages = getCurrentPages(),
            //获取当前页面的对象
            view = pages[pages.length - 1],
            data;
        if (view) {
            data = view.data;
            console.log('是否重写分享方法', data.isOverShare);
            if (!data.isOverShare) {
                data.isOverShare = true;
                view.onShareAppMessage = function () {
                    //你的分享配置
                    return {
                        title: '足之迹',
                        path: '/pages/login/login'
                    };
                }
            }
        }
    })
},
})
