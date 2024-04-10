import './uni.promisify.adaptor'
import '@/uni.scss' // 引入全局样式
import i18n from '@/lang/i18n'
// import router from '@/router'
import vk from '@/uni_modules/vk-unicloud'
import uviewPlus from '@/uni_modules/uview-plus'

// #ifdef VUE3
// 针对 Vue 3 的插件
export const pluginsV3 = [uviewPlus, i18n, vk]

export function setupPluginsV3(app, plugins = []) {
	// 使用插件
	plugins.forEach(plugin => {
		app.use(plugin)
	})
}
// #endif

// #ifndef VUE3
// 针对 Vue 2 的插件
export const pluginsV2 = [uviewPlus, i18n, vk]

export function setupPluginsV2(Vue, plugins = []) {
	// 使用插件
	plugins.forEach(plugin => {
		Vue.use(plugin)
	})
}
// #endif