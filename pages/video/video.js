import request from "../../utils/request";
// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],//导航标签数据
    navId: '',
    videoList: [],
    videoId: '',
    videoUpdateTime: [],//记录video播放时长
    isTriggered: false,//标识下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData();
  },

  // 获取导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 20),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId)
  },

  //获取视频列表
  async getVideoList(id) {
    let videoAddressArr = []
    let index = 0
    let videoListData = await request('/video/group', {id})
    for (let i = 0; i < videoListData.datas.length; i++) {
      let videoAddressId = videoListData.datas[i].data.vid
      let videoAddress = await request('/video/url', {id: videoAddressId})
      videoAddressArr.push(videoAddress.urls[0].url)
      // console.log(videoAddressArr)
    }
    let videoList = videoListData.datas.map(item => {
      item.id = index++
      item.url = videoAddressArr[index]
      return item
    })
    this.setData({
      videoList,
      isTriggered: false
    })
    wx.hideLoading()
  },

  //点击切换导航的回调
  changeNav(event) {
    let navId = event.currentTarget.id
    this.setData({
      navId: navId * 1,
      videoList: []
    })
    wx.showLoading({
      title: '正在加载'
    })
    this.getVideoList(this.data.navId)
  },

  //点击播放
  handlePlay(event) {
    let vid = event.currentTarget.id
    //判断当前视频是否为同一个（调用stop时需要判断视频对象，undifined.stop()会报错）
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    //
    // this.vid = vid
    //
    // //更新data中videoId的状态数据
    this.setData({
      videoId: vid
    })

    this.videoContext = wx.createVideoContext(vid)
    //当前视频之前是否播放过，如果有，跳转到指定位置
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },

  //监听视频播放的进度
  handleTimeUpdate(event) {
    let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime}
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if (videoItem) {
      videoItem.currentTime = videoTimeObj.currentTime
    } else {
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },

  //视频播放结束调用
  handleEnd(event) {
    let {videoUpdateTime} = this.data
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1)
    this.setData({
      videoUpdateTime
    })
  },

  //下拉加载更新
  handleRefresher() {
    this.getVideoList(this.data.navId)
  },

  //上拉触底回调
  handleToLower() {
    wx.showToast({
      title: '暂无更多内容~',
      icon: 'none'
    })
  },

  toSearch(){
    wx.navigateTo({
      url:'/pages/search/search'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    if (from === 'button') {
      return {
        title: '歌曲分享',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    } else {
      return {
        title: '微星小伙伴',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }

  }
})