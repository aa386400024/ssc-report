<template>
	<view>
		<!-- #ifndef H5 -->
		<button class="button" @click="createPayment">支付</button>
		<!-- #endif -->
		<vk-uni-pay
			ref="vkPay"
			v-model:status="vkPay.status"
			v-model:codeUrl="vkPay.codeUrl"
			v-model:qrcodeImage="vkPay.qrcodeImage"
			:query-payment-action="vkPay.queryPaymentAction"
			:page-show="vkPay.pageShow"
			:auto-get-openid="vkPay.autoGetOpenid"
			:polling="vkPay.polling"
			:return-url="vkPay.returnUrl"
			:await-notify="vkPay.awaitNotify"
			:pay-order-info="vkPay.payOrderInfo"
		></vk-uni-pay>
	</view>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs, computed } from 'vue';

const myData = reactive({
	vkPay: {
		/**
		 * 查询支付状态的云函数配置
		 * 如果是非路由框架，则action为字符串，值为云函数名称
		 * 如果是路由框架，则按下方配置填写
		 * 注意：queryPaymentAction内参数用默认即可，无需更改。（除非你已经知道参数的意义）
		 */
		queryPaymentAction: {
			name: 'vk-pay', // 云函数名称
			action: 'pay/queryPayment', // 路由模式下云函数地址
			actionKey: 'action', // 路由模式下云函数地址的识别key
			dataKey: 'data' // 路由模式下云函数请求参数的识别key
		},
		// PC支付的付款二维码地址，渲染二维码需要自己写，可以参考示例中的二维码组件 vk-uni-qrcode
		codeUrl: '',
		qrcodeImage: '',
		// 当前支付状态 0:等待发起支付 1:支付中 2:已支付（注意：跟数据库的status无关）
		status: 0,
		// 当前页面是否显示
		pageShow: true,
		// 启用轮询检测订单支付状态（仅h5支付有效）
		polling: true,
		// 仅微信手机外部浏览器H5支付时有效，必须是http或https开头的绝对路径，且在微信H5支付配置的域名白名单中。你还需要将此H5域名加入uniCloud白名单
		// 如果此值为空，则默认返回当前页面，返回的页面url参数会带上confirmShow=true&out_trade_no=实际订单号
		returnUrl: '',
		// 确认已支付的弹窗开关（微信手机外部浏览器H5支付时有效）
		confirmShow: false,
		// 支付成功后，是否需要等待异步回调全部执行完成后才通知前端（当awaitNotify和payOrderInfo均为false时，支付成功的响应速度最快）
		awaitNotify: true,
		// 支付成功后，是否需要返回支付订单数据（当awaitNotify和payOrderInfo均为false时，支付成功的响应速度最快）
		payOrderInfo: false,
		// 是否自动获取小程序的openid（若传false，则在createPayment时需要自己传对应的openid，一般服务商模式下需要传false）
		autoGetOpenid: true
	}
});

const { vkPay } = toRefs(myData);

const createPayment = (obj = {}) => {
  vkPay.value.out_trade_no = obj.out_trade_no || "test_" + Date.now();

  // 根据编译平台选择支付提供商
  // #ifdef MP-WEIXIN
  vkPay.value.provider = "wxpay";
  // #endif
  // #ifdef MP-ALIPAY
  vkPay.value.provider = "alipay";
  // #endif

  // 支付流程调用
  vkPay.value.createPayment({
    action: {
      name: vkPay.value.queryPaymentAction.name,
      action: vkPay.value.queryPaymentAction.action,
      actionKey: vkPay.value.queryPaymentAction.actionKey,
      dataKey: vkPay.value.queryPaymentAction.dataKey
    },
    data: {
      provider: vkPay.value.provider,
      total_fee: vkPay.value.total_fee,
      out_trade_no: vkPay.value.out_trade_no,
      subject: vkPay.value.subject,
      body: vkPay.value.body,
      type: vkPay.value.type,
      openid: vkPay.value.openid
    },
    create: res => {
      console.log('pay-create', res);
      vkPay.value.out_trade_no = res.out_trade_no;
    },
    success: res => {
      console.log("pay-success", res);
      uni.showToast({ title: "支付成功", icon: "success" });
    },
    fail: res => {
      console.error("pay-fail", res);
      uni.showToast({ title: res.msg, icon: "none" });
    },
    cancel: res => {
      uni.showToast({ title: "用户取消支付", icon: "none" });
    }
  });
}; 
</script>

<style lang="scss" scoped></style>
