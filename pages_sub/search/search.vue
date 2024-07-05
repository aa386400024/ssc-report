<template>
	<view class="page-container">
		<u-search
			class="padding-lg"
			placeholder="输入报告关键词, 例如'人工智能'"
			shape="round"
			showAction
			actionText="取消"
			:color="textColor"
			@input="bindSearchInput"
			@custom="cancelSearch"
		></u-search>

		<view v-if="!isSearchActive">
			<view class="search-history">
				<text class="title">搜索历史</text>
				<text class="clear-history" @tap="clearSearchHistory">清空历史</text>
				<view v-for="(item, index) in searchHistory" :key="index" class="search-history-item" @tap="searchWord(item)">
					{{ item }}
				</view>
			</view>

			<view class="gap"></view>

			<view class="hot-searches">
				<text class="title">大家都在搜</text>
				<view class="tag-container">
					<view v-for="(tag, index) in tagList" :key="index" class="tag padding-lg margin-sm" @tap="searchWord(tag)">
						{{ tag }}
					</view>
				</view>
			</view>
		</view>

		<InfiniteScroll v-if="isSearchActive" :loadMoreMethod="loadMore" :refreshMethod="onRefresh" :hasMore="hasMore" :isLoading="isLoading" @update:isLoading="updateIsLoading">
			<view class="search-results padding-lg" v-if="searchInput">
				<u-subsection :list="sortOptions" mode="subsection" :current="currentSortIndex" @change="onSortChange"></u-subsection>
				<u-cell-group :border="false" :customStyle="{ fontWeight: 'bold' }" class="cell-group-container">
					<u-cell v-for="(item, index) in searchResults" :key="`search-result-${index}`" @click="onReportItemTap(item.id)">
						<template #title>
							<view class="title-view">
								<view class="title">{{ item.title }}</view>
								<view class="right-icon">
									<image v-if="item.hot" src="/static/home/flag_hot.png" style="width: 20px; height: 20px"></image>
									<image v-if="item.isNew" src="/static/home/flag_new.png" style="width: 20px; height: 20px"></image>
								</view>
							</view>
							<view class="info">
								<image v-if="item.fileType === 'pdf'" src="/static/file/file_type_pdf.png" style="width: 11px; height: 13px"></image>
								<image v-if="item.fileType === 'doc'" src="/static/file/file_type_doc.png" style="width: 11px; height: 13px"></image>
								<image v-if="item.fileType === 'ppt'" src="/static/file/file_type_ppt.png" style="width: 11px; height: 13px"></image>
								<text>{{ item.fileType }}</text>
								<text>{{ computeFileSize(item.filesize) }}</text>
								<text>{{ item.pages }}页</text>
								<text>{{ item.industry }}</text>
								<text>{{ item.comeFrom }}</text>
								<text>{{ item.time }}</text>
							</view>
						</template>
						<template #icon>
							<text :class="`iconfont ${item.icon}`"></text>
						</template>
					</u-cell>
				</u-cell-group>
			</view>

			<view v-if="emptyPage" class="empty-page">
				<text>没有搜索到相关结果</text>
			</view>
		</InfiniteScroll>
	</view>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue';
import InfiniteScroll from '@/components/InfiniteScroll/InfiniteScroll.vue';

const myData = reactive({
	textColor: '#fff',
	tagList: ['抖音', '直播', '小红书', '数字化', '人工智能', '汽车'],
	searchInput: '',
	searchHistory: [],
	searchResults: [],
	emptyPage: false,
	searchSortBy: 'publishTime',
	pageNo: 0,
	pageSize: 30,
	hasMore: true,
	isLoading: false,
	currentSortIndex: 0,
	sortOptions: ['按时间', '按查看次数', '按下载次数'],
	isSearchActive: false
});

const {
	textColor,
	tagList,
	searchInput,
	searchHistory,
	searchResults,
	emptyPage,
	searchSortBy,
	pageNo,
	pageSize,
	hasMore,
	isLoading,
	currentSortIndex,
	sortOptions,
	isSearchActive
} = toRefs(myData);

const cancelSearch = () => {
	myData.searchInput = '';
	myData.isSearchActive = false;
};

const bindSearchInput = (event) => {
	myData.searchInput = event.detail.value;
	searchWord(myData.searchInput);
};

const searchWord = (word) => {
	myData.searchInput = word;
	if (word.length > 0) {
		myData.pageNo = 0;
		doSearch(true);
		myData.isSearchActive = true;
	}
	if (myData.searchHistory.includes(word)) {
		myData.searchHistory = myData.searchHistory.filter((item) => item !== word);
	}
	myData.searchHistory.unshift(word);
	uni.setStorageSync('search_words', myData.searchHistory);
};

const doSearch = (isRefresh = false) => {
	myData.emptyPage = false;
	setTimeout(() => {
		const response = {
			record: {
				reports: [
					{
						name: 'inviteRanking',
						icon: 'friends',
						title: '2023胖东来：幸福企业进化之路分享-混沌学院.pdf',
						path: '/pages_sub/invite-ranking/invite-ranking',
						isNew: true,
						hot: false,
						fileType: 'pdf',
						filesize: 23345,
						pages: 20,
						industry: '教育',
						comeFrom: '混沌学院',
						time: '2024-04-04'
					},
					{
						name: 'readRanking',
						icon: 'read',
						title: '2024年ai营销应用解析报告-微易播.pdf',
						path: '/pages_sub/read-ranking/read-ranking',
						isNew: false,
						hot: true,
						fileType: 'doc',
						filesize: 12345,
						pages: 15,
						industry: '科技',
						comeFrom: '微易播',
						time: '2024-04-04'
					}
				],
				pageNo: myData.pageNo + 1,
				hasNext: myData.pageNo < 3 // 模拟3页数据
			}
		};

		myData.isLoading = false;
		myData.hasMore = response.record.hasNext;
		myData.pageNo = response.record.pageNo;
		if (isRefresh) {
			myData.searchResults = response.record.reports;
		} else {
			myData.searchResults = myData.searchResults.concat(response.record.reports);
		}
		if (myData.searchResults.length === 0) {
			myData.emptyPage = true;
		}
	}, 1000);
};

const clearSearchHistory = () => {
	myData.searchHistory = [];
	uni.setStorageSync('search_words', []);
};

const onSortChange = (index) => {
	myData.currentSortIndex = index;
	switch (index) {
		case 0:
			myData.searchSortBy = 'publishTime';
			break;
		case 1:
			myData.searchSortBy = 'viewCount';
			break;
		case 2:
			myData.searchSortBy = 'downloads';
			break;
	}
	myData.pageNo = 0;
	doSearch(true);
};

const onReportItemTap = (reportId) => {
	uni.navigateTo({
		url: `/pages/detail/detail?uuid=${reportId}`
	});
};

// 上拉加载更多方法
const loadMore = async () => {
	if (myData.hasMore && !myData.isLoading) {
		myData.isLoading = true;
		doSearch();
	}
};

// 下拉刷新方法
const onRefresh = async () => {
	if (!myData.isLoading) {
		myData.isLoading = true;
		doSearch(true);
	}
};

// 更新isLoading状态
const updateIsLoading = (val) => {
	myData.isLoading = val;
};

// 初始加载历史搜索
myData.searchHistory = uni.getStorageSync('search_words') || [];

const computeFileSize = (size: number) => {
	// 用于计算文件大小的函数
	if (size < 1024) {
		return size + ' B';
	} else if (size < 1024 * 1024) {
		return (size / 1024).toFixed(2) + ' KB';
	} else {
		return (size / (1024 * 1024)).toFixed(2) + ' MB';
	}
};
</script>

<style lang="scss" scoped>
.page-container {
	background: #fff;
	padding: 0 !important;
	.search-history {
		display: flex;
		flex-direction: column;
		padding: 0 40rpx;
		.title {
			font-weight: bold;
			font-size: 30rpx;
		}
		.clear-history {
			font-size: 22rpx;
			color: #ccc;
		}
		.search-history-item {
			font-size: 24rpx;
			margin-top: 10rpx;
			cursor: pointer;
		}
	}
	.gap {
		height: 20rpx;
		width: 100%;
		background: #f0f0f0;
		margin: 40rpx auto;
	}
	.hot-searches {
		.title {
			padding: 0 40rpx;
			font-weight: bold;
			font-size: 30rpx;
		}
		.tag-container {
			display: flex;
			flex-wrap: wrap;
			padding: 10px;
			.tag {
				background-color: #f0f0f0;
				border-radius: 30rpx;
				font-size: 22rpx;
				color: #666;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 30rpx;
				margin: 5rpx;
				padding: 0 10rpx;
				cursor: pointer;
			}
		}
	}
	.search-results {
		.search-sort {
			display: flex;
			justify-content: space-around;
			margin: 20rpx 0;
			.search-sort-item,
			.search-sort-item-select {
				font-size: 24rpx;
				cursor: pointer;
			}
			.search-sort-item-select {
				color: blue;
			}
		}
		.cell-group-container {
			&:not(:last-child) {
				margin-bottom: 40rpx;
			}

			::v-deep .u-cell__body {
				padding: 20rpx 0 !important;
			}

			.title-view {
				display: flex;
				justify-content: flex-start;
				.title {
					width: calc(100% - 120rpx);
					white-space: normal; /* 允许内容按照正常的方式进行换行 */
					word-wrap: break-word; /* 在需要的时候，单词可以被拆断换行 */
					overflow-wrap: break-word; /* 同上，确保内容不会溢出 */
				}

				.right-icon {
					text {
						margin: 0 10rpx;
					}
				}
			}
			.info {
				font-weight: normal;
				font-size: 20rpx;
				color: #ccc;
				text {
					margin: 0 10rpx;
					&:first-child,
					&:last-child {
						margin: 0; // 特别为第一个和最后一个.text元素设置的样式
					}
				}
			}
		}
	}
	.empty-page {
		text-align: center;
		padding: 50rpx;
	}
}
</style>
