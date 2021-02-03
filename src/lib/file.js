/**
 * 文件操作类
 */
const fs = require('fs')
const path = require('path')

module.exports = {
  // 查看文件/文件夹是否存在
  existsSync(src) {
    return fs.existsSync(src)
  },

  // 创建文件夹
  mkDir(src) {
    return new Promise((resolve) => {
      fs.mkdir(src, { recursive: true }, (err) => {
        if (err) {
          throw err
        }
        resolve(true)
      })
    })
  },

  // 读取文件
  readFile(src) {
    return new Promise((resolve) => {
      fs.readFile(src, (err, data) => {
        if (err) {
          throw err
        }
        resolve(data)
      })
    })
  },

  // 同步读取文件
  readFileSync(src) {
    return new Promise((reslove) => {
      if (this.existsSync(path)) {
        try {
          const data = fs.readFileSync(src)
          reslove(data)
        } catch (e) {
          reslove('readFileSync failed!!!')
        }
      }
    })
  },

  // 获取文件夹下的list
  readDir(src) {
    return new Promise((resolve) => {
      fs.readdir(src, (err, files) => {
        if (err) {
          throw err
        }
        resolve(files)
      })
    })
  },

  // 复制文件
  copyFile(originPath, curPath) {
    return new Promise((resolve) => {
      fs.copyFile(originPath, curPath, fs.constants.COPYFILE_EXCL, (err) => {
        if (err) {
          throw err
        }
        resolve('copyFile success!!!')
      })
    })
  },

  // 复制批量文件
  copyFiles(originPath, curPath, files) {
    return new Promise((resolve) => {
      let extName = ''
      files.forEach((file) => {
        extName = path.extname(file)
        this.copyFile(`${originPath}/${file}`, `${curPath}${extName}`)
      })
      resolve('copyFiles success!!!')
    })
  },
}
