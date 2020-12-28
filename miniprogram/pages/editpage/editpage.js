// miniprogram/pages/editpage/editpage.js
const app = getApp()
const db = wx.cloud.database()
const record = db.collection('record')
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
    text: '',//打卡文本
    address:'',//打卡地址
    visibility: '',//可见性
    type: '',//标签
    _id: '',//record记录唯一
    index:0,
    imageList: [],//图片列表
    countIndex: 9,//最多上传图片的数量
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],//图片数组
    state:0,
    clickRecord:true,
    fileIDs: [],
    nickname:'',//未用到
    userInfo:[],//未用到
    recordnum:0,//未用到
    addimage: 0,//监听有没有修改过图片
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
    var count = this.data.count;
    var countIndex = this.data.countIndex;
    var imagelist = []
    wx.showModal({
      title: '添加图片',
      content: '添加图片会覆盖已上传的图片呦~',
      cancelText:"算了",
      confirmText:"添加",
      success: function (res) {
        if(res.cancel) {
        } else {
          wx.chooseImage({
            count: count[countIndex],
            success: function (res) {
              console.log(res)
              imagelist=res.tempFilePaths
              console.log(imagelist)
              that.setData({
                imageList: res.tempFilePaths
              })
            },
          })
        }
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
    if(this.data.addimage ==0) {//未修改图片，可以直接上传
      this.setData ({
        fileIDs: this.data.imageList,
      })
    }
    else {//图片修改：需改名字
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
    }
    Promise.all(promiseArr).then(res=>{
      var data = {
        content: this.data.getContent,
        address:this.data.address,
        image:this.data.fileIDs,//图片地址
        type:this.data.index,//标签
        state:1,//草稿为1
        visibility:this.data.clickRecord,//获取之前的可见性
        time: this.formatDate(),
      };
      db.collection('record').doc(this.data._id).update({
        data: data
      }).then(res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
          title: '已存入草稿！',
        })
        wx.switchTab({
          url: '/pages/homepage/homepage',
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
    console.log("接收来自详情页的_id："+options._id); //接受来自上一个页面的_id
    this.setData({
      _id:options._id
    });
    record.where({
      _id: this.data._id
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          imageList: res.data[0].image,//加载上传过的图片
          address: res.data[0].address,
          text: res.data[0].content,
          clickRecord: res.data[0].visibility,
          type: res.data[0].type,
          state: res.data[0].state,
          _id: res.data[0]._id,
        })
        console.log('编辑-文本：'+this.data.text)
        console.log('编辑-可见：'+this.data.visibility)
        console.log('编辑-标签：'+this.data.type)
        console.log('编辑-图片：'+this.data.imageList)
      },
    })
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
    console.log(this.data.imageList)
    if(this.data.addimage ==0) {//未修改图片，可以直接上传
      this.setData ({
        fileIDs: this.data.imageList,
      })
    }
    else {//图片修改：需改名字
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
      console.log(this.data._id)
      db.collection('record').where({
        _id: this.data._id
      }).update({
        data: data
      }).then(res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
          title: '打卡成功！',
        })
        wx.switchTab({
          url: '/pages/homepage/homepage',
        })
      })
      .catch(error => {
        console.log(error)
      })
    })
    
  },

  //删除记录
  delEdit() {
    console.log(this.data._id)
    var id = this.data._id
    wx.showModal({
      title: '删除记录',
      content: '确定要删除该条草稿吗？',
      cancelText:"再想想",
      confirmText:"删除",
      success: function (res) {
        if(res.cancel) {
        } else {
          record.doc(id).remove({
            success: function(res) {
              console.log('删除成功')
            }
          })
          wx.showToast({
            title: '成功删除！',
          })
          wx.reLaunch({
            url: '../homepage/homepage',
          })
        }
      },
    })
  },
})