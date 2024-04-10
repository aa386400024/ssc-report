import { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    getOpenerEventChannel: () => any;
  }
}

declare global {
	namespace NodeJS {
		interface Global {
			uniEnv: {
				ENV: string
				TIMEOUT: number
				BASE_URL: string
				STORAGE_KEY: string
			}
		}
	}
}

export {}
