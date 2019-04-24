<template><div>
	<el-upload
	  :action="$store.state.uploadUrl"
    ref="upload"
	  list-type="picture-card"
      :data="postData"
      :limit='limit'
  	  :on-exceed="handleExceed"
	  :on-preview="handlePictureCardPreview"
	  :on-remove="handleRemove"
	  :on-success="handleSuccess"
      :on-progress="handleProgress"
      :on-error="handleError"
    :file-list="fileList">
	  <i class="el-icon-plus"></i>
	</el-upload>
	<el-dialog :visible.sync="dialogVisible">
	  <img width="100%" :src="dialogImageUrl" alt="">
	</el-dialog>
</div></template>
<style>
	.el-upload--picture-card{
		width: 80px;
		height: 80px;
		line-height: 90px;
	}
	.el-upload-list--picture-card .el-upload-list__item{
		width: 80px;
		height: 80px;
	}
	.el-upload-list--picture-card .el-upload-list__item-actions span+span {
		margin: 0;
	}
	.el-upload-list__item-preview .el-icon-zoom-in{
		display: none;
	}
</style>
<script>
  export default {
    props: ['limit','name',"prefix","new","id"],
    data() {
      return {
      	postData:{},
        dialogImageUrl: '',
        dialogVisible: false,
        fileList:[],
        deleteList:[],
        now_id:null
      };
    },
    methods: {
        handleProgress(event, file, fileList){
            
        },
        handleError(err, file, fileList){
            
        },
      multiClear(){
        //this.fileList = []
        this.clear()
        this.now_id = null
        this.getPicList("shopPrimaryPic/promotion/"+this.id)
        //this.$emit('change', this.fileList); 
      },
      clear(){
        //this.fileList = []
        this.$refs.upload.clearFiles();
        //this.$emit('change', this.fileList); 
      },
      handleRemove(file, fileList) {
        if(file.hasOwnProperty('response')){
          this.deleteFile(file.response.key)
        }else{
          this.$emit("delete",file.name,this.name)
        }
        this.$emit('change', {fileList:fileList,name:this.name}); 
        /*if (file.response.key) {
        }*/
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleSuccess(response,file, fileList){
      	this.fileList = fileList
        this.$emit('change', {fileList:fileList,name:this.name}); 
        this.getToken()
      },
      handleExceed(files, fileList) {
        this.$message.warning(`最多`+this.limit+`张图片`);
      },
      deleteFile(key){
        this.getToServer("https://shop.funnything.net/admin/qiniu/delete?key="+key,function(response) {
        })
      },
      getToken(){
        this.getToServer("https://shop.funnything.net/admin/qiniu/uploadToken?prefix=tmp/"+this.name+"/"+this.$store.state.userInfo.shop_id,(response) => {
          this.postData.token = response.data.data.token
          this.postData.key = response.data.data.filename
        })
      },
      getPicList(prefix){
        this.getToServer("https://shop.funnything.net/admin/qiniu/picList?prefix="+prefix+"/"+this.$store.state.userInfo.shop_id,(response) => {
          var compare = function (obj1, obj2) {
              var val1 = obj1.putTime;
              var val2 = obj2.putTime;
              if (val1 < val2) {
                  return 1;
              } else if (val1 > val2) {
                  return -1;
              } else {
                  return 0;
              }            
          }
          this.fileList = []
          response.data.data.items = response.data.data.items.sort(compare) 
          for (var i = 0; i < response.data.data.items.length; i++) {
            this.fileList.push({name:response.data.data.items[i].key,url:"http://qiniu.funnything.net/"+response.data.data.items[i].key})
          }
          this.$emit('change', {fileList:this.fileList,name:this.name}); 
        })
      }
    },
    watch:{
      id:function() {
        if (this.id !== undefined && this.id !== this.now_id) {
          this.getPicList("shopPrimaryPic/promotion/"+this.id)
          this.now_id = this.id
        }
      }
    },
    mounted() {
      this.getToken()
      if(!this.new){
        this.getPicList(this.prefix)
      }
    }
  }
</script>