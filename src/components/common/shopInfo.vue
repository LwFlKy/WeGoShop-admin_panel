<template>
	<div class="shopInfo">
	</div>
</template>
<script>
	export default {
	    props: ['shop_id'],
		data(){
			return {
				child_cate:"",
				top_cate:"",
				categoryData:[],
				tmpFileList:{
					logo:[],
					gallery:[]
				},
				initData:[]
			}
		},
		methods:{
			async showData(page = "") {
				this.loading = true
				let response = await this.awGetToServer("https://shop.funnything.net/admin/shop/info?id="+this.shop_id)
				this.initData = response.data.data
				this.loading = false
				
				response = await this.awGetToServer("https://shop.funnything.net/admin/category")
				this.categoryData = response.data.data
				for (var i = this.categoryData.length - 1; i >= 0; i--) {
					if(this.categoryData[i].id == this.postData.type_id){
						if (this.categoryData[i].parent_id !== 0) {
							this.top_cate = this.categoryData[i].parent_id
							this.child_cate = this.postData.type_id
						}else{
							this.top_cate = this.postData.type_id
						}
						break;
					}
				}
			}
		},
		mounted: function() {
			this.showData()
			this.test()
			//this.showQRCode()
		}
	}
</script>