<template>
	<view class="fui-wrap">
		<fui-tabs :tabs="tabs" @change="switchToRecently"></fui-tabs>
		<fui-actionsheet :show="actionSheetShow" :itemList="rejectReasons" @click="actionSheetClick"
			@cancel="actionSheetCancel"></fui-actionsheet>
		<fui-swipeaction-group>
			<fui-collapse accordion @change="changeTest">
				<fui-swipe-action v-for="(item, index) in postList" :key="item._id"
					:buttons="isAdmin? (isRecently? adminRecentlyButtons:adminButtons) : userButtons"
					@click="handleSwiperAction" :param="index">
					<fui-collapse-item :index="index">
						<view class="fui-item__box">
							<!-- <image src="/static/images/common/logo.png" class="fui-logo"></image> -->
							<view v-if="isRecently">
								<text v-if="item.post_reject"
									style="color: #FF2B2B">{{ '[' + item.post_type + ']' + item.post_title + " - 拒发原因:" + item.post_reject}}</text>
								<text v-else
									style="color: #09BE4F;">{{ '[' + item.post_type + ']' + item.post_title }}</text>
							</view>
							<view v-else>
								<text>{{ '[' + item.post_type + ']' + item.post_title + " - 已选择 " + selectCounter[index] + "/" + item.image_list.length }}</text>
							</view>
						</view>
						<template v-slot:content>
							<!-- <fui-swiper-dot :items="item.image_list"> -->
							<swiper class="swiper__wrap" circular :indicator-dots="true" :interval="4000"
								:duration="150">
								<swiper-item class="swiper-item" v-for="(image, idx) in item.image_list" :key="idx">
									<!-- <view class="fui-banner__item" :style="{background:item.background}">胶州实验中学贴贴墙</view> -->
									<view>
										<image :src="image" @tap="previewImg" :id="index*10+idx" mode="aspectFit">
										</image>
										<view v-if="isAdmin" class="checkicon__class">
											<fui-icon v-if="!isSelected[index][idx]" name="checkround"
												:params="[index, idx]" :size="50" color="#4F5CFF" @click="selectImg">
											</fui-icon>
											<fui-icon v-else name="checkbox-fill" :params="[index, idx]" :size="50"
												color="#4F5CFF" @click="selectImg"></fui-icon>
										</view>
									</view>
								</swiper-item>
							</swiper>
							<!-- </fui-swiper-dot> -->
						</template>
					</fui-collapse-item>
				</fui-swipe-action>
			</fui-collapse>
		</fui-swipeaction-group>
		<view class="fui-pagination__bd fui-page__spacing">
			<view v-if="allPostList.length !== 0">
				<fui-pagination pageSize="9" :total="allPostList.length" @change="paginationChange">
				</fui-pagination>
			</view>
			<view v-if="allPostList.length !== 0 && isAdmin">
				<view style="display: inline-block;">
					<fui-button type="gray" :margin="['20rpx','43rpx','20rpx','0rpx']" width="300rpx" height="72rpx"
						:size="28" @click="deleteAll">清除当页</fui-button>
				</view>
				<view style="display: inline-block;">
					<fui-button type="primary" :margin="['20rpx','0rpx','20rpx','43rpx']" width="300rpx" height="72rpx"
						:size="28" @click="toQzone">发布选中</fui-button>
				</view>
				<fui-button type="primary" width="686rpx" height="72rpx" :size="28" @click="publishAll">发布所有
				</fui-button>
			</view>
			<view v-if="allPostList.length === 0">
				<fui-empty :src="`/static/admin/img_order_3x.png`" title="暂无订单" marginTop="64"></fui-empty>
			</view>
		</view>
		<fui-footer :navigate="navigate" text="Copyright © 2021-2022 胶州实验自助贴贴墙"></fui-footer>
	</view>
</template>

<script>
	//index.js
	//获取应用实例
	const app = getApp();
	export default {
		data() {
			return {
				userInfo: {},
				isAdmin: '',
				userOpenid: '',
				appInstance: app,
				isRecently: false,
				hasUserInfo: false,
				canIUse: uni.canIUse('button.open-type.getUserInfo'),
				rejectReasons: ['政治', '色情', '侮辱他人', '暴力、辱骂他人', '未经允许使用他人照片', '重复'],
				forbiddenArray: [],
				postList: [],
				allPostList: [],
				allPostNum: 0,
				rejectIndex: 0,
				nowPagesNum: 0,
				photoArray: new Array(10).fill('').map(() => new Array(10).fill('')),
				selectCounter: new Array(10).fill(0),
				// true is selected
				isSelected: new Array(10).fill(false).map(() => new Array(10).fill(false)),
				image: '',
				navigate: [{
					text: '隐私说明',
					openType: 'navigate',
					url: '/pages/privacy/privacy'
				}, {
					text: '使用说明',
					openType: 'navigate',
					url: "/pages/declaration/declaration"
				}],
				tabs: ['等待发布', '近期发布'],
				adminButtons: [{
					//按钮文本
					text: '拒绝',
					//按钮字体大小，可选
					size: 32,
					//按钮字体颜色，可选
					color: '#fff',
					//按钮背景色
					background: '#FF2B2B'
				}, {
					//按钮文本
					text: '清除',
					//按钮字体大小，可选
					size: 32,
					//按钮字体颜色，可选
					color: '#fff',
					//按钮背景色
					background: '#465CFF'
				}],
				adminRecentlyButtons: [{
					//按钮文本
					text: '恢复',
					//按钮字体大小，可选
					size: 32,
					//按钮字体颜色，可选
					color: '#fff',
					//按钮背景色
					background: '#465CFF'
				}],
				userButtons: [{
					//按钮文本
					text: '清除',
					//按钮字体大小，可选
					size: 32,
					//按钮字体颜色，可选
					color: '#fff',
					//按钮背景色
					background: '#465CFF'
				}],
				actionSheetShow: false
			};
		},
		onShareAppMessage() {
			// return custom share data when user share.
		},
		onLoad() {
			this.getRejectArray();
			this.getForbiddenArray();
		},
		onShow() {
			// Hide red dot on admin page
			uni.hideTabBarRedDot({
				index: 1
			}); // If allPostList has changed, refresh

			this.isPostListChanged()
				.then((res) => {
					console.log('Post list changed res', res);

					if (res) {
						this.refresh(true);
					}
				})
				.catch((error) => {
					console.error('onShow function check refresh error,', error);
				});
		},
		onPullDownRefresh(options) {
			this.refresh(true);
		},
		methods: {
			changeTest(event) {
				console.log(event)
			},
			async loadDatabase() {
				uni.showLoading({
					title: '正在加载订单',
					mask: true
				});
				let functionName = this.isAdmin === true ? 'adminGetdb' : 'Getdb';
				let isRecently = this.isRecently;
				let queryCondition = '';

				if (isRecently) {
					queryCondition = {
						user_openid: this.userOpenid,
						reverse: true
					};
				} else {
					queryCondition = {
						user_openid: this.userOpenid
					};
				}

				return await qq.cloud
					.callFunction({
						name: functionName,
						data: queryCondition
					})
					.then((res) => {
						if (this.isAdmin === true) {
							this.allPostList = res.result.data;
							this.allPostNum = res.result.data.length;
						} else {
							// 筛选出 post_done 为 false 的
							if (!this.isRecently) {
								this.allPostList = res.result.data.filter((item) => {
									return item.post_done === false;
								});
								this.allPostNum = this.allPostList.length;
							} else {
								this.allPostList = res.result.data.filter((item) => {
									return item.post_done === true;
								});
								this.allPostNum = this.allPostList.length;
							}
						}
					});
			},

			async loadPostList(isReload) {
				if (isReload) {
					await this.loadDatabase();
				} // Set postList

				const nowPostNum = this.nowPagesNum * 9;
				let tempList = this.allPostList.slice(nowPostNum, Math.min(nowPostNum + 9, this.allPostList.length));

				for (let i = 0; i < tempList.length; i++) {
					tempList[i].open = false;

					if (!tempList[i].post_reject) {
						tempList[i].post_reject = false;
					}
				}

				this.setData({
					postList: tempList
				}); // Download image files in cloud

				let tasks = [];

				for (let i = 0; i < this.postList.length; i++) {
					let imageList = this.postList[i].image_list;

					for (let j = 0; j < imageList.length; j++) {
						let task = qq.cloud
							.downloadFile({
								fileID: this.postList[i].image_list[j]
							})
							.then((res) => {
								this.photoArray[i][j] = res.tempFilePath;
							});
						tasks.push(task);
					}
				}

				return await Promise.all(tasks)
					.then((responses) => {
						uni.hideLoading();
					})
					.catch((error) => {
						console.log('Load orders error, maybe download files error, error msg: ', error);
						uni.hideLoading();
					});
			},

			// Async to update userOpenid and isAdmin info
			async updateUserStatus() {
				// 多层 Promise 最终只 await 最外层的 Promise 即可
				return await qq.cloud
					.callFunction({
						name: 'getOpenid'
					})
					.then((res) => {
						console.log('Get openid res', res);
						this.userOpenid = res.result.openid;
						const db = qq.cloud.database(); // return important!!!!

						return db
							.collection('adminList')
							.get()
							.then((res) => {
								let adminList = res.data;
								console.log('adminList is ', adminList);
								this.isAdmin = false;

								for (let i = 0; i < adminList.length; i++) {
									if (adminList[i].open_id === this.userOpenid) {
										this.isAdmin = true;
										break;
									}
								}

								console.log('The user isAdmin is ', this.isAdmin);
								console.log('The user openid is ', this.userOpenid);
								this.setData({
									isAdmin: this.isAdmin,
									userOpenid: this.userOpenid
								});
							});
					})
					.catch((error) => {
						console.error('updateUserStatus error, ', error);
					});
			},

			async isPostListChanged() {
				let isDelta = false; // await to make sure update isDelta

				await this.updateUserStatus().then((res) => {
					let functionName = this.isAdmin === true ? 'adminGetdb' : 'Getdb';
					let isRecently = this.isRecently;
					let queryCondition = '';

					if (isRecently) {
						queryCondition = {
							user_openid: this.userOpenid,
							reverse: true
						};
					} else {
						queryCondition = {
							user_openid: this.userOpenid
						};
					}

					return qq.cloud
						.callFunction({
							name: functionName,
							data: queryCondition
						})
						.then((res) => {
							let newLength = 0;
							let oldLength = 0;

							for (let i = 0; i < res.result.data.length; i++) {
								newLength += res.result.data[i].image_list.length;
							}

							for (let i = 0; i < this.allPostList.length; i++) {
								oldLength += this.allPostList[i].image_list.length;
							}

							if (!this.allPostList || newLength !== oldLength || res.result.data.length !==
								this.allPostList.length) {
								isDelta = true;
							}
						})
						.catch((error) => {
							console.error('isPostList function error, ', error);
						});
				});
				console.log('isDelta is ', isDelta);
				return isDelta;
			},

			refresh(isReload) {
				if (isReload) {
					this.nowPagesNum = 0;
				}

				this.getRejectArray();
				this.getForbiddenArray();
				this.setData({
					photoArray: new Array(10).fill('').map(() => new Array(10).fill('')),
					selectCounter: new Array(10).fill(0),
					isSelected: new Array(10).fill(false).map(() => new Array(10).fill(false))
				});
				this.loadPostList(isReload)
					.then(() => {
						uni.stopPullDownRefresh({
							success: (res) => {
								if (isReload) {
									uni.showToast({
										title: '刷新成功',
										icon: 'success',
										duration: 500
									});
								}
							}
						});
					})
					.catch((error) => {
						console.log('Refresh error, ', error);
						uni.stopPullDownRefresh({
							success: (res) => {
								if (isReload) {
									uni.showToast({
										title: '刷新异常',
										icon: 'none',
										duration: 500
									});
								}
							}
						});
					});
			},

			getUserInfo: function(e) {
				console.log(e);
				app.globalData.userInfo = e.detail.userInfo;
				this.setData({
					userInfo: e.detail.userInfo,
					hasUserInfo: true
				});
			},

			previewImg(e) {
				const id = parseInt(e.target.id);
				const postIndex = parseInt(id / 10);
				const imageIndex = id % 10;
				console.log(e, id, postIndex, imageIndex)
				uni.previewImage({
					current: this.postList[postIndex].image_list[imageIndex],
					urls: this.postList[postIndex].image_list
				});
			},

			kindToggle(e) {
				const postId = e.currentTarget.id;
				const id = e.target.dataset.id;
				const postList = this.postList;
				const post = postList[id];

				if (post.post_reject && !post.notify_count && !this.isRecently) {
					post.notify_count = true;
					let rejectContent = '您的订单由于涉及 ' + post.post_reject + ' 等原因被拒绝发送，请修改后重新提交。\n\n您是否需要删除该订单？您也可以通过左滑删除订单。';
					uni.showModal({
						title: '订单已被拒发',
						content: rejectContent,
						cancelText: '否',
						confirmText: '是',
						success: (res) => {
							if (res.confirm) {
								this.deleteOnePost(id);
							}
						}
					});
				} else {
					for (let i = 0, len = postList.length; i < len; ++i) {
						if (postList[i]._id === postId) {
							postList[i].open = !postList[i].open;
						} else {
							postList[i].open = false;
						}
					}
				}

				this.setData({
					postList: postList
				});
			},

			selectImg(event) {
				const postIndex = event.params[0]
				const imageIndex = event.params[1]
				console.log(postIndex, imageIndex)
				let isSelected = this.isSelected;
				let selectCounter = this.selectCounter;
				isSelected[postIndex][imageIndex] = !isSelected[postIndex][imageIndex];
				if (isSelected[postIndex][imageIndex] === true) {
					selectCounter[postIndex]++;
				} else {
					selectCounter[postIndex]--;
				}

				this.setData({
					isSelected: isSelected,
					selectCounter: selectCounter
				});
			},

			toQzone() {
				let medias = [];
				const isSelected = this.isSelected;
				let now_index = 1;
				let next_index = 0;
				let post_detail = '';

				for (let i = 0; i < isSelected.length; i++) {
					for (let j = 0; j < isSelected[i].length; j++) {
						if (isSelected[i][j]) {
							medias.push({
								type: 'photo',
								path: this.photoArray[i][j]
							});
						}
					}
				}

				for (let i = 0; i < this.selectCounter.length; i++) {
					if (this.selectCounter[i] !== 0) {
						next_index = now_index + this.selectCounter[i] - 1;

						if (this.selectCounter[i] !== 1) {
							post_detail += 'P' + now_index + '-' + next_index + ':[' + this.postList[i].post_type + ']' +
								this.postList[i].post_title + '\n';
							now_index = next_index + 1;
						} else {
							post_detail += 'P' + now_index + ':[' + this.postList[i].post_type + ']' + this.postList[i]
								.post_title + '\n';
							now_index = next_index + 1;
						}
					}
				}

				uni.openQzonePublish({
					footnote: '胶州实高自助贴贴墙',
					path: 'pages/index/index',
					text: post_detail,
					media: medias
				});
				this.setData({
					selectCounter: new Array(10).fill(0),
					isSelected: new Array(10).fill(false).map(() => new Array(10).fill(false))
				});
			},

			/**
			 * 显示删除按钮
			 */
			showDeleteButton: function(e) {
				let productIndex = e.currentTarget.dataset.productindex;

				for (let i = 0; i < this.postList.length; i++) {
					if (i !== parseInt(productIndex)) {
						this.setXmove(i, 0);
					}
				}

				if (this.isRecently) {
					this.setXmove(productIndex, -65);
				} else {
					this.setXmove(productIndex, -130);
				}
			},

			/**
			 * 隐藏删除按钮
			 */
			hideDeleteButton: function(e) {
				let productIndex = e.currentTarget.dataset.productindex;
				this.setXmove(productIndex, 0);
			},

			/**
			 * 设置movable-view位移
			 */
			setXmove: function(productIndex, xmove) {
				let postList = this.postList;
				postList[productIndex].xmove = xmove;
				this.setData({
					postList: postList
				});
			},

			/**
			 * 处理movable-view移动事件
			 */
			handleMovableChange: function(e) {
				//  if (e.detail.source === 'friction') {
				//      if (this.data.isRecently) {
				//          if (e.detail.x < -50) {
				//              this.showDeleteButton(e)
				//          } else {
				//              this.hideDeleteButton(e)
				//          }
				//      } else {
				//          if (e.detail.x < -100) {
				//              this.showDeleteButton(e)
				//          } else {
				//              this.hideDeleteButton(e)
				//          }
				//      }
				//  } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
				//      this.hideDeleteButton(e)
				//  }
			},

			/**
			 * 处理touchstart事件
			 */
			handleTouchStart(e) {
				this.startX = e.touches[0].pageX;
			},

			/**
			 * 处理touchend事件
			 */
			handleTouchEnd(e) {
				let threshold = 0;

				if (this.isRecently) {
					threshold = -30;
				} else {
					threshold = -60;
				}

				if (e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= threshold) {
					this.showDeleteButton(e);
				} else {
					this.hideDeleteButton(e);
				}
			},

			/**
			 * 删除产品
			 */
			handleDeletePost: function({
				currentTarget: {
					dataset: {
						id
					}
				}
			}) {
				this.deleteOnePost(id);
			},

			handleRejectPost: function({
				currentTarget: {
					dataset: {
						id
					}
				}
			}) {
				this.rejectOnePost(id);
			},

			handleRecoverPost: function({
				currentTarget: {
					dataset: {
						id
					}
				}
			}) {
				this.recoverOnePost(id);
			},
			handleSwiperAction(event) {
				console.log(event)
				if (this.isAdmin) {
					if (this.isRecently) {
						this.recoverOnePost(event)
					} else {
						if (event.index === 0) {
							this.rejectOnePost(event);
						} else {
							this.deleteOnePost(event);
						}
					}
				} else {
					this.deleteOnePost(event);
				}
			},
			// Update database when delete a post
			deleteOnePost(event) {
				const postIndex = event.param;
				const db = qq.cloud.database();
				const isAdmin = this.isAdmin;
				const userOpenid = this.userOpenid;
				let post = this.postList[postIndex]; // Admin delete is different

				if (isAdmin === true && post.post_user_openid !== userOpenid) {
					db.collection('postwall')
						.doc(post._id)
						.update({
							data: {
								post_done: true,
								post_reject: false
							}
						})
						.then((res) => {
							uni.showToast({
								title: '删除成功',
								icon: 'success',
								duration: 500
							});
						});
				} else {
					db.collection('postwall')
						.doc(post._id)
						.update({
							data: {
								post_done: true,
								post_user_done: true
							}
						})
						.then((res) => {
							uni.showToast({
								title: '删除成功',
								icon: 'success',
								duration: 500
							});
						});
				}

				this.deleteAndUpdatePage(postIndex);
			},
			actionSheetClick(event) {
				const reason = event.text;
				let postIndex = this.rejectIndex;
				let post = this.postList[postIndex]
				const db = qq.cloud.database();
				if (this.isAdmin === true) {
					db.collection('postwall')
						.doc(post._id)
						.update({
							data: {
								post_done: true,
								post_reject: reason
							}
						})
						.then(result => {
							let hasReject = false
							let updateForbidden = async () => {
								for (let i = 0; i < this.forbiddenArray.length; i++) {
									if (this.forbiddenArray[i].open_id === post.post_user_openid) {
										this.forbiddenArray[i].count += 1
										hasReject = true
										return db.collection("forbiddenList").doc(this.forbiddenArray[i]
											._id).update({
											data: {
												count: this.forbiddenArray[i].count,
												posts: this.forbiddenArray[i].posts.concat(post
													._id),
												reasons: this.forbiddenArray[i].reasons.concat(reason)
											}
										})
									}
								}
							}
							return updateForbidden().then(result => {
								if (hasReject === false) {
									return db.collection("forbiddenList").add({
										data: {
											open_id: post.post_user_openid,
											count: 1,
											posts: [post._id],
											reasons: [reason]
										}
									})
								}
							});
						})
						.then((res) => {
							this.getForbiddenArray();
							uni.showToast({
								title: '拒发成功',
								icon: 'success',
								duration: 500
							});
						});
				} else {
					uni.showModal({
						title: '权限错误',
						content: '你没有权限进行此操作',
						showCancel: false
					});
				}

				this.deleteAndUpdatePage(postIndex);
				this.actionSheetShow = false;
			},
			actionSheetCancel(event) {
				this.actionSheetShow = false;
			},
			rejectOnePost(event) {
				const postIndex = event.param;
				this.rejectIndex = postIndex;
				const isAdmin = this.isAdmin;
				let post = this.postList[postIndex];
				this.actionSheetShow = true;
			},
			recoverOnePost(event) {
				const postIndex = event.param;
				const db = qq.cloud.database();
				const isAdmin = this.isAdmin;
				const userOpenid = this.userOpenid;
				let post = this.postList[postIndex];

				if (isAdmin === true) {
					db.collection('postwall')
						.doc(post._id)
						.update({
							data: {
								post_done: false,
								post_reject: false
							}
						}).then((res) => {
							if (post.post_reject) {
								for (let i = 0; i < this.forbiddenArray.length; i++) {
									if (this.forbiddenArray[i].open_id === post.post_user_openid) {
										this.forbiddenArray[i].count -= 1
										// 查找等于post._id的元素的下标
										let index = this.forbiddenArray[i].posts.indexOf(post._id)
										this.forbiddenArray[i].posts.splice(index, 1)
										this.forbiddenArray[i].reasons.splice(index, 1)
										return db.collection("forbiddenList").doc(this.forbiddenArray[i]._id)
											.update({
												data: {
													count: this.forbiddenArray[i].count,
													// 去掉特定下标元素
													posts: this.forbiddenArray[i].posts,
													reasons: this.forbiddenArray[i].reasons
												}
											})
									}
								}
							}
						}).then(res => {
							this.getForbiddenArray()
							uni.showToast({
								title: '恢复成功',
								icon: 'success',
								duration: 500
							});
						});
				} else {
					uni.showModal({
						title: '权限错误',
						content: '你没有权限进行此操作',
						showCancel: false
					});
				}

				this.deleteAndUpdatePage(postIndex);
			},

			deleteAndUpdatePage(id) {
				let postList = this.postList;
				postList.splice(id, 1);
				this.photoArray.splice(id, 1);
				this.selectCounter.splice(id, 1);
				this.isSelected.splice(id, 1);
				this.setData({
					postList: postList,
					selectCounter: this.selectCounter,
					photoArray: this.photoArray,
					isSelected: this.isSelected
				});
				this.setData({
					allPostNum: this.allPostNum - 1
				});
			},

			getRejectArray() {
				qq.cloud
					.callFunction({
						name: 'getTypeArray',
						data: {
							reject: true
						}
					})
					.then((res) => {
						this.setData({
							rejectReasons: res.result.data[0].rejectlist
						});
					});
			},
			getForbiddenArray() {
				qq.cloud.callFunction({
					name: "getForbiddenArray",
				}).then(res => {
					this.setData({
						forbiddenArray: res.result.data
					})
				})
			},
			publishAll() {
				for (let i = 0; i < this.postList.length; i++) {
					let data_ = this.postList[i];

					for (let j = 0; j < data_.image_list.length; j++) {
						if (!this.isSelected[i][j]) {
							this.isSelected[i][j] = true;
							this.selectCounter[i]++;
						}
					}
				}

				this.toQzone();
			},

			deleteAll() {
				let postList = this.postList;
				const isAdmin = this.isAdmin;
				const userOpenid = this.userOpenid;
				const db = qq.cloud.database();
				let deleteTasks = [];

				for (let i = 0; i < postList.length; i++) {
					let post = postList[i];

					if (isAdmin && post.post_user_openid !== userOpenid) {
						let task = db
							.collection('postwall')
							.doc(post._id)
							.update({
								data: {
									post_done: true
								}
							})
							.then((res) => {
								postList.splice(i, 1);
							})
							.catch((error) => {
								console.error(error);
							});
						deleteTasks.push(task);
					} else {
						let task = db
							.collection('postwall')
							.doc(post._id)
							.update({
								data: {
									post_done: true,
									post_user_done: true
								}
							})
							.then((res) => {
								postList.splice(i, 1);
							})
							.catch((error) => {
								console.error(error);
							});
						deleteTasks.push(task);
					}
				}

				Promise.all(deleteTasks)
					.then((responses) => {
						console.log('Delete all products.', responses);
						uni.showToast({
							title: '删除成功',
							icon: 'success',
							duration: 500
						});
					})
					.catch((error) => {
						console.error('Delete product error!', error);
						uni.showToast({
							title: '删除失败',
							icon: 'none',
							duration: 500
						});
					});
				this.setData({
					postList: postList
				}); // TODO: not refresh

				this.refresh(true);
			},

			switchToRecently() {
				this.setData({
					isRecently: !this.isRecently
				});
				console.log('Switch to recently is', this.isRecently);
				this.refresh(true);
			},

			paginationChange(event) {
				let type = event.type
				console.log("Event: ", event)
				console.log("Type: ", type)
				switch (type) {
					case 'prev':
						this.prePage();
						break;
					case 'next':
						this.nextPage();
						break;
					default:
						break;
				}
			},

			prePage() {
				if (this.nowPagesNum > 0) {
					this.nowPagesNum = this.nowPagesNum - 1;
					this.refresh(false);
				} else {
					uni.showToast({
						title: '已经是第一页了',
						icon: 'none',
						duration: 500
					});
				}
			},

			nextPage() {
				const nowPostNum = this.nowPagesNum * 9;

				if (nowPostNum + 9 >= this.allPostNum) {
					uni.showToast({
						title: '没有更多订单了',
						icon: 'none',
						duration: 500
					});
				} else {
					this.nowPagesNum = this.nowPagesNum + 1;
					this.refresh(false);
				}
			}
		}
	};
</script>
<style>
	page {
		background-color: #f5f6fa !important;
	}
	
	.fui-item__box {
		width: 100%;
		padding: 26rpx 32rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.fui-logo {
		width: 48rpx;
		height: 48rpx;
		margin-right: 24rpx;
		display: block;
	}

	.fui-descr {
		width: 100%;
		padding: 32rpx;
		font-size: 28rpx;
		line-height: 52rpx;
		color: #7F7F7F;
		word-break: break-all;
		box-sizing: border-box;
	}

	.fui-pagination__bd {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		padding-bottom: 32rpx;
		padding-top: 32rpx;
	}

	.swiper__wrap {
		height: 500rpx;
	}

	.swiper-item {
		/* 居中 */
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.checkicon__class {
		position: absolute;
		margin: 0 0 0 -170rpx;
		display: inline-block;
	}
</style>
