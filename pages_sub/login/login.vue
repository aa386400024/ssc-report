<template>
	<view>
		<view class="header-container">
			<view class="header-content">
				<view class="header-title">省时查报告</view>
				<view class="header-subtitle">速查报告，事半功倍</view>
			</view>
		</view>
		<view class="login-sections padding-xl">
			<view class="form-view">
				<view class="form-item username">
					<u-input
						clearable
						placeholder="请输入您的用户名/手机号"
						border="surround"
						shape="circle"
						placeholderStyle="font-size: 16px;"
						:customStyle="inputCustomStyle"
						v-model="loginForm.username"
					></u-input>
				</view>
				<view class="form-item password">
					<u-input
						clearable
						placeholder="请输入您的密码"
						border="surround"
						type="password"
						shape="circle"
						placeholderStyle="font-size: 16px;"
						:customStyle="inputCustomStyle"
						v-model="loginForm.password"
					></u-input>
				</view>
			</view>
			<view class="additional-actions">
				<view class="action-item" @click="goToRegister">
					<text class="iconfont icon-zhuce">注册账号</text>
				</view>
				<view class="action-item" @click="resetPassword">
					<text class="iconfont icon-tianchongxing-">忘记密码</text>
				</view>
			</view>
			<view class="login-by-username-view">
				<u-button shape="circle" type="primary" size="large" text="登 录" @click="handleLoginBtn"></u-button>
			</view>
			<view class="dividing-line-view">
				<text class="dividing-line">OR</text>
			</view>
			<view class="login-by-wx-view">
				<u-button
					open-type="getPhoneNumber"
					shape="circle"
					type="primary"
					size="large"
					text="微信一键登录"
					:customStyle="wxBtnCustomStyle"
					@getphonenumber="loginByWeixinPhoneNumber"
				></u-button>
				<u-button
					shape="circle"
					type="primary"
					size="large"
					text="微信登录"
					@click="loginByWeixin('login')"
				></u-button>
			</view>
			<view class="agreement-view">
				<u-checkbox-group v-model="loginForm.agreement" @change="checkboxChange">
					<u-checkbox shape="circle" name="agreement"></u-checkbox>
				</u-checkbox-group>

				<text>我已阅读并同意</text>
				<navigator url="/pages_sub/user-agreement/user-agreement" hover-class="none">
					<text class="link-text">《用户协议》</text>
				</navigator>
				<text>与</text>
				<navigator url="/pages_sub/privacy-policy/privacy-policy" hover-class="none">
					<text class="link-text">《隐私政策》</text>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { reactive, toRefs, defineExpose, ref, onMounted, computed, getCurrentInstance } from 'vue';
import { store, mutations } from '@/uni_modules/uni-id-pages/common/store.js';
import { onLoad } from '@dcloudio/uni-app';

const eventChannelRef = ref(null); // 创建一个响应式引用用于存储 eventChannel

const myData = reactive({
	loginForm: {
		username: 'aa386400025',
		password: '123456',
		agreement: true
	},
	inputCustomStyle: {
		height: '50px',
		paddingLeft: '20px'
	},
	wxBtnCustomStyle: {
		backgroundColor: 'rgba(0, 206, 209, .5)',
		borderColor: 'rgba(0, 206, 209, .5)'
	},
	encryptedKey: ''
});

const { loginForm, inputCustomStyle, wxBtnCustomStyle, encryptedKey } = toRefs(myData);

// 跳转到注册页
const goToRegister = () => {
	uni.navigateTo({
		url: '/pages_sub/register/register'
	});
};

// 跳转到忘记密码页
const resetPassword = () => {
	uni.navigateTo({
		url: '/pages_sub/reset-password/reset-password'
	});
};

// 在组件挂载完成后执行的操作
onMounted(() => {
	// 获取当前组件实例
	const instance = getCurrentInstance();

	// 如果实例不存在或者实例的代理对象不存在，则抛出错误
	if (!instance || !instance.proxy) {
		throw new Error('getCurrentInstance().proxy is null');
	}

	// 获取代理对象
	const proxy = instance.proxy;

	// 使用代理对象的 getOpenerEventChannel 方法获取事件通道，并赋值给 eventChannelRef
	eventChannelRef.value = proxy.getOpenerEventChannel();

	// ... 其他 onMounted 逻辑
});

onLoad(() => {
	// 需要先在onLoad内执行此函数
	vk.userCenter.code2SessionWeixin({
		data: {
			needCache: true
		},
		success: (data: any) => {
			encryptedKey.value = data.encryptedKey;
		}
	});
});

const loginSuccessFun = (data: any) => {
	// 检查是否有指定跳转的页面
	// 如果有，则执行原始页面的跳转逻辑，并终止当前函数的执行
	if (vk.navigate.getOriginalPage()) {
		vk.navigate.originalTo();
		return;
	}

	// 获取当前应用的页面栈数组
	const pages = getCurrentPages();

	// 判断页面栈是否满足以下条件：
	// 1. 页面栈长度大于1，表示有多个页面
	// 2. 倒数第二个页面存在
	// 3. 倒数第二个页面的路由存在
	// 4. 倒数第二个页面的路由不是登录页面（'login/login'）
	// 如果以上条件都满足，执行以下逻辑
	mutations.loginSuccess({
		showToast: true,
		toastText: '登录成功',
		autoBack: true
	});
	if (pages.length > 1 && pages[pages.length - 2] && pages[pages.length - 2].route && pages[pages.length - 2].route.indexOf('login/login') === -1) {
		// 检查 eventChannelRef.value 是否存在
		// 如果存在，使用 eventChannelRef.value 来访问 eventChannel
		// 并且触发 'loginSuccess' 事件，向可能监听该事件的页面传递消息
		if (eventChannelRef.value) {
			eventChannelRef.value.emit('loginSuccess', {});
			// 返回上一个页面
			vk.navigateBack();
		}
	} else {
		console.log('进入首页');
		// 如果不满足上述条件，或者倒数第二个页面是登录页面
		// 则导航至应用首页
		vk.navigateToHome();
	}
};

// 账号密码登录
const handleLoginBtn = () => {
	const { username, password, agreement } = loginForm.value;

	// 检查用户名和密码是否为空
	if (!username.trim() || !password.trim()) {
		vk.toast('用户名和密码不能为空', 'none');
		return;
	}

	// 检查用户名长度
	if (username.length < 4) {
		vk.toast('账号至少4位数', 'none');
		return;
	}

	// 检查密码格式
	if (!vk.pubfn.test(password, 'pwd')) {
		vk.toast('密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线', 'none');
		return;
	}

	// 检查是否勾选了隐私协议
	if (!agreement) {
		vk.toast('请阅读并同意用户协议及隐私政策', 'none');
		return;
	}

	// 如果以上校验都通过了，可以执行登录操作
	vk.userCenter.login({
		data: loginForm.value,
		success: (data: any) => {
			console.log(data, 'datatdddd');
			vk.toast('登陆成功!');
			setTimeout(() => {
				// 跳转到首页,或页面返回
				loginSuccessFun(data);
			}, 1000);
		}
	});
};

// 复选框勾选事件
const checkboxChange = (value: string) => {
	loginForm.value.agreement = value.includes('agreement');
};

// 微信登录
const loginByWeixin = (type: string) => {
	vk.userCenter.loginByWeixin({
		data:{
			type
		},
		success: (data) => {
			vk.alert(data.msg);
		}
	});
};

/**
 * 通过微信手机号登录的方法
 * @param e - 微信手机号事件对象，其中包含加密数据和初始化向量
 */
const loginByWeixinPhoneNumber = (e: WeixinPhoneNumberEvent) => {
	// 打印事件对象，用于调试
	console.log(e, 'eeee');

	// 从事件对象的 detail 中解构出 encryptedData 和 iv
	let { encryptedData, iv } = e.detail;

	// 如果 encryptedData 或 iv 为空，则直接返回 false，不执行登录操作
	if (!encryptedData || !iv) {
		return false;
	}

	// 调用 vk.userCenter.loginByWeixinPhoneNumber 方法进行登录
	vk.userCenter.loginByWeixinPhoneNumber({
		data: {
			encryptedData, // 加密数据
			iv, // 初始化向量
			encryptedKey: encryptedKey.value // 加密密钥
		},
		success: (data: any) => {
			// 登录成功后的回调函数
			vk.toast('登陆成功!'); // 弹出登录成功的提示

			// 延迟 1 秒后执行跳转操作，以便用户能看到登录成功的提示
			setTimeout(() => {
				// 跳转到首页或返回上一页
				loginSuccessFun(data);
			}, 1000);
		}
	});
};
</script>

<style lang="scss" scoped>
@import '@/common/css/mixins.scss';

.header-container {
	width: 100%;
	height: 450rpx;
	background-color: #ccc;
	position: relative;

	.header-content {
		position: absolute;
		bottom: 60rpx;
		left: 60rpx;
		font-size: 40rpx;
		font-weight: bold;
		color: $uni-text-color;

		.header-title {
			margin-bottom: 20rpx;
		}

		.header-subtitle {
		}
	}
}

.login-sections {
	position: relative; // 确保父容器是相对定位
	height: calc(100vh - 450rpx); // 限制最大高度，确保内容不会超出视口高度

	.form-view {
		.form-item {
			margin-bottom: 40rpx;
		}
	}

	.additional-actions {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;

		.action-item {
			display: flex;
			align-items: center;
			color: $uni-text-color-grey;
			font-size: 16px;

			.icon-zhuce,
			.icon-tianchongxing- {
			}
		}
	}

	.login-by-username-view {
		margin-top: 70rpx;
	}

	.login-by-wx-view {
	}

	.dividing-line-view {
		text-align: center;
		width: 100%;
		margin: 40rpx 0;
		color: #ddd;

		.dividing-line {
			@include title-decoration(line, 290rpx, 2rpx);
		}
	}

	.agreement-view {
		position: absolute;
		bottom: 50rpx;
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;

		.link-text {
			color: #1e90ff;
			margin: 0 5rpx;
		}
	}
}
</style>
