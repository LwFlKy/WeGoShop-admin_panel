<template>
	<div class="shopInfoManage" v-loading="loading">
		<el-row>
			<el-col :xs="24" style="width: 500px;">
				<el-form :model="postData" :disabled="!handle.modify" :rules="rules" label-width="80px" ref="postData">

                    <el-form-item label="LOGO" required>
				  	    <pic-uploader @change="getTmpFileList" @delete="addDeleteFile" :tmpFileList="tmpFileList" name="logo" :new='false' prefix="shopPrimaryPic/logo" :limit=1 ref="pic-uploader"></pic-uploader>
				    </el-form-item> 
                  
                    <el-form-item label="店铺名" prop="name">
                        <el-input v-model="postData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商店分类" required>
                        <el-row>
                            <el-col :span=11>
                                <el-form-item prop="top_cate">
                                    <el-select v-model="top_cate">
                                    <el-option v-for="(item, index, key) in categoryData" :key="key" v-if="item.level == 1" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span=2>&nbsp;</el-col>
                            <el-col :span=11>
                                <el-form-item v-if="child" prop="child_cate">
                                    <el-select v-model="child_cate" placeholder="">
                                    <el-option v-for="(item, index, key) in categoryData" :key="key" v-if="item.level == 2 & item.parent_id == top_cate" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="店铺照片" required>
                            <pic-uploader @change="getTmpFileList" @delete="addDeleteFile" :tmpFileList="tmpFileList" name="gallery" :new='false' prefix="shopPrimaryPic/gallery" :limit=6 ref="pic-uploader"></pic-uploader>
                    </el-form-item>
                    <el-form-item label="地址" required>
                        <el-popover
                        style="margin-right: 10px;"
                        placement="top"
                        trigger="click">
                        <div id="container" style="height: 400px;width: 400px;">aaa</div>
                        <el-button slot="reference">选点</el-button>
                        </el-popover>
                        <span style="font-size: medium;">{{address.district}}{{address.town}}{{address.street}}</span>
                    </el-form-item>
                    <el-form-item prop="address">
                        <el-input v-model="postData.address" placeholder="补全地址"></el-input>
                    </el-form-item>
                    <el-form-item label="经纬度" required>
                        <el-row>
                            <el-col :span=11>
                                <el-form-item prop="point.lat">
                                    <el-input :disabled="true" v-model="postData.point.lat" placeholder="x">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span=2>&nbsp;</el-col>
                            <el-col :span=11>
                                <el-form-item prop="point.long">
                                    <el-input :disabled="true" v-model="postData.point.long" placeholder="y"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="营业时间" prop="opening_time">
                        <date-selector @getOpeningTime="getOpeningTime"></date-selector>
                        <!-- <el-input v-model="postData.opening_time" placeholder="工作日/节假日/周X~周X 00:00 ~ 24:00"></el-input>-->
                    </el-form-item>
                    <el-form-item label="联系方式" prop="contact">
                        <el-input v-model="postData.contact" type="number" placeholder="电话号码"></el-input>
                    </el-form-item>
                    <el-form-item v-if="modify">
                        <el-button type="primary" @click="submitShopInfo('postData')">提交</el-button>
                        <el-button @click="modify=false">取消</el-button>
                    </el-form-item>
                    </el-form>
                        <el-button type="primary" v-if="handle.modify && modify == false" @click="modify=true" >修改</el-button>
                        <el-button type="primary" v-if="handle.apply_modify" :loading="modifyApply" @click="submitApply" >提交修改申请</el-button>
                </el-col>
            </el-row>
        </div>
</template>
<style scoped>
	img{
		width: 100px;
	}
</style>
<script>
    import PicUploader from '../common/picUploader.vue'
    import DateSelector from '../common/dateSelector.vue'
	import { TMap } from '../../assets/tenmap.js' 
	export default {
	    components:{
            DateSelector,
	       PicUploader
	    },
		data(){
			return {
				address:{
			        district:"",
			        street:"",
			        town:"",
			        streetNumber:"",
			    },
				modifyApply:false,
				child:false,
				child_cate:"",
				top_cate:"",
				tmpFileList:{
					logo:[],
					gallery:[]
				},
				deleteFileList:{
					logo:[],
					gallery:[]
				},
				rules: {
					name: [
						{ required: true, message: '请输入店铺名称',trigger: 'blur' }
					],
					address:[
						{ required: true, message: '请输入地址',trigger: 'blur' }
					],
					lat:[
						{ required: true, message: '请输入纬度',trigger: 'blur' }
					],
					long:[
						{ required: true, message: '请输入经度',trigger: 'blur' }
					],
					contact:[
						{ required: true, message: '请输入联系方式',trigger: 'blur' }
					],
					opening_time:[
						{ required: true, message: '请输入营业时间',trigger: 'blur' }
					],
					child_cate:[
						{ required: true, message: '请选择子分类',trigger: 'blur' }
					],
					top_cate:[
						{ required: true, message: '请选择一级分类',trigger: 'blur' }
					],
				},
				postData: {
                    point:{
                        lat:null,
                        long:null
                    }
				},
				initData: {

				},
				adminName: {
					0:"超级管理员",
					1:"系统管理员",
					3:"商家管理员",
					4:"店小二"
				},
				searchText:"",
				checkAdminData:null,
				modify:false,
				addDialogFormVisible: false,
				modifyDialogFormVisible: false,
				adminDialogFormVisible: false,
				loading: false,
				token : this.getCookie("token"),
				pageDetail:{
					pageSize:null
				},
				categoryData:[],
				shopData:null,
				handle:{
					modify: 0
				}

			}
		},
		watch:{
            loading: function (params,params2,params3) {
                
            },
			top_cate: function() {
				this.postData.top_cate = this.top_cate
				this.child = []
				for (var i = this.categoryData.length - 1; i >= 0; i--) {
					if(this.top_cate == this.categoryData[i].parent_id){
						this.child.push(this.categoryData[i])
					}
				}
				if(this.child.length > 0){
					let a = true
					for (var i = this.child.length - 1; i >= 0; i--) {
						if (this.child[i].id == this.child_cate) {
							a = true
							break;
						}else{
							this.child_cate = null
						}
					}
					this.child = a
				}else{
					this.child = false
				}
			},
			child_cate: function() {
				this.postData.child_cate = this.child_cate
			}
		},
		methods:{
            getOpeningTime(para){
                this.postData.opening_time = para;
            },
			submitApply(){
				this.modifyApply = true
				this.postToServer("https://shop.funnything.net/admin/apply/addShopModifyApply",{shop_id:this.$store.state.userInfo.shop_id,type:"modify"},(response) => {
					if(response.data.errno == 0){
						setTimeout(() => {
							this.modifyApply = false
							this.$message.success('已提交申请')
						},500)
					}else{
						setTimeout(() => {
							this.modifyApply = false
							this.$message.error('请勿重复提交申请，等待申请通过')
						},500)
					}
				})
			},
			deleteFile(){
				if (this.deleteFileList.logo.length !== 0) {
					this.getToServer("https://shop.funnything.net/admin/qiniu/delete?key="+this.deleteFileList.logo[0],function(response) {})
				}else if(this.deleteFileList.gallery.length !== 0){
					for (var i = this.deleteFileList.gallery.length - 1; i >= 0; i--) {
		  				this.getToServer("https://shop.funnything.net/admin/qiniu/delete?key="+this.deleteFileList.gallery[i],function(response) {})
		  				this.postToServer("https://shop.funnything.net/admin/shop/delGalleryItem",{shop_id:this.$store.state.userInfo.shop_id,img_url:this.deleteFileList.gallery[i]},(response) => {
						})
					}
				}
			},
			addDeleteFile(key,name){
				this.deleteFileList[name].push(key)
			},
			getTmpFileList:function(res) {
			  this.tmpFileList[res.name] = res.fileList
			},
			showQRCode(){
				this.postToServer("https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=10_atWwZXwEht-A7qx-Vl2sxT7LmL8YwACfwtNN-EW8_xf5JOoORRlF1sG85ETwbR1dAfMQWYI4gWBzl8g5WdSBDYsH5h_BVNcBXkb3v6Nrx3yCGwT7yLSy9QmbO98VJCiAHAYMF",{"path":"/pages/map"},(res)=>{
					this.QRcode = res;
				})
			},
			async submitShopInfo(formName){
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						this.deleteFile()
						this.postData.gallery = []
						if (this.tmpFileList.logo.length > 0) {
							let data = await this.awPostToServer("https://shop.funnything.net/admin/qiniu/moveFile",
					  			{prefix:"shopPrimaryPic/logo/"+this.$store.state.userInfo.shop_id,tmpFileList:this.tmpFileList.logo})
								
								if (this.tmpFileList.logo[0].hasOwnProperty("response")) {
									this.postData.logo_url = "shopPrimaryPic/logo/"+this.$store.state.userInfo.shop_id+"/"+this.tmpFileList.logo[0].response.key.slice(-32)
								}else{
									this.postData.logo_url=this.tmpFileList.logo[0].name
								}

					  	}
						if (this.tmpFileList.gallery.length > 0) {
							let data = await this.awPostToServer("https://shop.funnything.net/admin/qiniu/moveFile",
					  			{prefix:"shopPrimaryPic/gallery/"+this.$store.state.userInfo.shop_id,tmpFileList:this.tmpFileList.gallery})
							for (var i = this.tmpFileList.gallery.length - 1; i >= 0; i--) {
								if (this.tmpFileList.gallery[i].hasOwnProperty("response")) {
									this.postData.gallery.push("shopPrimaryPic/gallery/"+this.$store.state.userInfo.shop_id+"/"+this.tmpFileList.gallery[i].response.key.slice(-32))
								}else{
									this.postData.gallery.push(this.tmpFileList.gallery[i].name)
								}
							}
					  	}
					  	if (this.child == true) {
							this.postData.parent_type_id = this.top_cate
					  		this.postData.type_id = this.child_cate
					  	}else{
					  		this.postData.type_id = this.top_cate
					  	}
                          this.postData.type = 'golive'
                          this.postData.address = this.address.district + this.address.town + this.address.street + this.postData.address
					  	this.postToServer("https://shop.funnything.net/admin/apply/addShopGoliveApply",
					  			this.postData,(res) => {
					  				if (res.data.errno == 0) {
					  					this.$message.success("提交成功，请等待审核")
					  				}else{
					  					this.$message.fail("提交失败，请刷新后重新提交")
					  				}
					  				this.modify = false
					  				this.loading = false
					  				this.showData()
					  			})

					}
				})
			},
			async showData(page = "") {
                this.loading = true
				let ApplyData = await this.awPostToServer("https://shop.funnything.net/admin/apply/getApplyItem",{shopid:this.$store.state.userInfo.shop_id,type:'golive'})
                let DBData = await this.awGetToServer("https://shop.funnything.net/admin/shop/info?id="+this.$store.state.userInfo.shop_id)
				if (ApplyData.data.errno == 0) {
                    this.postData = ApplyData.data.data.content
					this.initData = ApplyData.data.data.content
				}else{	
					this.postData = DBData.data.data
					this.initData = DBData.data.data
                }
                this.handle = DBData.data.data.handle
                
				this.loading = false
				
				let response = await this.awGetToServer("https://shop.funnything.net/admin/category")
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
		async mounted() {
            await this.showData()
            
            
            // ===================================================================================
            // 初始化腾讯地图
            
			TMap().then(qq => {
				let latitude = 23.021604
				let longitude = 113.123474
				let zoom = 10
				if (this.postData.hasOwnProperty("latitude")) {
					if (this.postData.latitude !== "") {
						latitude = this.postData.latitude
						longitude = this.postData.longitude
						zoom = 20
					}
				}
				this.map = new qq.maps.Map(document.getElementById("container"), {
					// 地图的中心地理坐标。
					center: new qq.maps.LatLng(latitude,longitude),
					zoom: zoom
				});
				this.marker = new qq.maps.Marker({
				            position:new qq.maps.LatLng(latitude,longitude),
				            map:this.map
				})
		        qq.maps.event.addListener(this.map, 'center_changed', (res) => {
		        	this.postData.point.latitude = this.map.getCenter().lat
		        	this.postData.point.longitude = this.map.getCenter().lng
					if(this.mouseState){
					}
		        	this.marker.setMap(null)
					this.marker = new qq.maps.Marker({
					            position:new qq.maps.LatLng(this.map.getCenter().lat, this.map.getCenter().lng),
					            map:this.map
					})
					this.latLng = new qq.maps.LatLng(this.map.getCenter().lat, this.map.getCenter().lng);
					//this.geocoder.getAddress(latLng);

			    });
				let a = qq.maps.event.addListener(this.map, 'mouseup',(res) =>{
					this.geocoder.getAddress(this.latLng)
				})
		        /*let searchService = new qq.maps.SearchService({
		        	complete:(res)=>{
		        	}
		        })
			    var customZoomDiv = document.createElement("input");
			    customZoomDiv.setAttribute("placeholder","搜索地点")
			    customZoomDiv.setAttribute("style","padding:5px;")
			    customZoomDiv.addEventListener("keypress" , (res) => {
			    	if(res.keyCode == 13){

			    	}
			    })
				this.map.controls[qq.maps.ControlPosition.TOP_CENTER].push(customZoomDiv);*/
			    this.geocoder = new qq.maps.Geocoder({
			        complete : (result) => {
			        	this.address.district = result.detail.addressComponents.district
			        	this.address.street = result.detail.addressComponents.street
			        	this.address.town = result.detail.addressComponents.town
                        this.address.streetNumber = result.detail.addressComponents.streetNumber
			        }
			    });
            });
            // ===================================================================================
			//this.showQRCode()
		}
	}
</script>