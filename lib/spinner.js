const ora = require('ora')
const chalk = require('chalk')

const spinner = ora()

let lastMsg = null

exports.logWithSpinner = (symbol, msg) => {
  let _msg = ''
  let _symbol = ''
  if (!msg) {
    _symbol = chalk.green('✔')
    _msg = symbol
  }
  if (lastMsg) {
    // 清除上次的spinner
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text,
    })
  }
  spinner.text = ` ${_msg}`
  lastMsg = {
    symbol: `${_symbol} `,
    text: _msg,
  }
  spinner.start()
}

exports.stopSpinner = (persist) => {
  if (lastMsg && persist !== false) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text,
    })
  } else {
    spinner.stop()
  }
  lastMsg = null
}

exports.pauseSpinner = () => {
  spinner.stop()
}

exports.resumeSpinner = () => {
  spinner.start()
}
