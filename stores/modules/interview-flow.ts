import { defineStore } from 'pinia'

interface interviewState {
	currentJobInfo: {
		name?: string,
		position_id?: string,
		industry_name?: string,
	},
	ivCustomParams: {
		positionId: string,
		selectedStyleRadio: string,
		selectedLevelRadio: string,
		selectedSkillRadios: string[]
	}
}

export const useInterviewStore = defineStore('interview', {
	state: (): interviewState => {
		return { 
			currentJobInfo: {}, // 初始化 currentJobInfo
			ivCustomParams: { // 初始化随机面试题参数
				positionId: '',
				selectedStyleRadio: '',
				selectedLevelRadio: '',
				selectedSkillRadios: []
			}
		} 
	},
	actions: {
		increment(this: interviewState): void {},
	},
})

// 定义需要持久化的状态键
export const interviewPersistStateKeys = [
	{ storeId: 'interview', key: 'currentJobInfo' },
	{ storeId: 'interview', key: 'ivCustomParams' }
]
