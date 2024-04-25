<template>
	<view>
		<u-button text="退出登录" @click="logout"></u-button>
	</view>
</template>

<script lang="ts" setup>
	const logout = () => {
		vk.userCenter.logout({
		  success: (data) => {
		    // 退出登录成功后的逻辑
			console.log('成功退出')
		  }
		});
	}
</script>

<style lang="scss" scoped>

</style>
