/**
 * mp 命令行工具暴露配置文件工具类
 */
const path = require('path')
const file = require('../src/lib/file')

module.exports = {
  /**
   * 获取mpconfig文件
   */
  async getMpConfig() {
    const configPath = path.join(process.cwd(), 'mp.config.js')
    const config = file.readFileSync(configPath)
    return config
  },
}
