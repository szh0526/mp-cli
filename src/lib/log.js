const chalk = require('chalk');
const log = console.log;
const success = chalk.bold.greenBright;
const error = chalk.bold.redBright;
const warn = chalk.keyword('orange');

class logger {
  /** 
   * 默认
   */
  info(txt) {
    log(txt);
  }

  /** 
   * 异常
   */
  error(txt) {
    log(error(txt))
  }

  /** 
   * 警告
   */
  warn(txt) {
    log(warn(txt))
  }

  /** 
   * 成功
   */
  success(txt) {
    log(success(txt));
  }
}

module.exports = new logger()

