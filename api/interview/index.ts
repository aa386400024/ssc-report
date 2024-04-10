// api/interview/index.ts

import { request, RequestOptions } from '@/utils/api/request'

// 面试历史数据接口
export async function fetchIvHistory(data: IvHsitory): Promise<any> {
	const options: RequestOptions = {
		url: 'client/interview/kh/ivHistoryList',
		cloudFunction: true,
		title: '请求中...',
		data
	}
	const response = await request(options)
	return response.data
}

// 面试历史数据接口
export async function fetchIvFeedback(data: IvFeedback): Promise<any> {
	const options: RequestOptions = {
		url: 'client/interview/kh/feedback',
		cloudFunction: true,
		title: '请求中...',
		data
	}
	const response = await request(options)
	return response.data
}