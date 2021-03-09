/**
 * 新建小程序Page
 */
const path = require('path')
const logger = require('../../lib/logger')
const file = require('../../lib/file')
const { cwd, pageTemplateRoot } = require('../../config')

// 新增页面并将配置信息写入app.json
async function writePageToAppJson(name, modulePath = '', option) {
  const { appJson } = option

  // 填充主包
  if (!modulePath) {
    appJson.pages.push(`pages/${name}/${name}`)
  } else {
    // 当前页面所在位置
    const idx = Object.values(option.appModuleList).indexOf(modulePath)
    if (idx === -1) {
      logger.error(`app.json不存在当前分包, path: ${modulePath}`)
      return
    }
    appJson.subPackages[idx].pages.push(`pages/${name}/${name}`)
  }

  // 重写app.json
  const appJsonRoot = path.join(cwd, 'app.json')

  await file.writeFile(
    appJsonRoot,
    JSON.stringify(appJson, null, '\t'),
  )
}

async function createPage(answer, option) {
  try {
    if (!file.existsSync(pageTemplateRoot)) {
      logger.error(
        `未找到页面模板文件, 请检查当前文件目录是否正确, path: ${pageTemplateRoot}`,
      )
      return
    }

    const { name, modulePath = '' } = answer

    // 业务文件夹路径
    const newPageRoot = path.join('./', modulePath, '/pages', name)

    // 查看文件夹是否存在
    if (file.existsSync(newPageRoot)) {
      logger.error(`当前页面已存在, 请重新确认, path: ${newPageRoot}`)
      return
    }

    // 复制模文件到指定目录下
    file.copyFolder(pageTemplateRoot, newPageRoot, async (err) => {
      if (err) {
        console.log(err)
      }

      await file.renameFiles(newPageRoot)

      // 填充app.json
      await writePageToAppJson(name, modulePath, option)

      logger.clear()
      logger.success(` 🚀 页面创建成功, path: ${newPageRoot} \r\n`)
    })
  } catch (e) {
    logger.error(e.stack)
    process.exit(1)
  }
}

module.exports = createPage
