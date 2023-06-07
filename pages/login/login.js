import request from "../../utils/request";
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //表单项内容发生改变
  handleInput(event) {
    let type = event.currentTarget.id;
    this.setData({
      [type]: event.detail.value
    })
  },
  //登陆验证
  async login() {
    let {email, password} = this.data;
    if (!email) {
      wx.showToast({
        title:'邮箱不能为空',
        icon:'none'
      })
      return;
    }
    //定义正则表达式
    let emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$/;
    if(!emailReg.test(email)){
      wx.showToast({
        title:'邮箱格式错误',
        icon:'none'
      })
      return;
    }
    if(!password){
      wx.showToast({
        title:'密码不能为空',
        icon:'none'
      })
      return;
    }

    //后端验证
    let result = await request('/login', {email, password,isLogin:true})
    if (result.code===200){
      wx.showToast({
        title:"登陆成功",
        icon:'none'
      })
      //将用户信息存储
      wx.setStorageSync('userInfo',JSON.stringify(result.profile))

      wx.reLaunch({
        url:'/pages/personal/personal'
      })
    }else if(result.code===400){
      wx.showToast({
        title:"邮箱错误",
        icon:'none'
      })
    }else if (result.code===502){
      wx.showToast({
        title:"密码错误",
        icon:'none'
      })
    }else{
      wx.showToast({
        title:"未知错误，请稍后重试",
        icon:'none'
      })
    }

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