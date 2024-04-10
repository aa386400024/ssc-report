// api/todos/index.ts

import { request, RequestOptions } from '@/utils/api/request'
// 一个示例API请求函数
export async function fetchTodos(data: any): Promise<any> {
	const options: RequestOptions = {
		url: '/facts/random',
		method: 'GET',
		data,
		cloudFunction: false,
	}
	const response = await request(options)
	return response.data
}

// 下面是使用了cloud的方式的封装
export async function fetchTodosCloud(): Promise<any> {
	const options: RequestOptions = {
		url: 'template/db_api/pub/selects',
		cloudFunction: true,
	}
	const response = await request(options)
	return response.data
}

// 在此文件中定义更多与todos相关的API请求函数...
export async function generateIvQuastion(): Promise<any> {
	const options: RequestOptions = {
		url: 'client/openai/pub/generate-iv-quastion',
		cloudFunction: true,
	}
	const response = await request(options)
	return response.data
}