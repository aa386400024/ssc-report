<template>
	<!-- #ifdef MP-WEIXIN -->
	<ws-wx-privacy id="privacy-popup"></ws-wx-privacy>
	<!-- #endif -->
	<view class="page-container">
		<u--input
			placeholder="输入报告关键词, 例如'人工智能'"
			prefixIcon="search"
			border="surround"
			shape="circle"
			:readonly="true"
			:prefixIconStyle="`font-size: 22px; color: ${textColor};`"
			:placeholderStyle="`color: ${textColor};`"
			:color="textColor"
			:customStyle="customStyle"
		></u--input>
		
		<view class="swiper">
			<u-swiper
				indicator
				indicatorMode="dot"
				:height="100"
				:radius="8"
				:list="bannerList"
				@change="changeBanner"
				@click="clickBanner"
			></u-swiper>
		</view>
		
		<view class="tabs">
			<u-tabs
				:list="reportCategoryList"
				:activeStyle="activeStyle"
				:inactiveStyle="inactiveStyle"
				:itemStyle="itemStyle"
				@click="handleTabClick"
			>
			</u-tabs>
		</view>
		
		<view class="report-view">
			<view class="cell-group-container" v-for="(group, index) in cellGroups" :key="`group-${index}`">
				<u-cell-group :border="false" :customStyle="{ fontWeight: 'bold' }">
					<u-cell v-for="(cell, cellIndex) in group.cells" :key="`cell-${cellIndex}`" @click="() => handleCell(cell.name)">
						<template #title>
							<view class="title-view">
								<view class="title">{{cell.title}}</view>
								<view class="right-icon"><text class="iconfont icon-mima"></text><text class="iconfont icon-mima"></text></view>
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
		</view>
	</view>
	<u-popup mode="bottom" round="20" :show="showPopup" :customStyle="popupCustomStyle" @close="closePopup" @open="openPopup">
		<PermissionDrawer ref="childRef" @childClosePopup="childClosePopup" @childStartMockInterview="childStartMockInterview" />
	</u-popup>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue';
import { useInterviewStore } from '@/stores';
import { useGlobalAPI } from '@/hooks/useGlobalAPI';
import { fetchIndustries, fetchPositions } from '@/api/home';
import PermissionDrawer from './permission-drawer/permission-drawer.vue';

const { apiWrapper } = useGlobalAPI();
const interviewStore = useInterviewStore();
const myData = reactive({
	customStyle: {
		height: '',
		background: '#eaeaea'
	},
	textColor: '#fff',
	reportCategoryList: [
		{ name: '全部' },
		{ name: 'GPT' },
		{ name: '元宇宙' },
		{ name: '双碳' },
		{ name: '电商' },
		{ name: '短视频' },
		{ name: '房地产' },
	],
	defaultIndustryId: '',
	currentIndustryName: '',
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
	positions: [],
	showPopup: false,
	popupCustomStyle: {
		backgroundColor: '#fff'
	},
	bannerList: [
		'https://cdn.uviewui.com/uview/swiper/swiper1.png',  
		'https://cdn.uviewui.com/uview/swiper/swiper2.png',  
		'https://cdn.uviewui.com/uview/swiper/swiper3.png',  
	],
	cellGroups: [
		{
			cells: [
				{ name: 'inviteRanking', icon: 'friends', title: '2023胖东来：幸福企业进化之路分享-混沌学院.pdf', path: '/pages_sub/invite-ranking/invite-ranking' },
				{ name: 'readRanking', icon: 'read', title: '阅读排名', path: '/pages_sub/read-ranking/read-ranking' },
				{ name: 'wechatGroups', icon: 'wechat', title: '微信群组', path: '/pages_sub/wechat-groups/wechat-groups' },
				{ name: 'vipCode', icon: 'vip', title: 'VIP兑换码', path: '/pages_sub/vip-code/vip-code' }
			]
		},
		{
			cells: [
				{ name: 'favorites', icon: 'favorite', title: '我的收藏', path: '/pages_sub/favorites/favorites' },
				{ name: 'historyView', icon: 'history', title: '查看历史', path: '/pages_sub/history-view/history-view' },
				{ name: 'downloadHistory', icon: 'download', title: '下载历史', path: '/pages_sub/download-history/download-history' }
			]
		}
	]
});
const {
	customStyle,
	textColor,
	reportCategoryList,
	defaultIndustryId,
	currentIndustryName,
	activeStyle,
	inactiveStyle,
	itemStyle,
	positions,
	showPopup,
	popupCustomStyle,
	bannerList,
	cellGroups
} = toRefs(myData);
const childRef = ref<ChildComponentRef | null>(null);

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

const changeBanner = () => {
	
}

const clickBanner = () => {
	
}

const handleCell = (name) => {
	// 查找对应的cell项
	console.log(name, "name")
	const cellItem = myData.cellGroups.flatMap((group) => group.cells).find((cell) => cell.name === name);
	console.log(cellItem, "cellItem.path")
	if (cellItem && cellItem.path) {
		uni.navigateTo({
			url: `/pages_sub/report-detail/report-detail?id=${cellItem}` // 将参数拼接在URL中
		});
	} else {
		console.error('未找到对应的路由配置');
	}
};

// 切换行业tab点击事件
const handleTabClick = (item: any) => {
	currentIndustryName.value = item.name;
	const data = {
		industry_id: item.industry_id
	};
	fetchPositionApi(data);
};

// 获取报告分类数据
const fetchReportCategoryApi = async () => {
	try {
		const res = await fetchIndustries();
		// reportCategoryList.value = res.rows || [];
		defaultIndustryId.value = res.rows[0].industry_id;
		currentIndustryName.value = res.rows[0].name;
	} catch (error) {
		console.error('Error during fetchTodosCloud:', error);
		// 可以在这里添加更多的错误处理逻辑，比如设置一个标志，让用户知道出现了错误
	}
};

// 获取职位数据
const fetchPositionApi = async (data: any) => {
	try {
		const res = await fetchPositions(data);
		positions.value = res.rows || [];
	} catch (error) {
		console.error('Error during fetchTodosCloud:', error);
		// 可以在这里添加更多的错误处理逻辑，比如设置一个标志，让用户知道出现了错误
	}
};

// 职位点击事件-跳转到面试页
const goToInterview = (job: any) => {
	interviewStore.currentJobInfo = job;
	interviewStore.currentJobInfo.industry_name = currentIndustryName.value;
	showPopup.value = true;
};

// 关闭弹出层
const closePopup = () => {
	showPopup.value = false;
};

// 子组件关闭抽屉自定义事件
const childClosePopup = () => {
	showPopup.value = false;
};

// 子组件开始模拟面试自定义事件
const childStartMockInterview = () => {
	vk.navigateTo('/pages_template/interview/custom/custom');
};

// 开启抽屉弹出层
const openPopup = () => {
	childRef.value?.netWorkStatus();
};

onMounted(async () => {
	// #ifdef MP-WEIXIN
	doRequire();
	// #endif

	fetchReportCategoryApi().then(() => {
		const data = {
			industry_id: defaultIndustryId.value
		};
		fetchPositionApi(data);
	});
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
					white-space: normal;          /* 允许内容按照正常的方式进行换行 */
					word-wrap: break-word;        /* 在需要的时候，单词可以被拆断换行 */
					overflow-wrap: break-word;    /* 同上，确保内容不会溢出 */
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
}
</style>
