import config from '@/uni-starter.config.js'
import { CancelToken } from '@/utils/cancel-token'
import { responseInterceptor, requestInterceptor } from '@/api/interceptors'
interface RequestOptions {
	url: string
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
	data?: any
	headers?: Record<string, string>
	timeout?: number
	cancelToken?: CancelToken
	cloudFunction?: boolean
	loading?: boolean | object
	title?: string
}

interface VKCloudFunctionResult {
	data: any // 这里使用了any类型，你可能需要根据实际情况更改为具体的类型
}

function request(
	options: RequestOptions,
): Promise<UniApp.RequestSuccessCallbackResult | VKCloudFunctionResult> {
	const {
		url,
		method = 'GET',
		data,
		headers,
		timeout = config.api.timeout,
		cancelToken,
		cloudFunction = false,
		title,
		loading = true
	} = requestInterceptor(options)

	if (cloudFunction) {
		// 是云函数请求，使用vk.callFunction
		return new Promise((resolve, reject) => {
			uni.vk.callFunction({
				url,
				title,
				data,
				loading,
				success(res: any) {
					console.log('Cloud function call succeeded:', res)
					resolve({ data: res })
				},
				fail(error: any) {
					console.error('Cloud function call failed:', error)
					reject(error)
				},
			})
		})
	} else {
		// 不是云函数请求，使用uni.request
		return new Promise((resolve, reject) => {
			const requestTask = uni.request({
				url: config.api.baseUrl + url,
				method,
				data,
				header: { ...config.api.headers, ...headers },
				timeout,
				success: async response => {
					try {
						const processedResponse = await responseInterceptor(response)
						resolve(processedResponse)
					} catch (error) {
						reject(error)
					}
				},
				fail: error => {
					reject(error)
				},
			})

			if (cancelToken) {
				cancelToken.cancel = reason => {
					requestTask.abort()
					reject(reason)
				}
			}
		})
	}
}

export { request, RequestOptions }
