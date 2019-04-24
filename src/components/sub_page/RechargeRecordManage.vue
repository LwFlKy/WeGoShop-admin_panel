<template>
	<div class="RechargeRecordManage">
		<el-pagination
		    layout="total, prev, pager, next, jumper"
		    :total="pageDetail.count"
		    :page-size='pageDetail.pageSize'
		    :current-page='pageDetail.currentPage'
		    @current-change='showData'>
		</el-pagination>
		<el-table
			v-loading="loading"
			:data="recordData"
			style="width: 100%">
			<el-table-column
			width="50">
			</el-table-column>
			<el-table-column
				prop="out_trade_no"
				label="订单号">
			</el-table-column>
			<el-table-column
				label="充值金额">
				<template slot-scope="scope">
					￥{{scope.row.attach.fee}}
				</template>
			</el-table-column>
			<el-table-column
				label="充值积分">
				<template slot-scope="scope">
					{{scope.row.attach.point}}
				</template>
			</el-table-column>
			<el-table-column
			width="50">
			</el-table-column>
			<el-table-column>
				<!--<template slot-scope="scope">
					<el-dropdown @command="optionCommand">
					  <el-button type="text" size="medium">
					    操作<i class="el-icon-arrow-down el-icon--right"></i>
					  </el-button>
					  <el-dropdown-menu slot="dropdown">
					    <el-dropdown-item 
					    	:command="[{option:'del',data:scope.row.id}]"
					    	>删除</el-dropdown-item>
					    <el-dropdown-item
					    	:command="[{option:'modify',data:scope.row}]"
					    	>修改</el-dropdown-item>
					    <el-dropdown-item
					    	:command="[{option:'checkAdmin',data:scope.row.id}]"
					    	>查看管理员账户</el-dropdown-item>
					  </el-dropdown-menu>
					</el-dropdown>
				</template>-->
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
				recordData: [],
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
			showData(page = 1){
				this.loading = true
				this.getToServer("https://shop.funnything.net/admin/recharge/recordList?page="+page,(res) => {
                    console.log(res)
					this.recordData = res.data.data.data
					for (var i = this.recordData.length - 1; i >= 0; i--) {
						this.recordData[i].attach = JSON.parse(this.recordData[i].attach)
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