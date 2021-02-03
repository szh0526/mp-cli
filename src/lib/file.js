/**
 * 文件操作类
 */
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

module.exports = {
  // 判断是文件目录或文件
  fileStatType(src) {
    return new Promise((resolve, reject) => {
      fs.stat(src, (err, data) => {
        if (err) {
          reject(err)
        }
        if (data.isFile()) {
          resolve('file')
        } else if (data.isDirectory()) {
          resolve('dir')
        }
      })
    })
  },

  // 同步判断文件或目录是否存在
  accessSync(src) {
    try {
      // eslint-disable-next-line no-bitwise
      fs.accessSync(src, fs.constants.R_OK | fs.constants.W_OK)
      return true
    } catch (err) {
      return false
    }
  },

  // 同步查看文件/文件夹是否存在
  existsSync(src) {
    return fs.existsSync(src)
  },

  // 创建文件夹
  mkdir(src) {
    return new Promise((resolve) => {
      fs.mkdir(src, { recursive: true }, (err) => {
        if (err) {
          throw err
        }
        resolve(true)
      })
    })
  },

  mkdirSync(src) {
    return fs.mkdirSync(src)
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
      if (this.accessSync(path)) {
        try {
          const data = fs.readFileSync(src)
          reslove(data)
        } catch (e) {
          reslove(false)
        }
      }
    })
  },

  // 获取文件夹下
  readdir(src) {
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
  copyFile(to, from) {
    return new Promise((resolve) => {
      fs.copyFile(to, from, fs.constants.COPYFILE_EXCL, (err) => {
        if (err) {
          throw err
        }
        resolve(true)
      })
    })
  },

  // // 复制批量文件
  // copyFiles(to, from) {
  //   return new Promise((resolve) => {
  //     let extName = ''
  //     files.forEach((file) => {
  //       extName = path.extname(file)
  //       this.copyFile(`${to}/${file}`, `${from}${extName}`)
  //     })
  //     resolve(true)
  //   })
  // },

  async copyDir(from, to) {
    try {
      this.accessSync(to)
    } catch (err) {
      // 不存在，则创建文件夹
      this.mkdirSync(to)
    }
    const files = this.readFileSync(from)
    const size = files.length
    files.forEach(async (src, index) => {
      const _from = `${from}/${src}`
      const _to = `${to}/${src}`
      const fileType = await this.fileStatType(_from)
      if (fileType === 'file') {
        // const extName = path.extname(_from)
        await this.copyFile(_to, _from)
        console.log(chalk.magenta(`[${index / size}] 🚚  ${_from} `))
      } else if (fileType === 'dir') {
        this.copyDir(_from, _to)
      }
    })
  },
}
