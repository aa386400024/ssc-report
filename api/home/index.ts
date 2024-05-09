// api/home/index.ts

import { request, RequestOptions } from '@/utils/api/request'
// 首页报告列表
export async function fetchReportsView(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'me/collections',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}

// banner
export async function fetchBannerInfo(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'banner/info',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}

// 行业列表
export async function fetchIndustries(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'industries',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}

// 热门报告
export async function fetchHotReport(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'reports/find_hots',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}

// 报告详情
export async function fetchReportDetail(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'reports/view',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}
