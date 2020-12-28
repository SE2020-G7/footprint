// miniprogram/pages/gotorecord/gotorecord.js
const app = getApp()
const db = wx.cloud.database()
const record = db.collection('record')
/*时间标准化*//

Page({
  data: {
    connectButton: [{ 
      className: "", text: "", bindtap: "" 
    }],
    skin: 'normal-skin',
    array: ['其他','景点','住宿','餐饮'],//打卡类型标签
    objectArray: [{
        id:0,
        name:'其他'
      },{
        id:1,
        name:'景点'
      },{
        id:2,
        name:'住宿'
      },{
        id:3,
        name:'餐饮'
      }],
    data:'',
    index:0,
    imageList: [],//图片列表
    countIndex: 9,//最多上传图片的数量
    address:'',
    count: [1, 2, 3, 4,5,6,7,8,9],//图片数组
    state:0,
    clickRecord:true,
    fileIDs: [], 
    nickname:'',  
    userInfo:[],
    recordnum:0,
  },
  formatDate:function() {
    var now = new Date()
    var year = now.getFullYear()
    var mouth = now.getMonth()+1
    var day = now.getDate() 
    if(mouth<10) mouth='0'+mouth
    if(day<10) day='0'+day
  
    return year+'-'+mouth+'-'+day
  },
    //换皮肤函数
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
  /*选择图片*/ 
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      },
    })
  },
  /*预览图片*/ 
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  /*切换标签*/
  bindPickerChange:function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  /*是否存为草稿*/ 
  isDraftbox:function(){
    const promiseArr = []
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.imageList.length;i++) {
      let filePath = this.data.imageList[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove,reject)=>{
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log(error)
        })
      }))
    }
    Promise.all(promiseArr).then(res=>{
      var data = {
        content: this.data.getContent,
        address:this.data.address,
        image:this.data.fileIDs,//图片地址
        type:this.data.index,//标签
        state:1,//草稿为1
        visibility:this.data.clickRecord,
        time: this.formatDate(),
      };
      db.collection('record').add({
        data: data
      }).then(res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
          title: '已存入草稿！',
        })
        wx.switchTab({
          url: '/pages/index/index',
        })
      })
      .catch(error => {
        console.log(error)
      })
    })
  },
  /*是否公开*/
  showRecord:function(){
    this.setData({
      clickRecord:true
    })
  },
  hideRecord:function(){
    this.setData({
      clickRecord:false
    })
  },
  getContent:function(e) {
    console.log(e.detail.value);
    this.setData({
      getContent: e.detail.value
    })
  },
  onLoad: function(options) {
    console.log("address："+options.address); //接受来自上一个页面的地址
    this.setData({
      address:options.address
    });

  },
  onShow:function(){
  	app.setSkin(this); //个性换肤
  },

  /*将图片上传到云存储,并发布打卡*/ 
  submit: function () {
    wx.showLoading({
      title: '提交中',
    })
    const promiseArr = []
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.imageList.length;i++) {
      let filePath = this.data.imageList[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove,reject)=>{
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log(error)
        })
      }))
    }
    Promise.all(promiseArr).then(res=>{
      var data = {
        content: this.data.getContent,
        address:this.data.address,
        image:this.data.fileIDs,//图片地址
        type:this.data.index,//标签
        state:2,//发布状态为2
        visibility:this.data.clickRecord,
        time: this.formatDate(),
      };
      db.collection('record').add({
        data: data
      }).then(res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
          title: '打卡成功！',
        })
        wx.switchTab({
          url: '/pages/index/index',
        })
      })
      .catch(error => {
        console.log(error)
      })
    })
  },
})