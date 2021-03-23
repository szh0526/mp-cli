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
        logger.error('当前项目下未找到mp.config.js文件，请检查执行命令目录路径')
        return process.exit(1)
      }
      return null
    }

    const config = file.readFileSync(configPath)
    return config
  },

  /**
   * 获取发布版本文件
   */
  async getUploadJsonConfig() {
    try {
      const versionJsonPath = path.resolve(cwd, 'mp.version.json')

      // 创建版本文件
      if (!file.existsSync(versionJsonPath)) {
        await file.writeFile(versionJsonPath, JSON.stringify({ version: '0.0.0', desc: '', size: {} }, null, '\t'))
      }

      const versionJson = JSON.parse(file.readFileSync(versionJsonPath))

      return versionJson
    } catch (error) {
      logger.error('解析mp.version.json失败')
      return process.exit(1)
    }
  },
}
