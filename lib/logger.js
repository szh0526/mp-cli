const chalk = require('chalk')
const readline = require('readline')

const chalkTag = (msg) => chalk.white(` ${msg} `)

const format = (label, msg) => `${label} ${msg}`

class Logger {
  /**
   * 默认
   */
  log(msg = '', tag = null) {
    if (tag) {
      console.log(format(chalkTag(tag), msg))
    } else {
      console.log(msg)
    }
  }

  /**
   * 提示
   */
  info(msg, tag = null) {
    console.log(
      format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg),
    )
  }

  /**
   * 异常
   */
  error(msg, tag = null) {
    console.error(
      format(
        chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''),
        chalk.red(msg),
      ),
    )
  }

  /**
   * 警告
   */
  warn(msg, tag = null) {
    console.warn(
      format(
        chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''),
        chalk.yellow(msg),
      ),
    )
  }

  /**
   * 成功
   */
  success(msg, tag = null) {
    console.log(
      format(
        chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''),
        chalk.green(msg),
      ),
    )
  }

  clear() {
    if (process.stdout.isTTY) {
      // 判断是否在终端环境
      const blank = '\n'.repeat(process.stdout.rows)
      console.log(blank)
      // 在终端移动光标到标准输出流的起始坐标位置, 然后清除给定的TTY流
      readline.cursorTo(process.stdout, 0, 0)
      readline.clearScreenDown(process.stdout)
    }
  }
}

module.exports = new Logger()
