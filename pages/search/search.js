// pages/search/search.js
import request from "../../utils/request";

let timeout = null


Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeHolderContent: '',//搜索框默认内容
    hotList: [],//热搜榜列表
    searchContent: '',//搜索框输入的内容
    searchList: [],//模糊匹配的数据
    historyList: [],//历史记录列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()

    this.getSearchHistory()
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
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      //模糊匹配
      this.getSearchList()
    }, 2000)
  },
  //搜索数据功能函数
  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return
    }
    let {searchContent, historyList} = this.data
    let searchListData = await request('/search', {keywords: searchContent, limit: 10})
    this.setData({
      searchList: searchListData.result.songs
    })

    //添加搜索历史
    historyList.unshift(searchContent)
    this.setData({
      historyList: Array.from(new Set(historyList))
    })
    wx.setStorageSync('searchHistory', Array.from(new Set(historyList)))
  },

  //获取本地历史记录
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },

  //清空搜索内容
  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: []
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