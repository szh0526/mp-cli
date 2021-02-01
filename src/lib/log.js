const chalk = require('chalk');
const log = console.log;
const success = chalk.bold.greenBright;
const error = chalk.bold.redBright;
const warn = chalk.keyword('orange');

class logger {
  /** 
   * 默认
   */
  info(msg) {
    log(`>> ${msg}`)
  }

  /** 
   * 异常
   */
  error(msg) {
    log(error(`>> ${msg}`))
  }

  /** 
   * 警告
   */
  warn(msg) {
    log(warn(`>> ${msg}`))
  }

  /** 
   * 成功
   */
  success(msg) {
    log(success(`>> ${msg}`))
  }
}

module.exports = new logger()

