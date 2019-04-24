<template>
	<div class="RechargeItemManage">
		<el-row :gutter="20">
		  <el-col :span="6">		
		  	<el-button type="primary" size="small" @click="addDialogFormVisible = true">添加充值项<i class="el-icon-circle-plus el-icon--right"></i></el-button>
		  </el-col>
		  <el-col :span="6" :offset="12">
		  </el-col>

		</el-row>
		<el-table
			v-loading="loading"
			:data="rechargeItem"
			style="width: 100%">
			<el-table-column
				label="充值金额">
				<template slot-scope="scope">
					￥{{scope.row.fee}}
				</template>
			</el-table-column>
			<el-table-column 
				label="充值积分" 
				prop="point">
			</el-table-column>
			<el-table-column>
				<template slot-scope="scope">
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
					  </el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="添加充值项" :visible.sync="addDialogFormVisible">
			<el-form :model="postData" ref="postData">
				<el-form-item label="金额">
					<el-input-number v-model="postData.fee" :min="0.01" :step="0.01" :precision="2" label="描述文字"></el-input-number>
				</el-form-item>
				<el-form-item label="积分">
					<el-input-number v-model="postData.point" :min="1" label="描述文字"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addDialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click='addRechargeItem()'>确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改充值项" :visible.sync="modifyDialogFormVisible">
			<el-form :model="postData" ref="postData">
				<el-form-item label="金额">
					<el-input-number v-model="postData.fee" :min="0.01" :step="0.01" :precision="2" label="描述文字"></el-input-number>
				</el-form-item>
				<el-form-item label="积分">
					<el-input-number v-model="postData.point" :min="1" label="描述文字"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="modifyDialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click='modifyRechargeItem()'>确 定</el-button>
			</div>
		</el-dialog>
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
				modifyDialogFormVisible:false,
				addDialogFormVisible:false,
				rules: {
					name: [
						{ required: true, message: '请输入分类名称',trigger: 'blur' }
					]
				},
				loading : true,
				rechargeItem: [],
				postData:{
					id:0,
					fee:0,
					point:0,
				}
			}
		},
		watch:{
			modifyDialogFormVisible(){
				if (this.modifyDialogFormVisible == false) {
					this.postData = {
						id:0,
						fee:0,
						point:0,
					}
				}
			}
		},
		computed:{
		},
		methods:{
			showData(){
				this.loading = true
				this.getToServer("https://shop.funnything.net/admin/recharge/itemList",(res) =>{
					this.rechargeItem = res.data.data
					this.loading = false
				})
			},
			optionCommand(handle){
				if (handle[0].option == "del") {
					this.postToServer("https://shop.funnything.net/admin/recharge/itemDel",{id:handle[0].data},(res) =>{
						this.showData()
						this.$message.success("删除成功！")
					})
				}else if(handle[0].option == "modify"){
					this.postData = handle[0].data
					this.modifyDialogFormVisible = true
				}
			},
			addRechargeItem(){
				this.postToServer("https://shop.funnything.net/admin/recharge/itemAdd",this.postData,(res) =>{
					this.postData = {
						id:0,
						fee:0,
						point:0,
					}
					this.showData()
					this.addDialogFormVisible = false
					this.$message.success("添加成功！")
				})
			},
			modifyRechargeItem(){
				this.postToServer("https://shop.funnything.net/admin/recharge/itemModify",this.postData,(res) =>{
					this.postData = {
						id:0,
						fee:0,
						point:0,
					}
					this.showData()
					this.modifyDialogFormVisible = false
					this.$message.success("修改成功！")
				})
			}
		},
		mounted(){
			this.showData()
		}
	}
</script>