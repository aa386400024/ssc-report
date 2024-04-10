// 引入 vue 的 getCurrentInstance 和 ComponentPublicInstance
import { getCurrentInstance, ComponentPublicInstance } from 'vue'

// 创建 useGlobalProperties 钩子函数，并定义了一个泛型参数 T，它必须是一个 Vue 组件实例或其子类
export function useGlobalProperties<T extends ComponentPublicInstance>() : T {
	// 使用 getCurrentInstance 函数来获取当前 Vue 组件实例
	const instance = getCurrentInstance()

	// 如果没有找到当前的 Vue 组件实例，那就抛出一个错误
	if (!instance) {
		throw new Error('This must be run within setup function.')
	}

	// 创建并返回一个新的 Proxy 对象，它包装了当前组件实例的 proxy 对象
	// Proxy 对象用来拦截对组件实例 proxy 对象的访问，当尝试获取一个属性时，它会运行以下的 get 函数
	return new Proxy(instance.proxy!, {  // 添加了非空断言操作符 `!`
		// get 函数接收两个参数：目标对象和要访问的属性名
		get(target, prop : string | symbol) {
			// 检查要访问的属性是否在目标对象上
			if (prop in target) {
				// 如果属性存在，就返回它的值
				return target[prop as keyof typeof target]
			} else {
				// 如果属性不存在，就抛出一个错误
				throw new Error(`Global property ${String(prop)} not found.`)
			}
		}
	}) as T
}