const logger = require('../logger/index')
const { isNumber } = require('../validate')

const checkMethod = (methodName) => {
  if (wx[methodName]) {
    return true
  }
  // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
  // wx.showModal({
  //   title: '提示',
  //   content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
  // })
  if (logger && logger.error) {
    logger.error(`not support ${methodName} api`)
  }
  console.error(`not support ${methodName} api`)
  return false
}

const getExtConfigSync = () => {
  const flag = checkMethod('getExtConfigSync')
  if (flag) {
    return wx.getExtConfigSync()
  }
  return null
}

/* 获取当前页url */
const getCurrentPageUrl = () => {
  const pages = getCurrentPages()
  if (pages && pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    const url = currentPage.route
    return url
  }
  return '暂无'
}

const getCurrentFullUrl = () => {
  try {
    const pages = getCurrentPages() // 获取加载的页面
    const currentPage = pages[pages.length - 1] // 获取当前页面的对象
    const url = currentPage.route // 当前页面url
    const { options } = currentPage // 获取url中所带的参数
    // 拼接url的参数
    let fullURL = `/${url}?`

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(options)) {
      fullURL += `${key}=${value}&`
    }

    fullURL = fullURL.substring(0, fullURL.length - 1)
    return encodeURIComponent(fullURL)
  } catch (err) {
    logger.error(err.message)
    return ''
  }
}

const getSystemInfoSync = () => {
  const flag = checkMethod('getSystemInfoSync')
  if (flag) {
    return wx.getSystemInfoSync()
  }
  return null
}

// 下载图片
const downloadFile = (imgurl) => new Promise((resolve, reject) => {
  const flag = checkMethod('downloadFile')
  if (flag) {
    wx.downloadFile({
      url: imgurl,
      complete(res) {
        logger.info('下载图片返回结果: ', res)
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject(new Error(res))
        }
      },
      fail(res) {
        logger.info('下载图片失败: ', res)
        reject(new Error(res))
      },
    })
  } else {
    reject(new Error('下载图片失败！'))
  }
})

// 版本号比较
const compareVersion = (version1, version2) => {
  const v1 = version1.split('.')
  const v2 = version2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i += 1) {
    const num1 = parseInt(v1[i], 10)
    const num2 = parseInt(v2[i], 10)

    if (num1 > num2) {
      return 1
    } if (num1 < num2) {
      return -1
    }
  }

  return 0
}

const storage = {
  getStorageSync(key) {
    if (typeof key !== 'string') {
      throw new Error('key is typeof string at Utils.storage.Get')
    }
    if (key === '') {
      throw new Error('key is not null at Utils.storage.Get')
    }

    const flag = checkMethod('getStorageSync')
    if (flag) {
      return wx.getStorageSync(key)
    }
    return null
  },
  setStorageSync(key, data) {
    if (typeof key !== 'string') {
      throw new Error('key is typeof string at Utils.storage.Set')
    }
    if (key === '') {
      throw new Error('输入内容不能为空')
    }

    const flag = checkMethod('setStorageSync')
    if (flag) {
      console.log('setStorageSync', key, data)
      return wx.setStorageSync(key, data)
    }
    return null
  },
  removeStorageSync(key = '') {
    if (typeof key !== 'string') {
      throw new Error('key is typeof string at Utils.storage.rm')
    }

    const flag = checkMethod('removeStorageSync')
    if (flag) {
      return wx.removeStorageSync(key)
    }
    return null
  },
}

const router = {
  switchTab({ url }) {
    const flag = checkMethod('switchTab')
    if (flag) {
      wx.switchTab({
        url,
      })
    }
  },
  reLaunch({ url }) {
    const flag = checkMethod('reLaunch')
    if (flag) {
      wx.reLaunch({
        url,
      })
    }
  },
  redirectTo({ url }) {
    const flag = checkMethod('redirectTo')
    if (flag) {
      wx.redirectTo({
        url,
      })
    }
  },
  navigateTo({ url }) {
    const flag = checkMethod('navigateTo')
    if (flag) {
      wx.navigateTo({
        url,
      })
    }
  },
  navigateBack(delta) {
    if (delta || !isNumber(delta)) return
    const pages = getCurrentPages()
    if (pages && pages.length > 0) {
      const prevPage = pages[pages.length - delta]
      const flag = checkMethod('navigateBack')
      if (flag && prevPage) {
        wx.navigateBack({
          delta: prevPage || 1,
        })
      }
    }
  },
}

const makePhoneCall = (phoneNumber) => {
  const flag = checkMethod('makePhoneCall')
  if (flag) {
    wx.makePhoneCall({
      phoneNumber,
    })
  }
}
const setClipboardData = (data) => {
  const flag = checkMethod('setClipboardData')
  if (flag) {
    wx.setClipboardData({
      data,
    })
  }
}

const keyboard = {
  hideKeyboard: (data) => {
    const flag = checkMethod('hideKeyboard')
    if (flag) {
      wx.hideKeyboard({
        data,
      })
    }
  },
}

module.exports = {
  ...storage,
  ...router,
  ...keyboard,
  getCurrentPageUrl,
  getCurrentFullUrl,
  getSystemInfoSync,
  downloadFile,
  compareVersion,
  getExtConfigSync,
  makePhoneCall,
  setClipboardData,
}
