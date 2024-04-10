// api/home/index.ts

import { request, RequestOptions } from '@/utils/api/request'

// 行业数据接口
export async function fetchIndustries(): Promise<any> {
	const options: RequestOptions = {
		url: 'client/industries/pub/getList',
		cloudFunction: true,
		loading: false,
	}
	const response = await request(options)
	return response.data
}

// 职位数据接口
export async function fetchPositions(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'client/positions/pub/getList',
		data,
		cloudFunction: true,
		title: '请求中...'
	}
	const response = await request(options)
	return response.data
}

// 自定义面试风格数据接口
export async function fetchIvCustom(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'client/interview/kh/customLList',
		data,
		cloudFunction: true,
		title: '请求中...'
	}
	const response = await request(options)
	return response.data
}

// 根据面试风格，面试难度，技术栈随机获取5条面试题数据接口
export async function fetchIvQuestion(data: FetchIvQuestion): Promise<any> {
	const options: RequestOptions = {
		url: 'client/interview/kh/questionList',
		data,
		cloudFunction: true,
		title: '请求中...'
	}
	const response = await request(options)
	return response.data
}

// 百度智能云-音频文件转写API
export async function audioToText(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'client/interview/kh/speechRecognition',
		data,
		cloudFunction: true,
	}
	const response = await request(options)
	return response.data
}

// 提交面试答案
export async function submitInterviewAnswer(data: InterviewAnswer): Promise<any> {
	const options: RequestOptions = {
		url: 'client/interview/kh/submitInterviewAnswer',
		data,
		cloudFunction: true,
	}
	const response = await request(options)
	return response.data
}