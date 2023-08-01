<script>
export default {
    onLaunch: function () {
        console.log('App Launch')
        // 开启 debug
        qq.setEnableDebug({
            enableDebug: false
        })
        // let version = qq.getEnvVersion()
        // if (version === 'develop') {
        //     qq.setEnableDebug({
        //         enableDebug: true
        //     })
        // } else {
        //     qq.setEnableDebug({
        //         enableDebug: false
        //     })
        // }
        // this.login().then((res) => {
        //     console.log(res)
        // }).catch((err) => {
        //     console.log(err)
        // })
    },
    onError: function () {
    },
    onShow: function () {
    },
    onHide: function () {
    },
    version: 'v2.0.2',
    versionDesc: 'version v2.0.2',
    methods: {
        login(school) {
            let that = this.$vm
            return new Promise((resolve, reject) => {
                // 每次都请求，不使用缓存
                // uni.removeStorageSync('token')
                // uni.removeStorageSync('isAdmin')
                // uni.removeStorageSync('school')
                // let token = uni.getStorageSync('token')
                // if (token) {
                //     let isAdmin = uni.getStorageSync('isAdmin')
                //     resolve({
                //         token: token,
                //         isAdmin: isAdmin
                //     })
                // } else {
                uni.removeStorageSync('token')
                uni.removeStorageSync('isAdmin')
                uni.removeStorageSync('school')
                uni.removeStorageSync('schoolName')
                qq.login({
                    success(res) {
                        if (res.code) {
                            // 发起网络请求
                            that.http.post('/login', {
                                data: {
                                    code: res.code,
                                    school: school
                                }
                            }).then((res) => {
                                // 如果不为 200 则请求失败，使用非业务异常
                                if (res.data.code !== 200) {
                                    reject(res.data.msg)
                                } else {
                                    // console.log("Login res data", res.data.data)
                                    uni.setStorageSync('token', res.data.data.token)
                                    uni.setStorageSync('isAdmin', res.data.data.isAdmin)
                                    uni.setStorageSync('school', res.data.data.school)
                                    uni.setStorageSync('schoolName', res.data.data.schoolName)
                                    resolve({
                                        token: res.data.data.token,
                                        isAdmin: res.data.data.isAdmin,
                                        school: res.data.data.school,
                                        schoolName: res.data.data.schoolName
                                    })
                                }
                            })
                        } else {
                            console.log('登录失败！' + res.errMsg)
                            reject(res.errMsg)
                        }
                    },
                    fail(err) {
                        console.log("App Login error", err)
                        reject(err)
                    }
                })
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
