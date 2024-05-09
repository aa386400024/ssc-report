<template>
	<view class="page-container">
		<u-modal 
			:show="isShowModal" 
			:showCancelButton="true" 
			:closeOnClickOverlay="true" 
			@close="isShowModal = false" 
			@cancel="isShowModal = false" 
			@confirm="isShowModal = false"
		>
			<view class="slot-content">
				<view v-if="modalType === 'vip'">1111</view>
				<view v-else-if="modalType === 'invite'">2222</view>
			</view>
		</u-modal>
		<view class="header-menu">
			<view class="input-view margin-right-md">
				<u-input placeholder="请输入兑换码" border="surround" shape="circle" v-model="inputVal"></u-input>
			</view>
			<u-button @click="handleToExchangeBtn" shape="circle" color="#0055ff" text="兑换"></u-button>
		</view>
		<view class="open-vip-view margin-top-lg" @click="handleOpenVipBtn"></view>
		<view class="open-vip-view margin-top-lg" @click="handleInvitefriendsBtn"></view>
	</view>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed } from 'vue';
import { exchangeCode } from '@/api/my';

const myData = reactive({
	inputVal: '',
	isShowModal: false,
	modalType: ''
});

const { inputVal, isShowModal, modalType } = toRefs(myData);

// 兑换码兑换
const fetchExchangeCode = async () => {
	try {
		const result = await exchangeCode({ code: inputVal.value });
		if (result && result.data && result.data.length) {
		} else {
		}
	} catch (e) {
		console.error('Failed to industries:', e);
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
.header-menu {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.input-view {
		min-width: 500rpx;
	}
}
.open-vip-view {
	height: 190rpx;
	border-radius: 20rpx;
	background: url('https://mp-ab8b269c-c52c-4795-a674-3973206ce16b.cdn.bspapp.com/my/join-vip.png') no-repeat center center / cover;
}
</style>
