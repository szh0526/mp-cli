const download = require('download-git-repo')
const ora = require('ora')
const logger = require('../../lib/logger')

const handleError = (err) => {
  logger.error(`下载模板失败，${err.message}`)
  process.exit(1)
}

const downloadTemplate = (url, fileName) => new Promise((resolve) => {
  const spinner = ora('开始下载模板')
  spinner.start()
  download(`direct:${url}`, fileName, { clone: true }, (err) => {
    if (err) {
      spinner.fail()
      handleError(err)
      resolve(false)
    } else {
      spinner.text = '下载模板成功'
      spinner.succeed()
      logger.clear()
      resolve(true)
    }
  })
})

module.exports = {
  downloadTemplate,
}
