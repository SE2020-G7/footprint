// pages/homepage/homepage.js
const app = getApp();
const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    connectButton: [
      { className: "", text: "", bindtap: "" }
    ],
    skin: 'normal-skin',
    recordcount: '',
    collectcount: '',
    openid:''
  },

  onLoad: function() {
    
  },
  onShow:function(){
    app.setSkin(this); 
    this.getOpenid()
  },
  //bindtap事件函数换肤功能
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
  },
  //调用云函数获取openid
  getOpenid(){
    let page = this;
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        console.log('openid--',res.result)
        db.collection('record').where({
          _openid: res.result.openid,
          state: 2
        }).get({
          success: res =>  {
              console.log(res.data.length)
              this.setData({
                  recordcount: res.data.length
              })
          },
      })
      db.collection('collect').where({
        _openid: res.result.openid
      }).get({
        success: res =>  {
            console.log(res.data.length)
            this.setData({
                collectcount: res.data.length
            })
        },
    })
        page.setData({
          openid:res.result.openid
        })
        console.log('openid--',this.data.openid)
      }
    })
  },

  //到打卡列表页面
  gotoRecordlist: function() {
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        console.log('openid--',res.result.openid)
        db.collection('users').where({
          openid: res.result.openid,
        }).get({
          success: res =>  {
            console.log(res.data[0].userData.state)
              this.setData({
                state:res.data[0].userData.state
              })
              if(res.data[0].userData.state==0){
                console.log("address："+this.data.address)
                wx.navigateTo({
                  url: "../recordlistpage/recordlistpage"
                })
              }else{
                wx.showToast({
                  title: '账号状态异常请联系客服',
                  icon: 'none',
                })
              }
          },   
        })
      } 
    })
  },

  //到收藏列表页面
  gotoColletlist:function() {
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        console.log('openid--',res.result.openid)
        db.collection('users').where({
          openid: res.result.openid,
        }).get({
          success: res =>  {
            console.log(res.data[0].userData.state)
              this.setData({
                state:res.data[0].userData.state
              })
              if(res.data[0].userData.state==0){
                console.log("address："+this.data.address)
                wx.navigateTo({
                  url: "../collectlistpage/collectlistpage"
                })
              }else{
                wx.showToast({
                  title: '账号状态异常请联系客服',
                  icon: 'none',
                })
              }
          },   
        })
      } 
    })
  },

  //到草稿页面
  gotoDraftbox:function() {
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        console.log('openid--',res.result.openid)
        db.collection('users').where({
          openid: res.result.openid,
        }).get({
          success: res =>  {
            console.log(res.data[0].userData.state)
              this.setData({
                state:res.data[0].userData.state
              })
              if(res.data[0].userData.state==0){
                console.log("address："+this.data.address)
                wx.navigateTo({
                  url: "../draftboxpage/draftboxpage"
                })
              }else{
                wx.showToast({
                  title: '账号状态异常请联系客服',
                  icon: 'none',
                })
              }
          },   
        })
      } 
    })
  }
})