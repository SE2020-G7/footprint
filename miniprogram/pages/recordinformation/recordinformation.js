const app = getApp();////////
const db = wx.cloud.database({});
const record = db.collection('record');
Page({
  data: {
    skin: 'normal-skin',
    image: [],
    address: '',//打卡地址
    date: '',//打卡日期
    text: '',//打卡文本
    visibility: '',//可见性/images/write_eyes.png
    type: '',//标签
    _id: '',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },
  onLoad: function (options) {
    console.log("接收到的_id："+options._id); //接受来自上一个页面的_id
    this.setData({
      _id:options._id
    });
    record.where({
      _id: this.data._id
    }).get({
      success: res =>  {
        console.log(res)
        this.setData({
          image: res.data[0].image,
          address: res.data[0].address,
          date: res.data[0].time,
          text: res.data[0].content,
          visibility: res.data[0].visibility,
          type: res.data[0].type
        })
        console.log('可见性：'+this.data.visibility)
        console.log('标签属性：'+this.data.type)
      },
    })
  },

  //删除记录
  delRecord() {
    console.log(this.data._id)
    var id = this.data._id
    wx.showModal({
      title: '删除记录',
      content: '确定要删除该条记录吗？',
      cancelText:"再想想",
      confirmText:"删除",
      success: function (res) {
        if(res.cancel) {
        } else {
          record.doc(id).remove({
            success: function(res) {
              console.log('删除记录成功')
            }
          })
          wx.showToast({
            title: '成功删除！',
          })
          wx.reLaunch({
            url: '../recordlistpage/recordlistpage',
          })
        }
      },
    })
  },

  //编辑打卡
  editRecord: function(e){
    console.log('传递的打卡-_id：'+this.data._id)
    wx.navigateTo({
      url: '../editpage/editpage?_id='+this.data._id,
    })
  },

  onShow:function(){
  	app.setSkin(this); 
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
})