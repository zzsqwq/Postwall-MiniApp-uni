import App from './App';
import http from './components/firstui/fui-request'

// 全局mixins，用于实现setData等功能，请勿删除！';
import Mixin from './polyfill/mixins';

// #ifndef VUE3
import Vue from 'vue';

Vue.mixin(Mixin);
Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
    ...App
});
app.$mount();
// #endif

//初始化请求配置项
http.create({
    //接口域名
    // host: 'http://zzsqwq.cn:12080/api/v1',
    // host: 'http://127.0.0.1:8080/api/v1',
    // host: 'http://192.168.31.249:8080/api/v1',
    // host: 'http://192.168.1.244:8080/api/v1',
    host: "https://api.zzsqwq.cn:8443/api/v1",
    // host: "https://127.0.0.1:8443/api/v1",
    header: {
        'content-type': 'application/json',
    }
})

//请求拦截
http.interceptors.request.use(config => {
    //请求之前可在请求头中加入token等信息
    let token = uni.getStorageSync('token');
    if (config.header) {
        config.header['Authorization'] = token
    } else {
        config.header = {
            'Authorization': token
        }
    }
    return config
})

// #ifndef VUE3
Vue.prototype.http = http
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
export function createApp() {
    const app = createSSRApp(App);
    app.config.globalProperties.http = http
	app.mixin(Mixin);
    return {
        app
    };
}
// #endif
