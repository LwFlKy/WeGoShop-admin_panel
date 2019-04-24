<template>
  <!-- bidirectional data binding（双向数据绑定） -->
  <div>
    <el-popover
      ref="popover"
      trigger="click"
      @show="getPicList">
      <div class="upload-list">
      <el-upload
        class="pic-uploader"
        ref="upload"
        :action="$store.state.uploadUrl"
        accept="image/*"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :data="postData"
        :on-error="handleError"
        :before-upload="handleBeforeUpload"
        :on-progress="handlerOnProgress">
        <el-progress v-if="imageUrl" type="circle" :width=80 :percentage="percentage"></el-progress>
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus pic-uploader-icon"></i>
      </el-upload>
        <div class="pic-item" v-for="(value, key, index) in fileList"  backgroud>
          <img :src=value.url class="avatar" @click="putImg(value.name)">
          <div @click="deletePic(key)" class="layer">
                <i class="el-icon-delete"></i>
          </div>
        </div></div>
    </el-popover>
    <quill-editor v-model="content"
                  ref="$VueQuillEditor"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                  @change="onEditorChange($event)">
      <div id="toolbar" slot="toolbar">
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
          <button class="ql-strike"></button>
          <select class="ql-color">
            <option selected="selected"></option>
            <option value="#e60000"></option>
            <option value="#ff9900"></option>
            <option value="#ffff00"></option>
            <option value="#008a00"></option>
            <option value="#0066cc"></option>
            <option value="#9933ff"></option>
            <option value="#ffffff"></option>
            <option value="#facccc"></option>
            <option value="#ffebcc"></option>
            <option value="#ffffcc"></option>
            <option value="#cce8cc"></option>
            <option value="#cce0f5"></option>
            <option value="#ebd6ff"></option>
            <option value="#bbbbbb"></option>
            <option value="#f06666"></option>
            <option value="#ffc266"></option>
            <option value="#ffff66"></option>
            <option value="#66b966"></option>
            <option value="#66a3e0"></option>
            <option value="#c285ff"></option>
            <option value="#888888"></option>
            <option value="#a10000"></option>
            <option value="#b26b00"></option>
            <option value="#b2b200"></option>
            <option value="#006100"></option>
            <option value="#0047b2"></option>
            <option value="#6b24b2"></option>
            <option value="#444444"></option>
            <option value="#5c0000"></option>
            <option value="#663d00"></option>
            <option value="#666600"></option>
            <option value="#003700"></option>
            <option value="#002966"></option>
            <option value="#3d1466"></option></select>
          <select class="ql-background">
            <option selected="selected"></option>
            <option value="#e60000"></option>
            <option value="#ff9900"></option>
            <option value="#ffff00"></option>
            <option value="#008a00"></option>
            <option value="#0066cc"></option>
            <option value="#9933ff"></option>
            <option value="#ffffff"></option>
            <option value="#facccc"></option>
            <option value="#ffebcc"></option>
            <option value="#ffffcc"></option>
            <option value="#cce8cc"></option>
            <option value="#cce0f5"></option>
            <option value="#ebd6ff"></option>
            <option value="#bbbbbb"></option>
            <option value="#f06666"></option>
            <option value="#ffc266"></option>
            <option value="#ffff66"></option>
            <option value="#66b966"></option>
            <option value="#66a3e0"></option>
            <option value="#c285ff"></option>
            <option value="#888888"></option>
            <option value="#a10000"></option>
            <option value="#b26b00"></option>
            <option value="#b2b200"></option>
            <option value="#006100"></option>
            <option value="#0047b2"></option>
            <option value="#6b24b2"></option>
            <option value="#444444"></option>
            <option value="#5c0000"></option>
            <option value="#663d00"></option>
            <option value="#666600"></option>
            <option value="#003700"></option>
            <option value="#002966"></option>
            <option value="#3d1466"></option></select>
          <select class="ql-align"></select>
          <select class="ql-size">
            <option value="small"></option>
            <option selected></option>
            <option value="large"></option>
            <option value="huge"></option></select>
        </span>

        <span class="ql-formats">
          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-link"></button>
          <button id="custom-button" class="ql-image" v-popover:popover>Click</button>
        </span>
      </div>
    </quill-editor>
  </div>
 
  <!-- Or manually control the data synchronization（或手动控制数据流） -->
</template>
<style>
    .el-progress{

      opacity: 1;
      position: absolute;
      right: 0;
      background-color: #ffffff;
    }
    .pic-item:hover .layer{
        opacity:1;
    }
    .pic-item .layer{
        opacity:0;
        transition:all .3s;
    }
    .pic-item .layer{    
      width: 100%;
      height: 16px;
      position:absolute;
      bottom:0;
      color:#fff;
      text-align:center;
      z-index:5;
      background: rgba(0,0,0,.4);
    }
    .layer i{
        position:absolute;
        bottom:2px;
        left:34px;
        font-size:0.5em;
    }

    .pic-item{
      cursor: pointer;
      float:left;
      position:relative;
      width: 80px;
      height: 80px;
      margin: 5px;    
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
    }
    .upload-list{
      overflow-y: auto;
      display: flex;
      max-width: 460px;
      max-height: 300px;
      display:block;
    }
    .upload-list img{
      width: 80px;
      height: 80px;
    }
    .el-popover .el-upload-list{
      display: none;
    }
    .pic-uploader{

    }
    .pic-uploader .el-upload {
      width: 80px;
      height: 80px;
      margin: 5px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
    }
    .pic-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
    }
    .avatar {
      width: 80px;
      height: 80px;
      display: block;
    }
</style>
<script>

  const toolbarOptions = [
    //['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    //['blockquote', 'code-block'],
    
    //[{'header': 1}, {'header': 2}],               // custom button values
    //[{'list': 'ordered'}, {'list': 'bullet'}],
    //[{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    //[{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    //[{'direction': 'rtl'}],                         // text direction

    //[{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    //[{'header': [1, 2, 3, 4, 5, 6, false]}],

    //[{'color': []}, {'background': []}],          // dropdown with defaults from theme
    //[{'font': []}],
    //[{'align': []}],
    ['link', 'image', 'video'],
    //['clean']                                         // remove formatting button
  ]
  import {quillEditor, Quill} from 'vue-quill-editor'
  import ImageResize from 'quill-image-resize-module'
  Quill.register('modules/imageResize', ImageResize)
  export default {
    data () {
      return {
        imageUrl: '',
        postData:{
        },
        fileList:[],
        filename:"",
        dialogImageUrl: '',
        dialogVisible: false,
        content:'',
        percentage:0,
        editorOption: {
          placeholder: '在此编辑商品描述',
          theme: 'snow',  // or 'bubble'
          modules: {
            //toolbar:,
            toolbar: {
                _this:this,
                container: "#toolbar",  // 工具栏
                handlers: {
                    'image': function (value) {
                        if (value) {
                        } else {
                            //this.quill.format('image', false);
                        }
                    }
                }
            },
            imageResize: {
              displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              },
              modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
            }
          }
        }
      }
    },
    components:{
      quillEditor
    },
    // manually control the data synchronization
    // 如果需要手动控制数据同步，父组件需要显式地处理changed事件
    methods: {
      clear(){
        let quill = this.$refs.$VueQuillEditor.quill
        quill.deleteText(0,quill.getLength())
      },
      handlerOnProgress(event, file, fileList){
        this.percentage = parseInt(event.percent)
      },
      handleBeforeUpload(file){
        this.imageUrl = URL.createObjectURL(file);
      },
      handleError(err,file,fileList){
      },
      handleRemove(file, fileList) {
          this.deleteFile(file.response.key)
        if (file.size) {
        }else{
          this.deleteFile(file.name)
        }
      },
      deletePic(key){
        if (this.fileList[key].hasOwnProperty("file")) {
          this.deleteFile(this.fileList[key].name)
          this.fileList.splice(key,1)
        }else{
          this.deleteFile(this.fileList[key].name)
          this.fileList.splice(key,1)
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleSuccess(response,file){
        this.percentage = 0
        this.imageUrl = ''
        this.getToken()
        this.getPicList()
      },
      onEditorBlur(quill) {
      },
      onEditorFocus(quill) {
      },
      onEditorReady(quill) {
      },
      onEditorChange({ quill, html, text }) {
        this.content = html
        this.$emit('change',html); 
      },
      putImg(name){
        let quill = this.$refs.$VueQuillEditor.quill
        let length = quill.getSelection().index;
        quill.insertEmbed(length, 'image', "http://p9dkk6pbv.bkt.clouddn.com/"+name)
        quill.setSelection(length + 1)
      },
      getPicList(){
        let _this = this
        this.getToServer("https://shop.funnything.net/admin/qiniu/picList?prefix=img/"+this.$store.state.userInfo.shop_id+"/",function(response) {
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
          _this.fileList = []
          response.data.data.items = response.data.data.items.sort(compare) 
          for (var i = 0; i < response.data.data.items.length; i++) {
            _this.fileList.push({name:response.data.data.items[i].key,url:"http://p9dkk6pbv.bkt.clouddn.com/"+response.data.data.items[i].key})
          }
        })
      },
      getToken(){
        let _this = this
        this.getToServer("https://shop.funnything.net/admin/qiniu/uploadToken?prefix=img/"+this.$store.state.userInfo.shop_id,function(response) {
          _this.postData.token = response.data.data.token
          _this.postData.key = response.data.data.filename
        })
      },
      deleteFile(key){
        let _this = this
        this.getToServer("https://shop.funnything.net/admin/qiniu/delete?key="+key,function(response) {
        })
      }
    },
    computed: {
      editor() {
        
      }
    },
    mounted() {
      this.getToken()
    }
  }
</script>