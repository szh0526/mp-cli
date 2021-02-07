const logger = require('../logger/index')
const promisify = require('./promisify')
const { baseUrl } = require('../../config')()
const { getCurrentFullUrl, getStorageSync, redirectTo } = require('../sdk/wx.sdk')

const wxRequest = promisify(wx.request)
const CODE_MESSAGE = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '请求资源不存在。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  '-1': '系统开了个小差',
}

class HttpRequest {
  constructor() {
    this.checkStatus = this.checkStatus.bind(this)
  }

  request(opt) {
    return wxRequest(opt)
      .then((data) => {
        logger.info('请求参数:', opt)
        return this.checkStatus(data)
      })
      .then((data) => Promise.resolve(data))
      .catch((error) => {
        this.showError(error)
        return Promise.reject(error)
      })
  }

  throwException(errorMsg, errorCode = -1, response = {}) {
    const _errorMsg = errorMsg || '系统开了个小差'
    const error = new Error(_errorMsg)
    error.name = errorCode
    error.response = response
    throw error
  }

  checkStatus(response) {
    logger.info('接口响应结果,', response)
    const { errMsg, data, statusCode } = response
    const _statusCode = statusCode.toString()

    if (_statusCode.startsWith('2')) {
      const { code, message } = data
      if (code === 0) { // 业务成功
        return data
      } if (code >= 20001 && code <= 29999) { // 用户未登陆或其他用户错误
        this.goLogin()
      } else if (code !== 1 && code !== 40001) {
        return data
      } else {
        // 业务异常
        this.throwException(message, code, response)
        return null
      }
    }
    this.throwException(CODE_MESSAGE[_statusCode] || errMsg, _statusCode, response)
    return null
  }

  transApiUrl(opt) {
    let { url } = opt
    url = !url.startsWith('/') ? `${baseUrl}/${url}` : `${baseUrl}${url}`

    if (url.indexOf('api=') > -1) {
      url += '&'
    } else {
      url = !url.startsWith('?') ? `${url}?` : `${url}`
    }
    return url
  }

  transOptions(opt) {
    const token = getStorageSync('auth_token')

    const method = (opt.method || 'GET').toUpperCase()
    let { data } = opt

    let url = this.transApiUrl(opt)

    if (method === 'GET') {
      url += `&body=${encodeURIComponent(JSON.stringify(data))}`
    } else {
      data = JSON.stringify(data)
    }

    return {
      method: method || 'GET',
      header: {
        // 'Content-Type': method === 'POST'
        //   ? 'application/json; charset=utf-8'
        //   : 'application/x-www-form-urlencoded; charset=utf-8',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        cookie: `token=${token}`,
      },
      mode: 'no-cors',
      credentials: 'include',
      url,
      data,
    }
  }

  showError(error) {
    wx.showToast({
      title: error.message || CODE_MESSAGE['-1'],
      icon: 'none',
      duration: 2000,
    })
    logger.error(error.message, error)
  }

  goLogin() {
    const returnUrl = getCurrentFullUrl()

    redirectTo({
      url: `/pages/login/login?returnUrl=${returnUrl}`,
    })
  }

  get(param) {
    const opt = this.transOptions({
      ...param,
    })
    return this.request(opt)
  }

  post(param) {
    const opt = this.transOptions({
      ...param,
      method: 'POST',
    })
    return this.request(opt)
  }
}

module.exports = new HttpRequest()
