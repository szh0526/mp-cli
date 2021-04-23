/** 
 * 指定小程序和源码分支，生成各环境小程序二维码
*/
const path = require('path')
const { download } = require('../git/download')
const logger = require('../../lib/logger')
const { deleteFolder, writeFile } = require('../../lib/file')
const { preview } = require('./index')
const { wxcli, cwd } = require('../../config')

//动态生成配置文件
const generateConfigFile = async (projectRoot, environmentConfig) => {
  const { config, name, env } = environmentConfig
  const configFileStr = `
const { logger } = getApp()

/**
 * 全局配置
 * 区别开发版、灰度版、体验版、线上版环境配置
 * dev开发版，gray灰度版, pre体验版，prod线上版
 */
module.exports = function () {
  const config = ${`${JSON.stringify(config, null, '\t')}`}

  try {
    const title = ${`"当前环境: ${name}，是否生产: ${env === 'prod'}"`}
    logger.info(title, config)
    return config
  } catch (err) {
    logger.error('获取环境配置失败: ', err)
    return config
  }
}
  `

  // 重写config.js
  const configFile = path.join(projectRoot, 'config.js')

  await writeFile(
    configFile,
    configFileStr,
  )

  return true
}

const previewQrCode = async (url, fileName, environmentConfig) => {
  const projectRoot = `${cwd}/${fileName}`
  try {
    //下载源代码
    await download(url, fileName)
    //动态设置config.js
    await generateConfigFile(projectRoot, environmentConfig)
    //生成预览码
    await preview(wxcli,projectRoot)
    //生成后清理文件夹
    deleteFolder(projectRoot)
  } catch (error) {
    deleteFolder(projectRoot)
    logger.error('生成预览二维码失败', error)
  }
}

module.exports = {
  previewQrCode
}