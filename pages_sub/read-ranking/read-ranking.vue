<template>
	<view class="container">
		<view class="top-bar padding-left-xl">
			<image class="avatar" src=""></image>
			<text class="report-info">本月阅读{{ count }}份研报，排名第{{ rank }}位</text>
		</view>
		<view class="gap"></view>
		<view class="my-invite-ranking">
			<u-cell-group
				:border="false" 
				:customStyle="{ fontWeight: 'bold' }"
				class="cell-group-container"
			>
				<u-cell 
				  v-for="(cell, index) in cellGroups" 
				  :key="`group-0-cell-${index}`" 
				  @click="() => handleCell(cell.name)">
					  <template #title>
						<view class="title-view">
							<view class="title">{{cell.title}}</view>
						</view>
						<view class="info">
							申请加入
						</view>
					  </template>
					  <template #icon>
						<text :class="`iconfont ${cell.icon}`"></text>
					  </template>
				</u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed } from 'vue';

const myData = reactive({
	count: 22,
	rank: 15464,
	cellGroups: [
		{ name: 'inviteRanking', icon: 'friends', title: '2023胖东来：幸福企业进化之路分享-混沌学院.pdf', path: '/pages_sub/invite-ranking/invite-ranking' },
		{ name: 'readRanking', icon: 'read', title: '阅读排名', path: '/pages_sub/read-ranking/read-ranking' },
		{ name: 'wechatGroups', icon: 'wechat', title: '微信群组', path: '/pages_sub/wechat-groups/wechat-groups' },
		{ name: 'vipCode', icon: 'vip', title: 'VIP兑换码', path: '/pages_sub/vip-code/vip-code' }
	],
});

const { count, rank, cellGroups } = toRefs(myData);

const handleCell = (name: string) => {
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
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0;

	.top-bar {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		width: 100%;
		.avatar {
		    width: 50rpx;
		    height: 50rpx;
		    border-radius: 50%;
		}

		.report-info {
		    font-size: 22rpx;
		    color: $uni-grey-light;
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
	
	.gap {
		height: 20rpx;
		width: 100%;
		background: $uni-grey-base; 
		color: $uni-grey-base;
		margin: 40rpx 20rpx;
		padding: 0 20rpx;
	}
	
	.my-invite-ranking {
		width: 100%;
	}
}
</style>
