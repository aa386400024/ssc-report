<template>
	<view class="card padding-md margin-bottom-md border-radius-large box-shadow-md-sd-primary" @click="handleClick">
		<image class="card-image margin-right-md border-radius-large box-shadow-md-sd-secondary"
			:src="position.image_url" />
		<view class="card-content margin-left-sm">
			<view class="card-title margin-bottom-sm">{{ position.name }}</view>
			<view class="card-description margin-bottom-lg">{{ position.description }}</view>
			<view class="card-interviews">
				<text class="iconfont icon-yonghutongji" :data-text="position.interviewed_count + '人使用过'"></text>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { defineProps } from 'vue';

	// 定义props
	const props = defineProps({
		position: Object,
	});

	// 定义emit
	const emits = defineEmits(["click"]);

	const handleClick = () => {
		emits('click', props.position);
	};
</script>

<style lang="scss" scoped>
	@import '@/common/css/mixins.scss'; // 导入你的mixin文件

	.card {
		@include flex-layout('start');
		border: 1px solid #eee;
		background-color: #fff;

		.card-image {
			width: 180rpx;
			height: 180rpx;
		}

		.card-content {
			flex: 1;
			flex-direction: column;

			.card-title {
				font-size: $uni-font-size-xl;
				color: $uni-color-title;
				font-weight: 700;
			}

			.card-description {
				font-size: $uni-font-size-base;
				color: #666;
			}

			.card-interviews {
				@include flex-layout('start');

				.icon-yonghutongji {
					font-size: $uni-font-size-base;
					position: relative;

					&::before {
						content: '\e620';
						display: inline-block;
						margin-right: 6rpx;
					}

					&::after {
						content: attr(data-text);
						display: inline-block;
					}
				}
			}
		}
	}
</style>