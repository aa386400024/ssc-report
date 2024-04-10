<template>
	<view :style="styleObject"></view>
</template>

<script lang="ts" setup>
	import { computed, inject } from 'vue';

	// 注入全局样式变量，并进行类型断言
	const globalVariables = inject('globalVariables') as GlobalVariables;
	console.log(globalVariables, 'globalVariables')
	// 定义 props 
	const props = defineProps({
		height: String,
		bgColor: String,
	});
	// 计算样式对象
	const styleObject = computed(() => ({
		height: props.height ?? globalVariables.gapHeight,
		backgroundColor: props.bgColor ?? globalVariables.gapBgcolor,
	}));
</script>

<style scoped>
</style>
