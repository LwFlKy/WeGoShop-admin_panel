<template>
	<div class="promotionManage">
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span>已上线商品</span>
		  </div>
		  
		<el-table
			v-loading="loading"
			:data="PromotionData.GoliveData"
			style="width: 100%">
		    <el-table-column type="expand">
		      <template slot-scope="props">
			        <el-form label-position="left" inline class="table-expand">
			          <el-form-item label="套餐名称">
			            <span>{{ props.row.name }}</span>
			          </el-form-item>
			          <el-form-item label="套餐 ID">
			            <span>{{ props.row.id }}</span>
			          </el-form-item>
			          <el-form-item label="套餐价格">
			            <span>￥{{ props.row.price}}</span>
			          </el-form-item>
			          <el-form-item label="添加时间">
			            <span>{{ getTime(props.row.add_time)}}</span>
			          </el-form-item>
			          <el-form-item label="套餐描述" style="overflow: hidden;">
			          	{{ props.row.promotion_brief}}
			          </el-form-item><br>
			          <el-form-item label="套餐内容">
			          </el-form-item>
			          	    <el-table
						      :data="props.row.content"
						      style="width: 100%">
						      <el-table-column
						        prop="name"
						        label="品项名"
						        width="180">
						      </el-table-column>
						      <el-table-column
						        prop="price"
						        label="单价"
						        width="180">
						      </el-table-column>
						      <el-table-column
						        label="数量/规格">
						        <template slot-scope="scope">{{scope.row.sum}}/{{scope.row.unit}}</template>
						      </el-table-column>
						    </el-table>
			        </el-form>
		      </template>
		    </el-table-column>
			<el-table-column
				prop="id"
				label="ID">
			</el-table-column>
			<el-table-column
				prop="name"
				label="套餐名">
			</el-table-column>
				<el-table-column
					label="状态">
					<template slot-scope="scope">
				        <el-tag v-for="(value, key, index) in PromotionStatus" :key="key" v-if="key == 'is_on_sale' ? true : scope.row[key] == 1" :type="value[scope.row[key]].type">{{value[scope.row[key]].name}}</el-tag>
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
					  </el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		</el-card>

		<br>
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span>审核中商品</span>
		    <el-button type="primary" style="float: right" size="small" @click="addDialogFormVisible = true">添加新套餐<i class="el-icon-circle-plus el-icon--right"></i></el-button>
		  </div>

		<el-table
			v-loading="loading"
			:data="PromotionData.ApplyData"
			style="width: 100%">
		    <el-table-column type="expand">
		      <template slot-scope="props">
			        <el-form label-position="left" inline class="table-expand">
			          <el-form-item label="套餐名称">
			            <span>{{ props.row.name }}</span>
			          </el-form-item>
			          <el-form-item label="套餐 ID">
			            <span>{{ props.row.id }}</span>
			          </el-form-item>
			          <el-form-item label="套餐价格">
			            <span>￥{{ props.row.price}}</span>
			          </el-form-item>
			          <el-form-item label="添加时间">
			            <span>{{ getTime(props.row.add_time)}}</span>
			          </el-form-item>
			          <el-form-item label="套餐描述" style="overflow: hidden;">
			          	{{ props.row.promotion_brief}}
			          </el-form-item><br>
			          <el-form-item label="套餐内容">
			          </el-form-item>
			          	    <el-table
						      :data="props.row.content"
						      style="width: 100%">
						      <el-table-column
						        prop="name"
						        label="品项名"
						        width="180">
						      </el-table-column>
						      <el-table-column
						        prop="price"
						        label="单价"
						        width="180">
						      </el-table-column>
						      <el-table-column
						        label="数量/规格">
						        <template slot-scope="scope">{{scope.row.sum}}/{{scope.row.unit}}</template>
						      </el-table-column>
						    </el-table>
			        </el-form>
		      </template>
		    </el-table-column>
			<el-table-column
				prop="id"
				label="ID">
			</el-table-column>
			<el-table-column
				prop="name"
				label="套餐名">
			</el-table-column>
				<el-table-column
					label="状态">
					<template slot-scope="scope">
				        <el-tag v-for="(value, key, index) in PromotionStatus" :key="key" v-if="key == 'is_on_sale' ? true : scope.row[key] == 1" :type="value[scope.row[key]].type">{{value[scope.row[key]].name}}</el-tag>
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
		</el-card>
		<el-dialog title="添加套餐" :visible.sync="addDialogFormVisible">
			<el-form :model="postData" label-position="right" label-width="80px" :rules="rules" ref="postData">
				<el-form-item label="商品展示图片">
					<pic-uploader @change="getTmpFileList" @delete="addDeleteFile" :tmpFileList="tmpFileList" :limit=6 :new='true' name="promotion" prefix="shopPrimaryPic/promotion" ref="pic-uploader"></pic-uploader>
				</el-form-item>
				<el-form-item label="套餐名" prop="name">
					<el-input v-model="postData.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="套餐简述" prop="promotion_brief">
					<el-input v-model="postData.promotion_brief" auto-complete="off"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="价格" prop="price">
							<el-input v-model="postData.price" type="number" auto-complete="off"><template slot="append">元</template></el-input>
						</el-form-item>	
					</el-col>
				</el-row>
				<el-form-item label="有效时期" prop="start_date">	
				    <el-date-picker
				      v-model="time"
				      type="daterange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
				</el-form-item>
				<el-form-item label="有效时段" prop="allow_time">
					<el-form-item v-for="(item, index, key) in postData.allow_time" :key="key">
						<el-row style="margin-bottom: 10px">
							<el-col :span="20">
							  <el-time-picker
							    is-range
							    v-model="item.start"
							    range-separator="至"
							    start-placeholder="开始时间"
							    end-placeholder="结束时间"
							    placeholder="选择时间范围">
							  </el-time-picker>
							</el-col>
							<el-col :span="4"><el-button type="text" icon="el-icon-circle-close" style="margin: 0 auto;" @click="postData.allow_time.splice(index,1)">删除</el-button></el-col>
						</el-row>
					</el-form-item>
					<el-button type="text" icon="el-icon-circle-plus" style="margin: 0 auto;" @click='postData.allow_time.push({start:"",end:""})'>添加一项</el-button>
				</el-form-item>
				<el-form-item label="套餐内容">	
					<el-form-item v-for="(item, index, key) in postData.content" :key="key">
						<el-row style="margin-bottom: 10px">
							<el-col :span="5"><el-input v-model="item.name" placeholder="单项名称"></el-input></el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="4"><el-input type="number" v-model="item.price" placeholder="单价"></el-input></el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="3"><el-input v-model="item.sum" placeholder="数量"></el-input></el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="4"><el-input v-model="item.unit" placeholder="单位"></el-input></el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="4"><el-button type="text" icon="el-icon-circle-close" style="margin: 0 auto;" @click="postData.content.splice(index,1)">删除</el-button></el-col>
						</el-row>
					</el-form-item>
					<el-button type="text" icon="el-icon-circle-plus" style="margin: 0 auto;" @click='postData.content.push({name:"",price:null,sum:null,unit:""})'>添加一项</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addDialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click='addPromotion("postData")'>确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改套餐信息" :before-close="handleClose" :visible.sync="modifyDialogFormVisible">
			<el-form :model="postData" label-position="right" label-width="80px" :rules="rules" ref="postData">
				<el-form-item label="商品展示图片">
					<pic-uploader @change="getTmpFileList" @delete="addDeleteFile" :new="false" :tmpFileList="tmpFileList" :limit=6 name="promotion" :prefix='"shopPrimaryPic/promotion/"+postData.id' :id="postData.id" ref="modify-uploader"></pic-uploader>
				</el-form-item>
				<el-form-item label="套餐名" prop="name">
					<el-input v-model="postData.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="套餐简述" prop="promotion_brief">
					<el-input v-model="postData.promotion_brief" auto-complete="off"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="价格" prop="price">
							<el-input v-model="postData.price" type="number" auto-complete="off"><template slot="append">元</template></el-input>
						</el-form-item>	
					</el-col>
				</el-row>
				<el-form-item label="有效时期" prop="start_date">	
				    <el-date-picker
				      v-model="time"
				      type="daterange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
				</el-form-item>
				<el-form-item label="有效时段" prop="allow_time">
					<el-form-item v-for="(item, index, key) in postData.allow_time" :key="key">
						<el-row style="margin-bottom: 10px">
							<el-col :span="20">
							  <el-time-picker
							    is-range
							    v-model="item.start"
							    range-separator="至"
							    start-placeholder="开始时间"
							    end-placeholder="结束时间"
							    placeholder="选择时间范围">
							  </el-time-picker>
							</el-col>
							<el-col :span="4"><el-button type="text" icon="el-icon-circle-close" style="margin: 0 auto;" @click="postData.allow_time.splice(index,1)">删除</el-button></el-col>
						</el-row>
					</el-form-item>
					<el-button type="text" icon="el-icon-circle-plus" style="margin: 0 auto;" @click='postData.allow_time.push({start:"",end:""})'>添加一项</el-button>
				</el-form-item>
				<el-form-item label="套餐内容">	
					<el-form-item v-for="(item, index, key) in postData.content" :key="key">
						<el-row style="margin-bottom: 10px">
							<el-col :span="5"><el-input v-model="item.name" placeholder="单项名称"></el-input></el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="4"><el-input type="number" v-model="item.price" placeholder="单价"></el-input></el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="3"><el-input v-model="item.sum" placeholder="数量"></el-input></el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="4"><el-input v-model="item.unit" placeholder="单位"></el-input></el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="4"><el-button type="text" icon="el-icon-circle-close" style="margin: 0 auto;" @click="postData.content.splice(index,1)">删除</el-button></el-col>
						</el-row>
					</el-form-item>
					<el-button type="text" icon="el-icon-circle-plus" style="margin: 0 auto;" @click='postData.content.push({name:"",price:null,sum:null,unit:""})'>添加一项</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click='modifyPromotion("postData")'>确 定</el-button>
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
	import PromotionEditor from '../common/UE.vue'
	import PicUploader from '../common/picUploader.vue'
	import * as qiniu from 'qiniu-js'
	export default {
		components:{
			PromotionEditor,
			PicUploader
		},
		data(){
			return {
				allow_time:[],
				rules: {
					name: [
						{ required: true, message: '请输入套餐名',trigger: 'blur' }
					],
					promotion_brief:[
						{ required: true, message: '请输入套餐简述',trigger: 'blur' }
					],
					price:[
						{ required: true, message: '请输入价格',trigger: 'blur' }
					],
					Promotion_unit:[
						{ required: true, message: '请输入单位',trigger: 'blur' }
					],
					start_date:[
						{ required: true, message: '请选择日期',trigger: 'blur' }
					]
				},
				deleteFileList:{
					promotion:[]
				},
				content:"",
				postData: {
					shop_id:this.shop_id,
					content:[{name:"",price:null,sum:null,unit:""}],
					allow_time:[]
				},
				PromotionStatus: {
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
				time:"",
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
				PromotionData:{
					GoliveData:[],
					ApplyData:[]
				},
				content:null
			}
		},
		watch:{
			addDialogFormVisible: function() {
				this.postData = {
					shop_id:this.shop_id,
					content:[{name:"",price:null,sum:null,unit:""}],
					allow_time:[]
				}
			},
			time: function() {
				if (this.time == 'reset') {
					this.time == ''
				}else{
				this.postData.start_date = this.time[0].getFullYear()+"-"+(parseInt(this.time[0].getMonth())+1)+"-"+this.time[0].getDate()
				this.postData.end_date = this.time[1].getFullYear()+"-"+(parseInt(this.time[1].getMonth())+1)+"-"+this.time[1].getDate()
				}
			}
		},
		methods:{
			deleteFile(id){
				if(this.deleteFileList.promotion.length !== 0){
					for (var i = this.deleteFileList.promotion.length - 1; i >= 0; i--) {
						this.deleteFileList.promotion[i] = "shopPrimaryPic/promotion/"+id+"/"+this.shop_id+"/"+this.deleteFileList.promotion[i].slice(-32)
		  				this.getToServer("https://shop.funnything.net/admin/qiniu/delete?key="+this.deleteFileList.promotion[i],function(response) {})
		  				this.postToServer("https://shop.funnything.net/admin/promotion/delGalleryItem",{promotion_id:id,img_url:this.deleteFileList.promotion[i]},(response) => {
						})
					}
				}
			},
			addDeleteFile(key,name){
				this.deleteFileList[name].push(key)
			},
		    clear(){
		      this.$refs["pic-uploader"].clear()
		    },
			getTmpFileList:function(tmpFileList) {
				this.tmpFileList = tmpFileList.fileList
			},
			descChange:function(content) {
				this.postData.Promotion_desc = content
			},
			async addPromotion(formName){
				let _this = this
				this.$refs[formName].validate(async (valid) => {
					if(valid){
						if (this.tmpFileList.length > 0) {
							this.postData.gallery = []
							let data = await this.awPostToServer("https://shop.funnything.net/admin/qiniu/moveFile",
					  			{prefix:"shopPrimaryPic/promotion/"+this.$store.state.userInfo.shop_id,tmpFileList:this.tmpFileList})
							for (var i = this.tmpFileList.length - 1; i >= 0; i--) {
								this.postData.gallery.push("shopPrimaryPic/promotion/"+this.$store.state.userInfo.shop_id+"/"+this.tmpFileList[i].response.key.slice(-32))
							}
					  	}
						this.postData.shop_id = this.shop_id
						this.postData.allow_time = JSON.stringify(this.postData.allow_time)
					  	this.postToServer("https://shop.funnything.net/admin/promotion/store",
					  			this.postData,(res) => {
					  				this.time = "reset"
					  				this.showData()
									this.postData = {
										shop_id:this.shop_id,
										content:[{name:"",price:null,sum:null,unit:""}]}
					  				this.modify = false
					  				this.loading = false
					  				this.$refs["pic-uploader"].clear()
					  				this.$message.success("修改成功")
									this.addDialogFormVisible = false
					  	})
					}
				});
			},
			delPromotion:function(id){
				this.postToServer("https://shop.funnything.net/admin/promotion/destory",{id:id,is_delete:1},(res) => {
					this.showData(this.pageDetail.currentPage)
					this.$message.success("删除成功")
				})
					/*this.$ajax.post("https://shop.funnything.net/admin/promotion/store",this.postData,{headers:{"x-wegoshop-token":this.token}})
						.then((response) => {
					})*/
			},
			async modifyPromotion(formName){
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						this.postData.gallery = []
						this.deleteFile(this.postData.id)
						if (this.tmpFileList.length > 0) {
							let data = await this.awPostToServer("https://shop.funnything.net/admin/qiniu/moveFile",
					  			{prefix:"shopPrimaryPic/promotion/"+this.$store.state.userInfo.shop_id,tmpFileList:this.tmpFileList})
							for (var i = this.tmpFileList.length - 1; i >= 0; i--) {
								if (this.tmpFileList[i].hasOwnProperty("response")) {
									this.postData.gallery.push("shopPrimaryPic/promotion/"+this.$store.state.userInfo.shop_id+"/"+this.tmpFileList[i].response.key.slice(-32))
								}else{
									this.postData.gallery.push(this.tmpFileList[i].name)
								}
								
							}
					  	}
						let _this = this
						this.postData.allow_time = JSON.stringify(this.postData.allow_time)
						delete this.postData.add_time
						this.postToServer("https://shop.funnything.net/admin/promotion/store",this.postData,() => {
							this.tmpFileList = []
							this.modifyDialogFormVisible = false
							this.$message.success("修改成功")
							this.showData()
							this.$refs["modify-uploader"].multiClear()
						})
					}
				});
				//this.showData(this.pageDetail.currentPage)
					/*this.$ajax.post("https://shop.funnything.net/admin/promotion/store",this.postData,{headers:{"x-wegoshop-token":this.token}})
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
			searchPromotion:function(value) {
				this.showData("",value)
			},
			optionCommand(command) {
				if (command[0].option == "del") {
					        this.$confirm('确认删除该套餐吗？', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					          this.delPromotion(command[0].data);
					        }).catch(() => {
					          this.$message({
					            type: 'info',
					            message: '已取消删除'
					          });          
					        });
				}else if(command[0].option == "modify"){
					this.postData = JSON.parse(JSON.stringify(command[0].data))
					this.postData.allow_time = JSON.parse(this.postData.allow_time)
					this.postData.is_on_sale = (command[0].data.is_on_sale == 1 ? true : false)
					this.time = [new Date(this.postData.start_date),new Date(this.postData.end_date)]
					this.modifyDialogFormVisible = true
					/*if (this.$refs.hasOwnProperty("modify-uploader")) {
        				this.$refs["modify-uploader"].getPicList("shopPrimaryPic/promotion/"+this.postData.id)
					}*/
				}
				//this.$message('click on item ' + command);
			},
			getTime(time){
				const date = new Date(time)
				return date.getFullYear()+"年"+(date.getMonth()+1) +"月"+date.getDate()+"日 "+date.getHours()+" : "+date.getMinutes()+" : "+date.getSeconds()
			},
			showData(page = "") {
				this.loading = true
				this.getToServer("https://shop.funnything.net/admin/promotion?page="+page+"&name="+this.searchText+"&shop_id="+this.shop_id,(response) => {
					this.PromotionData = {}

					this.PromotionData.ApplyData = response.data.data.ApplyData
					for (var i = this.PromotionData.ApplyData.length - 1; i >= 0; i--) {
						this.PromotionData.ApplyData[i].content = JSON.parse(this.PromotionData.ApplyData[i].content)
					}

					this.PromotionData.GoliveData = response.data.data.GoliveData
					for (var i = this.PromotionData.GoliveData.length - 1; i >= 0; i--) {
						this.PromotionData.GoliveData[i].content = JSON.parse(this.PromotionData.GoliveData[i].content)
					}
					this.loading = false
				})
			}
		},
		mounted: function() {
			this.showData()
		}
	}
</script>