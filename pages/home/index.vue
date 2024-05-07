<template>
	<view class="page-container">
		<u-search placeholder="输入报告关键词, 例如'人工智能'" shape="round" :disabled="true" :showAction="false" :color="textColor" @click="handleSearch"></u-search>

		<view class="swiper">
			<u-swiper indicator indicatorMode="dot" :height="100" :radius="8" :list="bannerList" @change="changeBanner" @click="clickBanner"></u-swiper>
		</view>

		<view class="tabs">
			<u-tabs :list="reportCategoryList" :activeStyle="activeStyle" :inactiveStyle="inactiveStyle" :itemStyle="itemStyle" @click="handleTabClick"></u-tabs>
		</view>

		<scroll-view
			class="report-view"
			style="height: 70vh;"
			:scroll-y="true"
			@scrolltolower="loadMore"
			:lower-threshold="50"
			:refresher-enabled="true"
			@refresherrefresh="onRefresh"
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
			<view class="load-more">
				<text v-if="isLoading">{{ loadingText }}</text>
				<text v-else-if="!hasMore && reportList.length">没有更多内容了</text>
			</view>
		</scroll-view>
	</view>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue';
import { fetchReportsView } from '@/api/home';

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
	isLoading: false,
	loadingText: '加载中...',
	hasMore: true
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
    if (!myData.hasMore || myData.isLoading) {
        return; // 如果没有更多数据或正在加载，则直接返回
    }
    myData.isLoading = true; // 开始加载数据
    myData.loadingText = '加载中...'; // 设置加载文本
    myData.pageNo++; // 增加页码
    try {
        const data = { pageSize: myData.pageSize, pageNo: myData.pageNo };
        const headers = { Authorization: '你的认证token' };
        let result = await fetchReportsView(data, headers);
        if (result && result.record && result.record.reports && result.record.reports.length) {
            myData.reportList.push(...result.record.reports);
            myData.hasMore = result.record.hasNext; // 根据后端返回更新是否还有更多数据
        } else {
            myData.hasMore = false; // 如果返回的数据为空，则标记为没有更多数据
            myData.loadingText = '没有更多内容了'; // 设置提示文本
        }
    } catch (e) {
        console.error('Failed to fetch reports:', e);
        myData.hasMore = false; // 请求失败也应该标记为没有更多数据
        myData.loadingText = '加载失败，请重试'; // 设置失败提示文本
    }
    myData.isLoading = false; // 完成加载
};

const onRefresh = async () => {
    console.log('Refreshing data...');
    if (myData.isLoading) {
        return; // 如果正在加载，则直接返回
    }
    myData.isLoading = true; // 开始刷新数据
    myData.loadingText = '刷新中...'; // 设置刷新文本
    myData.pageNo = 1; // 重置为第一页
    myData.hasMore = true; // 假设还有更多数据可加载
    await loadMore(); // 调用加载更多的方法，但这次是为了刷新数据
    myData.isLoading = false; // 完成刷新
    uni.stopPullDownRefresh(); // 停止下拉刷新动画
};

onMounted(() => {
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
	.load-more {
		display: flex;
		justify-content: center;
	}
}
</style>
