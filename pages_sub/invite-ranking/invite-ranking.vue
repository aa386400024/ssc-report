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
			<InfiniteScroll :loadMoreMethod="loadMore" :hasMore="hasMore" :isLoading="isLoading" :enableRefresh="false" @update:isLoading="updateIsLoading">
				<u-cell-group :border="false" :customStyle="{ fontWeight: 'bold' }" class="cell-group-container">
					<u-cell v-for="(cell, index) in cellGroups" :key="`group-0-cell-${index}`" @click="() => handleCell(cell.name)">
						<template #title>
							<view class="title-view">
								<text class="index">{{ index + 1 }}</text>
								<u-avatar class="avatar" :src="cell.avatarSrc"></u-avatar>
								<text class="title">{{ cell.title }}</text>
							</view>
						</template>
						<template #value>
							<text class="u-slot-value">{{ cell.readReportCount }}份</text>
						</template>
					</u-cell>
				</u-cell-group>
			</InfiniteScroll>
		</view>
	</view>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed, onMounted } from 'vue';
import { fetchInviteRank } from '@/api/my';
import InfiniteScroll from '@/components/InfiniteScroll/InfiniteScroll.vue';

const myData = reactive({
	ranking: '未入选',
	cellGroups: [
		{
			name: 'inviteRanking',
			icon: 'friends',
			title: '禅一',
			readReportCount: '25065',
			avatarSrc: 'https://uview-plus.jiangruyi.com/h5/static/uview/album/1.jpg',
			path: '/pages_sub/invite-ranking/invite-ranking'
		},
		{
			name: 'readRanking',
			icon: 'read',
			title: '文文',
			readReportCount: '18896',
			avatarSrc: 'https://uview-plus.jiangruyi.com/h5/static/uview/album/2.jpg',
			path: '/pages_sub/read-ranking/read-ranking'
		},
		{
			name: 'wechatGroups',
			icon: 'wechat',
			title: '张建',
			readReportCount: '16562',
			avatarSrc: 'https://uview-plus.jiangruyi.com/h5/static/uview/album/3.jpg',
			path: '/pages_sub/wechat-groups/wechat-groups'
		},
		{
			name: 'vipCode',
			icon: 'vip',
			title: '晶华',
			readReportCount: '14002',
			avatarSrc: 'https://uview-plus.jiangruyi.com/h5/static/uview/album/5.jpg',
			path: '/pages_sub/vip-code/vip-code'
		}
	],
	pageNo: 1,
	pageSize: 10,
	hasMore: true,
	isLoading: false
});

// 可以从这里导出需要的响应式属性
const { cellGroups, ranking, hasMore, isLoading } = toRefs(myData);

// 使用计算属性来检查内容是否为数字
const isNumber = computed(() => !isNaN(parseFloat(myData.ranking)) && isFinite(myData.ranking));

const loadMore = async () => {
	if (!hasMore.value || isLoading.value) return;
	isLoading.value = true;
	try {
		const { data, more } = await fetchInviteRank(myData.pageNo, myData.pageSize);
		if (data.length) {
			cellGroups.value = [...cellGroups.value, ...data];
			myData.pageNo++;
			hasMore.value = more;
		} else {
			hasMore.value = false;
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	} finally {
		isLoading.value = false;
	}
};

const updateIsLoading = (newLoading) => {
	isLoading.value = newLoading;
};

onMounted(loadMore);
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
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;

			.number {
				display: block;
				font-size: 80rpx;
				color: $uni-color-theme;
				min-height: 130rpx; // 设置一个最小高度，使得所有.number元素高度相等
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.not-number {
				font-size: 40rpx;
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
		.cell-group-container {
			.title-view {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.index {
					display: block;
					width: 20rpx;
				}
				.avatar {
					margin: auto 30rpx;
				}
			}
		}
	}
}
</style>
