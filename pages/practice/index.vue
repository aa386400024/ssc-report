<template>
	<view class="page-container">
		<text>Count: {{ count }}</text>
		<text>Double Count: {{ doubleCount }}</text>
		<button @tap="increment">Increment</button>
		<button @click="incrementApi">Increment</button>
		<u-button type="warning" text="月落" @click="callVKFunction"></u-button>
		<u-button type="warning" text="生成面试题" @click="generateIvQuastion"></u-button>
		<text>API Result: {{ apiResult }}</text>
		{{os}}
		<text>{{navbar.top}}</text>
		{{sumVal}}
	</view>
</template>

<script lang="ts" setup>
	import { computed, onMounted, ref, toRefs, reactive } from 'vue';
	import { useCounterStore } from '@/stores';
	import { todos } from '@/api';
	import { fetchTodosCloud } from '@/api/todos';
	import { useGlobalAPI } from '@/hooks/useGlobalAPI'
	const { apiWrapper, config } = useGlobalAPI()
	const navbar = apiWrapper.navbar; 
	const myData = reactive({
		sumVal: 0,
	})
	const {
		sumVal
	} = toRefs(myData)
	const apiResult = ref(null);
	const incrementApi = async () => {
		try {
			const response = await fetchTodosCloud();
			apiResult.value = response;
			console.log(apiResult.value, 'responseresponseresponse');
		} catch (error) {
			console.error('Error during fetchTodosCloud:', error);
			// 可以在这里添加更多的错误处理逻辑，比如设置一个标志，让用户知道出现了错误
		}
	};
	
	const callVKFunction = () => {
		uni.vk.callFunction<{ x : number; y : number; }, { z : number; }>({
			url: 'client/pub.user.calc',
			title: '请求中...',
			data: {
				x: 1,
				y: 2
			},
			success: (data) => {
				const { z } = data;
				sumVal.value = z;
			},
			fail: (error) => {
				console.error(error);
			}
		});
	};
	
	const generateIvQuastion = () => {
		uni.vk.callFunction({
			url: 'client/openai/pub/generate-iv-quastion',
			title: '请求中...',
			data: {
				
			},
			success: (data) => {
				
			}
		});
	}
	
	
	const os = uni.$u.os()
	console.log(os, 'osos');
	const rightClick = () => {
		
	} 
	const navbarRect = () => {
		const selector = '.navbar';
		apiWrapper.getBoundingRect(selector, (res) => {
			// 在这里处理位置信息，可以使用res.left, res.top, res.width, res.height等属性
			console.log('Element position:', res);
		}); 
	} 

	// import { useRouter } from 'uni-mini-router'

	// let router = useRouter()
	// console.log(router, 'routerrouter')

	const counterStore = useCounterStore();

	const count = computed(() => counterStore.count);
	const doubleCount = computed(() => counterStore.doubleCount);
	const increment = counterStore.increment;

	// 如果在组件外要是有这个方法，需要defineExpose导出
	defineExpose({
		callVKFunction,
	});
	onMounted(async () => {
		navbarRect()
		const data = {
		   "model": "gpt-3.5-turbo",
		   "messages": [
				{
				  "role": "system",
				  "content": "You are a helpful assistant."
				},
				{
				  "role": "user",
				  "content": "Who won the world series in 2020?"
				}
		   ]
		}
		const todoList = await todos.fetchTodos();
	});
</script>