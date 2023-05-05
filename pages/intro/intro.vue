<template>
    <view class="fui-wrap">
        <fui-vtabs :vtabs="vtabs" :activeTab="activeTab" :linkage="false" @click="onTabClick" tabWidth="180">
            <view class="fui-vtabs-content__item">
                <view class="fui-content--box">
                    <text class="fui-title">{{ content.title }}</text>
                    <view v-for="(item, index) in content.content" :key="index">
                        <image v-if="item.slice(-3) === 'png'" :src="item" class="image-descr"
                               mode="aspectFit" @tap="previewImg" :id="index"></image>
                        <text v-else class="fui-descr">{{ item }}</text>
                    </view>
                </view>
            </view>
        </fui-vtabs>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            activeTab: 0,
            appInstance: app,
            vtabs: ["简介", "快速上手", "审核规则", "加入我们", "FAQ"],
            contents: [],
            content: {},
        }
    },
    async onLoad() {
        //内容可与tabs分开
        await this.http.get("/config/intro").then(res => {
            let contents = res.data.data
            this.vtabs = contents.map(item => item.title)
            for (let i = 0; i < contents.length; i++) {
                let content = contents[i].content
                for (let j = 0; j < content.length; j++) {
                    if (content[j].substring(0, 5) === 'intro') {
                        // content 为 key
                        this.http.post("/file/download/url", {
                            data: {
                                "key": content[j]
                            }
                        }).then(res => {
                            let downloadUrl = res.data.data
                            return uni.downloadFile({
                                url: downloadUrl,
                            }).then(res => {
                                if (res.statusCode === 200) {
                                    content[j] = res.tempFilePath
                                }
                            })
                        })
                    }
                }
            }
            this.contents = contents
            // this.content = this.contents[0]
        }).catch(err => {
            console.log(err)
        })
        this.content = this.contents[0]
    },
    methods: {
        onTabClick(e) {
            const index = e.index
            this.content = this.contents[index]
        },
        previewImg(event) {
            const index = parseInt(event.target.id);
            uni.previewImage({
                current: this.content.content[index],
                urls: [this.content.content[index]]
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
