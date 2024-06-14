<template>
	<uni-sign-in ref="signIn"></uni-sign-in>
	<view class="user-nav padding-md">
		<view class="profile-container" :style="{ paddingTop: offsetTop + 'px' }">
			<view class="profile-section">
				<u-avatar v-if="hasLogin && userInfo.avatarurl" :src="userInfo.avatarurl"></u-avatar>
				<u-avatar size="50" v-else></u-avatar>
				<view class="profile-info">
					<view v-if="hasLogin" @click="toUserInfo">
						<view class="user-name" v-if="hasLogin">
							{{ userInfo.nickname || userInfo.username || userInfo.mobile }}
							<text class="iconfont icon-VIP1"></text>
						</view>
						<view class="login-prompt margin-top-xs" v-if="userInfo.partner === 0">您还不是VIP会员！</view>
					</view>
					<view v-else @click="toLogin">
						<text class="user-name">{{ $t('mine.notLogged') }}</text>
						<text class="login-prompt margin-top-xs">登录后可体验更多服务 ></text>
					</view>
				</view>
			</view>
			<view class="profile-actions"></view>
		</view>
		<view class="vip-banner" @click="openMembership"></view>
		<view class="settings-container">
			<view class="cell-group-container" v-for="(group, index) in cellGroups" :key="`group-${index}`">
				<u-cell-group :border="false" :customStyle="{ fontWeight: 'bold' }">
					<u-cell v-for="(cell, cellIndex) in group.cells" :key="`cell-${cellIndex}`" @click="() => handleCell(cell.name)" :title="cell.title">
						<template #icon>
							<text :class="`iconfont ${cell.icon}`"></text>
						</template>
					</u-cell>
				</u-cell-group>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs, computed } from 'vue';
import { store as storeOriginal, mutations } from '@/uni_modules/uni-id-pages/common/store.js';
import { fetchMyProfile } from '@/api/my';

const myData = reactive({
	offsetTop: 0,
	cellGroups: [
		{
			cells: [
				{ name: 'inviteRanking', icon: 'friends', title: '邀请好友排名', path: '/pages_sub/invite-ranking/invite-ranking' },
				{ name: 'readRanking', icon: 'read', title: '阅读排名', path: '/pages_sub/read-ranking/read-ranking' },
				{ name: 'wechatGroups', icon: 'wechat', title: '微信群组', path: '/pages_sub/wechat-groups/wechat-groups' },
				{ name: 'vipCode', icon: 'vip', title: 'VIP兑换码', path: '/pages_sub/vip-code/vip-code' }
			]
		},
		{
			cells: [
				{ name: 'favorites', icon: 'favorite', title: '我的收藏', path: '/pages_sub/favorites/favorites' },
				{ name: 'historyView', icon: 'history', title: '查看历史', path: '/pages_sub/view-history/view-history' },
				{ name: 'downloadHistory', icon: 'download', title: '下载历史', path: '/pages_sub/download-history/download-history' }
			]
		}
	]
});
const { offsetTop, cellGroups } = toRefs(myData);
const { userInfo, hasLogin } = toRefs(storeOriginal);

// 跳转到登录页
const toLogin = () => {
	uni.navigateTo({
		url: '/pages_sub/login/login'
	});
};

// 跳转到个人中心
const toUserInfo = () => {
	uni.navigateTo({
		url: '/pages_sub/userinfo/userinfo'
	});
};

// 获取个人资料并更新用户信息
const fetchMyProfileApi = async () => {
	try {
		const result = await fetchMyProfile({});
		if (result.code === 0) {
			Object.assign(userInfo.value, result.record);
			mutations.setUserInfo(result.record);
		}
	} catch (e) {
		console.error('Failed to fetch profile info:', e);
	}
};

const handleCell = (name) => {
	// 查找对应的cell项
	const cellItem = myData.cellGroups.flatMap((group) => group.cells).find((cell) => cell.name === name);
	if (cellItem && cellItem.path) {
		uni.navigateTo({
			url: cellItem.path
		});
	} else {
		console.error('未找到对应的路由配置');
	}
};

// 微信小程序获取胶囊区域距离顶部的位置
const capsuleInfo = () => {
	const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
	const systemInfo = uni.getSystemInfoSync() || {};
	const capsuleHeight = menuButtonInfo.height;
	offsetTop.value = systemInfo.statusBarHeight! + capsuleHeight + 2;
};

// 前往会员开通页
const openMembership = () => {
	vk.navigateTo('/pages_sub/member-details/member-details');
};

onMounted(async () => {
	// #ifdef MP-WEIXIN
	capsuleInfo();
	// #endif
	fetchMyProfileApi();
});
</script>

<style lang="scss" scoped>
@import '@/common/css/mixins.scss';

.user-nav {
	background-color: $uni-bg-color-grey;
	.profile-container {
		margin: 40rpx auto;
		@include flex-layout(between);
		.profile-section {
			@include flex-layout(start);
			align-items: center;
			.profile-info {
				margin-left: 40rpx;
				.user-name {
					color: $uni-color-title;
					font-size: $uni-font-size-xxl;
					font-weight: bold;
				}
				.login-prompt {
					color: $uni-grey-light;
					font-size: $uni-font-size-md;
				}
			}
		}
		.profile-actions {
			color: #fff;
		}
	}

	.vip-banner {
		height: 190rpx;
		background-color: #f3f3f3; /* 可以使用任何颜色值 */
		background: url('https://mp-ab8b269c-c52c-4795-a674-3973206ce16b.cdn.bspapp.com/my/join-vip.png') no-repeat center center / cover;
		border-radius: 20rpx;
	}
}

.settings-container {
	margin-top: 40rpx;
	border-radius: 20rpx;
	background: #fff;
	.cell-group-container {
		&:not(:last-child) {
			margin-bottom: 40rpx;
		}
		::v-deep .u-cell {
			&:last-child {
				.u-line {
					display: none;
				}
			}
		}
	}
}
</style>
