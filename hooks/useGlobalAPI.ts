// hooks/useGlobalAPI.ts
import APIWrapper from '@/common/js/apiWrapper'
import config from '@/uni-starter.config'

export function useGlobalAPI() {
	const apiWrapper = new APIWrapper()
	return {
		apiWrapper,
		config,
	}
}
