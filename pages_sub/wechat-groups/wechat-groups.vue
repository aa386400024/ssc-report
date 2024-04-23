<template>
	<view class="page-container">
		<u-cell-group :border="false" :customStyle="{  }" class="cell-group-container">
			<u-cell v-for="(cell, index) in cellGroups" :key="`group-0-cell-${index}`" @click="() => handleCell(cell.name)">
				<template #title>
					<view class="title-view">
						<u-avatar class="avatar" shape="square" size="46" :src="cell.avatarSrc"></u-avatar>
						<view class="join-cell margin-left-md">
						  <text class="title">{{ cell.title }}</text>
						  <text class="join-action" @click="handleJoinRequest">申请加入</text>
						</view>
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
		{ name: 'inviteRanking', icon: 'friends', title: '省时查报告•工业互联网交流群', avatarSrc: 'https://uview-plus.jiangruyi.com/h5/static/uview/album/1.jpg', path: '/pages_sub/invite-ranking/invite-ranking' },
		{ name: 'readRanking', icon: 'read', title: '省时查报告•短视频交流群', avatarSrc: 'https://uview-plus.jiangruyi.com/h5/static/uview/album/2.jpg', path: '/pages_sub/wechat-group/wechat-group' },
		{ name: 'wechatGroups', icon: 'wechat', title: '省时查报告•房地产交流群', avatarSrc: 'https://uview-plus.jiangruyi.com/h5/static/uview/album/3.jpg', path: '/pages_sub/wechat-groups/wechat-groups' },
		{ name: 'vipCode', icon: 'vip', title: '省时查报告•智慧城市交流群', avatarSrc: 'https://uview-plus.jiangruyi.com/h5/static/uview/album/5.jpg', path: '/pages_sub/vip-code/vip-code' }
	]
});

const { cellGroups } = toRefs(myData);

const handleCell = (name: string) => {
	// 查找对应的cell项
	console.log(name, 'name');
	const cellItem = myData.cellGroups.flatMap((group) => group.cells).find((cell) => cell.name === name);
	console.log(cellItem, 'cellItem.path');
	if (cellItem && cellItem.path) {
		uni.navigateTo({
			url: `/pages_sub/report-detail/report-detail?id=${cellItem}` // 将参数拼接在URL中
		});
	} else {
		console.error('未找到对应的路由配置');
	}
};

const handleJoinRequest = () => {
	
}
</script>

<style lang="scss" scoped>
.page-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30rpx;
	width: 100%;
	.cell-group-container {
		width: 100%;
		:deep(.u-cell__body) {
			padding: 20rpx 0;
		}
		.title-view {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.join-cell {
				display: flex;
				flex-direction: column;
				text-align: left;
				.title { 
					color: $uni-text-color;
					font-size: 28rpx;
				}
				.join-action {
					color: $uni-color-theme;
					font-size: 26rpx;
				}
			}
		}
	}
}
</style>
