<template>
	<view class="page-container">
		<view class="question-analysis">
			<u-subsection fontSize="14" mode="button" :list="subsectionList" :current="currentSubsectionIndex" @change="sectionChange"></u-subsection>
		</view>
		<view class="report-view">
			<!-- 微信群组列表 -->
			<u-cell-group v-if="currentSubsectionIndex === 0" :border="false" :customStyle="{}" class="cell-group-container">
				<u-cell v-for="(cell, index) in cellGroups['wxGroup']" :key="`group-0-cell-${index}`" @click="() => handleCell(cell.name)">
					<template #title>
						<view class="title-view">
							<view class="title">{{ cell.name }}</view>
						</view>
						<view class="join">申请加入</view>
					</template>
					<template #icon>
						<view style="height: 60px; margin-right: 14px">
							<u-image :showLoading="false" :src="cell.icon" width="50px" mode="aspectFit"></u-image>
						</view>
					</template>
				</u-cell>
			</u-cell-group>

			<!-- 热门推荐列表 -->
			<InfiniteScroll
				v-if="currentSubsectionIndex === 1"
				class="report-view"
				:loadMoreMethod="loadMore"
				:hasMore="hasMore"
				:isLoading="isLoading"
				:enableRefresh="false"
				@update:isLoading="(isLoading) => (myData.isLoading = isLoading)"
			>
				<u-cell-group :border="false" :customStyle="{ fontWeight: 'bold' }" class="cell-group-container">
					<u-cell v-for="(cell, index) in cellGroups['recommend']" :key="`group-0-cell-${index}`" @click="() => handleCell(cell.name)">
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
	</view>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, toRefs, reactive } from 'vue';
import InfiniteScroll from '@/components/InfiniteScroll/InfiniteScroll.vue';
import { fetchFindHotsReport } from '@/api/discover';
import { onLoad } from '@dcloudio/uni-app';

const myData = reactive({
	subsectionList: [{ name: '微信群组' }, { name: '热点推荐' }] as { name: string }[],
	currentSubsectionIndex: 0,
	cellGroups: {
		wxGroup: [
			{
				name: '📖省时查报告·工业互联网交流群',
				icon: '/static/wechat-group/meizhuanghangye.jpg',
				code: '工业互联网'
			},
			{
				name: '📖省时查报告·短视频交流群',
				icon: '/static/wechat-group/dianshang.jpg',
				code: '短视频'
			},
			{
				name: '📖省时查报告·房地产交流群',
				icon: '/static/wechat-group/fangdichan.jpg',
				code: '房地产'
			},
			{
				name: '📖省时查报告·智慧城市交流群',
				icon: '/static/wechat-group/jiaoyuhangye.jpg',
				code: '城市'
			},
			{
				name: '📖省时查报告·5G行业交流群',
				icon: '/static/wechat-group/g5.jpg',
				code: '5G'
			},
			{
				name: '📖省时查报告·股票投资交流群',
				icon: '/static/wechat-group/gushitouzi.jpg',
				code: '股票'
			},
			{
				name: '📖省时查报告·食品快消交流群',
				icon: '/static/wechat-group/shipinkuaixiao.jpg',
				code: '食品'
			},
			{
				name: '📖省时查报告·美妆行业交流群',
				icon: '/static/wechat-group/meizhuanghangye.jpg',
				code: '美妆'
			},
			{
				name: '📖省时查报告·电商交流群',
				icon: '/static/wechat-group/dianshang.jpg',
				code: '电商'
			},
			{
				name: '📖省时查报告·区块链行业交流群',
				icon: '/static/wechat-group/qukuailian.jpg',
				code: '区块链'
			},
			{
				name: '📖省时查报告·汽车行业交流群',
				icon: '/static/wechat-group/qichehangye.jpg',
				code: '汽车'
			},
			{
				name: '📖省时查报告·教育行业交流群',
				icon: '/static/wechat-group/jiaoyuhangye.jpg',
				code: '教育'
			},
			{
				name: '📖省时查报告·人工智能交流群',
				icon: '/static/wechat-group/rengongzhineng.jpg',
				code: '人工智能'
			},
			{
				name: '📖省时查报告·智慧农业交流群',
				icon: '/static/wechat-group/zhihuinongye.jpg',
				code: '智慧农业'
			},
			{
				name: '📖省时查报告·数字化交流群',
				icon: '/static/wechat-group/meizhuanghangye.jpg',
				code: '数字化'
			},
			{
				name: '📖省时查报告·创业创新交流群',
				icon: '/static/wechat-group/shipinkuaixiao.jpg',
				code: '创业'
			},
			{
				name: '📖省时查报告·金融科技交流群',
				icon: '/static/wechat-group/shipinkuaixiao.jpg',
				code: '金融'
			}
		],
		recommend: []
	},
	pageNo: 1,
	pageSize: 10,
	hasMore: true,
	isLoading: false
});
const { subsectionList, currentSubsectionIndex, cellGroups, isLoading, loadingText, hasMore } = toRefs(myData);

// 分段器切换事件
const sectionChange = (index: number) => {
	currentSubsectionIndex.value = index;
};

const loadMore = async () => {
	if (!hasMore.value || isLoading.value) return;
	isLoading.value = true;
	try {
		const result = await fetchFindHotsReport({ pageSize: myData.pageSize, pageNo: myData.pageNo });
		if (result.code === 0 && result.record.reports.length) {
			myData.cellGroups.recommend.push(...result.record.reports);
			hasMore.value = result.record.hasNext;
		} else {
			hasMore.value = false;
		}
	} catch (e) {
		console.error('Failed to load more:', e);
	} finally {
		isLoading.value = false;
	}
};

const handleCell = (name: any) => {
	// 查找对应的cell项
	const cellItem = myData.cellGroups.recommend.find((cell) => cell.name === name);
	if (cellItem && cellItem.path) {
		uni.navigateTo({
			url: `/pages_sub/report-detail/report-detail?id=${cellItem}` // 将参数拼接在URL中
		});
	} else {
		console.error('未找到对应的路由配置');
	}
};

onLoad(() => {
	loadMore();
});
</script>

<style lang="scss" scoped>
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

	.join {
		margin-top: 20rpx;
		font-size: 30rpx;
		color: $uni-color-theme;
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
</style>
