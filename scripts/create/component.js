/**
 * 新建小程序Component
 */
const logger = require('../../lib/logger')

async function createComponent(answer) {
  try {
    console.log(answer)
  } catch (e) {
    logger.error(e.stack)
  }
}

module.exports = createComponent
