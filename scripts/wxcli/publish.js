const spawn = require('cross-spawn')
const inquirer = require('inquirer')
const logger = require('../../lib/logger')
const { cwd } = require('../../config')

const spawnSync = (cmd = '', args = [], options) => spawn.sync(cmd, args, { ...options, ...{ stdio: 'inherit' } })

const askCommit = async () => {
  const commit = await inquirer.prompt([{
    type: 'list',
    name: 'result',
    message: '本次发布涉及的所有改动已提交？',
    choices: [
      'yes',
      'no',
    ],
  }])
  return commit.result
}

module.exports = async (newVersion) => {
  try {
    // 同步代码
    spawnSync('git', ['pull'], { cwd })
    logger.success('同步代码完成')

    // 询问是否提交所有改动
    const isCommit = await askCommit()
    if (isCommit === 'no') return

    // 添加文件到暂存区
    spawnSync('git', ['add', '.'], { cwd })

    // 添加备注
    spawnSync('git', ['commit', '-m', `发布线上版本: ${newVersion}`], { cwd })
    logger.success('提交暂存区到本地仓库中')

    // 打tag
    spawnSync('git', ['tag', '-a', `v${newVersion}`, '-m', `release ${newVersion} version`], { cwd })
    logger.success(`当前tag标签: ${newVersion}`)

    // 同时推送git提交和标签
    spawnSync('git', ['push', '--follow-tags'], { cwd })
    logger.success('git提交成功')
  } catch (error) {
    logger.error(`git提交异常 ${error ? error.message : ''}`)
  }
}
