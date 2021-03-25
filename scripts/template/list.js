const inquirer = require('inquirer')
const chalk = require('chalk')
const logger = require('../../lib/logger')
const { templates } = require('../../package.json')

module.exports = () => {
  const _templates = templates || {}
  if (Object.keys(_templates).length) {
    let text = '\r\n模板列表:\r\n'
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(_templates)) {
      if (value && value.default) {
        text += chalk.blueBright(` * ${key} ${value.url}\r\n`)
      } else {
        text += `   ${key} ${value.url}\r\n`
      }
    }
    console.log(text)
  } else {
    logger.info('暂无模板\n')
    inquirer.prompt([{
      type: 'confirm',
      name: 'add',
      message: '是否添加新模板？',
    }]).then((answer) => {
      if (answer.add) {
        require('./index').add()
      } else {
        process.exit(1)
      }
    })
  }
}
