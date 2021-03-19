/**
 * 自定义配置文件
*/
module.exports = {
  name: 'test',
  wxcli: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
  zip: 'dist/wechat.zip',
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
