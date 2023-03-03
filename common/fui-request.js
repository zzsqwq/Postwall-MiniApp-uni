// 本文件由FirstUI授权予战硕（手机号： 18    300  23  4 626，身份证尾号：0 9   15 19）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
import http from '@/components/firstui/fui-request'

//初始化请求配置项
http.create({
	host: 'https://ffa.firstui.cn',
	header: {
		// 'content-type': 'application/x-www-form-urlencoded'
	}
})
//请求拦截
http.interceptors.request.use(config => {
	//请求之前可在请求头中加入token等信息
	let token = uni.getStorageSync('firstui_token') || 'testToken';
	if (config.header) {
		config.header['token'] = token
	} else {
		config.header = {
			'token': token
		}
	}
	return config
})
//响应拦截
http.interceptors.response.use(response => {
	//TODO
	return response
})

export default http