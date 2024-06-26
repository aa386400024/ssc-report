### `vk-uni-pay`插件Q群:22466457 如有问题或建议可以在群内讨论。
### 插件名称：`vk-uni-pay`
### 作者：VK

### 什么是 `vk-uni-pay`？

`vk-uni-pay` 是基于 `unicloud` 量身定制的支付插件，兼容任何 `unicloud` 框架。

**2021-07-06 vk-uni-pay 万能支付插件 正式上线**

## 与官方 `uni-pay` 的关系？

`vk-uni-pay` 依赖 `uni-pay` 的公共模块，同时在原 `uni-pay` 基础上进行拓展，具有超高自由度。

### 注意：目前支持情况

| 支付方式																| 支持情况| 说明																																		|
|---------------------------------				|--------	|---------																																|
| H5手机-支付宝支付												|  支持		| 在H5浏览器中唤起支付宝客户端支付																				|
| H5手机-微信支付													| 支持		| 在H5浏览器中唤起微信客户端支付																					|
| PC扫码支付-支付宝支付										|  支持		|  在PC浏览器中出现支付二维码，通过支付宝扫码支付													|
| PC扫码支付-微信支付											|  支持		|  在PC浏览器中出现支付二维码，通过微信扫码支付														|
| 微信小程序支付													|  支持		| 在微信小程序中支付																											|
| 支付宝小程序支付												|  支持		|  在支付宝小程序中支付																										|
| APP-支付宝转H5支付											|  支持		| 可以免申请APP接口，效果等于APP支付接口，但无法自动返回APP								|
| APP-支付宝支付													|  支持		| 在APP中唤起支付宝客户端支付，支付成功后自动返回到APP页面								|
| APP-微信支付														|  支持		|  在APP中唤起微信客户端支付，支付成功后自动返回到APP页面									|
| 公众号H5-微信支付												|  支持		| 在微信公众号的H5页面中唤起微信客户端支付																|
| 转账到支付宝余额												|  支持		| 一般用于给用户提现等业务场景（秒到）																		|
| 转账到微信零钱													|  支持		| 一般用于给用户提现等业务场景（秒到）																		|
| 强制使用二维码支付											|  支持		| 强制使用二维码支付，让顾客扫码支付，一般用于物联网，如按摩椅上的扫码支付|
| 从数据库中读取商户配置（多商户）				|  支持		| 一般用于多商户时使用（非服务商模式）																		|
| 服务商模式（多商户）（新增于1.10.0）		|  支持		| 一般用于多商户时使用（服务商模式）																			|
| IOS内购支付（appleiap）（新增于1.10.0）	|  支持		| In-App Purchase，是指苹果 App Store 的应用内购买	
| 个人支付（vkspay）（新增于1.11.0）	|  支持		| 无需营业执照，个人也能拥有支付接口，支付资金由支付宝、微信支付官方结算，避免二次清算。												|
| 微信小程序虚拟支付（新增于1.12.2）	|  支持		|短剧类目的微信小程序需要使用微信虚拟支付代替原先的微信支付才能上架									|

微信支付API均支持V2版本和V3版本，详情请看[支付配置](https://vkdoc.fsq.pub/vk-uni-pay/config.html)

### 安装步骤

[点击查看『安装步骤』](https://vkdoc.fsq.pub/vk-uni-pay/quickstart.html)

### 配置支付参数文件

[点击查看『配置支付参数文件』](https://vkdoc.fsq.pub/vk-uni-pay/config.html)

### 后端SDK（云函数）

[点击查看『后端SDK（云函数）』](https://vkdoc.fsq.pub/vk-uni-pay/uniCloud/createPayment.html)

### 前端SDK（页面）

[点击查看『前端SDK（页面）』](https://vkdoc.fsq.pub/vk-uni-pay/page/vk-uni-pay.html)

### 示例项目运行教程

[点击查看『示例项目运行教程』](https://vkdoc.fsq.pub/vk-uni-pay/example.html)
