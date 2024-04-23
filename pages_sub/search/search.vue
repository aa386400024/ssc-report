<template>
	<view class="page-container">
		<u-search class="padding-lg" placeholder="输入报告关键词, 例如'人工智能'" shape="round" showAction actionText="取消" :color="textColor" @custom="cancelSearch"></u-search>

		<view class="search-history">
			<text class="title">搜索历史</text>
			<text class="clear-history">清空历史</text>
		</view>

		<view class="gap"></view>

		<view class="hot-searches">
			<text class="title">大家都在搜</text>
			<view class="tag-container">
				<view v-for="(tag, index) in tagList" :key="index" class="tag padding-lg margin-sm">
					{{ tag }}
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue';
const myData = reactive({
	textColor: '#fff',
	tagList: ['抖音', '直播', '小红书', '数字化', '人工智能', '汽车']
});

const { textColor, tagList } = toRefs(myData);

const cancelSearch = () => {};
</script>

<style lang="scss" scoped>
.page-container {
	background: #fff;
	padding: 0 !important;
	.search-history {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
		.title {
			font-weight: bold;
			font-size: 30rpx;
		}
		.clear-history {
			font-size: 22rpx;
			color: $uni-grey-light;
		}
	}
	.gap {
		height: 20rpx;
		width: 100%;
		background: $uni-grey-base;
		color: $uni-grey-base;
		margin: 40rpx auto;
	}
	.hot-searches {
		.title {
			padding: 0 40rpx;
			font-weight: bold;
			font-size: 30rpx;
		}
		.tag-container {
			display: flex;
			flex-wrap: wrap;
			padding: 10px;
			.tag {
			    background-color: $uni-grey-base;
			    border-radius: 30rpx;
			    font-size: 22rpx;
			    color: $uni-grey-dark;
			    display: flex;
			    align-items: center;
			    justify-content: center;
			    height: 30rpx;
			}
		}
	}
}
</style>
