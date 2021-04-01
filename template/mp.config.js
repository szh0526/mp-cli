/**
 * 自定义配置文件
*/
module.exports = {
  name: 'test',
  wxcli: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
  zip: 'dist/wechat.zip',
  entry: './src',
  output: './dist',
  // 模板文件夹插槽，方便自定义模版
  template: './template/src',
  // 预编译配置
  sass: {
    dir: 'src/css/',
    output: 'src/css/',
  },
  // 发布钩子函数
  publishHook: {
    before() {

    },
    after() {

    },
  },
}
