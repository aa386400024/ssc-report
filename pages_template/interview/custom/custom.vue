<template>
	<view :style="{minHeight: windowHeight + 'px', backgroundColor: '#f3f4f6'}">
		<view class="img-body">
			<u-image :showLoading="false" :src="customUrl" :width="customImgWidth" mode="aspectFit"></u-image>
		</view>
		<view class="page-custom">
			<view class="style-body border-radius-large margin-bottom-lg">
				<view class="title">面试风格</view>
				<view class="style-tag">
					<view class="tag-item margin-right-xl" v-for="(item, index) in styleRadios" :key="index">
						<u-tag 
							:text="item.name" 
							:plain="!item.checked" 
							size="large" 
							type="warning" 
							:name="index"
							@click="styleRadioClick"
						>
						</u-tag>
					</view>
				</view>
			</view>
			<view class="level-body border-radius-large margin-bottom-lg">
				<view class="title">面试难度</view>
				<view class="level-tag">
					<view class="tag-item margin-right-xl" v-for="(item, index) in levelRadios" :key="index">
						<u-tag 
							:text="item.name" 
							:plain="!item.checked" 
							size="large" 
							type="warning" 
							:name="index"
							@click="levelRadioClick"
						>
						</u-tag>
					</view>
				</view>
			</view>
			<view class="skill-body border-radius-large"  v-if="skillRadios.length > 0">
				<view class="title">技术栈</view>
				<view class="skill-tag">
					<view class="margin-right-xl margin-bottom-lg" v-for="(item, index) in skillRadios" :key="index">
						<u-tag 
							:text="item.name" 
							:plain="!item.checked" 
							size="large" 
							type="warning" 
							:name="index"
							@click="skillRadiosClick"
						>
						</u-tag>
					</view>
				</view>
			</view>
			<view class="start-interview-body">
				<u-button 
					shape="circle" 
					type="primary" 
					size="large" 
					text="开始面试"
					:customStyle="interviewBtnCustomStyle"
					@click="startInterviewClick" 
				></u-button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive, toRefs, Ref, computed, onMounted } from 'vue';
	import { fetchIvCustom } from '@/api/home';
	import { useInterviewStore } from '@/stores';
	const interviewStore = useInterviewStore();
	const currentJobInfo = computed(() => interviewStore.currentJobInfo);
	const myData = reactive({
		customUrl: 'https://mp-43f7552d-29af-4d0a-8672-7a2fcdd00dc7.cdn.bspapp.com/interview/custom-interview-subject.png',
		customImgWidth: 0, 
		windowHeight: 0,
		styleRadios: [] as CustomRadio[],
		levelRadios: [] as CustomRadio[],
		skillRadios: [] as CustomRadio[],
		selectedStyleRadio: '',
		selectedLevelRadio: '',
		selectedSkillRadios: [] as string[],
		interviewBtnCustomStyle: {
			fontSize: "20px !important"
		}
	})
	const { 
		customUrl, 
		windowHeight,
		customImgWidth, 
		styleRadios,
		levelRadios, 
		skillRadios, 
		selectedStyleRadio,
		selectedLevelRadio,
		selectedSkillRadios,
		interviewBtnCustomStyle 
	} = toRefs(myData)
	
	// 获取当前设备宽度
	const setCustomImgWidth = () => {
		const systemInfo = uni.getSystemInfoSync();
		windowHeight.value = systemInfo.safeArea!.height;
		customImgWidth.value = systemInfo.safeArea!.width
	}
	
	// 公共radioClick方法
	const radioClick = (name: number, radios: Ref<CustomRadio[]>, selectedRadio: Ref<string>) => {
	    radios.value.forEach((item, index) => {
	        item.checked = index === name;
	    });
	    selectedRadio.value = radios.value.find(item => item.checked)?.value || '';
	};
	
	// 面试风格tag点击事件
	const styleRadioClick = (name: number) => {
	    radioClick(name, styleRadios, selectedStyleRadio);
	};
	
	// 面试难度tag点击事件
	const levelRadioClick = (name: number) => {
	    radioClick(name, levelRadios, selectedLevelRadio);
	};

	// 技术栈tag点击事件
	const skillRadiosClick = (name: number) => {
		console.log(skillRadios.value[name], 'name')
		skillRadios.value[name].checked = !skillRadios.value[name].checked;
		selectedSkillRadios.value = skillRadios.value.filter(item => item.checked).map(item => item.value) || [];
	};
	
	// 开始面试点击事件
	const startInterviewClick = () => {
		interviewStore.ivCustomParams = { 
			positionId: currentJobInfo.value.position_id || '',
			selectedStyleRadio: selectedStyleRadio.value,
			selectedLevelRadio: selectedLevelRadio.value,
			selectedSkillRadios: selectedSkillRadios.value,
		};
		vk.redirectTo('/pages_template/interview/flow/flow');
	}
	
	// 获取自定义面试数据
	const fetchIvCustomApi = async () => {
		const { position_id } = currentJobInfo.value
		const params = {
			position_id
		}
		try {
			const res = await fetchIvCustom(params);
			const { styleRadios, levelRadios, skillRadios } = res;
			console.log(styleRadios, 'styleRadios')
			myData.styleRadios.splice(0, myData.styleRadios.length, ...(styleRadios || []));
			myData.levelRadios.splice(0, myData.levelRadios.length, ...(levelRadios || []));
			myData.skillRadios.splice(0, myData.skillRadios.length, ...(skillRadios || []));
			selectedStyleRadio.value = styleRadios.find((item: CustomRadio) => item.checked)?.value || '';
			selectedLevelRadio.value = levelRadios.find((item: CustomRadio) => item.checked)?.value || '';
			selectedSkillRadios.value = skillRadios.filter((item: CustomRadio) => item.checked).map((item: CustomRadio) => item.value) || [];
		} catch (error) {
			console.error('Error during fetchIvCustomApi:', error);
			// 可以在这里添加更多的错误处理逻辑，比如设置一个标志，让用户知道出现了错误
		}
	};
	
	onMounted(async () => {
		setCustomImgWidth()
		fetchIvCustomApi()
	});
</script>

<style lang="scss" scoped>
	@import '@/common/css/mixins.scss';
	.page-custom {
		padding: 30rpx !important;
		.style-body, .level-body, .skill-body {
			background-color: #fff;
			.title {
				font-size: 34rpx;
				font-weight: 500;
				padding: 30rpx 40rpx;
			}
			.style-tag, .level-tag, .skill-tag {
				@include flex-layout(start, row);
				flex-wrap: wrap;
				padding: 0 40rpx 40rpx;
			}
			.skill-tag {
				padding-bottom: 10rpx !important;
			}
		}
		.start-interview-body {
			margin-top: 40rpx;
		}
	}
</style> 
