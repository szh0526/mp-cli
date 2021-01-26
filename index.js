#!/usr/bin/env node
const program = require('commander')
const packageJson = require('./package.json');

process.env.FORCE_COLOR = 1

if (process.argv.length <= 2) {
  console.log(require('figlet').textSync('wxa-cli', { horizontalLayout: 'full' }))
}

program
  .version(packageJson.version, '-V, --ver') // --version会导致build命令的--version参数失效
  .usage(`<command> [options]，当前版本：${packageJson.version}，docs：https://git.jd.com/legosv5/wxa-cli/blob/master/README.md`)
  .command('build', '小程序编译').alias('b')
  // .command('new', '新建页面或组件').alias('n')
  // .command('preview', '预览小程序，生成二维码').alias('p')
  // .command('audit', '项目审计').alias('a')
  // .command('config <cmd>', '全局配置').alias('c')
  // .command('upload', '上传').alias('u')
  .parse(process.argv)

// 命令校验
const VALID_COMMAND = [
  'help',
  '--help', '-h',
  '--version', '-V',
  'build', 'b',
  'new', 'n',
  'preview', 'p',
  'audit', 'a',
  'config', 'c',
  'upload', 'u'
];

if (!VALID_COMMAND.includes(process.argv[2])) {
  console.warn('不支持的命令，输入 wxa 查看使用帮助\n');
}
