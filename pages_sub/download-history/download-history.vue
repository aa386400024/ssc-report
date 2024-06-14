<template>
	<view class="page-container">
		<InfiniteScroll
			class="cell-group-container"
			:loadMoreMethod="loadMore"
			:hasMore="hasMore"
			:isLoading="isLoading"
			:enableRefresh="false"
			@update:isLoading="updateIsLoading"
		>
			<u-cell-group :border="false" :customStyle="{ fontWeight: 'bold' }" class="cell-group-container">
				<u-cell v-for="(cell, index) in cellGroups" :key="`group-0-cell-${index}`" @click="() => handleCell(cell.uuid)">
					<template #title>
						<view class="title-view">
							<view class="title">{{ cell.title }}</view>
						</view>
						<view class="info">
							<text class="iconfont icon-mima">{{ cell.filetype }}</text>
							<text>{{ cell.filesize }}MB</text>
							<text>{{ cell.pages }}页</text>
							<text>{{ cell.comefrom || cell.industries }}</text>
							<text>{{ cell.publishtime }}</text>
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
import { fetchDownloadHistory } from '@/api/my';
import InfiniteScroll from '@/components/InfiniteScroll/InfiniteScroll.vue';

const myData = reactive({
	cellGroups: [],
	pageNo: 1,
	pageSize: 10,
	hasMore: true,
	isLoading: false
});

const { cellGroups, hasMore, isLoading } = toRefs(myData);

const handleCell = (uuid: string) => {
	uni.navigateTo({
		url: `/pages_sub/report-detail/report-detail?id=${uuid}` // 将uuid作为参数拼接在URL中
	});
};

const loadMore = async () => {
	if (!hasMore.value || isLoading.value) return;
	isLoading.value = true;
	try {
		const { code, record } = await fetchDownloadHistory(myData.pageNo, myData.pageSize);
		if (code === 0 && record.reports.length > 0) {
			myData.cellGroups.push(...record.reports);
			myData.pageNo++;
			myData.hasMore = record.hasNext;
		} else {
			myData.hasMore = false;
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
