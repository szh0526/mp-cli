const path = require('path')
const inquirer = require('inquirer')
const logger = require('../../lib/logger')
const { isEnName } = require('../../lib/validate')
const file = require('../../lib/file')
const { templates } = require('../../package.json')

module.exports = () => {
  const _templates = templates || {}

  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入模板名称',
      validate(val) {
        if (val === '') {
          return '模板名称不能为空!'
        } if (!isEnName(val)) {
          return '模板名称格式错误!'
        } if (_templates[val]) {
          return '模板已存在，请重新输入!'
        }
        return true
      },
    }, {
      type: 'input',
      name: 'url',
      message: '请输入模板[git域名]/[git账户名]/[git仓库名],eg:https://github.com/xxx/xxx',
      validate(val) {
        if (val === '') {
          return '地址不能为空!'
        }
        return true
      },
    }, {
      type: 'list',
      name: 'isDefault',
      message: '是否设置为默认模板？',
      choices: [
        'no',
        'yes',
      ],
      default: 'no',
    },
  ]).then(async (answer) => {
    const { name, url, isDefault } = answer
    // 过滤 unicode 字符
    _templates[name] = {
      url,
    }

    // 设置为默认模板
    if (isDefault === 'yes') {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(_templates)) {
        if (key === name) {
          _templates[key].default = 1
        } else {
          delete value.default
        }
      }
    }

    // 重写package.json
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
      logger.success('新增模板成功')
    } else {
      logger.error('读取templates配置异常')
      process.exit(1)
    }
  })
}
