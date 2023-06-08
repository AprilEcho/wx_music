// pages/search/search.js
import request from "../../utils/request";

let isSend = true


Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeHolderContent: '',//搜索框默认内容
    hotList: [],//热搜榜列表
    searchContent: '',//搜索框输入的内容
    searchList: [],//模糊匹配的数据

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
  },
  //获取初始化数据
  async getInitData() {
    let placeholderData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeHolderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    })
  },

  //表单内容发生改变的回调
  handleInputChange(event) {
    this.setData({
      searchContent: event.detail.value.trim()
    })
    if (!isSend) return
    isSend = false
    setTimeout(() => {
      //模糊匹配
      this.getSearchList()
      isSend = true
    }, 300)
  },
  //搜索数据功能函数
  async getSearchList() {
    let searchListData = await request('/search', {keywords: this.data.searchContent, limit: 10})
    this.setData({
      searchList: searchListData.result.songs
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
  onShareAppMessage: function () {

  }
})