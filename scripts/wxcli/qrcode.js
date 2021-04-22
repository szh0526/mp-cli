/** 
 * 指定小程序和源码分支，生成各环境小程序二维码
*/
const { download } = require('../git/download')
const logger = require('../../lib/logger')
const { preview } = require('./index')
const { wxcli,cwd } = require('../../config')
const { deleteFolder } = require('../../lib/file')

const previewQrCode = async (url,env,fileName) => {
  const projectRoot = `${cwd}/${fileName}`
  try {
    await download(url,fileName)
    await preview(wxcli,projectRoot)
    deleteFolder(projectRoot)
  } catch (error) {
    deleteFolder(projectRoot)
    logger.error('生成预览二维码失败',error)
  }
}

module.exports = {
  previewQrCode
}