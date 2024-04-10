import App from './App'
import globalVariables from './hooks/useGlobalVariables'
import CustomGap from './components/base/gap.vue' 
// #ifndef VUE3
import Vue from 'vue'
import { setupPluginsV2, pluginsV2 } from './plugins/index.ts'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
// 在 Vue 2 中使用插件
setupPluginsV2(Vue, pluginsV2)
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import { piniaPersistPlugin } from './stores/pinia-persist-plugin'
import { setupPluginsV3, pluginsV3 } from './plugins/index.ts'
export function createApp() {
	const app = createSSRApp(App)
	app.use(Pinia.createPinia().use(piniaPersistPlugin)) // 添加 piniaPersistPlugin
	setupPluginsV3(app, pluginsV3) // 使用插件和功能设置
	
	// 提供全局样式变量
	app.provide('globalVariables', globalVariables)
	// 注册全局组件
	app.component('custom-gap', CustomGap)
	return {
		app,
		Pinia
	}
}
// #endif