<template>
    <view class="fui-page_bd">
        <!-- 		<fui-swiper-dot :items="items" :current="current">
          <swiper class="fui-banner__wrap" @change="swiperChange" circular :indicator-dots="false" autoplay
            :interval="4000" :duration="150">
            <swiper-item v-for="(item,index) in items" :key="index">
              <view class="fui-banner__item" :style="{background:item.background}">胶州实验中学贴贴墙</view>
            </swiper-item>
          </swiper>
        </fui-swiper-dot> -->
        <view :class="{'fui-notice__pt':noticeShow}">
            <fui-swiper-dot :items="items" :current="current">
                <swiper previous-margin="60rpx" next-margin="60rpx" class="fui-banner__box" @change="swiperChange"
                        circular :indicator-dots="false" autoplay :interval="5000" :duration="150">
                    <swiper-item v-for="(item, index) in items" :key="index">
                        <!-- <view class="fui-banner__cell" :class="{'fui-item__scale':current!==index}"
                          :style="{background:item.img}">{{ item.desc }}</view> -->
                        <image class="fui-banner__cell" :class="{'fui-item__scale':current!==index}" :src="item.image"
                               mode="aspectFill"></image>
                    </swiper-item>
                </swiper>
            </fui-swiper-dot>
        </view>
        <view class="fui-section__title">投稿类型*</view>
        <view style="margin-left: 32rpx;">
            <fui-data-tag :options="postTypeArray" v-model="postType" activeColor="#465CFF" borderColor="#465CFF" mark
                          radius="12" markColor="#465CFF" size="26"></fui-data-tag>
        </view>
        <view class="fui-section__title">投稿标题*</view>
        <!--        <fui-input required clearable placeholder="不多于六个字" radius="100rpx" v-model="postTitle" @input="finishTitle">-->
        <fui-input required clearable placeholder="不多于六个字" radius="100rpx" maxlength="6" v-model="postTitle">
        </fui-input>
        <view class="fui-section__title">内容文本*</view>
        <fui-textarea required isCounter autoHeight maxlength="-1" placeholder="请勿包含暴力，辱骂等限流内容，字数不限。"
                      minHeight="180rpx"
                      v-model="postText"></fui-textarea>
        <view class="fui-section__title">选择图片（点击图片可预览）</view>
        <view class="upload__spacing">
            <fui-upload background="#333" addColor="#d1d1d1" :fileList="imageList" ref="upload"></fui-upload>
        </view>
        <view class="fui-section__title">联系方式</view>
        <fui-input v-model="postContactQQ" placeholder="请输入QQ号">
            <template v-slot:left>
                <view class="fui-left__icon">
                    <fui-icon name="qq" color="#333" :size="48"></fui-icon>
                </view>
            </template>
        </fui-input>
        <fui-input v-model="postContactWechat" placeholder="请输入微信号">
            <template v-slot:left>
                <view class="fui-left__icon">
                    <fui-icon name="wechat" color="#333" :size="48"></fui-icon>
                </view>
            </template>
        </fui-input>
        <fui-input v-model="postContactPhone" placeholder="请输入手机号">
            <template v-slot:left>
                <view class="fui-left__icon">
                    <fui-icon name="mobile" color="#333" :size="48"></fui-icon>
                </view>
            </template>
        </fui-input>
        <view class="fui-page__spacing" style="margin-top: 32rpx;">
            <fui-button type="primary" radius="96rpx" :margin="['0', '0', '20rpx', '0']" @click="bindSubmit">提交
            </fui-button>
            <fui-button type="success" radius="96rpx" @click="querySchool">查看或绑定学校</fui-button>
        </view>
        <fui-footer :navigate="navigate" text="Copyright © 2021-2023 自助贴贴墙"></fui-footer>
        <!--顶部固定-->
        <view class="fui-notice__fixed" v-if="noticeShow">
            <fui-notice-bar :content="noticeStr" background="#fff8d5" color="#FF2B2B" scrollable>
                <view class="fui-icon__box">
                    <fui-icon name="notice" :size="36" color="#FF2B2B"></fui-icon>
                </view>
                <template v-slot:right>
                    <view class="fui-more__wrap" @tap.stop="closeNotice">
                        <fui-icon name="close" :size="40" color="#FF2B2B"></fui-icon>
                    </view>
                </template>
            </fui-notice-bar>
        </view>
        <fui-select :show="schoolSelectorShow" :options="schoolItems" title="请选择平台"
                    @confirm="schoolSelectorConfirm" @cancel="schoolSelectorCancel"></fui-select>
    </view>
</template>

<script>
// index.js
const sourceType = [
    ['camera'],
    ['album'],
    ['camera', 'album']
];
const sizeType = [
    ['compressed'],
    ['original'],
    ['compressed', 'original']
];
const app = getApp();
export default {
    data() {
        return {
            imageList: [],
            isAdmin: '',
            userOpenid: '',
            appInstance: app,
            postTypeArray: ['提问', '吐槽', '表白', '寻物', '寻人'],
            bannedUsers: [],
            chosenTypeIndex: 0,
            lastSubmitTime: 0,
            submitList: [],
            postType: '提问',
            postTitle: '',
            postText: '',
            postContactQQ: '',
            postContactWechat: '',
            postContactPhone: '',
            image: '',
            navigate: [{
                text: '隐私说明',
                openType: 'navigate',
                url: '/pages/privacy/privacy'
            }, {
                text: '使用说明',
                openType: 'navigate',
                url: "/pages/intro/intro"
            }],
            current: 0,
            items: [{
                background: '#09BE4F',
                desc: '清空请下拉刷新！',
                image: 'cloud://postwall-4gy7eykl559a475a.706f-postwall-4gy7eykl559a475a-1300413137/banner/2EA9869F2BF5428EB764F57260960751.png'
            }, {
                background: '#FFB703',
                desc: '可在查看订单页面取消订单～',
                image: 'cloud://postwall-4gy7eykl559a475a.706f-postwall-4gy7eykl559a475a-1300413137/banner/973FF51735EF93BBB37B3A4517F95922.png'
            }, {
                background: '#B2B2B2',
                desc: '欢迎加入我们！',
                image: 'cloud://postwall-4gy7eykl559a475a.706f-postwall-4gy7eykl559a475a-1300413137/banner/BDFFBACD8C9D6651B62C7AB705862A5C.png'
            },],
            noticeShow: false,
            noticeStr: "",
            schoolSelectorShow: false,
            schoolItems: []
        };
    },
    onShareAppMessage() {
        // return custom share data when user share.
    },
    async onLoad(options) {
        // Do some initialize when page load.
        console.log("Page loaded.")
        // Init token and isAdmin
        let school = options.school || null;
        console.log("Options is:", options)
        console.log("Options School is:", school)
        await app.login(school).then(res => {
            this.isAdmin = res.isAdmin;
            this.token = res.token;
            this.school = res.school;
            console.log("school is", this.school)
            this.schoolName = res.schoolName;
            // Log
            console.log("Login success.", res);
        }).catch(err => {
            console.error("Login failed.", err);
            uni.showModal({
                title: '登陆失败',
                content: err + "，点击确认查看指引。",
                showCancel: true,
                success: (res) => {
                    if (res.confirm) {
                        uni.navigateTo({
                            url: '/pages/intro/intro'
                        });
                    }
                }
            });
        });
        // Checkup update
        this.checkUpdates();
        // Setup share menu
        uni.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        });
        // Get post types
        this.getAvailableTypes();
        // Get Notice
        this.getNotice();
        // Get banner
        this.getBanner();
        // Get isBanned
        this.getIsBanned();

        // Delete abundant images
        this.deleteAbundantFiles()
        // Get schools
        this.getSchools()
    },
    onReady() {
        // Do something when page ready.
        console.log("Page ready.")
    },
    onShow() {
        // Do something when page show.
        console.log("Page show.")
    },
    onHide() {
        // Do something when page hide.
        console.log("Page hide.")
    },
    onUnload() {
        // Do something when page close.
        console.log("Page unload.")
    },
    onPullDownRefresh() {
        this.refresh();
        uni.stopPullDownRefresh({
            success: (res) => {
                uni.showToast({
                    title: '页面已刷新',
                    icon: 'success',
                    duration: 500
                });
            }
        });
    },
    methods: {
        schoolSelectorConfirm(event) {
            console.log("this is admin", this.isAdmin)
            if (this.isAdmin) {
                uni.showModal({
                    title: '管理员模式',
                    content: '管理员模式下无法切换学校',
                    showCancel: false,
                });
                this.schoolSelectorShow = false;
                return;
            }
            if (event.index === -1) {
                uni.showToast({
                    title: '请至少选择一个选择学校',
                    icon: 'none',
                    duration: 1000
                });
                return;
            } else {
                let school = this.schoolItems[event.index].school;
                if (school === this.school) {
                    uni.showToast({
                        title: '已经在该学校了',
                        icon: 'none',
                        duration: 1000
                    });
                    this.schoolSelectorShow = false;
                    return;
                }
                console.log("School is", school)
                this.http.post("/users/bindSchool", {
                    data: {
                        school: school
                    }
                }).then((res) => {
                        console.log("Bind school success.", res);
                        if (res.statusCode === 200) {
                            uni.showToast({
                                title: '切换成功，当前学校为' + this.schoolItems[event.index].text,
                                icon: 'success',
                                duration: 1000
                            });
                            this.school = school;
                            this.schoolName = this.schoolItems[event.index].text;
                            uni.setStorageSync("school", school);
                            // this.refresh();
                        } else {
                            throw res.data.msg;
                        }
                    })
                    .catch(err => {
                        console.error("Bind school failed.", err);
                        uni.showToast({
                            title: '切换失败',
                            icon: 'none',
                            duration: 1000
                        });
                    })
            }
            this.schoolSelectorShow = false;
        },
        schoolSelectorCancel(event) {
            console.log("Event is ", event)
            this.schoolSelectorShow = false;
        },
        getSchools() {
            let items = []
            this.http.get("/config/schools")
                .then((res) => {
                    console.log("Get schools success.", res);
                    if (res.statusCode === 200) {
                        let data = res.data.data;
                        let tasks = []
                        for (let i = 0; i < data.length; i++) {
                            let dataItem = data[i];
                            let task = this.http.post("/file/download/url", {
                                data: {
                                    key: dataItem.logo
                                }
                            }).then((res) => {
                                if (res.statusCode === 200) {
                                    return uni.downloadFile({
                                        url: res.data.data,
                                    }).then((res) => {
                                        items.push({
                                            school: dataItem.school,
                                            text: dataItem.schoolName,
                                            src: res.tempFilePath,
                                            checked: dataItem.schoolName === this.schoolName
                                        })
                                    })
                                } else {
                                    throw "获取学校失败";
                                }
                            })
                            tasks.push(task)
                        }
                        Promise.all(tasks).then(() => {
                            this.schoolItems = items;
                        })
                    } else {
                        throw "获取学校失败";
                    }
                }).catch(err => {
                console.error("Get schools failed.", err);
                uni.showToast({
                    title: '获取学校失败',
                    icon: 'none',
                    duration: 1000
                });
            })
        },
        getIsBanned() {
            this.http.get("/users/isBanned").then(res => {
                console.log("Get isBanned success.", res);
                if (res.statusCode === 200) {
                    this.isBanned = res.data.data;
                }
            })
        },
        querySchool() {
            let items = this.schoolItems
            if (!this.school) {
                uni.showToast({
                    title: '当前未绑定学校',
                    icon: 'none',
                    duration: 1000
                });
            } else {
                uni.showToast({
                    title: '当前学校为：' + this.schoolName,
                    icon: 'none',
                    duration: 1000
                });
            }
            this.schoolSelectorShow = true

        },
        getNotice() {
            this.http.get("/config/notice").then(res => {
                console.log("Get notice success.", res);
                if (res.statusCode === 200 && res.data.data !== "") {
                    this.noticeShow = true;
                    this.noticeStr = res.data.data;
                }
            })
        },
        getBanner() {
            this.http.get("/file/banners").then(res => {
                console.log("Get banner success.", res);
                if (res.data.data.length !== 0) {
                    let newItems = []
                    let banners = res.data.data
                    for (let i = 0; i < banners.length; i++) {
                        this.http.post("/file/download/url", {
                            data: {
                                key: banners[i]
                            }
                        }).then(res => {
                            console.log("Get banner url success.", res);
                            uni.downloadFile({
                                url: res.data.data,
                                success: (res) => {
                                    if (res.statusCode === 200) {
                                        newItems.push({
                                            background: '#B2B2B2',
                                            desc: '欢迎加入我们！',
                                            image: res.tempFilePath
                                        })
                                        if (newItems.length === banners.length) {
                                            this.items = newItems
                                        }
                                    }
                                }
                            })
                        })
                    }
                }
            }).catch(err => {
                console.error("Get banner failed.", err);
            })
        },
        deleteAbundantFiles() {
            let fs = uni.getFileSystemManager();
            fs.readdir({
                dirPath: `${uni.env.USER_DATA_PATH}`,
                success: (res) => {
                    res.files.forEach((file) => {
                        if (file.slice(-3) === 'png') {
                            fs.unlink({
                                filePath: uni.env.USER_DATA_PATH + '/' + file,
                                success: (res) => {
                                    console.log("Delete file ", file, "success.", res)
                                },
                                fail: (res) => {
                                    console.error(res);
                                }
                            });
                        }
                    });
                }
            });
        },
        checkUpdates() {
            const updateManager = uni.getUpdateManager();
            updateManager.onUpdateReady(function () {
                uni.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用加载？',
                    success(res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate();
                        }
                    }
                });
            });
            updateManager.onUpdateFailed(function () {
                console.error('新版本更新失败。');
                uni.showToast({
                    title: '新版本更新失败',
                    icon: 'none',
                    duration: 500
                });
            });

        },
        closeNotice() {
            this.noticeShow = false;
        },
        swiperChange(e) {
            this.current = e.detail.current;
        },
        getAvailableTypes() {
            this.http.get('/config/postTypes').then(res => {
                this.postTypeArray = res.data.data;
            }).catch(err => {
                console.error(err);
            })
        },
        refresh() {
            const imageList = this.imageList;
            const submitList = this.submitList;
            imageList.splice(0, imageList.length);
            submitList.splice(0, submitList.length);
            this.$refs.upload.urls = imageList
            this.getAvailableTypes();
            this.setData({
                postType: '提问',
                postTitle: '',
                postText: '',
                postContactQQ: '',
                postContactWechat: '',
                postContactPhone: '',
                imageList: imageList,
                submitList: submitList
            });

            // Get Notice
            this.getNotice();
            // Get banner
            this.getBanner();
            // Get isBanned
            this.getIsBanned();
        },

        async uploadFilesToCOS() {
            const timestamp = new Date().getTime();
            let fs = uni.getFileSystemManager();
            let imageList = this.imageList;
            let submitList = this.submitList;
            let uploadTasks = [];

            for (let i = 0; i < imageList.length; i++) {
                let task = this.http.post("/file/upload/url", {
                    data: {
                        fileName: i + imageList[i].slice(-4),
                        folder: timestamp
                    }
                }).then(res => {
                    let url = res.data.data.url;
                    let key = res.data.data.key;
                    submitList.push(key);
                    return uni.request({
                        url: url,
                        method: 'PUT',
                        data: fs.readFileSync(imageList[i]),
                    })
                }).catch(err => {
                    console.error(err);
                })
                uploadTasks.push(task);
            }

            return await Promise.all(uploadTasks).then((responses) => {
                console.log('uploadTasks responses is ', responses);
            });
        },
        /**
         * @brief submit a post
         * @param event the event
         * @param action 0 is formsubmit, 1 is blur submit
         */
        async submitPost(event) {
            if (!this.school) {
                uni.showToast({
                    title: '请先绑定学校后再投稿',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            // Check if user is banned
            if (this.isBanned === undefined) {
                await this.http.get("/users/isBanned").then(res => {
                    this.isBanned = res.data.data;
                })
            }
            if (this.isBanned) {
                uni.showModal({
                    title: '您已被禁止投稿',
                    content: '因您多次发表违规订单，已被禁止投稿。如有疑问请联系贴贴墙',
                    showCancel: false,
                })
                return;
            }

            this.imageList = this.$refs.upload.urls;

            let lastSubmitTime = this.lastSubmitTime;
            let submitBeginTime = new Date().getTime() / 1000; // 小于 20s

            let duration = Math.ceil(Math.abs(lastSubmitTime - submitBeginTime));
            let timeContent = '请等待 ' + (20 - duration) + 's 后才可继续提交';

            if (lastSubmitTime !== 0 && duration < 20) {
                uni.showModal({
                    title: '您的提交频率过快',
                    content: timeContent,
                    showCancel: false
                });
                return;
            }

            let postType = this.postType;
            let postTitle = this.postTitle;
            let postContent = this.postText;
            let postContactQQ = this.postContactQQ;
            let postContactWechat = this.postContactWechat;
            let postContactPhone = this.postContactPhone;
            let submitList = this.submitList;

            if (!postType || !postTitle || !postContent) {
                let content = '您的';

                if (!postType) {
                    content = content + '投稿类型' + '、';
                }

                if (!postTitle) {
                    content = content + '投稿标题' + '、';
                }

                if (!postContent) {
                    content = content + '投稿内容' + '、';
                }

                content = content.slice(0, -1) + '未填写';
                uni.showModal({
                    title: '投稿内容不全!',
                    content: content,
                    showCancel: false
                });
                return;
            }


            uni.showModal({
                title: '投稿确认提示',
                content: '请确认投稿内容中不包含暴力、谩骂、引战、色情、政治等信息。\n\n如内容涉及他/她人个人信息、肖像等请征得对方同意。\n\n可在查看订单页面查看或右滑取消、删除已发订单。',
                confirmText: '是',
                confirmColor: '#00CAFC',
                cancelText: '否',
                cancelColor: '#FF0000',
                success: (res) => {
                    if (res.confirm) {
                        const timestamp = new Date().getTime() / 1000;
                        uni.showLoading({
                            title: '订单投递中，请稍作等待',
                            mask: true
                        });
                        this.uploadFilesToCOS()
                            .then((res) => {
                                return this.http.post("/posts", {
                                    data: {
                                        postType: postType,
                                        postTitle: postTitle,
                                        postContent: postContent,
                                        imageList: submitList,
                                        contactQQ: postContactQQ,
                                        contactWechat: postContactWechat,
                                        contactTelephone: postContactPhone,
                                    }
                                })
                            })
                            .then((res) => {
                                submitList.slice(0, submitList.length);
                                uni.hideLoading();
                                uni.showToast({
                                    title: '提交成功',
                                    icon: 'success',
                                    duration: 500
                                });
                                uni.showTabBarRedDot({
                                    index: 1
                                });
                            })
                            .catch((error) => console.error(error));
                        let submitEndTime = new Date().getTime();
                        this.setData({
                            lastSubmitTime: submitEndTime / 1000
                        });
                    }
                }
            });
        },

        formSubmit(e) {
            this.submitPost(e);
        },

        bindSubmit(e) {
            this.submitPost(e);
        },

        chooseImage: function () {
            let imageList = this.imageList;
            uni.chooseImage({
                sourceType: ['album', 'camera'],
                sizeType: ['original', 'compressed'],
                count: 9 - imageList.length,
                success: (res) => {
                    console.log(res);
                    imageList = imageList.concat(res.tempFilePaths);
                    this.setData({
                        imageList: imageList
                    });
                }
            });
        },

        previewImage(e) {
            const current = e.target.dataset.index;
            uni.previewImage({
                current: this.imageList[current],
                urls: this.imageList
            });
        },

        deleteImage(e) {
            let imageList = this.imageList;
            let index = e.target.dataset.index;
            console.log('Delete image index is ', index);
            imageList.splice(index, 1);
            this.setData({
                imageList: imageList
            });
        },
    }
};
</script>
<style>
page {
    background-color: #f5f6fa !important;
}

.upload__spacing {
    padding-left: 40rpx;
    padding-right: 40rpx;
    /* #ifndef APP-NVUE */
    box-sizing: border-box;
    /* #endif */
}

.fui-section__title {
    margin-left: 32rpx;
}

.fui-notice__pt {
    padding-top: 124rpx;
}

.fui-notice__fixed {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
}

.fui-icon__box {
    padding-left: 24rpx;
    padding-right: 12rpx;
}

.fui-more__wrap {
    display: flex;
    align-items: center;
    padding: 0 24rpx;
}

.fui-banner__item {
    width: 100%;
    height: 360rpx;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    font-weight: 600;
}

.fui-banner__wrap {
    height: 360rpx;
}

.fui-left__icon {
    padding-right: 24rpx;
}

.fui-banner__box {
    height: 280rpx;
}

.fui-banner__cell {
    width: 100%;
    height: 280rpx;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    font-weight: 600;
    border-radius: 24rpx;
    transition: transform .1s linear;
}

.fui-item__scale {
    transform: scale3d(.9, .9, 1);
}
</style>
