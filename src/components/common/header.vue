<template>
	<div class="header">
		<div class="left">
			<strong>商圈</strong><small>后台管理系统</small>
		</div>
		<div class="right">
			<div>
				<el-button @click="logout" type="primary" round size="mini">注销</el-button>
			</div>
		</div>
	</div>
</template>
<style>
	.header{
		display: -webkit-flex;
		display: flex;
		flex-direction:row;
	}
	.left{
		display: -webkit-flex;
		display: flex;
		width: 50%;
		flex-direction:row
	}
	.right{
		display: -webkit-flex;
		display: flex;
		width: 50%;
		flex-direction:row-reverse
	}
</style>
<script>
	export default {
		data(){
			return {

			}
		},
		methods:{
			logout:function() {
				this.delCookie({name:"token"})
				this.$store.commit('logout')
				this.$message.success("已退出！")
				this.$router.push("/login")
			}
		}
	}
</script>