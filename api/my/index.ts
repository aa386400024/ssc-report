// api/home/index.ts

import { request, RequestOptions } from '@/utils/api/request'

// 行业数据接口
export async function fetchIvHistory(): Promise<any> {
	const options: RequestOptions = {
		url: 'client/industries/pub/getList',
		cloudFunction: true,
		loading: false,
	}
	const response = await request(options)
	return response.data
}