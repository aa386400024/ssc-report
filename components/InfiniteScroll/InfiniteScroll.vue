<template>
	<scroll-view
		class="infinite-scroll-view"
		:scroll-y="true"
		:refresher-enabled="enableRefresh"
		@refresherrefresh="onRefresh"
		@scrolltolower="loadMore"
		:lower-threshold="lowerThreshold"
	>
		<!-- 插入自定义内容的插槽 -->
		<slot></slot>

		<!-- 加载更多的指示器 -->
		<view v-if="isLoading && enableLoadMore" class="load-more">
			<text>{{ loadingText }}</text>
		</view>

		<!-- 没有更多内容的指示器 -->
		<view v-if="!hasMore && showNoMoreText" class="no-more">
			<text>没有更多内容了</text>
		</view>
	</scroll-view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// 定义属性及其类型
const props = defineProps({
	loadMoreMethod: Function,
	refreshMethod: Function,
	hasMore: Boolean,
	isLoading: Boolean,
	enableRefresh: {
		type: Boolean,
		default: true
	},
	enableLoadMore: {
		type: Boolean,
		default: true
	},
	showNoMoreText: {
		type: Boolean,
		default: true
	},
	lowerThreshold: {
		type: Number,
		default: 50
	}
});

// 定义事件发射器
const emit = defineEmits(['update:isLoading', 'loaded', 'refreshed']);

const loadingText = ref('加载中...');

// 上拉加载更多方法
const loadMore = async () => {
	if (!props.hasMore || props.isLoading || !props.enableLoadMore) return;
	emit('update:isLoading', true);
	try {
		await props.loadMoreMethod();
		emit('loaded');
	} catch (error) {
		console.error('加载数据失败:', error);
	}
	emit('update:isLoading', false);
};

// 下拉刷新方法
const onRefresh = async () => {
	if (props.isLoading || !props.enableRefresh) return;
	emit('update:isLoading', true);
	try {
		await props.refreshMethod();
		emit('refreshed');
	} catch (error) {
		console.error('刷新数据失败:', error);
	}
	emit('update:isLoading', false);
};

// 可选：监视属性变化
watch(
	() => props.isLoading,
	(newVal) => {
		if (newVal) {
			loadingText.value = '加载中...';
		} else {
			loadingText.value = '加载完成';
		}
	}
);
</script>

<style scoped lang="scss">
.infinite-scroll-view {
	min-height: 100%; // 确保视图可以扩展到足够的高度
	overflow: auto; // 允许滚动
}

.load-more,
.no-more {
	text-align: center;
	padding: 10px;
}
</style>
