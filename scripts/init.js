/**
 * 初始化小程序目录
 * 标准业务模版，组件库，工具类库，css预编译等
 */
const path = require('path')
const chalk = require('chalk')
const logger = require('../lib/logger')
const file = require('../lib/file')
const { cwd, srcTemplateRoot } = require('../config')

async function init(answer) {
  try {
    const startTime = new Date()
    // logger.info(`${JSON.stringify(answer)}`)
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
    file.copyFolder(srcTemplateRoot, projectRoot, async (err) => {
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

        if (esLint) {
          config.devDependencies.eslint = '^6.7.2'
          config.devDependencies['eslint-config-airbnb-base'] = '^14.0.0'
          config.devDependencies['eslint-plugin-import'] = '^2.18.2'
        }

        await file.writeFile(
          packageJsonRoot,
          JSON.stringify(config, null, '\t'),
        )
      }

      setTimeout(() => {
        logger.clear()
        const endTime = new Date()
        logger.success(` 🚀 Created successfully in ${endTime - startTime}ms \r\n`)
        logger.log(`        👉 Local development run ${chalk.cyan('mp open')}`)
        logger.log(`        👉 To create a production build, run ${chalk.cyan('mp build')}`)
        logger.log(`        👉 Display help for command run ${chalk.cyan('mp help')} \r\n`)
      }, 1000)
    })
  } catch (e) {
    logger.error(e.stack)
  }
}

module.exports = {
  init,
}
