// api/my/index.ts

import { request, RequestOptions } from '@/utils/api/request'
// 我的收藏
export async function fetchFavrites(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'me/collections',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}

// 下载历史
export async function fetchDownloadHistory(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'me/downloads',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}

// 查看历史
export async function fetchViewHistory(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'me/history',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}

// 邀请好友排名
export async function fetchInviteRank(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'me/invite_rank',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}

// 更新用户信息
export async function updateUserinfo(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'me/update_user_info',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}

// 兑换优惠券
export async function exchangeCode(data: any): Promise<any> {
	const options: RequestOptions = {
		url: 'coupon/exchange',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}