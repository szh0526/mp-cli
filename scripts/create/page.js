/**
 * 新建小程序Page
 */
const logger = require('../../lib/logger')

async function createPage(answer) {
  try {
    console.log(answer)
  } catch (e) {
    logger.error(e.stack)
  }
}

module.exports = createPage
