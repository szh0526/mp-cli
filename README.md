# **mp-cli**
<p align="left">
  <img src="https://img.shields.io/badge/build-passing-brightgreen">
  <img src="https://img.shields.io/badge/npm-v6.14.6-blue">
  <img src="https://img.shields.io/badge/license-MIT-green">
  <img src="https://img.shields.io/badge/timline-1611651550830-9cf">
</p>

> 专注于项目工程初始化，预编译，打包优化，代码依赖分析，代码压缩，自动化上传代码

## ***mp-cli***是门店研发部在支持小程序实践基础上抽象出来的用于支持大规模小程序开发的命令行工具，主要解决小程序中的开发、调试、构建、性能优化等方面的问题，包括：
*  页面初始化。开发同学通常不会直接使用微信IDE，而是在VSCode等IDE下开发页面，新建页面的时候需要手工创建页面的js、wxml、wcss、json等文件，多有不便；
*  SASS支持、热加载支持、ESlint支持、代码压缩。前端的基本诉求都支持；
*  条件编译及多小程序支持。可以将一份源码编译生成多个不同的小程序，条件编译可以解决不同小程序的个性化逻辑表达问题；
*  单页抽取。当小程序项目比较大的时候，启动微信官方IDE非常慢，单页抽取可以支持编译指定的页面，尽可能减少要编译的代码，提升IDE启动速度和开发体验；
*  依赖分析和Tree-Shaking。小程序对包空间是非常敏感的，依赖分析和Tree-Shaking主要是解决打包后的项目代码中的用了一些废弃的文件，或者打包了根本用不上的函数的问题，这些文件或者函数会占用本来就紧张的小程序空间；
*  npm包支持。小程序低版本基础库并不支持npm包，另外小程序npm包比较特殊，需要经过构建动作，这些在通过此工具可以一键完成；
*  代码审计。工具会分析页面分包不合理的和重复的文件、函数、样式、模板等，并给出优化建议，解决页面瘦身的问题；
*  插件机制。优秀的插件机制，保证了工具的扩展性；

## 微信官方IDE足够强大，为什么要使用***mp-cli***
微信官方IDE确实强大，如果你的小程序规模比较小，可以完全满足，但是当你的小程序规模膨胀后，碰到了诸如微信IDE启动慢、包大小超标问题、支持生成多个小程序、代码质量需要优化等问题的时候，就需要一个工具辅助你解决问题，这个就是***mp-cli***派上用场的时候。这一方面工程化是一个复杂的问题，微信IDE并不能解决实际工程中的所有问题，另外一方面我们认为微信IDE在实践中更多的是被定为用于调试代码的工具，而非开发的工具，跟开发相关的需要独立的工具来支持。这个工具也是前端团队在支持小程序开发多年经验的沉淀。

总而言之，***mp-cli***是辅助小程序开发的用于支持大规模小程序开发的命令行工具。

# **项目依赖**
*  node
*  npm/yarn
*  babel
*  eslint
*  prettier
*  typescript
*  esnext
*  husky
*  commander
*  inquirer
*  chalk
*  gulp
*  webpack
*  uglify-es

# **安装**
```
npm install mp-cli --registry=http://registry.m.jd.com/
```

# **使用说明**
测试

# **命令说明**
测试

# **常见问题**
测试

# **参考文献**
* [命令行工具-commander](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)
* [命令行交互工具-inquirer](https://www.npmjs.com/package/inquirer)
* [终端美化插件-chalk](https://www.npmjs.com/package/chalk)
* [小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
* [自动化构建工具](https://www.npmjs.com/package/gulp)


# **开发人员**
| 姓名 | ERP | 职位 |
| :--- | :--- | :--- |
| 孙则浩 | sunzehao3<a href="timline://chat/?topin=sunzehao3" title="联系咚咚"><img src="https://king.jd.com/common/img/dongdong.png"></a> | 前端开发工程师岗 |
