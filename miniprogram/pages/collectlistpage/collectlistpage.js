// miniprogram/pages/collectlistpage/collectlistpage.js
const app = getApp();////////
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData : 0,//当前滑块参数
    /**
     * currentData == 0 全部
     * currentData == 1 景点
     * currentData == 2 餐饮
     * currentData == 3 住宿
     */
    skin: 'normal-skin',
    address: '',//打卡地址
    image: '',//打卡图片
    date: '',//打卡日期
    imgheights:0,
    collectList:[],
    collectList1:[],
    collectList2:[],
    collectList3:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onShow:function(){
    app.setSkin(this); 
    this.getOpenid()
  },
  //获取用户openid
  getOpenid(){
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        console.log(res)
        console.log('openid--',res.result.openid)
        this.setData({
          openid:res.result.openid
        })
        this.getAllCollectId(this.data.openid)
        console.log(this.data.collect)
      }
    })
  },
  //获取所有收藏信息
  getAllCollectId(openid){
    const db = wx.cloud.database()
    db.collection('collect').where({
        _openid: openid,
    }).orderBy('time', 'desc').get({
      success:res =>{
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
        this.setData({
          collectList:res.data,
          imgheights:res.data.length*310
        })
      } 
    })
    console.log(this.data.collect)
  },
  //获取景点对应收藏信息
  getCollectId1(openid){
    const db = wx.cloud.database()
    db.collection('collect').where({
        _openid: openid,
        type:1
    }).orderBy('time', 'desc').get({
      success:res =>{
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
        this.setData({
          collectList1:res.data,
          imgheights:res.data.length*310
        })
      } 
    })
    console.log(this.data.collect)
  },
   //获取餐饮对应收藏信息
   getCollectId2(openid){
    const db = wx.cloud.database()
    db.collection('collect').where({
        _openid: openid,
        type:2
    }).orderBy('time', 'desc').get({
      success:res =>{
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
        this.setData({
          collectList2:res.data,
          imgheights:res.data.length*310
        })
      } 
    })
    console.log(this.data.collect)
  },
   //获取住宿对应收藏信息
   getCollectId3(openid){
    const db = wx.cloud.database()
    db.collection('collect').where({
        _openid: openid,
        type:3
    }).orderBy('time', 'desc').get({
      success:res =>{
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
        this.setData({
          collectList3:res.data,
          imgheights:res.data.length*310
        })
      } 
    })
    console.log(this.data.collect)
  },
  //换肤事件函数
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
 

  //获取当前滑块的index
  bindchange:function(e){
    const that  = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换滑块，index赋值
  checkCurrent:function(e){
    const that = this;

    if (that.data.currentData === e.target.dataset.current){
        return false;
    }else{
      that.setData({
        currentData: e.target.dataset.current
      })
    }
    console.log(this.data.openid)
    if( e.target.dataset.current==0){
      this.getAllCollectId(this.data.openid)
      console.log(this.data.collect)
    }else if( e.target.dataset.current==1){
      this.getCollectId1(this.data.openid,1)
      console.log(this.data.collect)
    }else if( e.target.dataset.current==2){
      this.getCollectId2(this.data.openid,2)
      console.log(this.data.collect)
    }else{
      this.getCollectId3(this.data.openid,3)
      console.log(this.data.collect)
    }
  },
    //收藏title传递
    gotoInfo: function(e){
      console.log('点击获得的信息：'+ e)
      let title = e.currentTarget.dataset.title
      wx.navigateTo({
        url: '../collectinformation/collectinformation?name='+title
      })
    },
})