const spawn = require('cross-spawn') // 开启子进程
const logger = require('./logger')

// 控制台输出
module.exports = {

  // 开启子进程（异步）
  spawn(cmd = '', args = [], stdio = 'inherit') {
    return spawn(cmd, args, { stdio })
  },

  // 开启子进程（同步）
  spawnSync(cmd = '', args = [], stdio = 'inherit') {
    const { status } = spawn.sync(cmd, args, { stdio })
    if (status) {
      logger.error(`执行命令失败: ${cmd} ${args.join(' ')}`)
      process.exit(1)
    }
    return true
  },
}
