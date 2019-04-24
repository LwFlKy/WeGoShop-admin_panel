<template>
	<div>
		<el-table
			v-loading="loading"
			:data="thisInfo"
			style="width: 100%"
			>
			<el-table-column  v-if="level !== 2" type="expand">
				<template slot-scope="props">

					<tabletree :parentId='props.row.id' :level="nextlevel" :allCategory="allCategory"></tabletree>
				</template>
		    </el-table-column>
			<el-table-column
				prop="id"
				label="分类ID">
			</el-table-column>
			<el-table-column
				prop="name"
				label="分类名">
			</el-table-column>
			<el-table-column>
				<template slot-scope="scope">
					<el-dropdown @command="handleCommand">
					  <el-button type="text" size="medium">
					    操作<i class="el-icon-arrow-down el-icon--right"></i>
					  </el-button>
					  <el-dropdown-menu slot="dropdown">
					    <el-dropdown-item :command="[{option:'delete',data:scope.row.id}]">删除</el-dropdown-item>
					    <el-dropdown-item :command="[{option:'add',data:scope.row.id}]" v-if="level !== 2">添加子分类</el-dropdown-item>
					  </el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="添加分类" :visible.sync="addDialogFormVisible">
			<el-form :model="postData" :rules="rules" ref="postData">
				<el-form-item label="分类名" prop="name">
					<el-input v-model="postData.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addDialogFormVisible = false;delete postData.parent_id;">取 消</el-button>
				<el-button type="primary" @click='addCategory()'>确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import tabletree from '../common/tabletree.vue'
	export default {
		name:"tabletree",
		components:{
			tabletree
		},
		props:['parentId','level','allCategory'],
		data(){
			return {
				rules: {
					name: [
						{ required: true, message: '请输入分类名称',trigger: 'blur' }
					]
				},
				addDialogFormVisible: false,
				postData: {
					id:0,
					name:"",
					address_name:"",
					address_xy:"asd"
				},
				next:false,
				nowData:null,
				next_children:[],
				loading:false,
				thisInfo:[],
				nextlevel:0
			}
		},
		methods:{
			addCategory(parent_id){
				delete this.postData.id
				this.postData.is_show = 1
				this.postToServer("https://shop.funnything.net/admin/category/store",this.postData,(response) => {
					this.postData = {
						id:0,
						name:"",
						address_name:"",
						address_xy:"asd"
					}
					this.addDialogFormVisible = false
					this.$message.success("添加成功")
					this.$store.commit("updateToggle")
				})
			},
			handleCommand(command) {
				if (command[0].option == 'delete') {
					this.delItem(command[0].data)
				}else if(command[0].option == 'add'){
					this.postData.parent_id = command[0].data
					this.opearte
					this.addDialogFormVisible = true
				}
				//this.$message(command[0].data)
			},
			delItem(id){
				this.postToServer("https://shop.funnything.net/admin/category/destory",{id:id},(respones) => {
					if (respones.data.errno == 1001) {
						this.$message.error("该分类下还有子类目，无法删除")
					}else{
						this.$message.success("删除成功")
						this.$store.commit("updateToggle")
					}
				})
			},
			initData() {
				let num = 0
				for (var i = this.allCategory.length - 1; i >= 0; i--) {
					if (this.allCategory[i].level == this.level && this.allCategory[i].parent_id == this.parentId) {
						this.thisInfo.push(this.allCategory[i])
						num++
					}
				}
				if (num !== 0) {
					this.nextlevel = parseInt(this.level) + 1
					this.next = true
				}else{
					this.next = false
				}
			}
		},
		created: function() {
			this.next = false
			this.initData()
		}
	}
</script>