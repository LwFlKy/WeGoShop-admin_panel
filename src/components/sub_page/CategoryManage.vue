<template>
	<div class="categoryManage">
		
		<el-row :gutter="20">
		  <el-col :span="6">		
		  	<el-button type="primary" size="small" @click="addDialogFormVisible = true">添加一级分类<i class="el-icon-circle-plus el-icon--right"></i></el-button>
		  </el-col>
		  <el-col :span="6" :offset="12">
		  </el-col>

		</el-row>
		<!--<el-pagination
		    layout="total, prev, pager, next, jumper"
		    :total="pageDetail.count"
		    :page-size='pageDetail.pageSize'
		    :current-page='pageDetail.currentPage'
		    @current-change='showData'>
		</el-pagination>-->
		<tabletree v-if="next" :parentId="0" :level="1" :allCategory="categoryData"></tabletree>

		<el-dialog title="添加分类" :visible.sync="addDialogFormVisible">
			<el-form :model="postData" :rules="rules" ref="postData">
				<el-form-item label="分类名" prop="name">
					<el-input v-model="postData.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addDialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click='addCategory(postData.name)'>确 定</el-button>
			</div>
		</el-dialog>
		<!--
		<el-dialog title="修改商家信息" :before-close="handleClose" :visible.sync="modifyDialogFormVisible">
			<el-form :model="postData" :rules="rules" ref="postData">
				<el-form-item label="店铺名" prop="name">
					<el-input v-model="postData.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="address_name">
					<el-input v-model="postData.address_name" auto-complete="off"></el-input>
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
					label="管理员级别">
					<template slot-scope="scope">
				        {{adminName[scope.row.admin_role_id]}}
				      </template>
				</el-table-column>
			</el-table>
		</el-dialog>
		-->
	</div>
</template>
<style>
	img{
		width: 100px;
	}
</style>
<script>
import tabletree from '../common/tabletree.vue'
	export default {
		components:{
			tabletree
		},
		data(){
			return {
				rules: {
					name: [
						{ required: true, message: '请输入分类名称',trigger: 'blur' }
					]
				},
				addDialogFormVisible: false,
				go:false,
				postData: {
					id:0,
					name:"",
					address_name:"",
					address_xy:"asd"
				},
				pageDetail:null,
				newData:null,
				loading:false,
				next:false,
			}
		},
		watch:{
			searchText: function() {
				this.searchShop(this.searchText)
			},
			update:function() {
				if (this.update == true) {
					this.initData()
					this.$store.commit("updateToggle")
				}
			}
		},
		computed:{
			update(){
				return this.$store.state.update
			}
		},
		methods:{
			addCategory(name){
				this.postToServer("https://shop.funnything.net/admin/category/store",{name:name,is_show:1},(response) => {
					this.postData = {
						id:0,
						name:"",
						address_name:"",
						address_xy:"asd"
					}
					this.addDialogFormVisible = false
					this.$message.success("添加成功")
					this.initData()
				})
			},
			initData(page = "") {
				let _this = this
				let parent = []
				let children = {}
				_this.next = false
				_this.loading = true
				this.getToServer("https://shop.funnything.net/admin/category",function(response) {
					let newData = []
					_this.next = true
					_this.categoryData = response.data.data
				})
			}
		},
		mounted: function() {
			this.initData()
		}
	}
</script>