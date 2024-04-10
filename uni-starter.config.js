//这是应用的配置页面，App.vue挂载到getApp().globalData.config
let baseUrl = process.env.BASE_URL

// #ifdef APP-PLUS
baseUrl = "https://api.chatanywhere.com.cn"
// #endif
export default {
	h5: {
		url: "", //	前端网页托管的域名	
		// 在h5端全局悬浮引导用户下载app的功能 更多自定义要求在/common/openApp.js中修改	
		openApp: { //如不需要本功能直接移除本节点即可	
			// //点击悬浮下载栏后打开的网页链接
			// openUrl: '/#/pages/ucenter/invite/invite',
			// //左侧显示的应用名称	
			// appname: 'uni-starter',
			// //应用的图标	
			// logo: './static/logo.png',
		}
	},
	mp: {
		weixin: {
			//微信小程序原始id，微信小程序分享时
			id: ""
		}
	},
	// 关于应用的配置
	about: {
		// 应用名称
		appName: "uni-cloud-formwork",
		// 自定义头部 custom: 自定义，default: 系统默认
		navbar: 'default',
		// 应用logo
		logo: "/static/logo.png",
		// 公司名称
		company: "陆探信息咨询工作室",
		// 口号
		slogan: "uni-cloud最佳实践",
		// 应用的下载链接，用于分享到第三方平台和生成关于我们页的二维码
		download: "https://itunes.apple.com/cn/app/hello-uni-app/id1417078253?mt=8",
		// 应用版本，用于非app端显示，app端自动获取
		version: "1.0.0",
	},
	// 用于生成二合一下载页面的配置
	download: {
		ios: "https://itunes.apple.com/cn/app/hello-uni-app/id1417078253?mt=8",
		android: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-97fca9f2-41f6-449f-a35e-3f135d4c3875/6d754387-a6c3-48ed-8ad2-e8f39b40fc01.apk",
	},
	// 用于打开应用市场评分界面的配置
	marketId: {
		ios: "",
		android: "",
	},
	// 国际化配置，i18n为英文单词 internationalization的首末字符i和n，18为中间的字符数，是“国际化”的简称
	i18n: {
		// 是否开启国际化，默认关闭。如果你想使用国际化相关功能，请改为true
		enable: false,
	},
	// 登录方式配置
	loginTypes: ['weixin', 'apple', 'univerify', 'smsCode', 'oa', 'username'],
	// 导航栏相关配置
	navbar: {
		style: 'custom',
		custom: '/components/use-navbar/use-navbar',
	},
	// 路由配置
	route: {
		home: '/pages/home/index',
		login: '/pages/login/login',
		search: '/pages/home/search/search',
		order: '/sub-user/pages/order/order',
		pay: '/sub-goods/pages/pay/pay',
		goods: '/sub-goods/pages/detail',
		goodslist: '/sub-goods/pages/list',
	},
	// 服务提供商相关配置
	provider: {
		name: '',
		// 提供商名称映射
		names: {
			weixin: '微信',
			qq: 'QQ',
			alipay: '支付宝',
			baidu: '百度',
			toutiao: '头条',
		},
	},
	// 常量配置
	constants: {
		storageKey: "__my_app_storage__",
	},
	// API相关配置
	api: {
		baseUrl,
		timeout: 5000,
		headers: {
			'Content-Type': 'application/json',
		},
	},
}