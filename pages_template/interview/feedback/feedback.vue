<template>
	<view class="container">
		<view class="header-section">
			<image class="image-container" mode="widthFix" :src="headerSectionUrl"></image>
			<view class="header-content">
				<text class="position-name">{{ interviewInfo.position_name }} - {{ interviewInfo.industry_name }}</text>
				<view class="info-box">
					<view class="info-item" v-for="(item, index) in infoItems" :key="index">
						<view class="info-content">
							<!-- <image src="/path/to/your/icon.png" class="info-icon" /> -->
							<view class="text-content">
								<text class="label">{{ item.label }}</text>
								<text class="value">{{ item.value }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="second-title assessment-title">面试表现综合评估</view>
		<view class="summary-section">
			<view class="overview">
				<view class="third-title">概览</view>
				<view class="overview-content">
					<view class="overview-info">
						<view class="evaluate">
							<text :style="{color: evaluation.color}">{{evaluation.label}}</text>
						</view>
						<view class="overview-evaluation">
							<text>{{evaluation.message}}</text>
						</view>
					</view>
					<view class="overview-chart">
						<qiun-data-charts type="arcbar" :opts="totalScoreOpts" :chartData="totalScoreChartData" />
					</view>
				</view>
			</view>
			<view class="feedback">
				<view class="third-title">评价与建议</view>
				<view class="feedback-evaluation">
					<view class="title margin-top-sm margin-bottom-md">
						<text class="title-with-dot">综合评价</text>
					</view>
					<view class="content">
						<text>{{generalFeedback}}</text>
					</view>
				</view>
				<view class="feedback-suggestions">
					<view class="title margin-top-sm margin-bottom-md">
						<text class="title-with-dot">改进建议</text>
					</view>
					<view class="content">
						<text>{{improvementSuggestions}}</text>
					</view>
				</view>
			</view>
			<view class="score-distribution">
				<view class="third-title">得分分布</view>
				<view class="distribution-chart">
					<qiun-data-charts type="rose" :opts="scorePieOpts" :chartData="scorePieData" />
				</view>
			</view>
			<view class="skills-assessment">
				<view class="third-title">职位核心能力</view>
				<view class="skills-chart">
					<qiun-data-charts type="radar" :opts="radarOpts" :chartData="radarData" />
				</view>
			</view>
		</view>

		<view class="second-title details-title">题目细节分析</view>
		<view class="details-section">
			<view class="question-analysis">
				<u-subsection fontSize="14" mode="button" :list="subsectionList" :current="currentQuestionIndex"
					@change="sectionQuestionChange"></u-subsection>
			</view>
			<view v-if="questionsFeedback[currentQuestionIndex]" class="feedback-section">
				<!-- 显示面试问题 -->
				<view class="interview-question">
					{{ questionsFeedback[currentQuestionIndex].question }}
				</view>

				<view v-for="feedback in questionsFeedback[currentQuestionIndex].feedbacks" :key="feedback.index"
					class="feedback-item">
					<view v-if="feedback.type === '改进建议' || feedback.type === '推荐答案'" class="long-feedback">
						<view class="feedback-type">{{ feedback.type }}</view>
						<view class="long-feedback-score common-feedback-style">
							<u-parse :content="feedback.score"></u-parse>
						</view>
					</view>
					<view v-else class="feedback-header">
						<view class="feedback-type">{{ feedback.type }}</view>
						<view class="feedback-score">{{ feedback.score }}</view>
					</view>
					<view class="feedback-description common-feedback-style" v-if="feedback.description">{{ feedback.description }}</view>
				</view>
			</view>

		</view>
		<view class="footer-section">

		</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive, toRefs, onMounted, computed } from 'vue';
	import { onLoad } from "@dcloudio/uni-app";
	import { fetchIvFeedback } from '@/api/interview';
	const CHART_COLOR = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"]

	const myData = reactive({
		interviewInfo: {} as interviewInfoType,
		headerSectionUrl: "https://mp-43f7552d-29af-4d0a-8672-7a2fcdd00dc7.cdn.bspapp.com/interview/feedback/feedback-header-report.png",
		evaluation: {
			label: "",
			message: ""
		} as Evaluation,
		generalFeedback: "",
		improvementSuggestions: "",
		totalScoreChartData: {},
		totalScoreOpts: {
			color: CHART_COLOR,
			padding: undefined,
			title: {},
			subtitle: {
				name: "综合评分",
				fontSize: 14,
				color: "#666666"
			},
			extra: {
				arcbar: {
					type: "circle",
					width: 8,
					backgroundColor: "#E9E9E9",
					startAngle: 1.5,
					endAngle: 0.25,
					gap: 2
				}
			}
		},
		scorePieData: {},
		scorePieOpts: {
			color: CHART_COLOR,
			padding: [5, 5, 5, 5],
			enableScroll: false,
			legend: {
				show: true,
				position: "bottom",
				lineHeight: 25
			},
			extra: {
				rose: {
					type: "radius",
					minRadius: 50,
					activeOpacity: 0.5,
					activeRadius: 10,
					offsetAngle: 0,
					labelWidth: 15,
					border: true,
					borderWidth: 2,
					borderColor: "#FFFFFF",
					linearType: "custom"
				}
			}
		},
		radarData: {},
		radarOpts: {
			color: CHART_COLOR,
			padding: [5, 5, 5, 5],
			dataLabel: false,
			enableScroll: false,
			legend: {
				show: true,
				position: "bottom",
				lineHeight: 25
			},
			extra: {
				radar: {
					gridType: "circle",
					gridColor: "#CCCCCC",
					gridCount: 3,
					opacity: 0.2,
					max: 10,
					labelShow: true
				}
			}
		},
		questionsFeedback: [] as QuestionsFeedback[],
		subsectionList: [] as { name : string }[],
		currentQuestionIndex: 0,
	})

	const {
		interviewInfo,
		headerSectionUrl,
		evaluation,
		generalFeedback,
		improvementSuggestions,
		totalScoreChartData,
		totalScoreOpts,
		scorePieData,
		scorePieOpts,
		radarData,
		radarOpts,
		questionsFeedback,
		currentQuestionIndex,
		subsectionList,
	} = toRefs(myData);

	// 获取面试反馈数据
	const fetchIvFeedbackApi = async (session_id : string) => {
		try {
			let params = {
				session_id
			}
			const res = await fetchIvFeedback(params);

			const feedbacks = res.data || {};
			const { overview } = feedbacks;
			// 概览-进度条
			evaluation.value = overview.evaluation || {};
			totalScoreChartData.value = overview.dashboardData || {};
			totalScoreOpts.value.title = overview.dashboardData.title || {};

			// 综合评价和改进建议
			generalFeedback.value = feedbacks.generalFeedback || '';
			improvementSuggestions.value = feedbacks.improvementSuggestions || '';

			// 得分分布-玫瑰图
			scorePieData.value = feedbacks.percentages || {};

			// 技能维度评估-雷达图
			radarData.value = feedbacks.radarChart || {};

			// 问题反馈内容
			questionsFeedback.value = feedbacks.feedback || [];
			// 问题分段器数据
			subsectionList.value = questionsFeedback.value.map((_, index) => ({ name: `T${index + 1}` }));
		} catch (error) {
			console.error('Error during fetchIvHistory:', error);
			// 可以在这里添加更多的错误处理逻辑，比如设置一个标志，让用户知道出现了错误
		}
	};


	const infoItems = computed(() => {
		return [
			{ label: '面试时间', value: interviewInfo.value.interview_started_at },
			{ label: '面试时长', value: interviewInfo.value.interview_duration },
			{ label: '面试难度', value: interviewInfo.value.interview_level_name },
			{ label: '面试风格', value: interviewInfo.value.interview_style_name }
		];
	});

	// 面试题分段器切换事件
	const sectionQuestionChange = (index : number) => {
		currentQuestionIndex.value = index;
	}

	onLoad((option : any) => {
		if (option.params) {
			interviewInfo.value = JSON.parse(decodeURIComponent(option.params));
		}
	});

	onMounted(() => {
		if (interviewInfo.value.session_id) {
			fetchIvFeedbackApi(interviewInfo.value.session_id);
		}
	});
</script>

<style lang="scss" scoped>
	@import '@/common/css/mixins.scss'; // 导入你的mixin文件
	.container {
		height: 100%;
		background-color: #8084FA;

		.header-section {
			position: relative;
			align-items: flex-start;

			.image-container {
				width: 100%;
				background-color: #eeeeee;
			}

			.header-content {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 40rpx;

				.position-name {
					margin-top: 20rpx;
					margin-bottom: 10rpx;
					padding: 0 30rpx;
					font-weight: bold;
					color: #fff;
				}

				.info-box {
					display: flex;
					flex-wrap: wrap;
					margin: 12rpx 20rpx 0;
				}

				.info-item {
					flex: 1 0 42%; // 这样保证一行显示2个
					padding: 16rpx 20rpx;
					margin: 10rpx;
					font-size: 20rpx;
					display: flex;
					flex-direction: column; // 设置为列方向，使文本显示在不同的行上
					// border: 2rpx solid #fff;
					background-color: rgba(202, 215, 255, 0.3);
					border-radius: 14rpx;
					color: #fff;

					.info-content {
						display: flex;
						align-items: flex-start; // 这将使图标和文本内容顶部对齐
					}

					.text-content {
						display: flex;
						flex-direction: column;
					}

					.info-icon {
						width: 20rpx; // 或者您想要的任何大小
						height: 20rpx; // 或者您想要的任何大小
						margin-right: 10rpx; // 这将在图标和文本之间添加一些空间
					}
				}
			}
		}

		.second-title {
			text-align: center;
			font-weight: bold;
			font-size: 38rpx;
			color: #fff;
			margin-top: 30rpx;
		}

		.third-title {
			padding: 40rpx 0 20rpx;
			font-weight: bold;
			font-size: 1.02rem;
			color: $uni-color-title;

			&::before {
				content: "";
				border-left: 15rpx solid #b8860b;
				border-radius: 0 4rpx 4rpx 0;
				height: 48rpx;
				width: 0;
				display: inline-block;
				margin-right: 10rpx;
				vertical-align: -12rpx;
			}
		}
		.title-with-dot {
			@include title-decoration(dot); // 使用圆点装饰
		}
		
		.feedback-evaluation, .feedback-suggestions {
			.title {
				text-align: center;
				font-size: 30rpx;
				font-weight: 400;
			}
			.content {
				display: flex;
				flex-direction: column;
				text-align: justify;
			
				text {
					margin-bottom: 40rpx;
					padding: 0 40rpx;
					line-height: 50rpx;
					font-size: 26rpx;
					color: $uni-color-subtitle;
				
					&:not(:last-child) {
						justify-content: space-between;
					}
				}
			}
		}

		.summary-section,
		.details-section {
			background-color: #fff;
			margin: 20rpx 30rpx;
			border-radius: 20rpx;
		}

		.footer-section {
			height: 200rpx;
		}

		.summary-section {
			.overview {
				.overview-content {
					display: flex;
					justify-content: space-between;
					padding: 0 30rpx;

					.overview-info {
						width: 100%;
						height: 100%;

						.evaluate {
							text-align: center;

							text {
								font-weight: bold;
							}
						}

						.overview-evaluation {
							margin-top: 18rpx;
							padding-right: 18rpx;
							
							text {
								font-size: 24rpx;
								line-height: 42rpx;
								color: $uni-color-paragraph;
							}
						}
					}

					.overview-chart {
						width: 250rpx;
						height: 250rpx;
					}
				}
			}
		}

		.details-section {
			.feedback-section {
				padding: 30rpx;

				.interview-question {
					font-size: 28rpx;
					font-weight: bold;
					margin-bottom: 30rpx;
					padding: 16rpx;
					line-height: 50rpx;
					color: $uni-color-title;
					border: 1px dashed orangered;
					border-radius: 12rpx;
				}
				
				.common-feedback-style {
					font-size: 26rpx;
					margin-top: 16rpx;
					padding: 16rpx;
					line-height: 50rpx;
					color: $uni-color-subtitle;
					border: 1px solid rgba(0, 0, 0, 0.1);
					border-radius: 12rpx;
					box-shadow: 2px 4px 6px 0px rgba(0, 0, 0, 0.1);
				}

				.feedback-item {
					margin-bottom: 40rpx;

					.long-feedback {
						margin-bottom: 10rpx;

						.feedback-type {
							text-align: left;
							font-weight: bold;
							color: $uni-color-title;
						}

						.long-feedback-score {
							@extend .common-feedback-style;
						}
					}

					.feedback-header {
						display: flex;
						justify-content: space-between;
						margin-bottom: 10rpx;
						font-weight: bold;

						.feedback-type {
							text-align: left;
							color: $uni-color-title;
						}

						.feedback-score {
							text-align: right;
						}
					}

					.feedback-description {
						@extend .common-feedback-style;
					}
				}
			}
		}

		.charts-box {
			width: 100%;
			// height: 300rpx;
		}
	}
</style>