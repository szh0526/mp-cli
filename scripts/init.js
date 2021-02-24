/**
 * 初始化小程序目录
 * 标准业务模板，组件库，工具类库，css预编译等
 */
const path = require('path')
const chalk = require('chalk')
const logger = require('../lib/logger')
const file = require('../lib/file')
const { spawnSync } = require('../lib/cross-spawn')
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
      componentLibrary,
      vantWeappVersion,
      jpassVersion,
      cssPrecompiledType,
      esLint = true,
    } = answer

    if (file.existsSync(projectName)) {
      await file.removeDir(projectName)
    }
    // 创建文件夹
    await file.mkdir(`${projectName}`)

    const projectRoot = path.join(cwd, projectName)

    // 复制模板文件到指定目录下
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
        // // npm构建 参考 https://vant-contrib.gitee.io/vant-weapp/#/quickstart#qi-ta
        // // npm构建 只会把dependencies下的依赖打包到miniprogram_npm下
        // config.setting.packNpmManually = true
        // config.setting.packNpmRelationList = [{
        //   packageJsonPath: './package.json',
        //   miniprogramNpmDistDir: './',
        // }]

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

        logger.info('开始安装依赖...')

        // 安装eslint依赖
        if (esLint) {
          spawnSync('npm', ['install', '-g', 'eslint@6.7.2', 'eslint-config-airbnb-base@14.0.0', 'eslint-plugin-import@2.18.2'])
        }

        // 安装组件库依赖
        if (componentLibrary === 'jpass') {
          logger.warn(` 🔥 jpass v${jpassVersion} 组件库正在开发中, 敬请期待...`)
        } else if (componentLibrary === 'vant-weapp') {
          if (vantWeappVersion === 'v2') {
            spawnSync('npm', ['install', '--save', '@vant/weapp'])
          } else {
            spawnSync('npm', ['install', '--save', 'vant-weapp'])
          }
        }
        logger.success('依赖安装完成')

        await file.writeFile(
          packageJsonRoot,
          JSON.stringify(config, null, '\t'),
        )
      }

      setTimeout(() => {
        logger.clear()
        const endTime = new Date()
        logger.success(` 🚀 初始化项目成功, 共计耗时 ${endTime - startTime} 毫秒 \r\n`)
        logger.log(`        👉 本地开发 run ${chalk.cyan('mp open')}`)
        logger.log(`        👉 生产环境构建打包 run ${chalk.cyan('mp build')}`)
        logger.log(`        👉 查看帮助文档 run ${chalk.cyan('mp help')} \r\n`)
      }, 1000)
    })
  } catch (e) {
    logger.error(e.stack)
  }
}

module.exports = {
  init,
}
