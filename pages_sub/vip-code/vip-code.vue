<template>
	<view class="page-container">
		<u-modal :show="isShowModal" :showCancelButton="true" :closeOnClickOverlay="true" @close="isShowModal = false" @cancel="isShowModal = false" @confirm="isShowModal = false">
			<view class="slot-content">
				<view v-if="modalType === 'vip'">VIP会员开通</view>
				<view v-else-if="modalType === 'invite'">邀请好友</view>
			</view>
		</u-modal>
		<view class="header-menu">
			<view class="input-view margin-right-md">
				<u-input placeholder="请输入兑换码" border="surround" shape="circle" v-model="inputVal"></u-input>
			</view>
			<u-button @click="handleToExchangeBtn" shape="circle" color="#0055ff" text="兑换"></u-button>
		</view>
		<view class="image-container margin-top-lg" @click="handleOpenVipBtn">
			<view class="open-vip-view"></view>
		</view>
		<view class="image-container margin-top-lg" @click="handleInvitefriendsBtn">
			<view class="open-invite-view"></view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue';
import { exchangeCode } from '@/api/my';

const myData = reactive({
	inputVal: '',
	isShowModal: false,
	modalType: ''
});

const { inputVal, isShowModal, modalType } = toRefs(myData);

// 兑换码兑换
const fetchExchangeCode = async () => {
	if (!inputVal.value) {
		uni.showToast({
			title: '请先填写正确的兑换码',
			icon: 'none'
		});
		return;
	}
	try {
		const result = await exchangeCode({ code: inputVal.value });
		console.log(result, 'result=code')
		if (result && result.data) {
			const userVipDays = result.data.record.userVipDays;
			const couponVipDays = result.data.record.couponVipDays;
			uni.showToast({
				title: `兑换成功，用户当前剩余VIP天数为${userVipDays}天，本次兑换了${couponVipDays}天`,
				icon: 'none'
			});
			inputVal.value = '';
		} else {
			throw new Error('Invalid response');
		}
	} catch (error) {
		uni.showToast({
			title: error.data?.msg || '您输入的兑换码有误，请重新输入！',
			icon: 'none'
		});
	}
};

// 点击兑换按钮
const handleToExchangeBtn = () => {
	fetchExchangeCode();
};

// 点击图片开通会员
const handleOpenVipBtn = () => {
	modalType.value = 'vip';
	isShowModal.value = true;
};

// 点击图片邀请好友
const handleInvitefriendsBtn = () => {
	modalType.value = 'invite';
	isShowModal.value = true;
};
</script>

<style lang="scss" scoped>
.page-container {
	padding: 20rpx;
}
.header-menu {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.input-view {
		min-width: 500rpx;
	}
}
.image-container {
	width: 100%;
	height: 180rpx;
	border-radius: 20rpx;
	overflow: hidden; /* 确保子容器的圆角效果 */
	position: relative;
}
.open-vip-view, .open-invite-view {
	width: 100%;
	height: 100%;
	background-size: 105%; /* 调整背景图片的大小 */
	background-position: center;
	border-radius: 20rpx; /* 保持圆角效果 */
}
.open-vip-view {
	background-image: url('../../static/my/join-vip.png');
}
.open-invite-view {
	background-image: url('../../static/my/yaoqing.png');
}
</style>
