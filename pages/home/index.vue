<template>
	<view class="page-container">
		<u-button shape="circle" type="primary" size="large" text="登 录" @click="getApi"></u-button>
		<u-search placeholder="输入报告关键词, 例如'人工智能'" shape="round" :disabled="true" :showAction="false" :color="textColor" @click="handleSearch"></u-search>

		<view class="swiper">
			<u-swiper indicator indicatorMode="dot" keyName="image" :height="100" :radius="8" :list="bannerList" @change="changeBanner" @click="clickBanner"></u-swiper>
		</view>

		<view class="tabs">
			<u-tabs :list="reportCategoryList" :activeStyle="activeStyle" :inactiveStyle="inactiveStyle" :itemStyle="itemStyle" @click="handleTabClick"></u-tabs>
		</view>
		<InfiniteScroll
			class="report-view"
			:loadMoreMethod="loadMore"
			:hasMore="hasMore"
			:isLoading="isLoading"
			:enableRefresh="false"
			@update:isLoading="(isLoading) => (myData.isLoading = isLoading)"
		>
			<u-cell-group :border="false" :customStyle="{ fontWeight: 'bold' }" class="cell-group-container">
				<u-cell v-for="(cell, index) in reportList" :key="`group-0-cell-${index}`" @click="() => handleCell(cell.name)">
					<template #title>
						<view class="title-view">
							<view class="title">{{ cell.title }}</view>
							<view class="right-icon">
								<image v-if="cell.hot" src="/static/home/flag_hot.png" style="width: 20px; height: 20px"></image>
								<image v-if="cell.isNew" src="/static/home/flag_new.png" style="width: 20px; height: 20px"></image>
							</view>
						</view>
						<view class="info">
							<image v-if="cell.fileType === 'pdf'" src="/static/file/file_type_pdf.png" style="width: 11px; height: 13px"></image>
							<image v-if="cell.fileType === 'doc'" src="/static/file/file_type_doc.png" style="width: 11px; height: 13px"></image>
							<image v-if="cell.fileType === 'ppt'" src="/static/file/file_type_ppt.png" style="width: 11px; height: 13px"></image>
							<text>{{ cell.fileType }}</text>
							<text>{{ computeFileSize(cell.filesize) }}</text>
							<text>{{ cell.pages }}页</text>
							<text>{{ cell.industry }}</text>
							<text>{{ cell.comeFrom }}</text>
							<text>{{ cell.time }}</text>
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

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs, computed } from 'vue';
import { fetchReportsView, fetchBannerInfo, fetchIndustries, fetchHotReport } from '@/api/home';
import InfiniteScroll from '@/components/InfiniteScroll/InfiniteScroll.vue';
import { useAuthStore } from '@/stores/modules/auth';
import { onLoad } from '@dcloudio/uni-app';

const authStore = useAuthStore();

const token = computed(() => authStore.token);

interface CategoryItem {
	name: string;
	id: number;
}

interface ReportItem {
	name: string;
	icon: string;
	title: string;
	path: string;
	isNew: boolean;
	hot: boolean;
	fileType: string;
	filesize: number;
	pages: number;
	industry: string;
	comeFrom: string;
	time: string;
}

const myData = reactive({
	textColor: '#fff',
	reportCategoryList: [{ name: '全部', id: 0 }] as CategoryItem[],
	activeStyle: {
		color: '#303133',
		fontWeight: 'bold',
		transform: 'scale(1.2)'
	},
	inactiveStyle: {
		color: '#606266',
		transform: 'scale(1.1)'
	},
	itemStyle: {
		paddingLeft: '15px',
		paddingRight: '15px',
		height: '36px'
	},
	bannerList: [] as { image: string; actionType: string; actionContent: string }[],
	reportList: [
		{
			name: 'inviteRanking',
			icon: 'friends',
			title: '2023胖东来：幸福企业进化之路分享-混沌学院.pdf',
			path: '/pages_sub/invite-ranking/invite-ranking',
			isNew: true,
			hot: false,
			fileType: 'pdf',
			filesize: 23345,
			pages: 20,
			industry: '教育',
			comeFrom: '混沌学院',
			time: '2024-04-04'
		},
		{
			name: 'readRanking',
			icon: 'read',
			title: '2024年ai营销应用解析报告-微易播.pdf',
			path: '/pages_sub/read-ranking/read-ranking',
			isNew: false,
			hot: true,
			fileType: 'doc',
			filesize: 12345,
			pages: 15,
			industry: '科技',
			comeFrom: '微易播',
			time: '2024-04-04'
		}
	] as ReportItem[],
	pageNo: 1,
	pageSize: 10,
	hasMore: true,
	isLoading: false
});
const { textColor, reportCategoryList, activeStyle, inactiveStyle, itemStyle, bannerList, reportList, isLoading, loadingText, hasMore } = toRefs(myData);

const handleSearch = () => {
	console.log('handleSearch');
	uni.navigateTo({
		url: `/pages_sub/search/search`
	});
};

const changeBanner = () => {};

const clickBanner = () => {};

const handleCell = (name) => {
	// 直接从reportList中查找对应的cell项
	console.log(name, 'name');
	const cellItem = myData.reportList.find((cell) => cell.name === name);
	console.log(cellItem, 'cellItem.path');
	if (cellItem && cellItem.path) {
		uni.navigateTo({
			url: `/pages_sub/report-detail/report-detail?id=${cellItem.path}` // 将参数拼接在URL中
		});
	} else {
		console.error('未找到对应的路由配置');
	}
};

const handleTabClick = () => {};

const getApi = () => {
	loadMore();
};

const computeFileSize = (size: number) => {
	// 用于计算文件大小的函数
	if (size < 1024) {
		return size + ' B';
	} else if (size < 1024 * 1024) {
		return (size / 1024).toFixed(2) + ' KB';
	} else {
		return (size / (1024 * 1024)).toFixed(2) + ' MB';
	}
};

const loadMore = async () => {
	console.log('Attempting to load more...');
	// if (!hasMore.value || isLoading.value) return;
	myData.pageNo++;
	try {
		const result = await fetchReportsView({ pageSize: myData.pageSize, pageNo: myData.pageNo });
		console.log(result, 'result');
		if (result && result.data && result.data.length) {
			// reportList.value.push(...result.data);
			hasMore.value = result.hasMore;
		} else {
			hasMore.value = false;
		}
	} catch (e) {
		console.error('Failed to load more:', e);
	}
};

// 获取banner
const fetchBannerList = async () => {
	try {
		const result = await fetchBannerInfo();
		console.log(result, 'result-banner');
		if (result && result.records && result.records.length) {
			console.log(result.records, 'result.records');
			bannerList.value = result.records;
		}
	} catch (e) {
		console.error('Failed to fetch banner info:', e);
	}
};

// 行业列表
const fetchReportCategoryList = async () => {
	try {
		const result = await fetchIndustries({});
		console.log(result, 'result-fetchReportCategoryList');
		if (result && result.records && result.records.length) {
			reportCategoryList.value = [...reportCategoryList.value, ...result.records];
		} else {
			reportCategoryList.value = [{ name: '全部', id: 0 }];
		}
	} catch (e) {
		console.error('Failed to fetch industries:', e);
	}
};

// 热门报告
const fetchHotReportList = async () => {
	try {
		const result = await fetchHotReport({});
		if (result && result.data && result.data.length) {
			// reportCategoryList.value = result.data
		} else {
			// reportCategoryList.value = []
		}
	} catch (e) {
		console.error('Failed to industries:', e);
	}
};

onMounted(() => {
	fetchBannerList();
	fetchReportCategoryList();
	fetchHotReportList();
});

onLoad(() => {
	loadMore();
});
</script>

<style lang="scss" scoped>
.page-container {
	background: #fff;
	.swiper {
		margin: 20rpx auto;
	}
}
.report-view {
	margin: 20rpx;

	.cell-group-container {
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

			.right-icon {
				text {
					margin: 0 10rpx;
				}
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
