/**
 * 小程序命令行工具类
 */
const spawn = require('cross-spawn')
const inquirer = require('inquirer')
const path = require('path')
const os = require('os')
const file = require('../../lib/file')
const logger = require('../../lib/logger')
const { wxcli } = require('../../config')

const spawnSync = (cmd = '', args = [], options) => spawn.sync(cmd, args, { ...options, ...{ stdio: 'inherit' } })

const MSG_PORT_DISABLE = '需要打开微信开发者工具 -> 设置 -> 安全设置，将服务端口开启。'
const MSG_NEED_LOGIN = '需要重新扫码 登录 微信开发者工具。'
const MSG_NEED_WXCLI = '需要指定微信开发者工具cli安装路径，详见readme'
const MSG_WXCLI_404 = '当前指定的微信开发者工具cli路径不存在，详见readme，建议使用 wxa config 重新配置'
const MSG_CONFIGFILE_404 = '微信开发者工具cli执行目录缺少 project.config.json文件'
const MSG_NO_NODE_MODULES = '没有找到可以构建的 NPM 包，请确认需要参与构建的 npm 都在 `miniprogramRoot` 目录内'

/**
 * 检查微信小程序命令行工具
 */
const checkWxcli = (wxcli) => {
  if (!wxcli) {
    throw MSG_NEED_WXCLI
  }

  if (!file.existsSync(wxcli)) {
    throw MSG_WXCLI_404
  }
}

/**
 * 统一处理exec回调日志，注意此处为可预知错误，应抛出字符串，而不是Error
 * https://cf.jd.com/pages/viewpage.action?pageId=277303025
 */
const handleSuccess = (execLog) => {
  const { stdout, stderr } = execLog

  if (stderr.includes('port timeout')) {
    // 实际只有win系统会走到这里，mac系统会走到handleError
    logger.error(MSG_PORT_DISABLE)
  }

  if (stdout.includes('error') && stdout.includes('重新登录')) {
    // 新版，未登录时，win和mac都不会抛出异常，未登录信息会输出到stdout
    logger.error(MSG_NEED_LOGIN)
  }

  if (
    stdout.includes('error')
    && stdout.includes('project.config.json')
    && stdout.includes('__NO_NODE_MODULES__')
  ) {
    logger.error(MSG_NO_NODE_MODULES)
  }

  if (stdout.includes('error') && stdout.includes('project.config.json')) {
    logger.error(MSG_CONFIGFILE_404)
  }

  logger.info(stdout)
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
const login = (command = wxcli, projectRoot) => {
  const args = []
  let { qrFormat, resultOutput } = {}
  const { qrOutput } = {}

  if (!resultOutput) {
    resultOutput = path.resolve(projectRoot, 'login-result.json')
  }

  args.concat([
    'login',
    '--result-output',
    resultOutput,
  ])

  if (qrOutput) {
    args.concat([
      '--qr-format',
      (qrFormat || 'base64'),
      '--qr-output',
      qrOutput,
    ])
  }

  logger.info('去登陆...')

  try {
    checkWxcli(command)
    const execLog = spawnSync(command,args)
    handleSuccess(execLog)
  } catch (error) {
    handleError(error)
  }
}

/**
 * 生成-预览小程序二维码
 */
const preview = (command = wxcli, projectRoot) => {
  const args = []
  let { qrFormat, infoOutput } = {}
  const { qrOutput, compileCondition } = {}

  if (!infoOutput) {
    infoOutput = path.resolve(projectRoot, 'preview-info.json')
  }

  args.concat([
    'preview',
    '--project',
    projectRoot,
    '--info-output',
    infoOutput,
  ])

  if (qrOutput) {
    args.concat([
      '--qr-format',
      (qrFormat || 'base64'),
      '--qr-output',
      qrOutput,
    ])
  }

  if (compileCondition) {
    if (os.type() === 'Windows_NT') { // win系统不能使用compile-condition参数。部分ide集成的终端无法显示二维码
      logger.warn(`windows系统暂不支持传递启动参数，将忽略:${compileCondition}`)
    } else {
    args.concat([
      '--compile-condition',
      compileCondition,
    ])
  }

  logger.info('开始生成预览二维码')

  try {
    checkWxcli(command)
    const execLog = spawnSync(command,args)
    handleSuccess(execLog)
  } catch (error) {
    handleError(error)
  }
}

/**
 * 上传小程序代码
 */
const upload = (command = wxcli, projectRoot) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'version',
        message: '请输入版本号',
        validate: (input) => Boolean(input && input.trim()),
      },
      {
        type: 'input',
        name: 'desc',
        message: '请输入版本描述',
        validate: (input) => Boolean(input && input.trim()),
      },
    ])
    .then((answer) => {
      const { version, desc } = answer
      logger.info('开始上传小程序代码...')

      try {
        checkWxcli(command)

        const infoOutput = path.resolve(projectRoot, 'upload-info.json')

        const execLog = spawnSync(command, [
          'upload',
          '--project',
          projectRoot,
          '--version',
          version,
          '--desc',
          desc,
          '--info-output',
          infoOutput,
        ])
        handleSuccess(execLog)
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
const buildNpm = (command = wxcli, projectRoot) => {
  logger.info('构建npm...')
  try {
    checkWxcli(command)
    const execLog = spawnSync(command, [
      'build-npm',
      '--project',
      projectRoot,
      '--compile-type',
      'miniprogram',
    ])
    handleSuccess(execLog)
  } catch (error) {
    handleError(error)
  }

  logger.info('构建plugin...')
  try {
    checkWxcli(command)
    const execLog = spawnSync(command, [
      'build-npm',
      '--project',
      projectRoot,
      '--compile-type',
      'plugin',
    ])
    handleSuccess(execLog)
  } catch (error) {
    handleError(error)
  }
}

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
  logger.info('启动开发者工具...')
  try {
    checkWxcli(command)
    const execLog = spawnSync(command, ['open', '--project', projectRoot])
    handleSuccess(execLog)
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