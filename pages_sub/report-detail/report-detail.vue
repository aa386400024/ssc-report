<template>
	<view>
		<pdf-reader
			ref="pdfReader"
			:hidden="hidden"
			:style="{ width: widthNum + 'rpx', height: heightNum + 'px', background: yanse }"
			@tap="onTap"
			@pagechanged="onPageChanged"
			@pagecategory="onPageCategory"
		></pdf-reader>
		<button @click="openNetworkPDF">Open Network PDF</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			hidden: false,
			widthNum: 750, // 示例宽度
			heightNum: 1334, // 示例高度
			yanse: '#ffffff' // 示例背景色
		};
	},
	methods: {
		onTap() {
			console.log('PDF reader tapped');
		},
		onPageChanged(event) {
			console.log('Page changed', event);
		},
		onPageCategory(event) {
			console.log('Page category', event);
		},
		openNetworkPDF() {
			const pdfReader = this.$refs.pdfReader;
			if (pdfReader) {
				// 调试输出 pdfReader
				console.log('pdfReader:', pdfReader);
				if (typeof pdfReader.openFile === 'function') {
					// 替换为你的网络 PDF 文件的 URL
					const networkPDFUrl = 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf';
					pdfReader.openFile(networkPDFUrl);
				} else {
					console.error('openFile method is not available on pdfReader');
				}
			} else {
				console.error('pdfReader reference is null');
			}
		}
	},
	mounted() {
		this.openNetworkPDF();
	}
};
</script>
