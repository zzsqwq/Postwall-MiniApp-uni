<template>
	<view class="fui-wrap">
		<image class="logo" :src="'https://q1.qlogo.cn/g?b=qq&nk=2825467691&s=640'" mode="aspectFill"></image>
		<text class="title">实高自助贴贴墙</text>
		<text class="inline-title">Developed by zzsqwq</text>
		<!-- <view class="fui-page__spacing">
			<view class="fui-menu__wrap fui-align__center">
				<view class="fui-menu__item" v-for="(item,index) in menus" :key="index">
					<button open-type="feedback" class="fui-btn__feedback" v-if="index===1"></button>
					<button open-type="share" class="fui-btn_feedback" v-if="index===0" :share-mode="['qq', 'qzone']"></button>
					<button open-type="openGroupProfile" group-id="421976351" class="fui-btn_feedback" v-if="index===2"></button>
					<view class="fui-menu__img fui-flex__center" :style="{background:item.background}">
						<image :src="`https://res.firstui.cn/static/images/my/light/icon_${item.src}_3x.png`"
							mode="widthFix"></image>
					</view>
					<text>{{item.text}}</text>
				</view>
			</view>
		</view> -->
		<view class="fui-list__view">
			<!-- 		<fui-list-cell arrow :padding="[0,'32rpx']" :bottomBorder="false" radius="16rpx" marginTop="24"
				v-for="(item,index) in links" :key="index" :index="index" @click="getLink">
				<button class="fui-list__item fui-align__center">
					<image class="fui-item__icon" :src="`/static/images/website/light/icon_${item.img}_3x.png`"></image>
					<text>{{item.name}}</text>
				</button
				>
			</fui-list-cell> -->
			<fui-list-cell arrow :padding="[0,'32rpx']" :bottomBorder="false" radius="16rpx" marginTop="24"
				@click="navigateToDeclaration">
				<view class="fui-list__item fui-align__center">
					<image class="fui-item__icon" :src="`/static/images/icon_document.png`"></image>
					<text>使用说明</text>
				</view>
			</fui-list-cell>
			<fui-list-cell arrow :padding="[0,'32rpx']" :bottomBorder="false" radius="16rpx" marginTop="24">
				<view class="fui-list__item fui-align__center">
					<button class="fui-btn__feedback" open-type="share" :share-mode="['qq', 'qzone', 'wechatFriends', 'wechatMoment']"></button>
					<image class="fui-item__icon" :src="`/static/images/icon_share.png`"></image>
					<text>分享给好友</text>
				</view>
			</fui-list-cell>
			<fui-list-cell arrow :padding="[0,'32rpx']" :bottomBorder="false" radius="16rpx" marginTop="24">
				<view class="fui-list__item fui-align__center">
					<button class="fui-btn__feedback" open-type="openGroupProfile" group-id="421976351"></button>
					<image class="fui-item__icon" :src="`/static/images/icon_group.png`"></image>
					<text>入群反馈</text>
				</view>
			</fui-list-cell>
			<fui-list-cell arrow :padding="[0,'32rpx']" :bottomBorder="false" radius="16rpx" marginTop="24" @click="getGithubLink">
				<view class="fui-list__item fui-align__center">
					<image class="fui-item__icon" :src="`/static/images/icon_github.png`"></image>
					<text>开源地址</text>
				</view>
			</fui-list-cell>
		</view>
		<fui-footer isFixed :navigate="navigate" text="Copyright © 2021-2022 胶州实验自助贴贴墙"></fui-footer>
	</view>
</template>

<script>
	import $fui from '@/components/firstui/fui-clipboard';
	export default {
		data() {
			return {
				navigate: [{
					text: '隐私说明',
					openType: 'navigate',
					url: '/pages/privacy/privacy'
				}, {
					text: '使用说明',
					openType: 'navigate',
					url: "/pages/declaration/declaration"
				}],
				menus: [{
					text: '分享好友',
					background: '#F2FCF6',
					src: 'share',
					page: '/pages/my/share/share'
				}, {
					text: '意见反馈',
					background: '#F6F7FF',
					src: 'proposal',
					page: 'feedback'
				}, {
					text: '入群反馈',
					background: '#FFF4F4',
					src: 'cooperation',
					page: '/pages/my/cooperate/cooperate'
				}],
				links: [{
					img: 'website',
					name: '使用说明',
					link: 'https://www.firstui.cn/'
				}, {
					img: 'file',
					name: '分享好友',
					link: 'https://doc.firstui.cn/'
				}, {
					img: 'github',
					name: '入群反馈',
					link: 'https://github.com/FirstUI/FirstUI'
				}, {
					img: 'uni',
					name: '加入我们',
					link: 'https://ext.dcloud.net.cn/publisher?id=766365'
				}]
			}
		},
		onShareAppMessage() {

		},
		methods: {
			navigateToDeclaration() {
				qq.navigateTo({
					url: '/pages/declaration/declaration'
				})
			},
			getGithubLink(e) {
				$fui.getClipboardData("https://github.com/zzsqwq/Postwall-MiniApp-uni", res => {}, e);
			}
		}
	}
</script>

<style>
	page {
		background-color: #f5f6fa !important;
	}
	
	.logo {
		/* 圆形居中 */
		width: 300rpx;
		height: 300rpx;
		border-radius: 50%;
		margin: 100rpx auto 0 auto;
		display: block;
	}

	.fui-menu__wrap {
		height: 210rpx;
		/* background: #FFFFFF; */
		/* 	box-shadow: 0 4rpx 8rpx 0 rgba(2, 4, 38, 0.05);
		border-radius: 0 0 16rpx 16rpx; */
	}

	.fui-menu__item {
		flex: 1;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 24rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		position: relative;
	}

	.fui-menu__img {
		width: 96rpx;
		height: 96rpx;
		border-radius: 24rpx;
		margin-bottom: 16rpx;
	}

	.fui-menu__img image {
		width: 64rpx;
		height: 64rpx;
		display: block;
	}

	.fui-btn__feedback {
		background: transparent !important;
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		top: 0;
		border: 0;
		z-index: 1;
	}

	.fui-btn__feedback::after {
		border: 0;
	}

	.title {
		text-align: center;
		font-size: 40rpx;
		font-weight: bold;
		margin-top: 20rpx;
	}

	.fui-list__view {
		width: 100%;
		padding: 8rpx 32rpx 32rpx;
		box-sizing: border-box;
	}

	.fui-list__item {
		width: 100%;
		height: 112rpx;
	}

	.fui-list__item text {
		padding-left: 24rpx;
		padding-right: 16rpx;
	}

	.fui-item__icon {
		width: 48rpx;
		height: 48rpx;
	}

	.inline-title {
		/*	居中，标题小一号*/
		text-align: center;
		font-size: 32rpx;
		/*font-weight: bold;*/
		margin-top: 20rpx;
	}
</style>
