<template>
	<!-- #ifdef MP-WEIXIN -->
	<ws-wx-privacy 
		id="privacy-popup"
	></ws-wx-privacy>
	<!-- #endif -->
	<scroll-view enable-flex style="height: 100vh;" scroll-y @scroll="handleScroll">
		<view class="top-banner"></view>
		<u-sticky v-if="offsetTop || platform === 'h5'" :offsetTop="offsetTop" bgColor="#fff">
			<u-tabs
				:list="industriesList"
				lineWidth="20"
				lineHeight="7"
				:lineColor="`url(${lineBg}) 100% 100%`"
				:activeStyle="activeStyle"
				:inactiveStyle="inactiveStyle"
				:itemStyle="itemStyle"
				@click="handleTabClick"
			>
				<template #right>
					<view
						style="padding-left: 4px; margin-right: 4px;"
						@tap="uni.$u.toast('插槽被点击')"
					>
						<u-icon
							name="list"
							size="24"
							bold
						></u-icon>
					</view>
				</template>
			</u-tabs>
		</u-sticky>
		<view class="page-container">
			<u-navbar :placeholder="false" :bgColor="navbarBgColor">
				<template #left>
					<view>
						<u-icon name="home" size="20"></u-icon>
					</view>
				</template>
				<template #center>
					<view>
						<u--input
							placeholder="请输入内容" 
							prefixIcon="search"
							border="surround"
							shape="circle"
							:readonly="true"
							:prefixIconStyle="`font-size: 22px; color: ${textColor};`"
							:placeholderStyle="`color: ${textColor};`"
							:color="textColor"
							:customStyle="customStyle"
						></u--input>
					</view>
				</template>
			</u-navbar>
			<job-card
				class="margin-bottom-md job-card"
				v-for="(item, index) in positions"
				:key="index"
				:position="item"
				@click="goToInterview"
			></job-card>
			<custom-gap></custom-gap>
			
		</view>
		<u-popup
			mode="bottom" 
			round="20"
			:show="showPopup" 
			:customStyle="popupCustomStyle"
			@close="closePopup" 
			@open="openPopup"
		>
			<PermissionDrawer 
				ref="childRef" 
				@childClosePopup="childClosePopup"
				@childStartMockInterview="childStartMockInterview"
			/>
		</u-popup>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { onMounted, reactive, ref, toRefs } from 'vue';
	import { useInterviewStore } from '@/stores';
	import { useGlobalAPI } from '@/hooks/useGlobalAPI';
	import { fetchIndustries, fetchPositions } from '@/api/home';
	import JobCard from '@/components/custom/card.vue';
	import PermissionDrawer from './permission-drawer/permission-drawer.vue';
	
	const { apiWrapper } = useGlobalAPI();
	const interviewStore = useInterviewStore();
	const myData = reactive({
		capsultBottom: 0,
		offsetTop: 0,
		customStyle: {
			height: '',
			marginRight: '40px',
		},
		navbarBgColor: 'transparent',
		textColor: '#fff',
		industriesList: [],
		defaultIndustryId: "",
		currentIndustryName: "",
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
			height: '36px',
		},
		positions: [],
		platform: uni.$u.platform, // 获取当前运行的平台名称
		showPopup: false,
		popupCustomStyle: {
			backgroundColor: "#fff"
		},
	})
	const {
		customStyle, 
		capsultBottom, 
		offsetTop,
		navbarBgColor, 
		textColor, 
		industriesList,
		defaultIndustryId,
		currentIndustryName,
		activeStyle,
		inactiveStyle,
		itemStyle,
		positions,
		platform,
		showPopup,
		popupCustomStyle,
	} = toRefs(myData)
	const lineBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=";

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
				console.log(complete, "complete")
			}
		})
	}
	
	// 切换行业tab点击事件
	const handleTabClick = (item: any) => {
		currentIndustryName.value = item.name;
		const data = {
			industry_id: item.industry_id
		}
	    fetchPositionApi(data)
	}
	
	// 获取行业数据
	const fetchIndustriesApi = async () => {
		try {
			const res = await fetchIndustries();
			industriesList.value = res.rows || []
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
			positions.value = res.rows || []
		} catch (error) {
			console.error('Error during fetchTodosCloud:', error);
			// 可以在这里添加更多的错误处理逻辑，比如设置一个标志，让用户知道出现了错误
		}
	};
	
	// 微信小程序的胶囊信息
	const capsuleInfo = () => {
		const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
		const systemInfo = uni.getSystemInfoSync() || {};
		const capsuleHeight = menuButtonInfo.height;
		customStyle.value.height = capsuleHeight + 'px';
		capsultBottom.value = menuButtonInfo.bottom;
		offsetTop.value = systemInfo.statusBarHeight! + capsuleHeight + 6
	}
	
	// 滚动事件
	const handleScroll = async () => {
		await apiWrapper.getBoundingRect('.top-banner').then(res => {
			const { bottom } = res;
			if (bottom <= capsultBottom.value) {
				navbarBgColor.value = '#fff';
				textColor.value = '#000';
			} else {
				navbarBgColor.value = 'transparent';
				textColor.value = '#fff';
			}
		}).catch(error => {
			console.error('Error:', error);
		});
	}
	
	// 职位点击事件-跳转到面试页
	const goToInterview = (job: any) => {
		interviewStore.currentJobInfo = job;
		interviewStore.currentJobInfo.industry_name = currentIndustryName.value;
		showPopup.value = true
	}
	
	// 关闭弹出层
	const closePopup = () => {
		showPopup.value = false
	}
	
	// 子组件关闭抽屉自定义事件
	const childClosePopup = () => {
		showPopup.value = false
	}
	
	// 子组件开始模拟面试自定义事件
	const childStartMockInterview = () => {
		vk.navigateTo('/pages_template/interview/custom/custom');
	}
	
	// 开启抽屉弹出层
	const openPopup = () => {
		childRef.value?.netWorkStatus();
	}
	
	onMounted(async () => {
		// #ifdef MP-WEIXIN
		capsuleInfo()
		doRequire()
		// #endif
		
		fetchIndustriesApi().then(() => {
			const data = {
				industry_id: defaultIndustryId.value
			}
			fetchPositionApi(data)
		})
	});
</script>

<style lang="scss" scoped>
	.top-banner {
		position: relative;
		height: 500rpx;
		background-color: #ffaa00;
	} 
	::v-deep .u-sticky {
		z-index: 1 !important;
	}
</style>