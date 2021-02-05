/**
 * 初始化小程序目录
 * 标准业务模版，组件库，工具类库，css预编译等
 */
// const ora = require('ora')
const path = require('path')
const logger = require('../lib/logger')
const file = require('../lib/file')
const { cwd, templateRoot } = require('../config')

// const spinner = ora('Loading...\n')

async function init(answer) {
  try {
    logger.info(`${JSON.stringify(answer)}`)
    const {
      projectName = 'mp_init',
      projectDescription = '',
      author = '',
      appId = '',
      libVersion = '',
      componentLibrary = '',
      cssPrecompiledType = '',
      esLint = true,
    } = answer

    if (file.existsSync(projectName)) {
      await file.removeDir(projectName)
    }
    // 创建文件夹
    await file.mkdir(`${projectName}`)

    const projectRoot = path.join(cwd, projectName)

    // 复制模版文件到指定目录下
    file.copyFolder(templateRoot, projectRoot, async (err) => {
      if (err) {
        console.log(err)
      }
      // 重写project.config.json
      const projectConfigRoot = path.join(projectRoot, 'project.config.json')

      const projectConfig = await file.readFile(projectConfigRoot)
      if (projectConfig) {
        const config = JSON.parse(projectConfig.toString())
        config.appid = appId
        config.projectname = projectName
        config.libVersion = libVersion
        config.description = projectDescription
        await file.writeFile(
          projectConfigRoot,
          JSON.stringify(config, null, '\t'),
        )
      }

      // 重写package.json
      const packageJsonRoot = path.join(projectRoot, 'package.json')

      const packageJson = await file.readFile(packageJsonRoot)
      if (packageJson) {
        const config = JSON.parse(packageJson.toString())
        config.name = projectName
        config.description = projectDescription
        config.author = author
        await file.writeFile(
          packageJsonRoot,
          JSON.stringify(config, null, '\t'),
        )
      }
      logger.clear()
      logger.success(
        `🚀🚀🚀 Your project ${projectName} has been created successfully!!`,
      )
    })
  } catch (e) {
    logger.error(e.stack)
  }
}

module.exports = {
  init,
}
