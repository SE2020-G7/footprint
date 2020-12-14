// 引入SDK核心类
var QQMapWX = require('./qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '453BZ-2JRCS-TM7OY-6TUVN-2XL2T-I3FFGn'
    });
    this.mapCtx = wx.createMapContext('myMap')
  },
  data: {
    location: "",
    latitude: "30.326058",
    longitude: "120.155530",
    // 图标定位
    markers: [],
  },
})