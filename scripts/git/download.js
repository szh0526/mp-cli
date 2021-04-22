const downloadGit = require('download-git-repo')
const ora = require('ora')
const logger = require('../../lib/logger')

const handleError = (err) => {
  logger.error(`下载失败，${err.message}`)
  process.exit(1)
}

const download = (url, fileName) => new Promise((resolve) => {
  const spinner = ora('开始下载')
  spinner.start()
  downloadGit(`direct:${url}`, fileName, { clone: true }, (err) => {
    if (err) {
      spinner.fail()
      handleError(err)
      resolve(false)
    } else {
      spinner.text = '下载成功'
      spinner.succeed()
      resolve(true)
    }
  })
})

module.exports = {
  download
}
