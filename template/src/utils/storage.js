/* eslint-disable*/
String.prototype.Trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @description 读取本地存储，
 * @param { string } 要读取的key
 * @param {boolean} 是否是同步
 * @todo 读取本地存储，判断key只能是string且非纯空格 如果不是将报错，
 */
function getStorage(key, isSync = false) {
  console.log('getStorage', key)
  if (typeof key !== 'string') {
    throw new Error('key is typeof string at Utils.storage.Get')
  }
  if (key.Trim() === '') {
    throw new Error('key is not null at Utils.storage.Get')
  }
  if (isSync) {
    return wx.getStorageSync(key.Trim())
  }
  wx.getStorage({
    key: key.Trim(),
    success(res) {
      return res.data
    },
    fail() {},
  })
}
/**
 * @description 设置本地存储，
 * @param { string } 存储的key
 * @param { * } 存储的内容
 * @param {boolean} 是否是同步
 * @todo 设置本地存储，判断key只能是string且非纯空格 如果不是将报错，
 */
function setStorage(key, data, isSync = false) {
  console.log('setStorage', key, data)
  if (typeof key !== 'string') {
    throw new Error('key is typeof string at Utils.storage.Set')
  }
  if (key.Trim() === '') {
    throw new Error('输入内容不能为空')
  }
  if (isSync) {
    wx.setStorageSync(key.Trim(), data)
  } else {
    wx.setStorage({
      key: key.Trim(),
      data,
      success() {
        console.log(key, data, '设置成功')
      },
    })
  }
}
/**
 * @description 清理本地存储，
 * @param { string } 存储的key（为空将清空所有）
 * @param {boolean} 是否是同步
 * @todo 清理本地存储，如果key为空则清空所有，如果key不为空则清空指定的key
 */
function removeStorage(key = '', isSync = false) {
  if (typeof key !== 'string') {
    throw new Error('key is typeof string at Utils.storage.rm')
  }
  if (key === '') {
    if (isSync) {
      wx.clearStorage({
        success() {},
      })
    } else {
      wx.clearStorageSync()
    }
  } else if (!isSync) {
    wx.removeStorage({
      key: key.Trim(),
      success() {},
    })
  } else {
    wx.removeStorage(key.Trim())
  }
}

export { getStorage, setStorage, removeStorage }
