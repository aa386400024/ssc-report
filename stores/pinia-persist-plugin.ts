// pinia-persist-plugin.ts
import { PiniaPluginContext, PiniaPlugin } from 'pinia'
import { debounce } from 'lodash'
import config from '@/uni-starter.config.js'
import { counterPersistStateKeys } from './modules/counter'
import { authPersistStateKeys } from './modules/auth'
// import { authPersistStateKeys } from './modules/auth';
// ... import other modules' persistStateKeys


// 将所有模块的持久化状态键组合在一起
const persistStateKeys = [
	...counterPersistStateKeys,
	...authPersistStateKeys,
]

export const piniaPersistPlugin: PiniaPlugin = ({ store }: PiniaPluginContext) => {
	// 获取已有的本地数据并将其合并到 store 中
	const persistedState = uni.getStorageSync(config.constants.storageKey)
	if (persistedState) {
		try {
			store.$patch(JSON.parse(persistedState))
		} catch (error) {
			console.error('Failed to parse persisted state:', error)
			// 在解析失败的情况下，可以选择清除本地存储中的数据或采取其他恢复措施
			uni.removeStorageSync(config.constants.storageKey);
			
		}
	}

	const persistState = () => {
		const persistState = {} as any;

		// 检查每个状态是否需要持久化，如果需要就添加到 persistState 中
		for (const stateKey of persistStateKeys) {
			if (stateKey.storeId === store.$id && store.$state.hasOwnProperty(stateKey.key)) {
				persistState[stateKey.key] = store.$state[stateKey.key]
			}
		}

		// 将需要持久化的状态保存到本地存储中
		uni.setStorageSync(
			config.constants.storageKey,
			JSON.stringify(persistState)
		)
		console.log('Persisting state:', persistState);
	}

	// 在 store 被修改时更新本地数据
	store.$subscribe(debounce(persistState, 300))  // 在 300ms 内，只会执行一次 persistState
}

