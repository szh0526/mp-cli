const path = require('path')
const inquirer = require('inquirer')
const logger = require('../../lib/logger')
const file = require('../../lib/file')
const { templates } = require('../../package.json')

module.exports = () => {
  const _templates = templates || {}

  if (Object.keys(_templates).length > 0) {
    inquirer.prompt([{
      type: 'list',
      name: 'key',
      message: '请选择要删除的模板名称',
      choices: ['none'].concat(Object.keys(templates)),
    }]).then(async (answer) => {
      const { key } = answer

      if (key === 'base') {
        logger.warn('基础模板不可删除，请选择其他模板!')
        return
      }

      if (key === 'none') {
        logger.warn('没有执行任何操作!')
        return
      }

      const packageJsonRoot = path.resolve(__dirname, '../../package.json')

      const packageJson = await file.readFile(packageJsonRoot)

      if (packageJson) {
        const config = JSON.parse(packageJson.toString())
        delete config.templates[key]

        await file.writeFile(
          packageJsonRoot,
          JSON.stringify(config, null, '\t'),
        )
        logger.clear()
        logger.success('删除模板成功')
      } else {
        logger.error('读取templates配置异常')
        process.exit(1)
      }
    })
  } else {
    logger.warn('暂无模板')
  }
}
