
import { RequestOptions } from '@/utils/api/request'

export function requestInterceptor(config : RequestOptions) : RequestOptions {
	// 在这里处理请求拦截逻辑
	// 例如：为每个请求添加一个认证令牌
	// const token = uni.getStorageSync('token')
	const token = 'U617164587682bf3a67ffc41aca8e9dfa5ac02267cd20'
	if (token) {
		config.headers = {
			...config.headers,
			Authorization: `${token}`,
			// Authorization: 'U617164587682bf3a67ffc41aca8e9dfa5ac02267cd20'
		}
	}
	return config
}