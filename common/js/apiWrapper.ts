'use strict'
import config from '@/uni-starter.config'

// 定义一个初始菜单按钮信息对象，包含top、width和height属性
let menuButtonInfo = {
	top: 6,
	width: 0,
	height: 30,
}

// #ifdef MP-WEIXIN
// 如果在微信小程序中，获取微信小程序的菜单按钮位置信息覆盖之前定义的menuButtonInfo对象
menuButtonInfo = uni.getMenuButtonBoundingClientRect()
// #endif

// 定义一个APIWrapper类
class APIWrapper {
	// 明确声明类属性navbar、menuButtonInfo、navbarTitleHeight和navbarHeight
	navbar: typeof menuButtonInfo
	menuButtonInfo: typeof menuButtonInfo
	navbarTitleHeight: number
	navbarHeight: number

	constructor() {
		// 在构造函数中，为类属性赋值
		this.navbar = menuButtonInfo // 导航栏信息，引用之前定义的menuButtonInfo对象
		this.menuButtonInfo = menuButtonInfo // 菜单按钮信息，引用之前定义的menuButtonInfo对象
		this.navbarTitleHeight = menuButtonInfo.height // 导航栏标题高度，取menuButtonInfo对象的height属性
		this.navbarHeight = menuButtonInfo.top + menuButtonInfo.height + 6 // 导航栏总高度，计算并取值
	}

	/**
	 * 获取指定元素选择器的位置信息
	 * @param selector - 选择器字符串
	 * @param callback - 回调函数，用于接收元素的位置信息
	 * @returns 如果未传入回调函数，返回一个Promise对象，可以使用async/await方式获取位置信息
	 */
	async getBoundingRect(selector: string, callback?: (res: any) => void): Promise<any> {
	    // 检查参数合法性
	    if (typeof selector !== 'string' || selector.trim() === '') {
	        throw new Error('Invalid selector. Selector must be a non-empty string.')
	    }
	
	    // 创建一个选择器查询对象，选择指定的元素
	    const query = uni.createSelectorQuery().select(selector)
	
	    try {
	        const result = await new Promise((resolve, reject) => {
	            query.fields({
	                size: true,
	                rect: true,
	                scrollOffset: true
	            }, (res: any) => {
	                resolve(res)
	            }).exec()
	        })
	
	        // 判断是否传入了回调函数，如果有，则调用回调函数传递位置信息
	        if (typeof callback === 'function') {
	            callback(result)
	        }
	
	        // 返回位置信息
	        return result
	    } catch (error) {
	        console.error('Error in selector query:', error)
	
	        // 在这里可以添加适当的错误处理逻辑，例如抛出自定义错误或进行其他操作
	
	        // 如果未传入回调函数，则抛出错误以便调用者处理
	        if (typeof callback !== 'function') {
	            throw error
	        }
	
	        // 如果传入了回调函数，则通过回调传递错误
	        callback(null)
	    }
	}
	
	/**
	 * @description 跳转首页
	 */
	tohome() {
		uni.switchTab({
			url: config.route.home
		});
	}
}

// 导出APIWrapper类
export default APIWrapper
