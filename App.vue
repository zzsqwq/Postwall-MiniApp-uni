<script>
	export default  {
		onLaunch: function() {
		    qq.cloud.init({
		        env: 'postwall-4gy7eykl559a475a',
		        traceUser: true
		    });
			
		    console.log("Cloud env init finished!")
		
		//     let version = qq.getEnvVersion()
		
		//     if(version !== 'release') {
		        qq.setEnableDebug({
		            enableDebug: false,
		            success: () => {
		                console.log("enable debug successful!")
		            },
		            fail: (e) => {
		                console.error("enable debug error.", e)
		            }
		        })
		//     }
		},
		onError: function() {
		    console.log(msg)
		},
		onShow: function() {},
		onHide: function() {},
		globalData: "I am global data",
		version: 'v2.0.2',
		versionDesc: 'version v2.0.2'
	}
</script>
<style>
	/*每个页面公共css */
	@import './common/fui-app.css';
	@import './components/firstui/fui-theme/fui-theme.css';
</style>
