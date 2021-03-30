const spawn = require('cross-spawn') // 开启子进程
const logger = require('./logger')

const defaultOptions = {
  // 显式地调用 cmd
  stdio: 'inherit',
}

// 控制台输出
module.exports = {

  // 开启子进程（异步）
  spawn(cmd = '', args = [], options) {
    return spawn(cmd, args, { ...defaultOptions, ...options })
  },

  // 开启子进程（同步）
  spawnSync(cmd = '', args = [], options) {
    const { status } = spawn.sync(cmd, args, { ...defaultOptions, ...options })
    if (status) {
      logger.error(`执行命令失败: ${cmd} ${args.join(' ')}`)
      process.exit(1)
    }
    return true
  },
}
