```
.
├── .gitignore # git忽略规则文件
├── androidPrivacy.json # 安卓应用隐私策略文件
├── app.config.js # uni-app全局配置
├── App.vue # 项目根组件
├── changelog.md # 版本变更日志
├── env.js # 环境变量配置
├── folder.txt # 其他信息文件
├── index.html # HTML入口文件
├── jest.config.js # Jest测试配置文件
├── LICENSE # 许可证
├── main.js # 应用程序主入口
├── manifest.json # 应用程序描述和配置文件
├── package-lock.json # 保存项目所有的依赖版本信息
├── package.json # 包信息文件
├── pages.json # 配置uni-app的所有页面路径，窗口样式等
├── README.md # 项目说明文件
├── tsconfig.json # TypeScript编译配置文件
├── uni-starter.config.js # uni-app启动器配置文件
├── uni.scss # uni-app全局样式文件
├── vite.config.js # Vite打包工具配置文件
│
├── .hbuilderx # HBuilderX配置目录
│   └── launch.json # 调试配置文件
│
├── api # 存放所有api请求及拦截器
│   ├── interceptors
│   │   ├── index.ts # 拦截器入口
│   │   ├── request-interceptor.ts # 请求拦截器
│   │   └── response-interceptor.ts # 响应拦截器
│   ├── todos
│   │   └── index.ts # 存放todos相关api请求
│   └── index.ts # api入口文件
│
├── common # 存放公共文件
│   ├── css
│   │   ├── index-nvue.scss # nvue样式文件
│   │   ├── index-vue.scss # vue样式文件
│   │   ├── mixins.scss # Sass混入(mixins)
│   │   ├── fonts
│   │   │   ├── iconfont.css # 图标字体样式
│   │   │   └── iconfont.ttf # 图标字体文件
│   │   ├── nvue-styles # nvue专用样式目录
│   │   └── vue-styles # vue专用样式目录
│   └── js
│       ├── common.ts # 全局公共方法
│       └── myPubFunction.js # 公共函数文件
│
├── startup # 用于存放应用程序初始化和启动的逻辑
│   ├── appInit.js # 应用初始化文件
│   └── openApp.js # 应用打开文件
│
├── components # 组件文件目录
│   ├── Base # 基础组件
│   ├── Custom # 自定义组件
│   ├── refreshBox # 刷新盒子组件
│   └── uni-load-state # uni-app加载状态组件
│
├── hooks # 存放 Vue composition API 的 hooks
│   ├── useGlobalAPI.ts # 全局属性和方法
│   └── useGlobalProperties.ts # 用于在 Vue 3 组件中安全地访问全局属性和方法。
│ 
├── lang # 国际化语言包
│   ├── en.js # 英文语言包
│   ├── i18n.js # i18n配置文件
│   └── zh-Hans.js # 简体中文语言包
│
├── pages # 存放所有页面文件
│   ├── circle # 圆形页
│   ├── grid # 网格页
│   ├── home # 首页
│   ├── list # 列表页
│   ├── my # 个人页
│   ├── practice # 练习页
│   ├── ucenter # 用户中心页
│   └── uni-agree # uni-app同意组件页
│
├── pages_template # 页面模板目录
│   ├── db-test # 数据库测试页
│   ├── kong # 空白页
│   ├── openapi # 开放API页
│   ├── temporary-cache # 临时缓存页
│   ├── uni-id # uni-app身份验证页
│   └── vk-vuex # vk-vuex页面
│
├── plugins # 插件目录
│   ├── index.js # 插件入口文件
│   └── uni.promisify.adaptor.ts # uni-app的promisify适配器
│
├── static # 静态资源目录
│   ├── app-plus # App-plus平台专用资源
│   ├── h5 # h5平台专用资源
│   ├── tabbar # 底部导航栏图标
│   ├── uni-center # uni中心资源
│   └── uni-load-state # uni-app加载状态资源
│
├── stores # Vuex store目录
│   ├── modules # Vuex模块
│   ├── index.ts # store入口
│   └── pinia-persist-plugin.ts # Pinia持久化插件
│
├── sub_packages # 分包目录
│   └── auth # 认证分包目录
│
├── types # 类型声明文件目录
│   ├── api.d.ts # api相关类型声明
│   ├── global.d.ts # 全局类型声明
│   ├── router.d.ts # 路由类型声明
│   └── uview-plus.d.ts # uview-plus类型声明
│
└── utils # 工具函数目录
    ├── api # api工具函数
    ├── date # 日期相关工具函数
    ├── helper # 辅助工具函数
    ├── toast # 提示工具函数
    ├── validation # 验证工具函数
    └── websocket # WebSocket相关工具函数
```