const app = getApp();
const db = wx.cloud.database({});
const record = db.collection('record');
Page({
  data: {
    skin: 'normal-skin',
    address: '',//打卡地址
    image: '',//打卡图片
    date: 'null',//打卡日期
    recordcount: '0',//打卡数量
    openid:'',//用户openid
    _id: 0,//打卡记录id：唯一
    recordlist:[]//从云上获取的数据放入的空数组
  },//环境id：test-wtt3j
  
  onLoad: function (options) {
    this.getUserRecordlist();
    
  },

  //获取用户openid并显示打卡列表页
  getUserRecordlist(){
    let page = this;
    var _this=this;
    const db = wx.cloud.database({
      env: 'test-wtt3j'
    })
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        record.where({//查找用户openid条件
          _openid: res.result.openid,
          state:2//2为已打卡
        }).orderBy('time', 'desc').get({
          success: res =>  {
            console.log(res)
            this.setData({
              recordlist: res.data,
              recordcount: res.data.length
            })
          },
        })
      },
    })
  },

  //打卡id传递
  gotoRecordInfo: function(e){
    //console.log('点击获得的信息：'+e)
    let _id = e.currentTarget.dataset._id
    //console.log('传递的打卡_id：'+_id)
    wx.navigateTo({
      url: '../recordinformation/recordinformation?_id='+_id,
    })
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