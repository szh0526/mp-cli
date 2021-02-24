const logger = require('./utils/logger/index')

/**
 * 全局配置
 * 区别开发版、体验版、线上版环境配置
 * develop开发版，trial体验版，release线上版
 */
module.exports = function () {
  const previewConf = {
    baseUrl: 'http://wdbgateway-pre.jd.com/app/api',
    dataSource: '',
  }

  const prodConf = {
    baseUrl: 'https://wdbapi.jd.com/app/api',
    dataSource: '',
  }

  try {
    const envVersion = wx.getAccountInfoSync().miniProgram.envVersion || 'release'
    const title = `当前环境: ${envVersion}，是否生产: ${envVersion === 'release'}`
    if (envVersion === 'develop') {
      logger.info(title, previewConf)
      return previewConf
    }
    logger.info(title, prodConf)
    return prodConf
  } catch (err) {
    logger.error('获取环境配置失败: ', err)
    return prodConf
  }
}
