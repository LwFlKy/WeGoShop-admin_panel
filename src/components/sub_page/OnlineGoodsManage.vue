<template>
	<div class="onlineGoodsManage">
		<el-row :gutter="20">
		  <el-col :span="6">		
		  	<el-button type="primary" size="small" @click="addDialogFormVisible = true">添加商品<i class="el-icon-circle-plus el-icon--right"></i></el-button>
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
			:data="goodsData"
			style="width: 100%">
		    <el-table-column type="expand">
		      <template slot-scope="props">
			        <el-form label-position="left" inline class="table-expand">
			          <el-form-item label="商品名称">
			            <span>{{ props.row.name }}</span>
			          </el-form-item>
			          <el-form-item label="商品 ID">
			            <span>{{ props.row.id }}</span>
			          </el-form-item>
			          <el-form-item label="商品描述">
			            <span>{{ props.row.goods_brief}}</span>
			          </el-form-item>
			          <el-form-item label="商品价格">
			            <span>￥{{ props.row.retail_price}}</span>
			          </el-form-item>
			          <el-form-item label="销量">
			            <span>{{ props.row.sell_volume}}&nbsp;{{ props.row.goods_unit}}</span>
			          </el-form-item>
			          <el-form-item label="添加时间">
			            <span>{{ getTime(props.row.add_time)}}</span>
			          </el-form-item>
			        </el-form>
		      </template>
		    </el-table-column>
			<el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
			<el-table-column
				prop="id"
				label="ID">
			</el-table-column>
			<el-table-column
				prop="name"
				label="商品名">
			</el-table-column>
				<el-table-column
					label="状态">
					<template slot-scope="scope">
				        <el-tag v-for="(value, key, index) in goodsStatus" :key="key" v-if="key == 'is_on_sale' ? true : scope.row[key] == 1" :type="value[scope.row[key]].type">{{value[scope.row[key]].name}}</el-tag>
				      </template>
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

		<el-pagination
		    layout="total, prev, pager, next, jumper"
		    :total="pageDetail.count"
		    :page-size='pageDetail.pageSize'
		    :current-page='pageDetail.currentPage'
		    @current-change='showData'>
		</el-pagination>

		<el-dialog title="添加商品" :visible.sync="addDialogFormVisible">
			<el-form :model="postData" label-position="right" label-width="80px" :rules="rules" ref="postData">
				<el-form-item label="商品展示图片">
					<pic-uploader @change="getTmpFileList" :tmpFileList="tmpFileList" :limit=6 :new='false' ref="pic-uploader"></pic-uploader>
				</el-form-item>

				<el-form-item label="商品名" prop="name">
					<el-input v-model="postData.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品简述" prop="goods_brief">
					<el-input v-model="postData.goods_brief" auto-complete="off"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="价格" prop="retail_price">
							<el-input v-model="postData.retail_price" type="number" auto-complete="off"><template slot="append">元</template></el-input>
						</el-form-item>	
					</el-col>
					<el-col :span="12">			
						<el-form-item label="单位" prop="goods_unit">
							<el-input v-model="postData.goods_unit" type="text" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="状态">	
					<el-checkbox label="上架" v-model="postData.is_on_sale" name="type"></el-checkbox>
					<el-checkbox label="热门" v-model="postData.is_hot" name="type"></el-checkbox>
					<el-checkbox label="新品" v-model="postData.is_new" name="type"></el-checkbox>
				</el-form-item>
				<el-form-item label="商品描述">	
					  <goods-editor @change="descChange" ref="goods-editor" :content="content">
					  </goods-editor>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addDialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click='addGoods("postData")'>确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改商品信息" :before-close="handleClose" :visible.sync="modifyDialogFormVisible">
			<el-form :model="postData" label-position="right" label-width="80px" :rules="rules" ref="postData">
				<el-form-item label="商品名" prop="name">
					<el-input v-model="postData.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品简述" prop="goods_brief">
					<el-input v-model="postData.goods_brief" auto-complete="off"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="价格" prop="retail_price">
							<el-input v-model="postData.retail_price" type="number" auto-complete="off"><template slot="append">元</template></el-input>
						</el-form-item>	
					</el-col>
					<el-col :span="12">			
						<el-form-item label="单位" prop="goods_unit">
							<el-input v-model="postData.goods_unit" type="text" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="状态">	
					<el-checkbox label="上架" v-model="postData.is_on_sale" name="type"></el-checkbox>
					<el-checkbox label="热门" v-model="postData.is_hot" name="type"></el-checkbox>
					<el-checkbox label="新品" v-model="postData.is_new" name="type"></el-checkbox>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click='modifyGoods()'>确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style>
	.quill-editor{
		line-height: 20px;
	}
	.quill-editor .ql-container{
		min-height: 200px;

	}
	.el-tag{
		margin-right:2px; 
	}
	.table-expand {
	    font-size: 0;
	}
	.table-expand label {
	    width: 90px;
	    color: #99a9bf;
	}
	.table-expand .el-form-item {
	    margin-right: 0;
	    margin-bottom: 0;
	    width: 50%;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button{
	    -webkit-appearance: none !important;
	    margin: 0; 
	}
</style>
<script>
	import GoodsEditor from '../common/UE.vue'
	import PicUploader from '../common/picUploader.vue'
	import * as qiniu from 'qiniu-js'
	export default {
		components:{
			GoodsEditor,
			PicUploader
		},
		data(){
			return {
				rules: {
					name: [
						{ required: true, message: '请输入商品名',trigger: 'blur' }
					],
					goods_brief:[
						{ required: true, message: '请输入商品简述',trigger: 'blur' }
					],
					retail_price:[
						{ required: true, message: '请输入价格',trigger: 'blur' }
					],
					goods_unit:[
						{ required: true, message: '请输入单位',trigger: 'blur' }
					]
				},
				content:"",
				postData: {
					null:null,
					shop_id:this.shop_id,
					type: []},
				goodsStatus: {
					is_hot:[{},{
						name:"热门",
						type:"danger"
					}],
					is_new:[{},{
						name:"新品",
						type:"success"
					}],
					is_on_sale:[{
						name:"下架",
						type:"info"
					},{
						name:"在售",
						type:"primary"
					}]
				},
				shop_id:this.$store.state.userInfo.shop_id,
				searchText:"",
				checkAdminData:null,
				addDialogFormVisible: false,
				modifyDialogFormVisible: false,
				adminDialogFormVisible: false,
				loading: true,
				token : this.getCookie("token"),
				tmpFileList:[],
				pageDetail:{
					pageSize:null
				},
				goodsData:null,
				content:null
			}
		},
		watch:{
			searchText: function() {
				this.searchGoods(this.searchText)
			}
		},
		methods:{
		    clear(){
		      this.$refs["goods-editor"].clear()
		      this.$refs["pic-uploader"].clear()
		    },
			getTmpFileList:function(tmpFileList) {
				this.tmpFileList = tmpFileList.fileList
			},
			descChange:function(content) {
				this.postData.goods_desc = content
			},
			addGoods:function(formName){
				let _this = this
				this.$refs[formName].validate((valid) => {
					if(valid){
				  		let _this = this
				  		if (_this.tmpFileList.length !== 0) {
					  		this.postToServer("https://shop.funnything.net/admin/qiniu/moveFile",
					  			{prefix:"shopPrimaryPic/"+this.$store.state.userInfo.shop_id,tmpFileList:_this.tmpFileList},
					  			function(response) {
								_this.postData.id = 0
								_this.postData.shop_id = _this.shop_id
								_this.postData.primary_pic_url = "shopPrimaryPic/"+_this.$store.state.userInfo.shop_id+"/"+_this.tmpFileList[0].response.key.slice(-32)
								_this.postData.list_pic_url = []
								for (var i = _this.tmpFileList.length - 1; i >= 0; i--) {
									_this.postData.list_pic_url.push("shopPrimaryPic/"+_this.$store.state.userInfo.shop_id+"/"+_this.tmpFileList[i].response.key.slice(-32))
								}
								_this.postData.list_pic_url = _this.postData.list_pic_url.toString()
								_this.postToServer("https://shop.funnything.net/admin/goods/store",_this.postData,function(response) {
									_this.addDialogFormVisible = false
									_this.showData()
									_this.$message.success("添加成功")
									_this.postData ={
										null:null,
										shop_id:_this.shop_id,
										type: [],
										is_on_sale:false,
										is_hot:false,
										is_new:false}
									_this.clear()
								})
					  		})
				  		}else{
				  			_this.$message.warning("请上传至少一张商品图片")
				  		}
					}
				});
			},
			delGoods:function(id){
				let _this = this
				this.postToServer("https://shop.funnything.net/admin/goods/store",{id:id,is_delete:1},function() {
					_this.showData(_this.pageDetail.currentPage)
					_this.$message.success("删除成功")
				})
					/*this.$ajax.post("https://shop.funnything.net/admin/goods/store",this.postData,{headers:{"x-wegoshop-token":this.token}})
						.then((response) => {
					})*/
			},
			modifyGoods:function(){
				let _this = this
				delete this.postData.add_time
				this.postToServer("https://shop.funnything.net/admin/goods/store",this.postData,function() {
					_this.modifyDialogFormVisible = false
					_this.$message.success("修改成功")
					_this.showData()
				})
				//this.showData(this.pageDetail.currentPage)
					/*this.$ajax.post("https://shop.funnything.net/admin/goods/store",this.postData,{headers:{"x-wegoshop-token":this.token}})
						.then((response) => {
					})*/
			},
			handleClose:function() {
				this.modifyDialogFormVisible = false
				this.postData = {
					null:null,
					shop_id:this.shop_id,
					type: []}
			},
			searchGoods:function(value) {
				this.showData("",value)
			},
			optionCommand(command) {
				if (command[0].option == "del") {
					        this.$confirm('确认删除该商品吗？', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					          this.delGoods(command[0].data);
					        }).catch(() => {
					          this.$message({
					            type: 'info',
					            message: '已取消删除'
					          });          
					        });
				}else if(command[0].option == "modify"){
					this.postData = JSON.parse(JSON.stringify(command[0].data))
					this.postData.is_on_sale = (command[0].data.is_on_sale == 1 ? true : false)
				    this.postData.is_new = (command[0].data.is_new == 1 ? true : false)
				    this.postData.is_hot = (command[0].data.is_hot == 1 ? true : false)
					this.modifyDialogFormVisible = true
				}
				//this.$message('click on item ' + command);
			},
			getTime(time){
				const date = new Date(time)
				return date.getFullYear()+"年"+(date.getMonth()+1) +"月"+date.getDate()+"日 "+date.getHours()+" : "+date.getMinutes()+" : "+date.getSeconds()
			},
			showData(page = "") {
				let _this = this
				_this.loading = true
				this.getToServer("https://shop.funnything.net/admin/goods?page="+page+"&name="+_this.searchText+"&shop_id="+_this.shop_id,function(response) {
					_this.goodsData = response.data.data.data
					_this.pageDetail = response.data.data
					_this.loading = false
				})
			}
		},
		mounted: function() {
			this.showData()
		}
	}
</script>