import { defineStore } from 'pinia'

interface CounterState {
	count: number
	persistedDoubleCount: number // 新增状态 persistedDoubleCount
}

export const useCounterStore = defineStore('counter', {
	state: (): CounterState => {
		return { count: 0, persistedDoubleCount: 0 } // 初始化 persistedDoubleCount
	},
	getters: {
		doubleCount(this: CounterState): number {
			return this.count * 2
		},
	},
	actions: {
		increment(this: CounterState): void {
			this.count++
			this.persistedDoubleCount = this.doubleCount // 更新 persistedDoubleCount 的值
		},
	},
})

// 定义需要持久化的状态键
export const counterPersistStateKeys = [
	{ storeId: 'counter', key: 'count' },
	{ storeId: 'counter', key: 'persistedDoubleCount' }, // 将 persistedDoubleCount 添加到持久化状态键中
]
