<template>
	<view class="page-container">
		<u-cell-group :border="false" :customStyle="{}" class="cell-group-container">
			<u-cell v-for="(cell, index) in cellGroups" :key="`group-0-cell-${index}`" @click="() => handleCell(cell.name)">
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
	</view>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed } from 'vue';

const myData = reactive({
	cellGroups: [
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
	]
});

const { cellGroups } = toRefs(myData);

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
