const $api = require('./models/global')
const logger = require('./utils/logger')
const $validate = require('./utils/validate')
const $util = require('./utils/util')
const $wxUtil = require('./utils/sdk/wx.sdk')
const $extUtil = require('./utils/sdk/ext.sdk')
const $const = require('./utils/constants')

// app.js
App({
  onLaunch() {
    // 获取用户信息
    wx.getSetting({
      success: (response) => {
        if (response.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
          })
        }
      },
    })
    // 获取系统信息
    wx.getSystemInfo({
      success: (e) => {
        this.globalData.systemInfo = e
        logger.info('当前设备信息: ', e)
        this.getStatusBarInfo(e)
        this.isIphoneX(e)
      },
    })

    // 注册全局公共类
    this.logger = logger
    this.$util = $util
    this.$validate = $validate
    this.$wxUtil = $wxUtil
    this.$extUtil = $extUtil
    this.$const = $const
    this.$api = $api
  },

  onShow() {
  },

  onError() {
  },

  /**
   * 获取系统状态栏信息
   */
  getStatusBarInfo(e) {
    this.globalData.StatusBar = e.statusBarHeight
    const custom = wx.getMenuButtonBoundingClientRect()
    this.globalData.Custom = custom
    this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight
  },

  /**
   * 否判断iPhone X
   */
  isIphoneX(e) {
    if (e.model.indexOf('iPhone X') !== -1 || e.model.indexOf('iPhone 11') !== -1 || e.model.indexOf('iPhone 12') !== -1 || e.model.indexOf('iPhone12') !== -1 || e.model.indexOf('iPhone13') !== -1) {
      this.globalData.isIphoneX = true
    }
  },

  globalData: {
    // 当前小程序appId
    appId: '',
    userInfo: null,
    isIphoneX: false,
  },
})
