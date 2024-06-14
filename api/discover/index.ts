import { request, RequestOptions } from '@/utils/api/request'
// 热点推荐列表
export async function fetchFindHotsReport(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'me/find_hots',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}