# 本地开发注意事项
## **本地开发**
开发版本的程序，可以在代码根目录中使用npm link(软链接到本地node/bin下)将其注册为全局安装，当开发完毕正式发布后，使用npm unlink去除连接即可。
## **发布版本**
当node包开发完成并使用publish命令正式发布以后，即可通过npm install -g XXX或yarn global add XXX直接从npm上下载并全局安装，然后即可全局使用。

## **创建分支**
git init 
git remote add origin https://github.com/szh0526/mp-cli.git
git checkout -f master
git branch <branch名称>
git checkout -f <branch名称>
git add .
git commit -m '初始化项目'
git push


## **小程序开发流程
需求沟通-需求评审-需求就绪-开发设计-开发中-测试中-待上线-完成

## **小程序上线
检查checklist-打包-提审-发布 