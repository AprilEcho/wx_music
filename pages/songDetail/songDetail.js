// pages/songDetail/songDetail.js
import PubSub from "pubsub-js"
import request from "../../utils/request";

const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,//音乐是否播放
    song: {},
    musicId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId)

    //判断音乐是否播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      //修改当前页面音乐播放状态为true
      this.setData({
        isPlay: true
      })
    }

    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      //修改音乐是否播放的状态
      this.changePlayState(true)
      //修改全局音乐播放状态
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
  },

  //修改播放状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    //修改全局音乐播放状态
    appInstance.globalData.isMusicPlay = isPlay;
  },

  //点击播放
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    // this.setData({
    //   isPlay
    // })
    let {musicId} = this.data
    this.musicControl(isPlay, musicId)
  },

  //控制音乐播放/暂时功能
  async musicControl(isPlay, musicId) {
    if (isPlay) {//音乐播放
      let musicLinkData = await request('/song/url', {id: musicId})
      this.backgroundAudioManager.src = musicLinkData.data[0].url
      this.backgroundAudioManager.title = this.data.song.name
    } else {
      this.backgroundAudioManager.pause()
    }
  },

  //获取音乐详情
  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', {ids: musicId})
    this.setData({
      song: songData.songs[0]
    })
    //修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },

  //切换歌曲
  handleSwitch(event) {
    let type = event.currentTarget.id
    //关闭当前播放的音乐
    this.backgroundAudioManager.stop()

    //拿到下/上一首的id
    PubSub.subscribe('musicId', (msg, musicId) => {
      //获取音乐详情信息
      this.getMusicInfo(musicId)
      //自动播放当前音乐
      this.musicControl(true, musicId)
      //取消订阅
      PubSub.unsubscribe('musicId')
    })
    //发布消息数据给recommendSong页面
    PubSub.publish('switchType', type)
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
  onShareAppMessage: function () {

  }
})