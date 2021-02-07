/**
 * logger日志+日志实时上报
 * logger输出级别分为五种：debug,info,warn,error,fatal。
 * 微信实时日志：https://developers.weixin.qq.com/miniprogram/dev/framework/realtimelog/
 */
const { formatTime } = require('../util')
const { isString, isEmptyObject, isError } = require('../validate/index')
const {
  compareVersion, getStorageSync, getSystemInfoSync,
} = require('../sdk/wx.sdk')
const { STORAGE_KEYS } = require('../constants/index')

// 实时日志, 系统定时上传
const RealtimeLogManager = wx.getRealtimeLogManager()
// 普通日志, 需要用户手动上传
const LogManager = wx.getLogManager()

const report = ({ level = 'info', message, option }) => {
  try {
    if (!isString(message)) {
      console.error('message was wrong type!!')
      return
    }

    const date = formatTime(new Date())
    const version = getSystemInfoSync().SDKVersion
    const traceId = getStorageSync(STORAGE_KEYS.TRACEID)
    let _option = option

    // Error 消息打印出错误的堆栈 ，字符串直接打印
    if (isError(_option)) {
      _option = `${_option.message} \r\n ${_option.stack}`
    }

    const customMsg = `[${level}][${date}][${traceId}] ${message} \r\n`

    if (level === 'info') {
      console.info(customMsg, _option)
    } else {
      console.error(customMsg, _option)
    }

    // 实时日志上报
    _option = !isEmptyObject(_option) ? `${JSON.stringify(_option, null, '\t')} \r\n` : _option
    if (compareVersion(version, '2.7.1') >= 0) {
      RealtimeLogManager.info(`${customMsg} ${_option}`)
    } else if (compareVersion(version, '2.1.0') >= 0 && compareVersion(version, '2.7.1') < 0) {
      LogManager.info(`${customMsg} ${_option}`)
    }
    // 添加过滤关键字
    if (compareVersion(version, '2.7.3') >= 0) {
      RealtimeLogManager.addFilterMsg(`traceId: ${traceId}`)
    }
  } catch (e) {
    console.error(e.message)
  }
}

/**
 * info:（信息）在粗粒度级别上突出强调应用程序的运行过程，打印一些感兴趣的或者重要的信息。
 * warn:（警告）表明会出现潜在错误的情形，有些信息不是错误信息，但是也要上报一些提示。
 * debug:（调试）指出细粒度信息事件对调试应用程序是非常有帮助的，主要用于开发过程中打印一些运行信息。
 * error:（错误）指出虽然发生错误事件，但仍然不影响系统的继续运行。
 * fatal:（致命）指出每个严重的错误事件将会导致应用程序的退出。
 * 式例: logger.info('测试日志')
        logger.info('测试日志',JSON.stringify({a:1}))
        logger.info('测试日志',{a:1,b:{c:1}})
 * @param {string} message 错误信息
 * @param {object} obj 对象
 */
module.exports = {
  info: (message, option) => {
    report({
      level: 'info',
      message,
      option,
    })
  },
  warn: (message, error) => {
    report({
      level: 'warn',
      message,
      option: error,
    })
  },
  debug: (message, error) => {
    report({
      level: 'debug',
      message,
      option: error,
    })
  },
  error: (message, error) => {
    report({
      level: 'error',
      message,
      option: error,
    })
  },
  fatal: (message, error) => {
    report({
      level: 'fatal',
      message,
      option: error,
    })
  },
}
