const { spawnSync } = require('../lib/cross-spawn')
const logger = require('../lib/logger')
const { cli } = require('../config')

module.exports = (userConfig, projectRoot) => {
  const command = userConfig.cli || cli

  logger.info('构建npm...')
  spawnSync(command, ['build-npm', '--project', projectRoot, '--compile-type', 'miniprogram'])

  logger.info('构建plugin...')
  spawnSync(command, ['build-npm', '--project', projectRoot, '--compile-type', 'plugin'])
}
