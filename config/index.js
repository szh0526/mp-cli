const path = require('path')

const cwd = process.cwd()
const { platform } = process
const isWin = /^win/.test(platform)
const isMac = /^darwin/.test(platform)
const rootDir = path.join(__dirname, '../')
const templateRoot = path.join(rootDir, 'template')
const srcTemplateRoot = path.join(templateRoot, 'src')
const pageTemplateRoot = path.join(templateRoot, 'page')
const componentTemplateRoot = path.join(templateRoot, 'component')
const userConfigTemplate = path.join(templateRoot, 'mp.config.js')
const wxcli = isWin ? 'D:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat' : '/Applications/wechatwebdevtools.app/Contents/MacOS/cli'

module.exports = {
  // 操作系统
  platform,

  // 是否Windows系统
  isWin,

  // 是否MacOS系统
  isMac,

  // 小程序CLI工具安装路径
  wxcli,

  // __dirname node全局变量，获得当前文件所在目录的完整目录名
  __dirname,

  // __filename node全局变量，获取当前模块文件的带有完整绝对路径的文件名
  __filename,

  // 执行命令目录路径
  cwd,

  // 用户自定义配置模板
  userConfigTemplate,

  // 小程序项目模板目录
  srcTemplateRoot,

  // 小程序page模板目录
  pageTemplateRoot,

  // 小程序组件模板目录
  componentTemplateRoot,
}
