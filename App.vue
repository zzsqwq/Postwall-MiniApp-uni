<script>
export default {
    onLaunch: function () {
        console.log('App Launch')
        // this.login().then((res) => {
        //     console.log(res)
        // }).catch((err) => {
        //     console.log(err)
        // })
    },
    onError: function () {
        console.log(msg)
    },
    onShow: function () {
    },
    onHide: function () {
    },
    version: 'v2.0.2',
    versionDesc: 'version v2.0.2',
    methods: {
        login() {
            let that = this
            return new Promise((resolve, reject) => {
                let token = uni.getStorageSync('token')
                if (token) {
                    let isAdmin = uni.getStorageSync('isAdmin')
                    resolve({
                        token: token,
                        isAdmin: isAdmin
                    })
                } else {
                    qq.login({
                        success(res) {
                            if (res.code) {
                                // 发起网络请求
                                that.http.post('/login', {
                                    data: {
                                        "code": res.code
                                    }
                                }).then((res) => {
                                    uni.setStorageSync('token', res.data.data.token)
                                    uni.setStorageSync('isAdmin', res.data.data.isAdmin)
                                    resolve({
                                        token: res.data.data.token,
                                        isAdmin: res.data.data.isAdmin
                                    })
                                }).catch((err) => {
                                    console.log(err)
                                    reject(err)
                                })

                            } else {
                                console.log('登录失败！' + res.errMsg)
                                reject(res.errMsg)
                            }
                        },
                        fail(err) {
                            console.log(err)
                            reject(err)
                        }
                    })
                }
            })
        }
    }
}
</script>
<style>
/*每个页面公共css */
@import './common/fui-app.css';
@import './components/firstui/fui-theme/fui-theme.css';
</style>
