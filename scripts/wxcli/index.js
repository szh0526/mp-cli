/**
 * 小程序命令行工具类
 */
const spawn = require('cross-spawn')
const inquirer = require('inquirer')
const path = require('path')
const os = require('os')
const file = require('../../lib/file')
const { getUploadJsonConfig } = require('../../config/util')
const logger = require('../../lib/logger')
const { wxcli } = require('../../config')
const publish = require('../git/publish')
const { resolve } = require('path')

const spawnSync = (cmd = '', args = [], options) => spawn.sync(cmd, args, { ...options, ...{ stdio: 'inherit' } })

const MSG_PORT_DISABLE = '需要打开微信开发者工具 -> 设置 -> 安全设置，将服务端口开启。'
const MSG_NEED_LOGIN = '需要重新扫码 登录 微信开发者工具。'
const MSG_NEED_WXCLI = '需要指定微信开发者工具cli安装路径，详见readme'
const MSG_WXCLI_404 = '当前指定的微信开发者工具cli路径不存在，详见readme'
const MSG_CONFIGFILE_404 = '微信开发者工具cli执行目录缺少 project.config.json文件'
const MSG_NO_NODE_MODULES = '没有找到可以构建的 NPM 包，请确认需要参与构建的 npm 都在 `miniprogramRoot` 目录内'

/**
 * 检查微信小程序命令行工具
 */
const checkWxcli = (cli) => {
  if (!cli) {
    throw MSG_NEED_WXCLI
  }

  if (!file.existsSync(cli)) {
    throw MSG_WXCLI_404
  }
}

/**
 * 获取版本
 */
function getVersionChoices(version) {
  const [major, minor, patch] = version.split('.')
  return [
    `patch (${major}.${minor}.${patch * 1 + 1})`,
    `minor (${major}.${minor * 1 + 1}.0)`,
    `major (${major * 1 + 1}.0.0)`,
  ]
}

/**
 * 统一处理exec回调日志，注意此处为可预知错误，应抛出字符串，而不是Error
 * https://cf.jd.com/pages/viewpage.action?pageId=277303025
 */
const handleSuccess = (execLog) => {
  const { stdout, stderr } = execLog

  if (stderr && stderr.includes('port timeout')) {
    // 实际只有win系统会走到这里，mac系统会走到handleError
    logger.error(MSG_PORT_DISABLE)
  }

  if (stdout && stdout.includes('error') && stdout.includes('重新登录')) {
    // 新版，未登录时，win和mac都不会抛出异常，未登录信息会输出到stdout
    logger.error(MSG_NEED_LOGIN)
  }

  if (
    stdout
    && stdout.includes('error')
    && stdout.includes('project.config.json')
    && stdout.includes('__NO_NODE_MODULES__')
  ) {
    logger.error(MSG_NO_NODE_MODULES)
  }

  if (
    stdout
    && stdout.includes('error')
    && stdout.includes('project.config.json')
  ) {
    logger.error(MSG_CONFIGFILE_404)
  }

  if (stdout) {
    logger.info(stdout)
  }
}

/**
 * 处理错误
 */
const handleError = (error) => {
  if (typeof error === 'string') logger.error(error) // string认为是handleSuccess抛出的错误，不再处理

  const { message } = error

  if (message.includes('port timeout')) {
    // 实际只有mac系统会走到这里，win系统会走到handleSuccess
    logger.error(MSG_PORT_DISABLE)
  } else {
    logger.error(message)
  }
}

/**
 * 小程序登陆
 */
const login = (command = wxcli, projectRoot, options = {}) => {
  let args = []
  let { resultOutput, qrOutput } = options
  const { qrFormat } = options

  if (!resultOutput) {
    resultOutput = path.resolve(projectRoot, 'mp.login.json')
  }

  args = args.concat([
    'login',
    '--project',
    projectRoot,
    '--qr-format',
    qrFormat,
    '--result-output',
    resultOutput,
  ])

  if (!qrOutput && qrFormat !== 'terminal') {
    qrOutput = path.resolve(projectRoot, 'mp.login.txt')
    args = args.concat(['--qr-output', qrOutput])
  }

  logger.info('微信扫码登陆...')

  try {
    checkWxcli(command)
    const execLog = spawnSync(command, args)
    handleSuccess(execLog)
    const config = JSON.parse(file.readFileSync(resultOutput))
    if (config.status === 'SUCCESS') {
      setTimeout(() => {
        logger.clear()
        logger.success('扫码登陆成功\r\n')
      }, 1000)
    } else {
      logger.error(`${config.error}\r\n`)
    }
  } catch (error) {
    handleError(error)
  }
}

/**
 * 生成-预览小程序二维码
 */
const preview = (command = wxcli, projectRoot, options = {}) => {
  return new Promise(resolve =>{
    let args = []
    let { infoOutput = '', qrOutput } = options
    const { qrFormat = 'terminal', compileCondition } = options
  
    if (!infoOutput) {
      infoOutput = path.resolve(projectRoot, 'mp.preview.json')
    }
  
    args = args.concat([
      'preview',
      '--project',
      projectRoot,
      '--qr-format',
      qrFormat,
      '--info-output',
      infoOutput
    ])
  
    if (!qrOutput && qrFormat === 'base64') {
      qrOutput = path.resolve(projectRoot, 'mp.qrcode.txt')
      args = args.concat(['--qr-output', qrOutput])
    }
  
    if (compileCondition) {
      if (os.type() === 'Windows_NT') {
        // win系统不能使用compile-condition参数。部分ide集成的终端无法显示二维码
        logger.warn(
          `windows系统暂不支持传递启动参数，将忽略:${compileCondition}`,
        )
      } else {
        args = args.concat(['--compile-condition', compileCondition])
      }
    }
  
    logger.info('开始生成预览二维码')
  
    try {
      checkWxcli(command)
      const execLog = spawnSync(command, args, {cwd: projectRoot})
      handleSuccess(execLog)
      setTimeout(() => {
        if (qrFormat !== 'terminal') {
          logger.clear()
        }
        logger.success('生成预览二维码成功\r\n')
        resolve(true)
      }, 1000)
    } catch (error) {
      handleError(error)
      resolve(false)
    }
  })
}

/**
 * 上传小程序代码
 */
const upload = async (command = wxcli, projectRoot) => {
  const versionConfig = await getUploadJsonConfig()
  const { version = '0.0.0' } = versionConfig

  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'isRelease',
        message: '是否为正式发布版本?',
        default: true,
      },
      {
        type: 'list',
        name: 'semver',
        message: `请设置上传的版本号 (当前版本号: ${version}):`,
        choices: getVersionChoices(version),
        when(answer) {
          return !!answer.isRelease
        },
      },
      {
        type: 'input',
        name: 'desc',
        message: '请输入版本描述',
        validate: (input) => Boolean(input && input.trim()),
      },
    ])
    .then(async (answer) => {
      logger.info('开始上传小程序代码...')
      const { isRelease, semver, desc } = answer
      const [, , newVersion] = isRelease ? semver.match(/(.*?)\s\((.*?)\)/) : []

      try {
        checkWxcli(command)
        const versionConfigPath = path.resolve(projectRoot, 'mp.version.json')

        const execLog = spawnSync(command, [
          'upload',
          '--project',
          projectRoot,
          '--version',
          isRelease ? newVersion : version,
          '--desc',
          desc,
          '--info-output',
          versionConfigPath,
        ])

        handleSuccess(execLog)

        if (execLog.status === 0) {
          setTimeout(async () => {
            // 修改本地版本文件 (当为发行版时)
            if (isRelease) {
              const config = JSON.parse(file.readFileSync(versionConfigPath))
              config.version = newVersion
              config.desc = desc
              await file.writeFile(
                versionConfigPath,
                JSON.stringify(config, null, '\t'),
              )
            }

            await publish(newVersion)

            logger.clear()
            logger.success(
              '小程序代码上传成功, 登录微信公众平台 https://mp.weixin.qq.com 获取体验版二维码 \r\n',
            )
          }, 1000)
        } else {
          logger.error(
            '小程序代码上传失败, 请重新上传 \r\n',
          )
        }
      } catch (error) {
        handleError(error)
      }
    })
    .catch((error) => {
      logger.error(error.stack)
      process.exit(1)
    })
}

/**
 * npm构建
 */
const buildNpm = (command = wxcli, projectRoot, options = { compileType: 'npm' }) => new Promise((resolve) => {
  const { compileType } = options
  // logger.info(`构建 ${compileType} ...`)

  try {
    checkWxcli(command)
    const execLog = spawnSync(command, [
      'build-npm',
      '--project',
      projectRoot,
      '--compile-type',
      compileType,
    ])
    handleSuccess(execLog)
    resolve(true)
  } catch (error) {
    handleError(error)
    resolve(false)
    process.exit(1)
  }
})

/**
 * 关闭项目窗口
 */
const close = (command = wxcli, projectRoot) => {
  logger.info('关闭项目窗口...')
  try {
    checkWxcli(command)
    const execLog = spawnSync(command, ['close', '--project', projectRoot])
    handleSuccess(execLog)
  } catch (error) {
    handleError(error)
  }
}

/**
 * 关闭开发者工具
 */
const quit = (command = wxcli) => {
  logger.info('关闭开发者工具...')
  try {
    checkWxcli(command)
    const execLog = spawnSync(command, ['quit'])
    handleSuccess(execLog)
  } catch (error) {
    handleError(error)
  }
}

/**
 * 关闭项目窗口
 */
const open = (command = wxcli, projectRoot) => {
  logger.info('启动微信开发者工具...')
  try {
    checkWxcli(command)
    const execLog = spawnSync(command, ['open', '--project', projectRoot])
    handleSuccess(execLog)
    setTimeout(() => {
      logger.clear()
      logger.success('微信开发者工具已启动\r\n')
    }, 1000)
  } catch (error) {
    handleError(error)
  }
}

/**
 * 重置工具内部文件缓存，重新监听项目文件
 */
const resetFileutils = (command = wxcli, projectRoot) => {
  logger.info('重建文件监听...')
  try {
    checkWxcli(command)
    const execLog = spawnSync(command, [
      'reset-fileutils',
      '--project',
      projectRoot,
    ])
    handleSuccess(execLog)
  } catch (error) {
    handleError(error)
  }
}

module.exports = {
  login,
  preview,
  upload,
  buildNpm,
  close,
  quit,
  open,
  resetFileutils,
}
