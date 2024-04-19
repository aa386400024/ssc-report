<template>
	<view class="container">
		<view class="status-bar">
			<view class="status-item">
				<text class="number">0</text>
				<text class="label">邀请次数</text>
			</view>
			<view class="status-item">
				<text :class="['number', { 'not-number': !isNumber }]">{{ ranking }}</text>
				<text class="label">排名</text>
			</view>
			<view class="status-item">
				<text class="number">0</text>
				<text class="label">解锁VIP天数</text>
			</view>
		</view>
		<view class="divider-line"></view>
		<view class="vip-invitation">
			<text class="invitation-text">每邀请一位好友，增加2天VIP</text>
			<u-button text="邀请" size="normal" type="primary" shape="circle"></u-button>
		</view>
		<view class="gap"></view>
		<view class="my-invitations padding-left-lg">
			<text class="my-invitations-title">我的邀请列表</text>
			<!-- 这里可以插入列表组件 -->
		</view>
	</view>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed } from 'vue';

const myData = reactive({
	ranking: '未入选'
});

// 可以从这里导出需要的响应式属性
const { ranking } = toRefs(myData);

// 使用计算属性来检查内容是否为数字
const isNumber = computed(() => !isNaN(parseFloat(myData.ranking)) && isFinite(myData.ranking));

// 在这里定义方法
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0;

	.status-bar {
		display: flex;
		justify-content: space-around;
		width: 100%;

		.status-item {
			display: flex; // 设置为flex布局
			flex-direction: column; // 子元素垂直排列
			align-items: center; // 子元素水平居中
			text-align: center;

			.number {
				display: block;
				font-size: 80rpx;
				color: $uni-color-theme;
				min-height: 130rpx; // 设置一个最小高度，使得所有.number元素高度相等
				display: flex; // 使用flex布局
				align-items: center; // 垂直居中
				justify-content: center; // 水平居中
			}
			
			.not-number {
			    font-size: 40rpx; // 或者你想要的字体大小
			}

			.label {
				font-size: 24rpx;
				color: $uni-grey-light;
			}
		}
	}
	
	.divider-line {
		height: 1px;
		width: 92%;
		background: $uni-grey-base; 
		color: $uni-grey-base;
		margin: 40rpx 20rpx;
		padding: 0 20rpx;
	}

	.vip-invitation {
		padding: 0 30rpx;

		.invitation-text {
			display: block;
			text-align: center;
			margin-bottom: 30rpx;
			font-size: 28rpx;
			color: $uni-grey-light;
		}
		
		.u-button {
			width: 200rpx;
		}
	}
	
	.gap {
		height: 20rpx;
		width: 100%;
		background: $uni-grey-base; 
		color: $uni-grey-base;
		margin: 40rpx 20rpx;
		padding: 0 20rpx;
	}
	
	.my-invitations {
		width: 100%;
		.my-invitations-title {
			font-size: 26rpx;
			text-align: center;
			color: $uni-grey-light;
		}
		// 这里添加列表样式
	}
}
</style>
