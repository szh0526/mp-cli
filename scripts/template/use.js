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
      name: 'name',
      message: '请选择一个模板名称',
      choices: Object.keys(templates),
    }]).then(async (answer) => {
      const { name } = answer

      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(_templates)) {
        if (key === name) {
          _templates[key].default = 1
        } else {
          delete value.default
        }
      }

      const packageJsonRoot = path.resolve(__dirname, '../../package.json')

      const packageJson = await file.readFile(packageJsonRoot)

      if (packageJson) {
        const config = JSON.parse(packageJson.toString())
        config.templates = _templates

        await file.writeFile(
          packageJsonRoot,
          JSON.stringify(config, null, '\t'),
        )
        logger.clear()
        logger.success(`设置成功，当钱默认模板为${name}`)
      } else {
        logger.error('读取templates配置异常')
        process.exit(1)
      }
    })
  } else {
    logger.warn('暂无模板')
  }
}
