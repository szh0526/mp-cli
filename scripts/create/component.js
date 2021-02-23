/**
 * 新建小程序Component
 */
const path = require('path')
const logger = require('../../lib/logger')
const file = require('../../lib/file')
const { componentTemplateRoot } = require('../../config')

// 新增页面并将配置信息写入app.json
async function writeComponentToPageJson(name, parentPage = '', pagePath) {
  const pageJsonPath = `${pagePath}/${parentPage.page}.json`
  const pageJson = JSON.parse(file.readFileSync(pageJsonPath))

  // 不存在时默值为对象
  if (!pageJson.usingComponents) {
    pageJson.usingComponents = {}
  }

  // 添加路径
  pageJson.usingComponents[name] = `./component/${name}/${name}`

  // 写入page.json文件
  const result = await file.writeFile(
    pageJsonPath,
    JSON.stringify(pageJson, null, '\t'),
  )

  if (!result) {
    logger.error('自动写入page.json文件失败, 请手动填写, 并检查错误 \r\n')
  }
}

async function createComponent(answer) {
  try {
    if (!file.existsSync(componentTemplateRoot)) {
      logger.error(
        `未找到组件模板文件, 请检查当前文件目录是否正确, path: ${componentTemplateRoot}`,
      )
      return
    }

    const {
      name, componentScope, parentModule, parentPage = {},
    } = answer

    // 业务文件夹路径
    const newComponentRoot = {
      global: () => path.join('./', '/components', name),
      module: () => path.join('./', parentModule, '/components', name),
      page: () => path.join(
        './',
        parentPage.root,
        '/pages',
        parentPage.page,
        '/components',
        name,
      ),
    }[componentScope]()

    // 查看文件夹是否存在
    if (file.existsSync(newComponentRoot)) {
      logger.error(`组件已存在, 请重新确认, path: ${newComponentRoot}`)
      return
    }

    // 复制模文件到指定目录下
    file.copyFolder(componentTemplateRoot, newComponentRoot, async (err) => {
      if (err) {
        console.log(err)
      }

      await file.renameFiles(newComponentRoot)

      // 填充app.json
      if (componentScope === 'page') {
        await writeComponentToPageJson(
          name,
          parentPage,
          path.join('./', parentPage.root, '/pages', parentPage.page),
        )
      }

      logger.clear()
      logger.success(` 🚀 组件创建成功, path: ${newComponentRoot} \r\n`)
    })
  } catch (e) {
    logger.error(e.stack)
    process.exit(1)
  }
}

module.exports = createComponent
