<template>
	<div class="GoodsApplyManage">
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
			<el-table-column type="expand"
			width="50">
		      <template slot-scope="props">
		        <el-form label-position="left" inline class="demo-table-expand">
		          <el-form-item label="商品名称">
		            <span>{{ props.row.name }}</span>
		          </el-form-item>
		          <el-form-item label="商品简述" class="all">
		            <span>{{ props.row.promotion_brief }}</span>
		          </el-form-item>
		          <el-form-item label="商品照片" class="all">
		            <img v-for="(value, key, index) in props.row.gallery" :key="key" :src="'https://qiniu.funnything.net/'+value.img_url">
		          </el-form-item>
		          <el-form-item label="商品价格" class="all">
		            <span>{{ props.row.price }}</span>
		          </el-form-item>
		          <el-form-item label="可用日期" class="all">
		            <span>{{props.row.start_date}}  到  {{props.row.end_date}}</span>
		          </el-form-item>
		          <el-form-item label="可用时段" class="all">
		            <div v-for="(value, key, index) in JSON.parse(props.row.allow_time)">{{new Date(value.start[0]).toLocaleTimeString()}} 到 {{new Date(value.start[1]).toLocaleTimeString()}}</div>
		          </el-form-item>
		          <el-form-item label="商品内容" class="all">
		            <div v-for="(value, key, index) in JSON.parse(props.row.content)">{{value.name}} {{value.sum}}{{value.unit}} ￥{{value.price}}</div>
		          </el-form-item>
		        </el-form>
		      </template>
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
					    	:command="[{option:'pass',data:scope.row._id}]"
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .demo-table-expand .el-form-item img{
    margin-right: 5px;
    margin-bottom: 5px;
   width: 100px;
   height: 100px;
  }
  .demo-table-expand .half {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
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
					this.postToServer("https://shop.funnything.net/admin/apply/passGoodsApply",{_id:handle[0].data},(res) => {
						this.showData()
					})
				}else if(handle[0].option == "reject"){
					this.reject(handle[0].data)
				}
			},
			async showData(page = 1){
				this.loading = true
				this.postToServer("https://shop.funnything.net/admin/apply/getApply",{type:"goods",page:page},(res) => {
					this.applyData = res.data.data.data
					for (var i = this.applyData.length - 1; i >= 0; i--) {
						this.applyData[i].time = new Date(this.applyData[i].timestamp*1000)
					}
					delete res.data.data.data
					this.pageDetail = res.data.data
					this.loading = false
				})
				let response = await this.awGetToServer("https://shop.funnything.net/admin/category")
				this.categoryData = [] 
				for (var i = response.data.data.length - 1; i >= 0; i--) {
					this.categoryData[response.data.data[i].id] = response.data.data[i]
				}
			}
		},
		mounted(){
			this.showData()
		}
	}
</script>