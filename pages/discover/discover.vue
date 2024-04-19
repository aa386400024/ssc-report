<template>
	<view class="page-container">
		<view class="question-analysis">
			<u-subsection 
				fontSize="14" 
				mode="button" 
				:list="subsectionList" 
				:current="currentSubsectionIndex"
				@change="sectionChange"
			></u-subsection>
		</view>
		<view class="report-view">
			<!-- 微信群组列表 -->
			<u-cell-group 
				v-if="currentSubsectionIndex === 0"
				:border="false" 
				:customStyle="{ fontWeight: 'bold' }"
				class="cell-group-container"
			>
				<u-cell 
				  v-for="(cell, index) in cellGroups['wxGroup']" 
				  :key="`group-0-cell-${index}`" 
				  @click="() => handleCell(cell.name)">
					  <template #title>
						<view class="title-view">
							<view class="title">{{cell.title}}</view>
						</view>
						<view class="info">
							申请加入
						</view>
					  </template>
					  <template #icon>
						<text :class="`iconfont ${cell.icon}`"></text>
					  </template>
				</u-cell>
			</u-cell-group>
			
			<!-- 热门推荐列表 -->
			<u-cell-group 
				v-if="currentSubsectionIndex === 1"
				:border="false" 
				:customStyle="{ fontWeight: 'bold' }"
				class="cell-group-container"
			>
				<u-cell 
				  v-for="(cell, index) in cellGroups['recommend']" 
				  :key="`group-0-cell-${index}`" 
				  @click="() => handleCell(cell.name)">
					  <template #title>
						<view class="title-view">
							<view class="title">{{cell.title}}</view>
							<view class="right-icon"><text class="iconfont icon-mima"></text><text class="iconfont icon-mima"></text></view>
						</view>
						<view class="info">
							<text class="iconfont icon-mima">pdf</text>
							<text>22.23MB</text>
							<text>244页</text>
							<text>混沌学院</text>
							<text>2024-04-04</text>
						</view>
					  </template>
					  <template #icon>
						<text :class="`iconfont ${cell.icon}`"></text>
					  </template>
				</u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { computed, onMounted, ref, toRefs, reactive } from 'vue';
	const myData = reactive({
		subsectionList: [
			{ name: '微信群组' },
			{ name: '热点推荐' },
		] as { name : string }[],
		currentSubsectionIndex: 0,
		cellGroups: {
			wxGroup: [
				{ name: 'inviteRanking', icon: 'friends', title: '2023胖东来：幸福企业进化之路分享-混沌学院.pdf', path: '/pages_sub/invite-ranking/invite-ranking' },
				{ name: 'readRanking', icon: 'read', title: '阅读排名', path: '/pages_sub/read-ranking/read-ranking' },
				{ name: 'wechatGroups', icon: 'wechat', title: '微信群组', path: '/pages_sub/wechat-groups/wechat-groups' },
				{ name: 'vipCode', icon: 'vip', title: 'VIP兑换码', path: '/pages_sub/vip-code/vip-code' }
			],
			recommend: [
				{ name: 'inviteRanking', icon: 'friends', title: '2023胖东来：幸福企业进化之路分享-混沌学院.pdf', path: '/pages_sub/invite-ranking/invite-ranking' },
				{ name: 'readRanking', icon: 'read', title: '阅读排名', path: '/pages_sub/read-ranking/read-ranking' },
				{ name: 'wechatGroups', icon: 'wechat', title: '微信群组', path: '/pages_sub/wechat-groups/wechat-groups' },
				{ name: 'vipCode', icon: 'vip', title: 'VIP兑换码', path: '/pages_sub/vip-code/vip-code' }
			],
		}
	})
	const { subsectionList, currentSubsectionIndex, cellGroups } = toRefs(myData);
	
	// 分段器切换事件
	const sectionChange = (index : number) => {
		currentSubsectionIndex.value = index;
	}
	
	const handleCell = (name) => {
		// 查找对应的cell项
		console.log(name, "name")
		const cellItem = myData.cellGroups.flatMap((group) => group.cells).find((cell) => cell.name === name);
		console.log(cellItem, "cellItem.path")
		if (cellItem && cellItem.path) {
			uni.navigateTo({
				url: `/pages_sub/report-detail/report-detail?id=${cellItem}` // 将参数拼接在URL中
			});
		} else {
			console.error('未找到对应的路由配置');
		}
	};
</script>

<style lang="scss" scoped>
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
				white-space: normal;          /* 允许内容按照正常的方式进行换行 */
				word-wrap: break-word;        /* 在需要的时候，单词可以被拆断换行 */
				overflow-wrap: break-word;    /* 同上，确保内容不会溢出 */
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
</style>