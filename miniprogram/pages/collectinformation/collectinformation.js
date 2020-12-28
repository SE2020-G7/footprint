// miniprogram/pages/collectinformation/collectinformation.js
const app = getApp();
const db = wx.cloud.database()
const recommend = db.collection('recommend')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skin: 'normal-skin',
    image:'',
    addressTitle: '',//地点标题
    addressInfo: '',//地址详情
    addressScore: 0,//地点评分
    text: '',//地点简介
    collect: false,//收藏按钮定义
    userAvatar: '',//用户头像
    userNickname: '',//用户名字
    userText: '',//用户打卡文字说明
    userImage: '',//用户打卡图片
    openid:'',
    record:[],
    type:0,
    collectid:''
  },

  //收藏切换
  isCollect:function(){
    this.setData({
      collect:true
    })
    const db = wx.cloud.database()
    db.collection('collect').add({
      data: {
        openid:this.data.openid,
        title:this.data.addressTitle,
        image:this.data.image,
        date:this.formatDate(),
        type:this.data.type
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        console.log(' 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '添加想去失败'
        })
        console.error(' 失败：', err)
      }
    })
  },
  isnotCollect:function(){
    this.setData({
      collect:false
    })
    db.collection('collect').doc(this.data.collectid).remove({
      success: function(res) {
        console.log("取消收藏")
      }
    })    
  },

  onLoad: function(options) {
    console.log("推荐name："+options.name); //接受来自上一个页面的地址
    this.setData({
      addressTitle:options.name
    });
    console.log(this.data.addressTitle)
    
  },
  onShow:function(){
    app.setSkin(this);
    this.getInfomation()
    this.getOpenid()
  },
  //获取标准化时间
  formatDate:function() {
    var now = new Date()
    var year = now.getFullYear()
    var mouth = now.getMonth()+1
    var day = now.getDate() 
    if(mouth<10) mouth='0'+mouth
    if(day<10) day='0'+day
  
    return year+'-'+mouth+'-'+day
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
  //获取收藏状态
  getCollectId(openid){
    const db = wx.cloud.database()
    db.collection('collect').where({
      _openid: openid,
      title:this.data.addressTitle
    })
    .get({
      success:res =>{
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
        if(res.data.length>0){
          this.setData({
            collectid:res.data[0]._id,
            collect:true
          }) 
        } 
      }  
    })
    console.log(this.data.collect)
  },
  //获取页面信息
  getInfomation(){
    var that=this
    db.collection('recommend').where({
      name: that.data.addressTitle,
    }).get({
      success: res =>  {
          console.log(res.data)
          this.showUesrRecord(res.data[0].address)
          this.setData({
            image:res.data[0].image,
            addressInfo:res.data[0].address,
            addressScore:res.data[0].scole,
            text:res.data[0].info,
            type:res.data[0].type
          })
          console.log(that.data.addressInfo)
      },
    })
    
  },
  //获取Openid
  getOpenid(){
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        console.log(res)
        console.log('openid--',res.result.openid)
        this.setData({
          openid:res.result.openid
        })
        this.getCollectId(res.result.openid)
        console.log(this.data.collect)
      }
    })
  },
  //展示用户打卡信息
  showUesrRecord(address){
    wx.cloud.callFunction({
      name:'searchUserRecord',
      data:{
        address:address
      },
      complete:res=>{
        console.log(res)
        this.setData({
          record:res.result.list
        })
        console.log(this.data.record)
      }
    })
  },
  //页面跳转
  gotoNewRecord: function() {
    console.log("address："+this.data.addressInfo)
    wx.navigateTo({
    url: '../gotorecord/gotorecord?address='+this.data.addressInfo,
  })
  },
  
})