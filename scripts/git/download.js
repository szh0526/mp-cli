const download = require('download-git-repo')
const ora = require('ora')
const logger = require('../../lib/logger')

const handleError = (err) => {
  const { message } = err
  if (message.indexOf('Response code 404 (Not Found)') > -1) {
    logger.error('仓库地址不存在，请检查模板仓库地址')
  } else if (message.indexOf('failed with status 128') > -1) {
    logger.error('项目目录已存在，请更换文件名称')
  } else if (message.indexOf('failed with status 1') > -1) {
    logger.error('仓库地址缺少分支（eg:master），请重新配置')
  } else {
    logger.error(`下载模板失败，${message}`)
  }
  process.exit(1)
}

const downloadTemplate = (url, fileName) => new Promise((resolve) => {
  logger.info('开始下载模板')
  const spinner = ora('downloading...')
  spinner.start()
  download(`direct:${url}`, fileName, { clone: true }, (err) => {
    if (err) {
      spinner.fail()
      handleError(err)
      resolve(false)
    } else {
      spinner.succeed()
      logger.clear()
      logger.success(`下载模板成功，run cd ${fileName} \r\n`)
      resolve(true)
    }
  })
})

module.exports = {
  downloadTemplate,
}
