<template>
	<view class="drawer-container">
		<!-- 抽屉头部 -->
		<view class="drawer-header">
			<text class="title">权限请求</text>
			<text @click="closePopup" class="close-btn">关闭</text>
		</view>
		
		<!-- 抽屉主体 -->
		<view class="drawer-body">
			<text class="description">为了确保模拟面试过程中的通信质量，我们需要以下权限：</text>
			
			<!-- 权限展示行 -->
			<view class="permission-row">
				<view class="permission-body" v-for="permission in permissions" :key="permission.type">
					<view class="background-block">
						<view class="iconfont" :class="permission.granted ? permission.success_icon : permission.fail_icon"></view>
						<text class="title">{{ permission.title }}</text>
					</view>
				</view>
			</view>

			<!-- 授权按钮行 -->
			<view class="permission-row">
				<view class="permission-button" v-for="permission in permissions" :key="permission.type">
					<u-button
						v-if="!permission.granted && permission.type !== 'network'" 
						@click="requestPermission(permission.type)" 
						type="success"
						shape="circle"
						:plain="true"
						text="去授权"
						:customStyle="permissionBtnCustomStyle"
					></u-button>
					<u-button
						v-else
						type="info"
						shape="circle"
						:plain="true"
						:text="permission.type == 'network' ? permission.message : '已授权'"
						:disabled="true"
						:customStyle="permissionBtnCustomStyle"
					></u-button>
				</view>
			</view>
		</view>
		
		<!-- 抽屉底部 -->
		<view class="drawer-footer">
			<u-button v-if="allPermissionsGranted" @click="startMockInterview" shape="circle" text="开始模拟面试" :customStyle="startIvBtnCustomStyle"></u-button>
			<u-button v-else @click="requestAllPermissions" shape="circle" type="success" text="一键授权"></u-button>
			<view class="margin-md"></view>
			<u-button @click="closeDrawer" shape="circle" text="稍后"></u-button>
		</view>
	</view> 
</template>


<script setup lang="ts">
	import { reactive, ref, toRefs, watch, computed } from 'vue';
	import { onShow } from "@dcloudio/uni-app"
	const myData = reactive({
		permissions: [
			{ type: 'microphone', title: '麦克风', granted: false, success_icon: 'icon-yuyin1', fail_icon: 'icon-lockvoice' },
			{ type: 'camera', title: '摄像头', granted: false, success_icon: 'icon-luxiang1', fail_icon: 'icon-luxiangguan' },
			{ type: 'network', title: '网络', granted: false, message: '未知', success_icon: 'icon-wifi1', fail_icon: 'icon-wifi-off' }
		],
		startIvBtnCustomStyle: {
			color: "#fff",
			backgroundColor: 'red'
		},
		permissionBtnCustomStyle: {
			height: "60rpx",
			width: "150rpx"
		}
	})
	const { permissions, startIvBtnCustomStyle, permissionBtnCustomStyle } = toRefs(myData)
	
	const allPermissionsGranted = computed(() => {
		return permissions.value.every(permission => permission.granted);
	});
	
	const closePopup = () => {
		emits('childClosePopup');
	}
	const emits = defineEmits(["childClosePopup", "childStartMockInterview"]);
	
	// 检查授权状态
	const checkPermissions = () => {
	    uni.getSetting({
	        success(res) {
	            permissions.value.forEach(permission => {
	                switch(permission.type) {
	                    case "microphone":
	                        permission.granted = res.authSetting["scope.record"] === true;
	                        break;
	                    case "camera":
	                        permission.granted = res.authSetting["scope.camera"] === true;
	                        break;
	                    case "network":
	                        // ...（如果你有检查网络权限的方式，则可以实现，否则不用处理）
	                        break;
	                }
	            });
	        }
	    });
	};
	
	// 请求单个权限
	const requestPermission = (type: string) => {
	    if (type === 'network') return; // 不处理网络权限请求
	
	    let scope = "";
	    switch(type) {
	        case "microphone":
	            scope = "scope.record";
	            break;
	        case "camera":
	            scope = "scope.camera";
	            break;
	        // 其他权限可以根据需要进行扩展
	    }
	
	    if (scope) {
	        // 先检查权限状态
	        uni.getSetting({
	            success(res: any) {
	                if (res.authSetting[scope] === undefined) {
	                    // 用户尚未做出选择，进行授权请求
	                    uni.authorize({
	                        scope: scope,
	                        success: () => {
	                            const permission = permissions.value.find(p => p.type === type);
	                            if (permission) permission.granted = true;
	                        },
	                        fail: () => {
	                            uni.showToast({ title: "授权失败", icon: "none" });
	                        }
	                    });
	                } else if (res.authSetting[scope] === false) {
	                    // 用户已拒绝授权，给出提示并提供一个按钮引导用户打开设置页面
	                    uni.showToast({
	                        title: "请在设置中开启权限",
	                        icon: "none",
	                        duration: 2000
	                    });
	                    // 提供一个按钮或提示引导用户打开设置页面
	                    // ... 
	                    // 当用户点击该按钮时:
	
						uni.openSetting({
						    success(settingRes) {
						        if (settingRes.authSetting[scope]) {
						            // 用户在设置中开启了权限，你可以进行下一步操作
						            const permission = permissions.value.find(p => p.type === type);
						            if (permission) permission.granted = true;
						        } else {
						            // 用户还是没有开启权限
						            uni.showToast({ title: "您没有开启权限", icon: "none" });
						        }
						    },
							fail(err) {
								console.log('Error:', err);
							}
						});
	                }
	            }
	        });
	    }
	};
	
	// 一键授权所有权限
	const requestAllPermissions = () => {
		permissions.value.forEach(permission => {
			requestPermission(permission.type);
		});
	};
	
	// 稍后授权
	const closeDrawer = () => {
		closePopup();
	};
	
	// 获取网络状态
	const netWorkStatus = () => {
	    uni.getNetworkType({
	        success: function (res) {
	            const networkType = res.networkType;
	            const permission = permissions.value.find(p => p.type === 'network');
	            if (permission) {
	                if (networkType === 'none') {
	                    permission.message = ' 无网络';
	                    permission.granted = false;
	                } else {
	                    permission.message = ' 稳定';
	                    permission.granted = true;
	                }
	            }
	        },
	    });
	};
	
	// 当所有权限都授予时，开始模拟面试
	const startMockInterview = () => {
		closePopup()
		emits('childStartMockInterview');
	};
	
	// 当应用回到前台时，检查权限状态
	onShow(() => {
	    checkPermissions();
	});
	defineExpose({
		netWorkStatus,
	});
	
</script>

<style lang="scss" scoped>
	@import '@/common/css/mixins.scss';
	.drawer-container {
	    width: 100%;
	    height: auto;  // 根据实际需要调整
	    background-color: #fff;
	    .drawer-header {
			@include flex-layout(between, row);
	        padding: 10px;
	        background-color: #f5f5f5;
	        .title {
	            font-weight: bold;
	        }
	
	        .close-btn {
	            color: #999;
	        } 
	    }
	
	    .drawer-body {
	        padding: 20px;
	        .description {
	            margin-bottom: 50rpx;
	        }
	    
	        .permission-row {
	            @include flex-layout(between, row);
	            padding: 10rpx 0;
	        
	            .permission-body, .permission-button {
	                flex: 1;
	                @include flex-layout(center, row);  // 使内容居中
	            }
	        
	            .permission-body {
	                .background-block {
	                    width: 200rpx;  
	                    height: 200rpx;
	                    background-color: #e5e5e5; 
	                    @include flex-layout(center, column);
	                    box-sizing: border-box;
						.iconfont {
							margin-bottom: 10rpx;  // 根据你的设计需要调整这个值
							font-size: 30px;
						}
						.title {
							font-size: 15px;
							color: #666
						}
	                }
	            }
	        }
	    }

	    .drawer-footer {
	        padding: 20px;
	        @include flex-layout(between, row);
	    }
	}
</style>
