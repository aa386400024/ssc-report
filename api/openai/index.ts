// api/open/index.ts

import { request, RequestOptions } from '@/utils/api/request'

// 下面是使用了cloud的方式的封装
export async function completions(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'client/openai/pub/openai.getOpenaiList',
		data,
		cloudFunction: true,
	}
	const response = await request(options)
	return response.data
}