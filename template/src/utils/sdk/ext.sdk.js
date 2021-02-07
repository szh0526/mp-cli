/**
 * 第三方平台ext配置工具类（积理studio）
 */
const logger = require('../logger/index')
const $wxUtil = require('./wx.sdk')
const { STORAGE_KEYS } = require('../constants')

// 初始化配置
const setExtConfig = () => {
  const extConfig = $wxUtil.getExtConfigSync()
  if (extConfig) {
    logger.info('第三方平台自定义配置: ', extConfig)
    $wxUtil.setStorageSync(STORAGE_KEYS.EXT_CONFIG, extConfig)
  } else {
    logger.error('第三方平台自定义配置异常', new Error('第三方平台自定义配置异常'))
  }
}

// 获取配置缓存
const getExtConfig = () => {
  const config = $wxUtil.getStorageSync(STORAGE_KEYS.EXT_CONFIG)
  return config
}

// 根据页面名称获取ext配置
const getPageExtConfig = () => {
  try {
    const page = $wxUtil.getCurrentPageUrl()
    if (page) {
      const config = getExtConfig()
      if (config) {
        const {
          pages, outerAppId, envType, appConfig,
        } = config
        let widgetList = []
        // 根据页面路径找到相关配置
        const pageConfig = pages.find((x) => x.pagePath.indexOf(page) > -1)
        if (pageConfig) {
          widgetList = pageConfig.widgetList || []
        }
        const extConfig = {
          widgetList,
          outerAppId,
          tenantId: appConfig.tenantId,
          env: envType,
        }
        logger.info('获取ext配置成功: ', extConfig)
        return extConfig
      }
      logger.info('获取ext配置为空')
      return null
    }
    logger.info('当前页面ext配置为空')
    return null
  } catch (error) {
    logger.error('获取ext配置失败: ', error)
    return null
  }
}

module.exports = {
  setExtConfig,
  getExtConfig,
  getPageExtConfig,
}
