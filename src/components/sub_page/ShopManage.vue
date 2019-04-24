<template>
	<div class="shopManage">
		<el-row :gutter="20">
		  <el-col :span="6">		
		  	<el-button type="primary" size="small" @click="addDialogFormVisible = true">添加商家<i class="el-icon-circle-plus el-icon--right"></i></el-button>
		  </el-col>
		  <el-col :span="6" :offset="12">
		  	<el-input v-model="searchText" placeholder="请输入要搜索的店铺名称"></el-input>
		  </el-col>

		</el-row>
		<el-pagination
		    layout="total, prev, pager, next, jumper"
		    :total="pageDetail.count"
		    :page-size='pageDetail.pageSize'
		    :current-page='pageDetail.currentPage'
		    @current-change='showData'>
		</el-pagination>
		<el-table
			v-loading="loading"
			:data="shopData"
			style="width: 100%">
			<el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
			<el-table-column
				prop="_id"
				label="ID">
			</el-table-column>
			<el-table-column
				prop="name"
				label="店铺名">
			</el-table-column>
			<el-table-column>
				<template slot-scope="scope">
					<el-dropdown @command="optionCommand">
					  <el-button type="text" size="medium">
					    操作<i class="el-icon-arrow-down el-icon--right"></i>
					  </el-button>
					  <el-dropdown-menu slot="dropdown">
					    <el-dropdown-item 
					    	:command="[{option:'del',data:scope.row._id}]"
					    	>删除</el-dropdown-item>
					    <el-dropdown-item
					    	:command="[{option:'modify',data:scope.row}]"
					    	>修改</el-dropdown-item>
					    <el-dropdown-item
					    	:command="[{option:'checkAdmin',data:scope.row._id}]"
					    	>查看管理员账户</el-dropdown-item>
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
		<el-dialog title="添加商家" :visible.sync="addDialogFormVisible">
			<el-form :model="postData" :rules="rules" ref="postData">
				<el-form-item label="店铺名" prop="name">
					<el-input v-model="postData.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addDialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click='addShop("postData")'>确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改商家信息" :before-close="handleClose" :visible.sync="modifyDialogFormVisible">
			<el-form :model="postData" :rules="rules" ref="postData">
				<el-form-item label="店铺名" prop="name">
					<el-input v-model="postData.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					  <el-radio-group v-model="postData.shop_stat.is_show">
					    <el-radio :label=false>下架</el-radio>
					    <el-radio :label=true>上架</el-radio>
					  </el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click='modifyShop()'>确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="查看管理员账户" :visible.sync="adminDialogFormVisible">
			<el-table
				v-loading="loading"
				:data="checkAdminData"
				style="width: 100%">
				<el-table-column
					prop="id"
					label="ID">
				</el-table-column>
				<el-table-column
					prop="admin_role_id"
					label="所属管理组">
					<template slot-scope="scope">
				        {{adminName[scope.row.admin_role_id]}}
				      </template>
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>
<style scoped>
	img{
		width: 100px;
	}
</style>
<script>
	export default {
		data(){
			return {
				rules: {
					name: [
						{ required: true, message: '请输入店铺名称',trigger: 'blur' }
					]
				},
				postData: {
					id:0,
                    name:"",
                    shop_stat:{}
				},
				adminName: {
					0:"超级管理员",
					1:"系统管理员",
					3:"商家管理员",
					4:"店小二"
				},
				searchText:"",
				checkAdminData:null,
				addDialogFormVisible: false,
				modifyDialogFormVisible: false,
				adminDialogFormVisible: false,
				loading: true,
				token : this.getCookie("token"),
				pageDetail:{
					pageSize:null
				},
				shopData:null

			}
		},
		watch:{
			searchText: function() {
				this.searchShop(this.searchText)
			}
		},
		methods:{
			addShop:function(formName){
				let _this = this
				this.$refs[formName].validate((valid) => {
					if(valid){
						this.postToServer("https://shop.funnything.net/admin/shop/store",this.postData,function(response) {
							_this.addDialogFormVisible = false
							_this.showData()
							_this.$message.success("添加成功")
						})
					}
				});
			},
			delShop:function(id){
				let _this = this
				this.postToServer("https://shop.funnything.net/admin/shop/destory",{id:id},function() {
					_this.showData(_this.pageDetail.currentPage)
					_this.$message.success("删除成功")
				})
					/*this.$ajax.post("https://shop.funnything.net/admin/shop/store",this.postData,{headers:{"x-wegoshop-token":this.token}})
						.then((response) => {
					})*/
			},
			modifyShop:function(){
				this.postToServer("https://shop.funnything.net/admin/shop/store",this.postData,() => {
					this.modifyDialogFormVisible = false
					this.$message.success("修改成功")
					this.showData()
				})
				//this.showData(this.pageDetail.currentPage)
					/*this.$ajax.post("https://shop.funnything.net/admin/shop/store",this.postData,{headers:{"x-wegoshop-token":this.token}})
						.then((response) => {
					})*/
			},
			checkAdmin:function(shopId) {
				this.postToServer("https://shop.funnything.net/admin/auth/checkAdmin",{shop_id:shopId},(response) => {
                    
					this.checkAdminData = response.data.data
					this.adminDialogFormVisible = true
				})
			},
			handleClose:function() {
				this.modifyDialogFormVisible = false
				this.postData = {
					id:0,
                    name:"",
                    shop_stat:{},
					address_name:"",
					address_xy:"asd"
				}
			},
			searchShop:function(value) {
				this.showData("",value)
			},
			optionCommand(command) {
				if (command[0].option == "del") {
					        this.$confirm('确认删除该商家吗？(抹去所有该商户资料)', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					          this.delShop(command[0].data);
					        }).catch(() => {
					          this.$message({
					            type: 'info',
					            message: '已取消删除'
					          });          
					        });
				}else if(command[0].option == "modify"){
					this.postData = JSON.parse(JSON.stringify(command[0].data))
					this.modifyDialogFormVisible = true
				}else if(command[0].option == "checkAdmin"){
					this.checkAdmin(command[0].data)
				}
				//this.$message('click on item ' + command);
			},
			showData(page = "") {
				this.loading = true
				this.getToServer("https://shop.funnything.net/admin/shop?page="+page+"&name="+this.searchText,(response) => {
                    
                    this.shopData = response.data.data.data
					this.pageDetail = response.data.data
					this.loading = false
				})
            },
            async getGroupInfo(){
                this.adminName = {}
                const groupData = await this.awPostToServer("https://shop.funnything.net/client/admin/authority/getGroupInfo",{});
                for (let index = 0; index < groupData.data.data.length; index++) {
                    this.adminName[groupData.data.data[index].id] = groupData.data.data[index].name;
                }
            }
		},
		mounted: function() {
            this.showData()
            this.getGroupInfo()
		}
	}
</script>