// 引入SDK核心类
var QQMapWX = require('./qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp();
const db = wx.cloud.database();
Page({
  data:{
    skin: 'normal-skin',
    addListShow: false,
    latitude: '30.326058',
    longitude: '120.155530',
    suggestion: [],
    markers:[],
    keyword:'',
    scale:16,
    address:'' ,
    clickView:false,
    clickHotel:false,
    clickEat:false,
    clickCollect:false,
    clickRecord:false,
    view:[],
    eat:[],
    hotel:[],
    state:0,
  },
  //bindtap事件函数 换肤功能
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

  onLoad: function () {
    var that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '453BZ-2JRCS-TM7OY-6TUVN-2XL2T-I3FFG'
    });
    this.mapCtx = wx.createMapContext('myMap');
    wx.showLoading({
      title: '正在玩命加载中',
      mask:true
    });
    //定位
    wx.getLocation({
      type: 'gcj02',//默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
      isHighAccuracy: true,
      success:function(res) {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.getLocal(latitude, longitude)//将此时的经纬度转换为地址
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });
      },    
      fail(err) {
        wx.showToast({
          title: '定位失败，请查看是否打开手机定位！',
          icon: 'none',
        })
      },
      complete: function () {
        //隐藏定位中信息进度
        wx.hideLoading()
      }
    })
  },
  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(JSON.stringify(res));
        var address = res.result.formatted_addresses.recommend
        console.log(address)
        vm.setData({
          address:address,
          latitude:latitude,
          longitude:longitude,
          markers:[{
            id:1,
            latitude:latitude,
            longitude:longitude,
            iconPath: '../../images/index_location.png',
            height:40,
            width:40
          }]
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  bindregionchange: function (e) {
    var that = this
    if (e.type == "begin") {
      console.log("begin");
    } else if (e.type == "end") {
      var mapCtx = wx.createMapContext("myMap")
      mapCtx.getCenterLocation({
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          that.getLocal(latitude, longitude)
        }
      }) 
    }
  },
  //重定位
  tapM() {
		var that = this;
		wx.getLocation({
			type: 'gcj02',
			isHighAccuracy: true,
			success(res) {
				const latitude = res.latitude
        const longitude = res.longitude
        that.getLocal(latitude, longitude)//将此时的经纬度转换为地址
				that.setData({
					scale: 16,
					latitude: latitude,
					longitude: longitude,
					roadFlag: true,
				})
			}
		})
	},
  onShow: function () {
    app.setSkin(this);
    var that=this;
    console.log("onShow");
    that.mapCtx = wx.createMapContext("myMap");
    that.mapCtx.getCenterLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.getLocal(latitude, longitude)
      }
    }) 
  },
 //触发关键词输入提示事件
 getsuggest: function (e) {
  var _this = this;
  var keyword = e.detail.value;
  _this.setData({
    addListShow:true  
  })
  //调用关键词提示接口
  qqmapsdk.getSuggestion({
    //获取输入框值并设置keyword参数
    keyword: keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
    region: '杭州', //设置城市名，限制关键词所示的地域范围，非必填参数
    page_size:20,
    page_index:1,
    success: function (res) {//搜索成功后的回调
      console.log(res);
      var sug = [];
      for (var i = 0; i < res.data.length; i++) {
        sug.push({ // 获取返回结果，放到sug数组中
          title: res.data[i].title,
          id: res.data[i].id,
          addr: res.data[i].address,
          latitude: res.data[i].location.lat,
          longitude: res.data[i].location.lng
        });
      }
      _this.setData({//设置suggestion属性，将关键词搜索结果以列表形式展示
        showview: false,
        suggestion: sug,
      })
    },
    fail: function (error) {
      console.error(error+"失败");
      _this.setData({
        showview: true
      })
    },
    complete: function (res) {
      console.log(res);
    
    }
  });
},
  showAddList: function () {
    this.setData({
      addListShow: true
    })
  },
    //方法回填
    backfill: function (e) {
      var id = e.currentTarget.id;
      for (var i = 0; i < this.data.suggestion.length; i++) {
        if (i == id) {
          //console.log(this.data.suggestion[i])
          this.setData({
            addListShow: false,
            latitude: this.data.suggestion[i].latitude,
            longitude: this.data.suggestion[i].longitude
          }); 
          return;
          //console.log(this.data.centerData)
        }
      }
    },
    back1: function () {
      if (this.data.addListShow) {
        this.setData({
          addListShow: false
        })
      }else {
        wx.navigateBack({
          delta: 1
        })
      }
    },
    //显示景点
    showView:function(){
      var that = this
      const _ = db.command
      that.setData({
        clickView:true
      })
      console.log(that.data.longitude+"   "+that.data.latitude)
      db.collection('recommend').orderBy('scole','desc').where({
        type:1,
        longitude:_.gte(that.data.longitude-0.0315).and(_.lte(that.data.longitude+0.0315)),
        latitude:_.gt(that.data.latitude-0.027).and(_.lt(that.data.latitude+0.027))
      }).limit(10).get({
        success: function(res) {
          console.log(res.data)
          that.setData({
            view:res.data
          })
          const markers = []
          for (var i = 0; i < res.data.length; i++) {
            markers.push({
              iconPath: res.data[i].image,
              id:i,
              //id: res.data[i]._id,
              title:res.data[i].name,
              latitude: res.data[i].latitude,
              longitude: res.data[i].longitude,
              width: 40,
              height: 40 
            });
          }
          console.log(markers)
          that.setData({
            markers:markers,
          })
        }
      })
    },
    hideView:function(){
      this.setData({
        clickView:false,
        markers:[]
      })
      
    },
    showHotel:function(){
      var that = this
      const _ = db.command
      this.setData({
        clickHotel:true
      })
      console.log(that.data.longitude+"   "+that.data.latitude)
      db.collection('recommend').orderBy('scole','desc').where({
        type:3,
        longitude:_.gte(that.data.longitude-0.0315).and(_.lte(that.data.longitude+0.0315)),
        latitude:_.gt(that.data.latitude-0.027).and(_.lt(that.data.latitude+0.027))
      }).limit(10).get({
        success: function(res) {
          console.log(res.data)
          that.setData({
            hotel:res.data
          })
          const markers = []
          for (var i = 0; i < res.data.length; i++) {
            markers.push({
              iconPath: res.data[i].image,
              id:i,
              //id: res.data[i]._id,
              title:res.data[i].name,
              latitude: res.data[i].latitude,
              longitude: res.data[i].longitude,
              width: 40,
              height: 40 
            });
          }
          console.log(markers)
          that.setData({
            markers:markers,
          })
        }
      })
    },
    hideHotel:function(){
      this.setData({
        clickHotel:false,
        markers:[]
      })
    },
    showEat:function(){
      var that = this
      const _ = db.command
      this.setData({
        clickEat:true
      })
      console.log(that.data.longitude+"   "+that.data.latitude)
      db.collection('recommend').orderBy('scole','desc').where({
        type:2,
        longitude:_.gte(that.data.longitude-0.0315).and(_.lte(that.data.longitude+0.0315)),
        latitude:_.gt(that.data.latitude-0.027).and(_.lt(that.data.latitude+0.027))
      }).limit(10).get({
        success: function(res) {
          console.log(res.data)
          that.setData({
            eat:res.data
          })
          console.log(res.data)
          const markers = []
          for (var i = 0; i < res.data.length; i++) {
            markers.push({
              iconPath: res.data[i].image,
              id:i,
              //id: res.data[i]._id,//无法获取字符串？
              title:res.data[i].name,
              latitude: res.data[i].latitude,
              longitude: res.data[i].longitude,
              width: 40,
              height: 40 
            });
          }
          console.log(markers)
          that.setData({
            markers:markers,
          })
          console.log(this.data.markers)
        }
      })
    },
    hideEat:function(){
      this.setData({
        clickEat:false,
        markers:[]
      })
    },
    //去打卡
    gotoNewRecord: function() {
      wx.cloud.callFunction({
        name:'getOpenid',
        complete:res=>{
          console.log('openid--',res.result.openid)
          db.collection('users').where({
            openid: res.result.openid,
          }).get({
            success: res =>  {
              console.log(res)
              if(res.data.length==0){
                wx.showToast({
                  title: '用户未注册，请先注册！',
                })
                wx.navigateTo({
                  url: '../login/login',
                })
              }else{
                console.log(res.data[0].userData.state)
                this.setData({
                  state:res.data[0].userData.state
                })
                if(res.data[0].userData.state==0){
                  console.log("address："+this.data.address)
                  wx.navigateTo({
                    url: '../gotorecord/gotorecord?address='+this.data.address,
                  })
                }else{
                  wx.showToast({
                    title: '账号状态异常请联系客服',
                    icon: 'none',
                  })
                }
              }
            }
          })
        } 
      })
    },
    //跳转至详情页
    showDetial: function(e) {
      let i = e.detail.markerId
      let name = this.data.markers[i].title
      wx.navigateTo({
        url: '../collectinformation/collectinformation?name='+name
      })
    }  
})