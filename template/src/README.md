# XX-小程序

<p align="left">
  <img src="https://img.shields.io/badge/build-passing-brightgreen">
  <img src="https://img.shields.io/badge/npm-v6.14.8-blue">
  <img src="https://img.shields.io/badge/license-MIT-green">
  <img src="https://img.shields.io/badge/timline-1020463787-9cf">
</p>

## 项目说明

### 项目目录

```
├── asserts 静态资源
   ├── iconfont.wxss 阿里巴巴矢量图标库
   └── jd.wxss  京东小程序字体库
├── behaviors 组件间代码共享
│  └── pagination.js 小程序分页器
├── components 自定义组件第三方组件库/基础组件/业务组件
   └── img-swiper 图片轮播组件
      ├── personal.js
      ├── personal.json
      ├── personal.wxml
      └── personal.wxss
├── images
   └── tab
      ├── home.png
      └── home_seled.png
├── mock mock服务
   └── home
      └── home.json
   └── index.json 
├── models
   ├── common.js 公共api
   └── global.js 全局注册api
├── pages  
   └── home  首页
      ├── home.js
      ├── home.json
      ├── home.wxml
      └── home.wxss
   └── personal  个人中心
      ├── personal.js
      ├── personal.json
      ├── personal.wxml
      └── personal.wxss
   └── login  登陆
      ├── login.js
      ├── login.json
      ├── login.wxml
      └── login.wxss
├── utils
   └── constants 常量
      └── index.js 公共常量
   └── logger 日志采集工具类
      └── index.js
   └── request 网络请求工具类
      └── index.js
   └── sdk
      ├── ext.sdk.js ext封装
      └── wx.sdk.js 微信api封装
   └── wxs 小程序wxs
      └── filter.wxs 过滤方法
   └── validate 校验工具类
      └── index.js
   └── number.js 
   └── util.js 常用工具类库
├── .eslintrc  eslint配置文件
├── .gitignore  git忽略提交
├── app.js   小程序入口
├── app.json  小程序原生配置文件
├── app.wxss  小程序公共样式，reset样式等
├── CHANGELOG.md 日志记录
├── config.js 全局配置文件
├── mp.config.js mp-cli自定义配置文件
├── package.json npm配置文件
├── project.config.json 小程序项目配置文件
├── README.md 项目说明
└── sitemap.json
```
## 开发人员
| 姓名 | ERP | 职位 |
| :--- | :--- | :--- |
| 孙则浩 | sunzehao3<a href="timline://chat/?topin=sunzehao3" title="联系咚咚"><img src="https://king.jd.com/common/img/dongdong.png"></a> | 前端开发工程师岗 |