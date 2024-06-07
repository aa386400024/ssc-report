// stores/modules/auth.ts
import { defineStore } from 'pinia'

interface AuthState {
	userInfo : {
		name ?: string,
		email ?: string,
	},
	token : string,
}

export const useAuthStore = defineStore('auth', {
	state: () : AuthState => {
		return {
			userInfo: {}, // 初始化 userInfo
			token: '', // 初始化 token
		}
	},
	actions: {
		setUserInfo(this : AuthState, userInfo : AuthState['userInfo']) {
			this.userInfo = userInfo;
		},
		setToken(this : AuthState, token : string) {
			uni.setStorageSync('token', token)
			this.token = token;
		},
	},
})

// 定义需要持久化的状态键
export const authPersistStateKeys = [
	{ storeId: 'auth', key: 'userInfo' },
	{ storeId: 'auth', key: 'token' }
]