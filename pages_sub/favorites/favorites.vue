<template>
	<view class="page-container">
		<InfiniteScroll
			class="cell-group-container"
			:loadMoreMethod="loadMore"
			:hasMore="hasMore"
			:isLoading="isLoading"
			:enableRefresh="false"
			:noMoreText="'你还没有收藏过噢(#^.^#)'"
			@update:isLoading="updateIsLoading"
		>
			<u-cell-group :border="false" :customStyle="{ fontWeight: 'bold' }">
				<u-cell v-for="(cell, index) in cellGroups" :key="`group-0-cell-${index}`" @click="() => handleCell(cell.name)">
					<template #title>
						<view class="title-view">
							<view class="title">{{ cell.title }}</view>
						</view>
						<view class="info">
							<text class="iconfont icon-mima">pdf</text>
							<text>{{ cell.size }}MB</text>
							<text>{{ cell.pages }}页</text>
							<text>{{ cell.author }}</text>
							<text>{{ cell.date }}</text>
						</view>
					</template>
					<template #icon>
						<text :class="`iconfont ${cell.icon}`"></text>
					</template>
				</u-cell>
			</u-cell-group>
		</InfiniteScroll>
	</view>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { fetchMyCollections } from '@/api/my';
import InfiniteScroll from '@/components/InfiniteScroll/InfiniteScroll.vue';

const myData = reactive({
	cellGroups: [],
	pageNo: 1,
	pageSize: 10,
	hasMore: true,
	isLoading: false
});

const { cellGroups, hasMore, isLoading } = toRefs(myData);

const loadMore = async () => {
	if (!hasMore.value || isLoading.value) return;
	isLoading.value = true;
	try {
		const { code, record } = await fetchMyCollections(myData.pageNo, myData.pageSize);
		if (code === 0 && record && record.reports.length) {
			const newCells = record.reports.map((report) => ({
				name: `report-${report.id}`,
				title: report.title,
				size: report.size,
				pages: report.pages,
				author: report.author,
				date: report.date,
				icon: 'pdf'
			}));
			cellGroups.value = [...cellGroups.value, ...newCells];
			myData.pageNo++;
			hasMore.value = record.hasNext;
		} else {
			hasMore.value = false;
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	} finally {
		isLoading.value = false;
	}
};

const updateIsLoading = (newLoading) => {
	isLoading.value = newLoading;
};

const handleCell = (name: string) => {
	const cellItem = cellGroups.value.find((cell) => cell.name === name);
	if (cellItem) {
		uni.navigateTo({
			url: `/pages_sub/report-detail/report-detail?id=${cellItem.name}`
		});
	} else {
		console.error('未找到对应的路由配置');
	}
};

onMounted(loadMore);
</script>

<style lang="scss" scoped>
.page-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30rpx;
	width: 100%;
	.cell-group-container {
		width: 100%;
		&:not(:last-child) {
			margin-bottom: 40rpx;
		}

		::v-deep .u-cell__body {
			padding: 20rpx 0 !important;
		}

		.title-view {
			display: flex;
			justify-content: flex-start;
			.title {
				width: calc(100% - 120rpx);
				white-space: normal; /* 允许内容按照正常的方式进行换行 */
				word-wrap: break-word; /* 在需要的时候，单词可以被拆断换行 */
				overflow-wrap: break-word; /* 同上，确保内容不会溢出 */
			}
		}
		.info {
			font-weight: normal;
			font-size: 20rpx;
			color: #ccc;
			text {
				margin: 0 10rpx;
				&:first-child,
				&:last-child {
					margin: 0; // 特别为第一个和最后一个.text元素设置的样式
				}
			}
		}
	}
}
</style>
