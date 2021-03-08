/**
 * mp 命令行工具暴露配置文件工具类
 */
const path = require('path')
const file = require('../lib/file')
const logger = require('../lib/logger')
const { cwd } = require('./index')

// 用户配置
const userConfig = null

module.exports = {
  /**
   * 获取用户配置文件
   */
  async getUserConfig({ level = 2 } = {}) {
    // 存在时，直接使用缓存
    if (userConfig) return userConfig

    // 校验：当前是否存在配置文件
    const configPath = path.join(cwd, 'mp.config.js')
    if (!file.existsSync(configPath)) {
      if (level === 2) {
        logger.error('当前项目尚未创建mp.config.js文件')
        return process.exit(1)
      }
      return null
    }

    const config = file.readFileSync(configPath)
    return JSON.parse(config.toString())
  },
}
