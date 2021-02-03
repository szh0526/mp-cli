/**
 * 初始化小程序目录
 * 标准业务模版，组件库，工具类库，css预编译等
 */
const ora = require('ora')
const logger = require('../lib/logger')
const file = require('../lib/file')

const spinner = ora('loading...\n')

async function init(answer) {
  console.log(`${JSON.stringify(answer)}`)
  const {
    projectNam, projectDescription, author, appId, libVersion, componentLibrary, cssPrecompiledType, esLint,
  } = answer
}

module.exports = {
  init,
}

// let path = `${process.cwd()}`

// async function create(props) {
//   const { projectName, appId, libVersion } = props
//   // spinner.start()
//   path = `${path}/${projectName}`

//   try {
//     await execa('mkdir', [path])
//     // fs.mkdirSync(`${projectName}`)
//     // 复制模板
//     await copyTemplate()

//     // 读取 模板 project.config.json 文件  更改配置信息
//     const wecahrtConfig = await readWechartProjectConfigJson()
//     wecahrtConfig.appid = appId
//     wecahrtConfig.projectname = projectName
//     wecahrtConfig.libVersion = libVersion

//     const configStr = JSON.stringify(wecahrtConfig)
//     await writeWechartProjectConfigJson(projectName, configStr)
//     //    spinner.stop()
//     console.log(chalk.green(`
//        ******************************************
//        * your "${projectName}" project init success
//        *
//        * you can use wechart tools open your "${projectName}"
//        *
//        * ok  ✔️✔️✔️😃😃😃
//        *
//        ******************************************
//          `))
//   } catch (e) {
//     spinner.fail(chalk.red(e))
//   }
// }

// // 读取wechart配置
// async function readWechartProjectConfigJson() {
//   return new Promise((resolve, reject) => {
//     fs.readFile(`${__dirname}/templates/project.config.json`, (err, data) => {
//       if (err) {
//         reject(err)
//       }
//       resolve(JSON.parse(data.toString()))
//     })
//   })
// }

// // 写入配置
// async function writeWechartProjectConfigJson(path, str) {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(`${path}/project.config.json`, str, (err, data) => {
//       if (err) {
//         reject(err)
//       }
//       resolve()
//     })
//   })
// }

// // 复制模板
// async function copyTemplate() {
//   copyTask.copyDir(`${__dirname}/templates`, path)

//   return Promise.resolve()
// }
