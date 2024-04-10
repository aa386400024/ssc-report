<template>
	<uni-sign-in ref="signIn"></uni-sign-in>
	<view class="top-nav padding-md">
		<view class="user-info" :style="{paddingTop: offsetTop + 'px'}">
			<view class="left">
				<u-avatar
					v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url"
					:src="userInfo.avatar_file.url"
				></u-avatar>
				<u-avatar size="45"></u-avatar>
				<view class="logo-title">
					<view v-if="hasLogin" @click="toUserInfo">
						<text class="uer-name" v-if="hasLogin">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</text>
						<text class="iconfont icon-VIP1 not-logged-prompt margin-top-xs"> 开通会员，享受更多特权！</text>
					</view>
					<view v-else @click="toLogin">
						<text class="uer-name">{{$t('mine.notLogged')}}</text>
						<text class="not-logged-prompt margin-top-xs">登录后可体验更多服务 > </text>
					</view>
				</view>
			</view>
			<view class="right">
				>
			</view>
		</view>
		<view class="membership-container" @click="openMembership"></view>

	</view>
	<view class="page-container">
		
	</view>
</template>

<script lang="ts" setup>
	import { onMounted, reactive, toRefs, computed } from 'vue';
	import { store as storeOriginal, mutations } from '@/uni_modules/uni-id-pages/common/store.js';
	const myData = reactive({
		offsetTop: 0,
	})
	const { offsetTop } = toRefs(myData)
	const { userInfo, hasLogin } = toRefs(storeOriginal);
	console.log(hasLogin, 'hasLoginhasLogin')
	// 跳转到登录页
	const toLogin = () => {
		uni.navigateTo({
			url: '/pages_sub/login/login'
		})
	}
	
	// 跳转到个人中心
	const toUserInfo = () => {
		uni.navigateTo({
			url: '/pages_sub/userinfo/userinfo'
		})
	}
	
	// 微信小程序获取胶囊区域距离顶部的位置
	const capsuleInfo = () => {
		const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
		const systemInfo = uni.getSystemInfoSync() || {};
		const capsuleHeight = menuButtonInfo.height;
		offsetTop.value = systemInfo.statusBarHeight! + capsuleHeight + 2
	}
	
	// 前往会员开通页
	const openMembership = () => {
		vk.navigateTo('/pages_template/extras/vip/vip');
	}
	
	onMounted(async () => {
		// #ifdef MP-WEIXIN
		capsuleInfo()
		// #endif
	});
</script>

<style lang="scss" scoped>
	@import '@/common/css/mixins.scss';
		
	.top-nav {
		background-color: $uni-bg-color-grey;
		.user-info {
			@include flex-layout(between);
			.left {
				@include flex-layout(start);
				.logo-title {
					margin-left: 20rpx;
					.uer-name {
						color: #fff;
						font-size: $uni-font-size-xxl;
						font-weight: bold;
					}
					.not-logged-prompt {
						color: #fff;
						font-size: $uni-font-size-md;
					}
				}
			}
			.right {
				color: #fff;
			}
		}
		
		.membership-container {
			height: 190rpx;
		    background-color: #f3f3f3; /* 可以使用任何颜色值 */
		    background: url('https://mp-ab8b269c-c52c-4795-a674-3973206ce16b.cdn.bspapp.com/my/join-vip.png') no-repeat center center / cover;
		    border-radius: 20rpx;
		}
	}
	
</style>
