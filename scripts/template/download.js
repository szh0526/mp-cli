const inquirer = require('inquirer')
const { downloadTemplate } = require('../git/download')
const { isEnName } = require('../../lib/validate')
const { templates } = require('../../package.json')

module.exports = () => {
  const _templates = templates || {}

  inquirer.prompt([{
    type: 'list',
    name: 'templateName',
    message: '请选择模板名称',
    choices: Object.keys(templates),
  }, {
    type: 'input',
    name: 'projectName',
    message: '请输入项目文件名称',
    validate(val) {
      if (val === '') {
        return '项目名称不能为空!'
      } if (!isEnName(val)) {
        return '项目名称格式错误!'
      }
      return true
    },
  },
  ]).then(async (answer) => {
    const { templateName, projectName } = answer
    const { url } = _templates[templateName]
    await downloadTemplate(url, projectName)
  })
}
