<template>
	<z-paging ref="paging" v-model="interviewsList" @query="queryList">
		<template #top>
			<!-- 标题和筛选按钮 -->
			<view class="padding-md">
				<u-search placeholder="请输入面试日期/面试职位" shape="round" :showAction="false" :disabled="true"
					@click="handleSearchInput"></u-search>
			</view>
		</template>
		<!-- 面试记录列表 -->
		<view class="card-list">
			<view v-for="interview in interviewsList" :key="interview.session_id" class="interview-card">
				<!-- 报告生成的状态显示 -->
				<view class="status-indicator">
					{{interview.status.is_feedback_generated ? '已生成' : '生成中'}}
				</view>

				<view class="left-content">
					<view class="card-title-wrapper">
						<text class="card-title">{{ interview.position_name }}</text>
					</view>
					<view class="info-text-wrapper">
						<text class="info-text">面试时间: {{ formatTime(interview.interview_started_at) }}</text>
					</view>
					<view class="info-text-wrapper">
						<text class="info-text">面试时长:
							{{ interview.interview_duration }}</text>
					</view>
				</view>
				<view>
					<u-button type="primary" shape="circle" text="查看报告" size="small"
						@click="toViewReport(interview)"></u-button>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script lang="ts" setup>
	import { reactive, toRefs, computed, onMounted, onUnmounted } from 'vue';
	import { fetchIvHistory } from '@/api/interview';

	type PagingType = {
		complete : (rows : any[]) => void;
		reload: () => void;
	};
	const myData = reactive({
		paging: {
			complete: (rows : any[]) => {
				console.log("Completed with rows:", rows);
			},
		} as PagingType,
		interviewsList: [] as Interviews[],
		// pollingInterval: null as number | null,
		currentPage: 1,
		pageSize: 10
	})
	const {
		paging,
		interviewsList,
		// pollingInterval,
	} = toRefs(myData);
	
	
	// 点击input事件
	const handleSearchInput = () => {

	};
	
	// 获取面试历史数据
	const fetchIvHistoryApi = async (pageNo : number, pageSize : number) => {
		try {
			let params = {
				pageNo,
				pageSize
			}
			const res = await fetchIvHistory(params);
			interviewsList.value = res.rows || [];
			paging.value?.complete(res.rows);
		} catch (error) {
			console.error('Error during fetchIvHistory:', error);
			// 可以在这里添加更多的错误处理逻辑，比如设置一个标志，让用户知道出现了错误
		}
	};
	
	const formatTime = (timeStr: string) => {
	    const date = new Date(timeStr);
		const newDate = vk.pubfn.timeFormat(date,"yyyy-MM-dd hh:mm");
		return newDate
	}

	// 跳转到面试报告详情页
	const toViewReport = (params: Interviews) => {
	    const { answers, ...selectedParams } = params; // 从params中排除answers属性
	    const paramString = encodeURIComponent(JSON.stringify(selectedParams));
	    uni.navigateTo({
	        url: `/pages_template/interview/feedback/feedback?params=${paramString}`
	    });
	};

	// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
	const queryList = (pageNo : number, pageSize : number) => {
		fetchIvHistoryApi(pageNo, pageSize);
	}

	// onMounted(() => {
	//     // 设置轮询，例如每10秒查询一次
	//     pollingInterval.value = setInterval(() => {
	//         paging.value.reload();
	//     }, 30 * 1000);
	// });
	// onUnmounted(() => {
	//     // 当组件被销毁时，清除定时器
	//     if (pollingInterval.value) {
	//         clearInterval(pollingInterval.value);
	//     }
	// });
</script>

<style lang="scss">
	.card-list {
		padding: 10rpx 20rpx;

		.interview-card {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			margin-bottom: 24rpx;
			background-color: #ffffff;
			border: 2rpx solid #e5e5e5;
			border-radius: 20rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
			position: relative;

			.status-indicator {
				position: absolute;
				top: 0;
				right: 0;
				background-color: rgba(0, 0, 0, 0.7);
				color: #ffffff;
				padding: 6rpx 15rpx;
				font-size: 22rpx;
				border-radius: 0 20rpx 0 20rpx;
				z-index: 1;
			}

			.left-content {
				flex: 1;
				margin-right: 20rpx;

				.card-title-wrapper,
				.info-text-wrapper {
					display: block;
				}

				.card-title {
					font-size: 36rpx;
					font-weight: bold;
					color: #333;
					display: block;
					margin-bottom: 20rpx;
				}

				.info-text {
					font-size: 26rpx;
					color: #777;
					display: block;
					margin-bottom: 14rpx;

					&::before {
						content: '';
						display: inline-block;
						width: 26rpx;
						height: 26rpx;
						margin-right: 16rpx;
						background-size: contain;
					}
				}
			}
		}
	}
</style>