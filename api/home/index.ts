// api/home/index.ts


import { request, RequestOptions } from '@/utils/api/request'
// 一个示例API请求函数
export async function fetchReportsView(data: any, headers: any): Promise<any> {
	const options: RequestOptions = {
		url: 'me/collections',
		method: 'GET',
		data,
		headers,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}