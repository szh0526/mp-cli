/**
 * mp 命令行工具暴露配置文件
 */
const path = require('path')
const logger = require('./../src/lib/log')
const { configName } = require('./../package.json')

module.exports = {
  /**
   * 获取config文件
   */
  getConfig: function () {
    const configPath = path.join(process.cwd(), configName);
    let config = {};
    return new Promise((reslove, reject) => {
      if (fs.existsSync(configPath)) {
        try {
          config = eval(fs.readFileSync(configPath, "utf-8"));
          reslove(config)
        } catch (e) {
          logger.warn(`读取${configName}文件失败`);
          reject(config)
        }
      } else {
        logger.warn(`${configName}文件不存在，请检查后再试`);
        reject(config)
      }
    })
  }
}