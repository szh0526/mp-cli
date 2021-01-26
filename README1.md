wxa-cli
====
wxa-cli是京喜研发部在支持京东购物和京喜小程序的实践基础上抽象出来的用于支持大规模小程序开发的命令行工具，主要解决小程序中的开发、调试、构建、性能优化等方面的问题，包括：
*  页面初始化。开发同学通常不会直接使用微信IDE，而是在VSCode等IDE下开发页面，新建页面的时候需要手工创建页面的js、wxml、wcss、json等文件，多有不便；
*  SASS支持、热加载支持、ESlint支持、代码压缩。前端的基本诉求都支持；
*  条件编译及多小程序支持。可以将一份源码编译生成多个不同的小程序，条件编译可以解决不同小程序的个性化逻辑表达问题；
*  单页抽取。当小程序项目比较大的时候，启动微信官方IDE非常慢，单页抽取可以支持编译指定的页面，尽可能减少要编译的代码，提升IDE启动速度和开发体验；
*  依赖分析和Tree-Shaking。小程序对包空间是非常敏感的，依赖分析和Tree-Shaking主要是解决打包后的项目代码中的用了一些废弃的文件，或者打包了根本用不上的函数的问题，这些文件或者函数会占用本来就紧张的小程序空间；
*  npm包支持。小程序低版本基础库并不支持npm包，另外小程序npm包比较特殊，需要经过构建动作，这些在通过此工具可以一键完成；
*  代码审计。工具会分析页面分包不合理的和重复的文件、函数、样式、模板等，并给出优化建议，解决页面瘦身的问题；
*  插件机制。优秀的插件机制，保证了工具的扩展性；

## 微信官方IDE足够强大，为什么要使用wxa-cli
微信官方IDE确实强大，如果你的小程序规模比较小，可以完全满足，但是当你的小程序规模膨胀后，碰到了诸如微信IDE启动慢、包大小超标问题、支持生成多个小程序、代码质量需要优化等问题的时候，就需要一个工具辅助你解决问题，这个就是wxa-cli派上用场的时候。这一方面工程化是一个复杂的问题，微信IDE并不能解决
实际工程中的所有问题，另外一方面我们认为微信IDE在实践中更多的是被定为用于调试代码的工具，而非开发的工具，跟开发相关的需要独立的工具来支持。这个工具也是京喜前端团地在支持小程序开发多年经验的沉淀。

总而言之，wxa-cli是辅助小程序开发的用于支持大规模小程序开发的命令行工具。


## 安装
<!-- `npm install -g @legos/wxa-cli --registry=http://npm.m.jd.com` -->
`npm install -g @legos/wxa-cli --registry=http://registry.m.jd.com`
> 安装失败？ 先看看[安装异常问题](docs/INSTALL.md)

## 购物小程序与京喜小程序使用指引
如果是`京东购物`或者`京喜`小程序使用者，直接看这个[wxapp项目指引](docs/WXAPP-JX.md)

## ChangeLog
详见[ChangeLog](CHANGELOG.md)

## 加入开发
* [开发指引](CONTRIBUTING.md)  
* [插件开发指南](docs/PLUGIN-GUIDE.md)

## 使用说明
`wxa`查看子命令说明
```
Usage: wxa <command> [options]

Options:
  -V, --ver  output the version number
  -h, --help     output usage information

Commands:
  build|b        小程序编译
  new|n          新建页面或组件
  preview|p      预览小程序，生成二维码
  audit|a        项目审计
  config|c <cmd> 用户级配置
  help [cmd]     display help for [cmd]
```
`wxa help [cmd]` 查看子命令参数，如：`wxa help new`
```
Usage: wxa new [options]

Options:
  -t, --type [value]  新建类型(page|component)
  -w, --wqvue         是否使用wqvue模板
  -n, --name [value]  名称
  -h, --help          output usage information
```

## 命令说明

### 小程序编译：wxa build
`wxa build` build 命令会依次做 wxss 转换、文件分析、npm 下载、npm 构建等(详见设计文档)，并最终生成 wxa-build 目录作为小程序开发目录。  

* 参数 --page|-p 单页抽取，仅提取指定页面需要的文件(多个使用英文逗号分隔)，可以提升开发效率，**支持使用配置文件** 。  
`wxa build -p pages/index/index,pages/seckill/index/index`   
```
以下是秒杀首单页抽取各场景数据对比  

          常规开发   单页抽取
预览耗时    100s     15s
启动耗时    25s      10s
编译耗时    5s       3s
``` 

* 参数 --watch|-w 启动watch模式，注意文件过多时watch会比较慢，注意配合单页抽取一起使用。  
`wxa build -w`   

* 参数 --tabbar 在单页抽取时，保留原生 tab 及 tab 上的页面。  
`wxa build -p pages/seckill/index/index --tabbar` 

* 参数 --wqvue 编译生成目录(wxa build)保留 wqvue 编译所需要 wqvue.conf.json、html_include.html 及 css 文件。  
`wxa build --wqvue`

* 参数 --page-info 输出本次编译的所有页面信息，包含页面基本信息、依赖的npm包、组件、子页面(通过goto分析，不全面)，输出路径默认为../wxa-build-pageinfo.log  
`wxa build --page-info`

* 参数 --app|-a 条件编译，用于同一个工程下存在多个 app 情况，app 参数用于指定要编译哪个 app，详见[小程序CLI多应用支持](https://cf.jd.com/pages/viewpage.action?pageId=204856892)  
`wxa build -a pg` 

* 参数 --type|-t 条件编译，用于同一个工程下存在多端同构的代码。 参数用于指定要编译哪个场景，详见[小程序CLI条件编译增强](https://cf.jd.com/pages/viewpage.action?pageId=284804909)  
`wxa build -t h5`  

* 参数 --open|-o 自动启动小程序开发者工具加载编译生成目录(wxa build)。  
`wxa build -o`
> 调用小程序开发者工具需要指定 CLI 路径，详见参数 --wxcli 。

* 参数 --fixnpm|-f NPM 包低版本兼容，即会将代码中对 NPM 包引用的引用转换为相对 miniprogram_npm 目录的路径引用。  
`wxa build -f`

* 参数 --wxcli 指定微信开发者工具 CLI 路径，详见[命令行](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)。macOS默认值为：/Applications/wechatwebdevtools.app/Contents/MacOS/cli，win默认值为空，**支持使用配置文件**。  
`wxa build --wxcli "D:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat"`

* 参数 --include|-i 需要额外拷贝的文件，参数值使用glob模式。  
`wxa build -i "assets/*.png"`

* 参数 --output.build|-d 指定命令生成的目标目录，默认为当前项目的平级目录 wxa build 即：../wxa build，可使用绝对路径，使用相对路径时，参照路径为 CLI 执行目录。  
`wxa build -d "../../wxa build"`，
> 与参数 --app 同时使用时，会在目标目录后加上附加 -{app} 作为区分，如 wxa build -d ../../wxa build -a pg 生成的目录为 wxa-build-pg
> 与参数 --type 同时使用时，会在目标目录后加上附加 -{type} 作为区分，如 wxa build -d ../../wxa build -a pg -t h5 生成的目录为 wxa-build-pg-h5

* 参数 --release|-r  发布模式，添加文件压缩、文件修改等操作。  
`wxa build -r`

* 参数 --version|-v  结合-r参数一起使用，指定版本号 修改 app.js 中的 version 字段。   
`wxa build -r -v 2.0.0`

* 参数 --dev 结合-r参数一起使用，打包开发版本，未捕获的错误会以弹窗的形式展示，若同时指定了版本号，则会在版本号前加上 alpha- 前缀。  
`wxa build -r -v 2.0.0 --dev`

* 参数 --js-tree-shaking 函数依赖分析，编译后的目录中，删掉js文件中未使用的函数。  
`wxa build --js-tree-shaking`

* 参数 --css-tree-shaking 删除无用样式 注：尚在实验阶段 ，未经过完整测试(可能会删掉有用的样式)，可以使用此参数并借助 Beyond Compare 等对比工具对比删掉的样式。上线前务必做好验证。  
`wxa build --css-tree-shaking`

### 新建页面|组件：wxa new
`wxa new`  new 命令会在当前目录下创建小程序页面或组件所需的文件，以下参数再不指定时，会通过询问的方式提示用户选择。
* 参数 --type|-t 可选值：page、component ，表示需要创建页面还是组件。  
`wxa new -t page`

* 参数 --wqvue|-w 创建wqvue类型的页面或者组件。  
`wxa new -w`

* 参数 --name|-n 页面或者组件名字(文件名)。  
`wxa new -n index`

### 小程序预览：wxa preview
`wxa preview` preview 命令会调用小程序开发者工具的 CLI，在控制台打印二维码。

> 若预览提示有文件未找到，但实际文件存在时，请尝试先关闭小程序开发者工具，再执行预览命令。

* 参数 --qr-format|-f 详见[命令行](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)，下同  
`wxa preview -f terminal`

* 参数 --qr-output|-o  
`wxa preview -n /path/to/qrcode.txt -f base64`

* 参数 --info-output|-i  
`wxa preview -i /path/to/preview-info.json`

* 参数 --compile-condition|-q   
`wxa preview -q  '{"pathName":"pages/index/index"}'`

* 参数 --page|-p  同 wxa build 参数
* 参数 --app|-a 同 wxa build 参数
* 参数 --output.preview|-d 预览命令文件生成目录，默认值为：../wxa-build

### 小程序上传：wxa upload
`wxa upload` upload 命令会调用小程序开发者工具的 CLI，上传代码。

* 参数 --desc 详见[命令行](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)，下同  
`wxa upload --desc "upload by wxa"`

* 参数 --version|-v    
`wxa upload -v 1.0.0`

* 参数 --info-output|-i  
`wxa upload -i /path/to/upload-info.json`

* 参数 --app|-a 同 wxa build 参数
* 参数 --output.upload|-d 预览命令文件生成目录，默认值为：../wxa-build

### 小程序审计：wxa audit
`wxa audit` 使用audit命令默认会执行两个功能，一是分析项目中的文件依赖关系，输出优化建议；若需要进行重复代码分析，请添加插件@legos/wxa-plugin-jscpd。  

* 参数 --circular-deps  检测并输出项目中存在循环依赖的场景。  
`wxa audit --circular-deps`  
* 参数 --app|-a 同 wxa build 参数
* 参数 --output.audit|-d audit命令输出目录，默认值为：../wxa-audit

### 全局配置：wxa config
`wxa config` 用于设置全局的用户配置，类似 npm config ，配置保存在操作系统的当前用户根目录下，目前的主要配置项为 wxcli（微信小程序 IDE 命令行工具安装路径）。
```
使用方式:
  $ wxa config set <key> <value>
  $ wxa config get [key]
  $ wxa config delete <key>
  $ wxa config list
```
* 子命令 list 控制台打印当前所有全局配置项  
`wxa config list`

* 子命令 set 设置对应配置项的值，需要传递 key 和 value 两个参数，如下。当value中有特殊字符时(空格、斜杠等)，带上双引号。  
`wxa config set wxcli "D:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat"`

* 子命令 get 获取对应配置项的值，需要指定 key。不指定时与子命令 list 等价  
`wxa config get wxcli`

* 子命令 delete 删除对应配置项，需要指定 key  
`wxa config delete wxcli`



## npm包支持
wxa-cli 对 npm 的支持基于官方提供的能力[npm支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。在这个基础上添加了低版本兼容及智能分包能力。
### 使用需知
1、`现状` 已完成基本改造，各页面可参考公共文件接入现有npm包。  
2、`使用基础库` 为保证质量，请使用基础库的npm包，详见[基础库文档](http://legos.wq.jd.com/legosv5/static/docs/index.html)，注意基础库发布在内网[JNPM](http://npm.m.jd.com/) ,安装时需要指定对应registry。  
3、`安装依赖` 在项目根目录 package.json 中的 `dependencies` 字段指明依赖并进行安装，注意为了确保代码稳定可控，依赖需要使用精确的版本(即使用1.0.0不要使用`^`1.0.0这种范围性的)，或者直接使用npm install {name} -E 来安装并自动添加精确版本依赖。  
4、`代码中使用` 跟常规npm使用一样，直接 import {xx} from '@base/xx' 即可。 


### wxa-cli编译npm流程
1、`检查npm包` 检查 package.json 中指定的版本号与当前 node_modules 中安装的包版本是否匹配，若不匹配，则会自动安装。若提前安装好了，此步骤将跳过。
> 若安装过程卡住或超时，检查下是否能访问内网及[JNPM](http://npm.m.jd.com/) 。若提示权限问题，可尝试删除wxapp/node_modules目录再重新执行命令。

2、`npm包适配` 对部分三端同构的基础库进行小程序端适配。  
3、`构建npm` 调用微信开发者工具CLI执行`构建npm`，将当前项目依赖的npm包转成 `miniprogram_npm` 目录。若已经构建过了，此步骤将跳过。
> 若构建npm步骤报错，请确保你当前的配置是否有指定正确的微信cli路径，详见本文档wxcli参数说明，建议使用 `wxa config` 进行配置。

4、`智能分包` 根据依赖分析动态拷贝 miniprogram_npm 文件到对应目录，比如一个 npm 包仅被一个子包引用，则会在子包目录生成一个 miniprogram_npm 目录。


## 配置文件
配置文件支持公有配置`wxa.config.js`和私有配置`wxa.config.profile.js`，私有配置文件优先级大于共有配置，放在在小程序根目录即可,目前可配置的选项如下:
```js
module.exports = {
  // 微信开发者工具CLI安装路径，macOS默认值:/Applications/wechatwebdevtools.app/Contents/MacOS/cli，win无默认值。建议使用wxa config配置。
  wxcli: 'D:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat',
  output: {
    build: path.resolve('../wxa-build'), // wxa build 命令的文件生成目录，默认为 ../wxa-build
    audit: path.resolve('../wxa-audit') // wxa audit 命令的文件生成目录，默认为 ../wxa-aduit
  },
  // 单页抽取，支持数组和字符串形式。一般写在私有配置中。
  page: ['pages/index/index', 'pages/h5/index'], // 或者，page:'pages/index/index,pages/h5/index'
  /**
   * 修改编译过程的webpack配置
   * @param chain webpack-chain
   */
  webpack (chain: IWebPackChain): void {},
  /**
   * 添加插件配置
   * (string|[string]|[string, object])[]
   */
  plugins:[]
}
```
> 代码中类型参见：[Context](./src/common/context.ts)


## 常见问题
### 压缩环节报错
wxa build --release 执行到【压缩】步骤时报错：events.jd:174 throw er; // Unhandled 'error' event。这个是安装CLI时，依赖的第三方图片处理包没有安装好。
详见[安装异常问题](docs/INSTALL.md)

### win系统[构建npm]步骤报错
小程序 CLI 执行过程中，需要调用微信开发者工具 CLI 接口，因此需要指定其安装路径，macOS 下安装路径比较固定，指定了默认值(详见上述)，但 win 下安装路径众多，没有指定默认值，因此 win 下需要使用参数 --wxcli 或者配置文件 wxa.config.js 指定微信开发者工具 cli.bat 路径，安装路径参考：[命令行](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)

### WARNING
命令执行后会生成一份 buid.log 日志文件，里面会有一些日志信息  
1:WARNING 一般是 import的内容在对应文件中没有 export  
`WARNING in ./pages/my_pages/coupon/coupon.js 1:9063-9077 "export 'verifyAuthUser' was not found in 'common.js'`  
2:ERROR 一般是找不到文件，一般是路径写错了，如多写了一个 ../，在微信开发者中工具中，是兼容这种情况的(不论写多少个../，最终会指向 wxapp 根目录)  
`ERROR in ./pages/recharge/index.json Module not found: Error: Can't resolve '../../../components/quick-nav/quick-nav' `  
3:以上两种情况均不影响编译结果，可以借此规范代码。
