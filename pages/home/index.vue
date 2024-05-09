<template>
	<view class="page-container">
		<u-search placeholder="输入报告关键词, 例如'人工智能'" shape="round" :disabled="true" :showAction="false" :color="textColor" @click="handleSearch"></u-search>

		<view class="swiper">
			<u-swiper indicator indicatorMode="dot" :height="100" :radius="8" :list="bannerList" @change="changeBanner" @click="clickBanner"></u-swiper>
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
								<text class="iconfont icon-mima"></text>
								<text class="iconfont icon-mima"></text>
							</view>
						</view>
						<view class="info">
							<text class="iconfont icon-mima">pdf</text>
							<text>22.23MB</text>
							<text>244页</text>
							<text>混沌学院</text>
							<text>2024-04-04</text>
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
import { onMounted, reactive, ref, toRefs } from 'vue';
import { fetchReportsView, fetchBannerInfo, fetchIndustries, fetchHotReport } from '@/api/home';
import InfiniteScroll from '@/components/InfiniteScroll/InfiniteScroll.vue';

const myData = reactive({
	textColor: '#fff',
	reportCategoryList: [{ name: '全部' }, { name: 'GPT' }, { name: '元宇宙' }, { name: '双碳' }, { name: '电商' }, { name: '短视频' }, { name: '房地产' }],
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
	bannerList: [
		'https://cdn.uviewui.com/uview/swiper/swiper1.png',
		'https://cdn.uviewui.com/uview/swiper/swiper2.png',
		'https://cdn.uviewui.com/uview/swiper/swiper3.png'
	] as string[],
	reportList: [
		{ name: 'inviteRanking', icon: 'friends', title: '2023胖东来：幸福企业进化之路分享-混沌学院.pdf', path: '/pages_sub/invite-ranking/invite-ranking' },
		{ name: 'readRanking', icon: 'read', title: '2024年ai营销应用解析报告-微易播.pdf', path: '/pages_sub/read-ranking/read-ranking' },
		{ name: 'wechatGroups', icon: 'wechat', title: '2024年年度天猫消费趋势报告-天猫.pdf', path: '/pages_sub/wechat-groups/wechat-groups' },
		{ name: 'vipCode', icon: 'vip', title: '2024全球人才趋势报告：在机器增强的世界释放员工潜力-美世咨询.pdf', path: '/pages_sub/vip-code/vip-code' },
		{ name: 'inviteRanking', icon: 'friends', title: '2023胖东来：幸福企业进化之路分享-混沌学院.pdf', path: '/pages_sub/invite-ranking/invite-ranking' },
		{ name: 'readRanking', icon: 'read', title: '2024年ai营销应用解析报告-微易播.pdf', path: '/pages_sub/read-ranking/read-ranking' },
		{ name: 'wechatGroups', icon: 'wechat', title: '2024年年度天猫消费趋势报告-天猫.pdf', path: '/pages_sub/wechat-groups/wechat-groups' },
		{ name: 'vipCode', icon: 'vip', title: '2024全球人才趋势报告：在机器增强的世界释放员工潜力-美世咨询.pdf', path: '/pages_sub/vip-code/vip-code' }
	],
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

const loadMore = async () => {
	console.log('Attempting to load more...');
	if (!hasMore.value || isLoading.value) return;
	myData.pageNo++;
	try {
		const result = await fetchReportsView({ pageSize: myData.pageSize, pageNo: myData.pageNo });
		if (result && result.data && result.data.length) {
			reportList.value.push(...result.data);
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
		const result = await fetchBannerInfo({});
		if (result && result.data && result.data.length) {
			bannerList.value = result.data
		} else {
			// bannerList.value = []
		}
	} catch (e) {
		console.error('Failed to banner info:', e);
	}
}

// 行业列表
const fetchReportCategoryList = async () => {
	try {
		const result = await fetchIndustries({});
		if (result && result.data && result.data.length) {
			reportCategoryList.value = result.data
		} else {
			reportCategoryList.value = []
		}
	} catch (e) {
		console.error('Failed to industries:', e);
	}
}

// 热门报告
const fetchHotReportList = async () => {
	try {
		const result = await fetchHotReport({});
		if (result && result.data && result.data.length) {
			reportCategoryList.value = result.data
		} else {
			reportCategoryList.value = []
		}
	} catch (e) {
		console.error('Failed to industries:', e);
	}
}

onMounted(() => {
	fetchBannerList();
	fetchReportCategoryList();
	fetchHotReportList();
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
