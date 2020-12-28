const app = getApp();////////
const db = wx.cloud.database({});
const record = db.collection('record');
Page({
  data: {
    skin: 'normal-skin',
    address: '',//打卡地址
    image: '',//打卡图片
    date: '',//打卡日期
    openid:'',//用户openid
    _id: 0,//打卡记录id：唯一(草稿是1)
    draftboxlist:[]//从云上获取的数据放入的空数组
  },
  
  onLoad: function (options) {
    this.getUserDraftboxlist();//获取用户openid并显示草稿列表页
  },

  getUserDraftboxlist(){
    let page = this;
    var _this=this;
    const db = wx.cloud.database({
      env: 'test-wtt3j'
    })
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        record.where({//查找用户openid条件以及打卡记录状态
          _openid: res.result.openid,
          state:1//1为打卡
        }).orderBy('time', 'desc').get({
          success: res =>  {
            console.log(res)
            this.setData({
              draftboxlist: res.data,
            })
          },
        })
      },
    })
  },

  //草稿id传递
  gotoEdit: function(e){
    console.log('点击获得的信息：'+e)
    let _id = e.currentTarget.dataset._id
    console.log('传递的草稿_id：'+_id)
    wx.navigateTo({
      url: '../editpage/editpage?_id='+_id,//链接草稿编辑页面
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