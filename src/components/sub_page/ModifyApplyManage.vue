<template>
	<div class="ModifyApplyManage">
		<el-pagination
		    layout="total, prev, pager, next, jumper"
		    :total="pageDetail.count"
		    :page-size='pageDetail.pageSize'
		    :current-page='pageDetail.currentPage'
		    @current-change='showData'>
		</el-pagination>
		<el-table
			v-loading="loading"
			:data="applyData"
			style="width: 100%">
			<el-table-column
			width="50">
			</el-table-column>
			<el-table-column
				prop="shopid"
				label="商户ID">
			</el-table-column>
			<el-table-column label="申请时间">
				<template slot-scope="scope">
					{{scope.row.time.toLocaleString()}}
				</template>
			</el-table-column>
			<el-table-column
			width="50">
			</el-table-column>
			<el-table-column>
				<template slot-scope="scope">
					<el-dropdown @command="optionCommand">
					  <el-button type="text" size="medium">
					    操作<i class="el-icon-arrow-down el-icon--right"></i>
					  </el-button>
					  <el-dropdown-menu slot="dropdown">
					    <el-dropdown-item 
					    	:command="[{option:'pass',data:scope.row.shopid}]"
					    	>通过</el-dropdown-item>
					    <el-dropdown-item 
					    	:command="[{option:'reject',data:scope.row._id}]"
					    	>拒绝</el-dropdown-item>
					  </el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
		    layout="total, prev, pager, next, jumper"
		    :total="pageDetail.count"
		    :page-size='pageDetail.pageSize'
		    :current-page='pageDetail.currentPage'
		    @current-change='showData'>
		</el-pagination>


	</div>
</template>
<style>
	img{
		width: 100px;
	}
</style>
<script>
	export default {
		data(){
			return {
				loading : true,
				applyData: [],
				pageDetail:{
					pageSize:null
				},
			}
		},
		watch:{
		},
		computed:{
		},
		methods:{
			reject(_id) {
				this.$prompt('请输入拒绝原因', '', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputErrorMessage: '邮箱格式不正确'
				}).then(({ value }) => {
					this.postToServer("https://shop.funnything.net/admin/apply/rejectApply",{_id:_id,reason:value},(res) => {
						this.$message({
							type: 'success',
							message: '已拒绝'
						});
						this.showData()
					})
				}).catch(() => {  
				});
			},
			optionCommand(handle){
				if (handle[0].option == "pass") {
					this.postToServer("https://shop.funnything.net/admin/apply/passShopModifyApply",{shop_id:handle[0].data},(res) => {
						this.showData()
					})
				}else if(handle[0].option == "reject"){
					this.reject(handle[0].data)
				}
			},
			showData(page = 1){
				this.loading = true
				this.postToServer("https://shop.funnything.net/admin/apply/getApply",{type:"modify",page:page},(res) => {
					this.applyData = res.data.data.data
					for (var i = this.applyData.length - 1; i >= 0; i--) {
						this.applyData[i].time = new Date(this.applyData[i].timestamp*1000)
					}
					delete res.data.data.data
					this.pageDetail = res.data.data
					this.loading = false
				})
			}
		},
		mounted(){
			this.showData()
		}
	}
</script>