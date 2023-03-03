<template>
	<view class="fui-wrap">
		<fui-vtabs :vtabs="vtabs" :activeTab="activeTab" :linkage="false" @click="onTabClick" tabWidth="180">
				<view class="fui-vtabs-content__item">
					<view class="fui-content--box">
						<text class="fui-title">{{content.title}}</text>
						<view v-for="(item, index) in content.descr" :key="index">
							<image v-if="item.substring(0, 5) === 'cloud'" :src="item" class="image-descr"
								mode="aspectFit" @tap="previewImg" :id="index"></image>
							<text v-else class="fui-descr">{{ item }}</text>
						</view>
					</view>
				</view>
		</fui-vtabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeTab: 0,
				vtabs: [],
				contents: [],
				content: {},
			}
		},
		onLoad() {
			//内容可与tabs分开
      const db = qq.cloud.database()
      db.collection('declaration').get().then(res => {
        this.contents = res.data
        this.vtabs = res.data.map(item => item.title)
        this.content = res.data[0]
      })
			// this.vtabs = ['简介', '快速上手', '审核规则', '加入我们', 'FAQ']
			// const contents = [{
			// 		title: '胶州实验自助贴贴墙',
			// 		img: '/cooperate/light/img_banner_3x.png',
			// 		descr: ['胶州实验自助贴贴墙是一个基于 QQ 小程序的发单工具🔧，它可以自动整合订单，提供给管理人员审核发布。',
			// 			'cloud://postwall-4gy7eykl559a475a.706f-postwall-4gy7eykl559a475a-1300413137/1657116879/0.jpg',
			// 			'测试一下'
			// 		]
			// 	},
			// 	{
			// 		title: '快速上手',
			// 		img: '/cooperate/dark/img_banner_3x.png',
			// 		descr: ['没事的时候可以多发发呆。', '上课了就是了开始']
			// 	},
			// 	{
			// 		title: '审核规则',
			// 		img: '/cooperate/light/img_banner_3x.png',
			// 		descr: ['为了规范投稿内容，我们制定了以下规范。',
			// 				'1. 当发送的帖子涉及他人肖像权(图片或视频)，则需要获得图片或视频中人的同意方可发出。',
			// 				'2. 对于涉及广告性质的帖子，不予发布。如果是与学习相关的，如 辅导班、自习室 等可酌情通过。',
			// 				'3. 如果帖子涉及买卖性质，过于贵重的不予发布。如金额较小，可酌情通过，但贴贴墙不对交易负任何责任。',
			// 				'4. 如果帖子会引起争议(引战)及敏感话题，如讨论 饭圈 类问题，不予发布。',
			// 				'5. 如果帖子发布后引起了意料之外的争论等，贴贴墙有权利在不告知您的情况下删除。',
			// 				'6. 如果帖子涉嫌诋毁他人，如骂人、爆料他人囧事等，不予发布。',
			// 				'7. 如果帖子涉嫌诋毁老师、诋毁学校，不予发布。'
			// 				]
			// 	},
			// 	{
			// 		title: '加入我们',
			// 		img: '/cooperate/dark/img_banner_3x.png',
			// 		descr: ['如果你也想服务同学，👏欢迎加入我们。']
			// 	},
			// 	{
			// 		title: 'FAQ',
			// 		img: '/cooperate/light/img_banner_3x.png',
			// 		descr: ['Q：你是谁？\nA：不告诉你']
			// 	}
			// ]
			// this.contents = contents
			// this.content = contents[this.activeTab]
		},
		methods: {
			onTabClick(e) {
				const index = e.index
				this.content = this.contents[index]
			},
			previewImg(event) {
				const index = parseInt(event.target.id);
				console.log(event, index)
				uni.previewImage({
					current: this.content.descr[index],
					urls: [this.content.descr[index]]
				});
			}
		}

	}
</script>

<style>
	page {
		background: #fff;
		font-weight: normal;
	}

	.fui-vtabs-content__item {
		width: 100%;
		/* padding: 0 20rpx; */
		box-sizing: border-box;
		overflow: hidden;
	}

	.fui-img {
		width: 100%;
		height: 268rpx;
		display: block;
		margin-top: 24rpx;
	}

	.fui-content--box {
		width: 100%;
		padding: 30rpx 24rpx 40rpx;
		box-sizing: border-box;
	}

	.fui-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
	}

	.fui-descr {
		display: block;
		font-size: 30rpx;
		padding-top: 24rpx;
	}

	.image-descr {
		display: block;
		padding-top: 24rpx;
		/*  居中*/
		width: 500rpx;
	}
</style>
