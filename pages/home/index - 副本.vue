<template>
	<!-- #ifdef MP-WEIXIN -->
	<ws-wx-privacy id="privacy-popup"></ws-wx-privacy>
	<!-- #endif -->
	<z-paging ref="paging" v-model="reportList" @query="queryReports" refresher-enabled>
		<template #top>
			<view class="page-container">
				<u-search placeholder="输入报告关键词, 例如'人工智能'" shape="round" :disabled="true" :showAction="false" :color="textColor" @click="handleSearch"></u-search>

				<view class="swiper">
					<u-swiper indicator indicatorMode="dot" :height="100" :radius="8" :list="bannerList" @change="changeBanner" @click="clickBanner"></u-swiper>
				</view>

				<view class="tabs">
					<u-tabs :list="reportCategoryList" :activeStyle="activeStyle" :inactiveStyle="inactiveStyle" :itemStyle="itemStyle" @click="handleTabClick"></u-tabs>
				</view>
			</view>
		</template>
		<view class="report-view">
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
		</view>
	</z-paging>
	<u-popup mode="bottom" round="20" :show="showPopup" :customStyle="popupCustomStyle" @close="closePopup" @open="openPopup"></u-popup>
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
	showPopup: false,
	popupCustomStyle: {
		backgroundColor: '#fff'
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
		{ name: 'vipCode', icon: 'vip', title: '2024全球人才趋势报告：在机器增强的世界释放员工潜力-美世咨询.pdf', path: '/pages_sub/vip-code/vip-code' }
	],
	paging: null
});
const { textColor, reportCategoryList, activeStyle, inactiveStyle, itemStyle, showPopup, popupCustomStyle, bannerList, reportList, paging } = toRefs(myData);
const childRef = ref<ChildComponentRef | null>(null);

const handleSearch = () => {
	console.log('handleSearch');
	uni.navigateTo({
		url: `/pages_sub/search/search`
	});
};

// 查看用户是否授权隐私协议
const doRequire = () => {
	uni.requirePrivacyAuthorize({
		success: () => {
			console.log('同意');
			// 用户同意授权
			// 继续小程序逻辑
		},
		fail: () => {
			console.log('拒绝');
		}, // 用户拒绝授权
		complete: (complete) => {
			console.log(complete, 'complete');
		}
	});
};

const changeBanner = () => {};

const clickBanner = () => {};

const handleCell = (name) => {
	// 查找对应的cell项
	console.log(name, 'name');
	const cellItem = myData.cellGroups.flatMap((group) => group.cells).find((cell) => cell.name === name);
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

const queryReports = async (pageNo: number, pageSize: number) => {
    try {
        const data = { pageSize, pageNo };
        const headers = { Authorization: 'U616954605653f450b2fb6947e998c68c8879432132bd' };
        const result = await fetchReportsView(data, headers);
        console.log(result, '报告列表');

        // 检查 result.data 是否存在，并且 result.data.list 是否存在
        if (result && result.data && result.data.list) {
            // 在调用 paging.value.complete 之前确保 paging.value 不为 null
            if (paging.value) {
                paging.value.complete(result.data.list);
            } else {
                console.error('Paging component is not initialized');
            }
        } else {
            console.error('No data received:', result);
            if (paging.value) {
                paging.value.complete(false);
            }
        }
    } catch (e) {
        console.error('Failed to fetch reports:', e);
        if (paging.value) {
            paging.value.complete(false);
        }
    }
};


// 关闭弹出层
const closePopup = () => {
	showPopup.value = false;
};

// 子组件关闭抽屉自定义事件
const childClosePopup = () => {
	showPopup.value = false;
};

// 开启抽屉弹出层
const openPopup = () => {
	childRef.value?.netWorkStatus();
};

onMounted(async () => {
	// #ifdef MP-WEIXIN
	doRequire();
	// #endif
});
</script>

<style lang="scss" scoped>
::v-deep .u-sticky {
	z-index: 1 !important;
}
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
