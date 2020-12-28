// miniprogram/pages/skincolorpage/skincolorpage.js
const app = getApp();////////
Page({

  data: {
    skin: 'normal-skin',
  },
  onLoad: function() {
    //app.setSkin(this); 
  },
  onShow:function(){
  	app.setSkin(this); 
  },
  //bindtap事件函数
  setSkin:function(e){
    var skin = e.target.dataset.flag;

    this.setData({
      skin: skin + '-skin',
      openSet:false
    })

    wx.setStorage({
      key: "skin",
      data: skin + '-skin'
    })
    app.setSkin(this);
  }

  /**
   * 页面的初始数据
  
  data: {

  }, */

  /**
   * 生命周期函数--监听页面加载
  
  onLoad: function (options) {

  }, */

  /**
   * 生命周期函数--监听页面初次渲染完成
  
  onReady: function () {

  }, */

  /**
   * 生命周期函数--监听页面显示
  
  onShow: function () {

  }, */

  /**
   * 生命周期函数--监听页面隐藏
  
  onHide: function () {

  }, */

  /**
   * 生命周期函数--监听页面卸载
  
  onUnload: function () {

  }, */

  /**
   * 页面相关事件处理函数--监听用户下拉动作
  
  onPullDownRefresh: function () {

  }, */

  /**
   * 页面上拉触底事件的处理函数
  
  onReachBottom: function () {

  }, */

  /**
   * 用户点击右上角分享
  
  onShareAppMessage: function () {

  } */
})