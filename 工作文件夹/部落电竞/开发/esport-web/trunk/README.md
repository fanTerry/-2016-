#基于vue.js开发的橘子电竞web网站 [线上访问地址](https://www.esportzoo.cn)

通过`npm`安装本地服务第三方依赖模块(需要已安装[Node.js](https://nodejs.org/))

```
npm install
```

启动服务(http://localhost:8888)

```
npm run dev
```

发布代码
```
npm run build
```

###开发

###目录结构
<pre>
.
├── README.md           
├── build              // 构建服务和webpack配置
├── config             // 项目不同环境的配置,主要存放配置文件，用于区分开发环境、线上环境的不同
├── dist               // 默认 npm run build 命令打包生成的静态资源文件，用于生产部署
├── node_modules       // 存放npm命令下载的开发环境和生产环境的依赖包
├── index.html         // 项目入口文件
├── package.json       // 项目配置文件
├── src                // 生产目录
│   ├── assets         // css js 和图片资源
│   ├── components     // 各种组件
│   ├── views          // 各种页面
│   ├── vuex           // vuex状态管理器
│   ├── filters.js     // 各种过滤器
│   └── main.js        // Webpack 预编译入口
</pre>

webpack.base.conf.js 用于配置 less、sass等css预编译库，或者配置 UI 库。

## 插件说明
- axios 基于 promise 的 HTTP 库
- vuex  管理全局数据
- iview css插件
- qs  数据格式转换插件 配合axios post使用
- vue-awesome-swiper 轮播图
- vue-lazyload 图片懒加载
