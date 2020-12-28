// miniprogram/pages/instructionspage/instructionspage.js
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
})