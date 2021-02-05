/* eslint-disable*/
/**
 * 文件操作类
 */
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

module.exports = {
  // 获取路径Stat
  getStat(src) {
    return new Promise((resolve) => {
      fs.stat(src, (err, stats) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(stats);
        }
      });
    });
  },

  // 同步判断文件或目录是否存在
  accessSync(src) {
    try {
      // eslint-disable-next-line no-bitwise
      fs.accessSync(src, fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  // 同步查看文件/文件夹是否存在
  existsSync(src) {
    return fs.existsSync(src);
  },

  // 创建文件夹
  mkdir(src) {
    return new Promise((resolve) => {
      fs.mkdir(src, { recursive: true }, (err) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  },

  // 同步递归创建目录
  mkdirsSync(dirname) {
    if (this.existsSync(dirname)) {
      return true;
    }
    if (this.mkdirsSync(path.dirname(dirname))) {
      this.mkdirSync(dirname);
      return true;
    }
    return false;
  },

  // 同步创建文件夹
  mkdirSync(src) {
    return fs.mkdirSync(src);
  },

  // 递归删除文件目录
  removeDir(src) {
    return new Promise((resolve) => {
      // 返回一个promise对象
      fs.stat(src, (err, statObj) => {
        // 异步读取文件判断文件类型 是目录 递归 否则就删除即可
        if (statObj.isDirectory()) {
          fs.readdir(src, (e, dirs) => {
            // 读取src下面的文件
            if (e) {
              console.log(e);
            }
            // 映射路径
            let arr = dirs.map((dir) => path.join(src, dir));
            // 映射promise
            arr = arr.map((dir) => this.removeDir(dir)); // 递归调用，p下面的文件再次调用判断删除方法
            // 删除完儿子后 删除自己
            Promise.all(arr).then(() => {
              fs.rmdir(src, resolve);
            });
          });
        } else {
          fs.unlink(src, resolve);
        }
      });
    });
  },

  // 读取文件
  readFile(src) {
    return new Promise((resolve) => {
      fs.readFile(src, "utf-8", (err, data) => {
        if (err) {
          console.log(err);
          resolve(false);
        }
        resolve(data);
      });
    });
  },

  // 写入配置
  writeFile(src, str) {
    return new Promise((resolve) => {
      fs.writeFile(src, str, (err, data) => {
        if (err) {
          console.log(err);
          resolve(false);
        }
        resolve(data);
      });
    });
  },

  // 同步读取文件
  readFileSync(src) {
    try {
      const data = fs.readFileSync(src);
      return data;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  // 获取文件夹下
  readdir(src) {
    return new Promise((resolve) => {
      fs.readdir(src, (err, files) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(files);
        }
      });
    });
  },

  // 同步复制文件
  copyFileSync(from, to) {
    return fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  },

  // // 递归复制文件夹
  // async copyDir(from, to) {
  //   try {
  //     await fs.accessSync(to);
  //   } catch (err) {
  //     await this.mkdirSync(to);
  //   }

  //   const files = await this.readdir(from);
  //   files.forEach(async (src) => {
  //     const _from = `${from}/${src}`;
  //     const _to = `${to}/${src}`;
  //     const stat = await this.getStat(_from);
  //     if (stat.isFile()) {
  //       this.copyFileSync(_from, _to);
  //       console.log(chalk.magenta(`📦 ${_from} `));
  //     } else if (stat.isDirectory()) {
  //       this.copyDir(_from, _to);
  //     }
  //   });
  // },

  // 递归拷贝文件
  copyFile(from, to, cb) {
    const rs = fs.createReadStream(from);
    rs.on("error", (err) => {
      if (err) {
        console.log("read error", from);
      }
      cb && cb(err);
    });
    const ws = fs.createWriteStream(to);
    ws.on("error", (err) => {
      if (err) {
        console.log("write error", to);
      }
      cb && cb(err);
    });
    ws.on("close", (ex) => {
      cb && cb(ex);
    });

    rs.pipe(ws);
  },

  // 递归拷贝文件夹
  copyFolder(sourceFolder, targetFolder, cb) {
    fs.readdir(sourceFolder, (err, files) => {
      let count = 0;
      const checkEnd = () => {
        ++count == files.length && cb && cb();
      };

      if (err) {
        checkEnd();
        return;
      }
      !fs.existsSync(targetFolder) && fs.mkdirSync(targetFolder);
      // console.log(chalk.magenta(`📦 ${targetFolder}`));

      files.forEach((file) => {
        const srcPath = path.join(sourceFolder, file);
        const tarPath = path.join(targetFolder, file);

        fs.stat(srcPath, (err, stats) => {
          if (stats.isDirectory()) {
            this.copyFolder(srcPath, tarPath, checkEnd);
          } else {
            const fileName = tarPath.replace(process.cwd(),'')
            console.log(`📦 ${chalk.magenta('create')} ${`${fileName}`}`);
            this.copyFile(srcPath, tarPath, checkEnd);
          }
        });
      });

      // 为空时直接回调
      files.length === 0 && cb && cb();
    });
  },
};
