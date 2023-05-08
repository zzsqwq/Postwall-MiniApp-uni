<template>
	<view class="fui-wrap">
		<view class="fui-page__hd">
			<view class="fui-page__title">隐私说明</view>
			<view class="fui-page__desc">本说明是自助贴贴墙小程序开发者（以下简称“开发者”）为处理您的个人信息而制定。</view>
		</view>
		<view class="fui-page__bd fui-page__spacing" >
		<view class="fui-section__title">开发者收集的信息</view>
		<fui-text text="1. 为了确定订单的基本内容，开发者收集订单类型、标题与内容，其中均不涉及个人隐私。" :size="28"></fui-text>
		<fui-text text="2. 当您选择上传图片，开发者会收集您的订单图片上传到后台。如果您需要使用后立即删除，请联系开发者。" :size="28"></fui-text>
		<fui-text text="3. 当您选择提供联系方式(包括QQ、微信、电话号码)，开发者会收集您的联系方式。如果您需要使用后立即删除，请联系开发者。" :size="28"></fui-text>
		<view class="fui-section__title">开发者对信息的存储</view>
		<fui-text text="1. 开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应为实现处理目的所必要的最短时间。" :size="28"></fui-text>
		<view class="fui-section__title">开发者对信息的使用规则</view>
		<fui-text text="1. 开发者将会在本指引所明示的用途内使用收集的信息" :size="28"></fui-text>
		<fui-text text="2. 如开发者使用你的信息超出本指引的合理范围，开发者会在变更使用目的或范围前，再次以小程序内公告方式告知并征得您的同意。" :size="28"></fui-text>
		<view class="fui-section__title">信息对外提供</view>
		<fui-text text="1. 开发者承诺，不会主动共享或转让您的个人信息至任何第三方，如确实存在需要共享或转让时，开发者应当直接征得或确认第三方征得您的单独同意。" :size="28"></fui-text>
		<fui-text text="2. 开发者承诺，不会对外公开披露您的信息，如必须公开披露时，开发者应当向您告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得您的单独同意。" :size="28"></fui-text>
		<view class="fui-section__title">您的权益</view>
		<fui-text text="1. 关于您的个人信息，您可以通过下方联系方式与开发者联系，行使查阅、复制、更正、删除等法定权利。" :size="28"></fui-text>
		<fui-text text="2. 若你认为开发者未遵守上述约定，或有其他投诉与建议、或未成年个人信息保护相关问题，可通过以下方式与开发者联系、或向QQ进行投诉。" :size="28"></fui-text>
		</view>
		<view class="fui-page__spacing">
			<fui-copy-text color="#465CFF" text="开发者联系方式: trizsqwq@gmail.com" :size="28"></fui-copy-text>
			<fui-text style="display: block;" type="primary" text="更新日期：2022年12月21日" :size="28"></fui-text>
			<fui-text style="display: block;" type="primary" text="生效日期：2022年12月21日" :size="28"></fui-text>
		</view>
		
<!-- 		<view class="privacy-container">
			<view class="privacy-title">隐私说明</view>
			<view class="privacy-content">本说明是实高自助贴贴墙小程序开发者（以下简称“开发者”）为处理您的个人信息而制定。</view>
		</view> -->
		<!-- <text class="privacy-content">
			1. 开发者收集的信息 - 为了确定订单的基本内容，开发者收集订单类型、标题与内容，其中均不涉及个人隐私。 -
			开发者收集您的订单图片，此项可选，您上传图片会上传到后台、我们会定期清理，如果您需要及时删除，可以联系开发者。 -
			您可以选择提供联系方式，包括QQ、微信与联系电话，开发者会定期清理订单内容，如果您需要及时删除，可以联系开发者。 - 开发者联系方式： 2459958352@qq.com
		</text>
		<text class="privacy-content">
			2. 您的权益 - 关于您的个人信息，您可以通过以下方式与开发者联系，行使查阅、复制、更正、删除等法定权利。 - 开发者联系方式： 2459958352@qq.com
		</text>
		<text class="privacy-content">3. 开发者对信息的存储 - 开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应为实现处理目的所必要的最短时间。</text>
		<text class="privacy-content">
			4. 开发者对信息的使用规则 - 开发者将会在本指引所明示的用途内使用收集的信息 -
			如开发者使用你的信息超出本指引的合理范围，开发者必须在变更使用目的或范围前，再次以小程序内公告方式告知并征得您的同意。
		</text>
		<text class="privacy-content">
			5. 信息对外提供 - 开发者承诺，不会主动共享或转让您的个人信息至任何第三方，如确实存在需要共享或转让时，开发者应当直接征得或确认第三方征得您的单独同意。 -
			开发者承诺，不会对外公开披露您的信息，如必须公开披露时，开发者应当向您告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得您的单独同意。
		</text>
		<text class="privacy-content">
			6. 若你认为开发者未遵守上述约定，或有其他投诉与建议、或未成年个人信息保护相关问题，可通过以下方式与开发者联系、或向QQ进行投诉。 - 开发者联系方式：2459958352@qq.com
		</text>
		<text class="privacy-content">更新日期：2021年12月30日 生效日期：2021年12月30日</text> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad: function(options) {},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		methods: {}
	};
</script>
<style>
	.fui-wrap {
		padding-bottom: 96rpx;
	}
	
</style>
