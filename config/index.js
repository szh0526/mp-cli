const path = require('path')

const cwd = process.cwd()
const rootDir = path.join(__dirname, '../')
const templateRoot = path.join(rootDir, 'template')
const srcTemplateRoot = path.join(templateRoot, 'src')
const pageTemplateRoot = path.join(templateRoot, 'page')
const componentTemplateRoot = path.join(templateRoot, 'component')

module.exports = {

  // __dirname node全局变量，获得当前文件所在目录的完整目录名
  __dirname,

  // __filename node全局变量，获取当前模块文件的带有完整绝对路径的文件名
  __filename,

  // 执行命令目录路径
  cwd,

  // 小程序项目模版目录
  srcTemplateRoot,

  // 小程序page模版目录
  pageTemplateRoot,

  // 小程序组件模板目录
  componentTemplateRoot,
}
