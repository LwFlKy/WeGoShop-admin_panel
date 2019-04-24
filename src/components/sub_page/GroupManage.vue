<template>
    <div>
        <el-row :gutter="20">
		  <el-col :span="6">		
		  	<el-button type="primary" size="small" @click="addDialogVisible = true">添加新分组<i class="el-icon-circle-plus el-icon--right"></i></el-button>
		  </el-col>
		  <el-col :span="6" :offset="12">
		  </el-col>

		</el-row>
        <el-table
        :data="groupData"
        style="width: 100%">
            <el-table-column
            prop="id"
            label="ID">
            </el-table-column>
            <el-table-column
            prop="name"
            label="分组名称">
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="openModifyDialog(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑框 --> 
        <el-dialog
        title="编辑分组"
        :visible.sync="modifyDialogVisible"
        width="50%">
        <div>
            <span>
                <el-form v-if="authVisible" label-position="left" label-width="80px" :model="handleData">
                    <el-form-item label="名称">
                        <el-input v-model="handleData.name"></el-input>
                    </el-form-item>
                    <div style="width:100%;font-size:20px;border-bottom:1px soild #dedede;">权限</div>
                    <el-form-item v-for="(menu, key) in allMenuInfo" :label="menu.name" :key="key">
                        <el-checkbox v-if="menu.type === 'single'" v-model='checkState[key]' :checked="checkState[key]" @change="change">{{menu.name}}</el-checkbox>
                        <el-checkbox v-else v-for="(submenu,subkey) in menu.submenu" :key="subkey" v-model='checkState[key][subkey]' :checked="checkState[key][subkey]" @change="change">{{submenu.name}}</el-checkbox>
                    </el-form-item>
                </el-form>
            </span>
        </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitModify">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增框 --> 
        <el-dialog
        title="新增分组"
        :visible.sync="addDialogVisible"
        width="50%">
        <div>
            <span>
                <el-form v-if="authVisible" label-position="left" label-width="80px" :model="handleData">
                    <el-form-item label="名称">
                        <el-input v-model="handleData.name"></el-input>
                    </el-form-item>
                    <div style="width:100%;font-size:20px;border-bottom:1px soild #dedede;">权限</div>
                    <el-form-item v-for="(menu, key) in allMenuInfo" :label="menu.name" :key="key">
                        <el-checkbox v-if="menu.type === 'single'" v-model='checkState[key]' :checked="checkState[key]" @change="change">{{menu.name}}</el-checkbox>
                        <el-checkbox v-else v-for="(submenu,subkey) in menu.submenu" :key="subkey" v-model='checkState[key][subkey]' :checked="checkState[key][subkey]" @change="change">{{submenu.name}}</el-checkbox>
                    </el-form-item>
                </el-form>
            </span>
        </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import menu from "../../menu";
export default {
    data(){
        return {
            label_position:'right',
            handleData:{
                name:null,
                content:null
            },
            authVisible:true,
            checkState:{},
            modifyDialogVisible:false,
            addDialogVisible:false,
            groupData:null,
            allMenuInfo:{}
        }
    },
    watch:{
        addDialogVisible(para){
            if (para === true) {
                this.handleData = {
                    name:null,
                    content:null
                }
                this.checkState = menu.getCheckState()
            }
        }
    },
    methods:{
        handleClose: () =>{
            //do nothing...
        },
        change(){
            //
        },
        submitAdd(){
            this.handleData.content = this.deepClone({});
            Object.keys(this.allMenuInfo).forEach((key)=>{
                if(this.allMenuInfo[key].type === "single"){
                    if(this.checkState[key] === true){
                        this.handleData.content[key] = this.allMenuInfo[key]
                    }
                } else {
                    Object.keys(this.allMenuInfo[key].submenu).forEach((subkey)=>{
                        if(this.checkState[key][subkey] === true){
                            if(!this.handleData.content.hasOwnProperty(key)){
                                this.handleData.content[key] = this.deepClone(this.allMenuInfo[key]);
                                this.handleData.content[key].submenu = {};
                            }
                            this.handleData.content[key].submenu[subkey] = this.allMenuInfo[key].submenu[subkey];
                        }
                    })
                }
            })
            
            this.postToServer("https://shop.funnything.net/client/admin/authority/groupAdd",this.handleData,(response)=>{
                
            })
        },
        submitModify(){
            this.handleData.content = this.deepClone({});
            Object.keys(this.allMenuInfo).forEach((key)=>{
                if(this.allMenuInfo[key].type === "single"){
                    if(this.checkState[key] === true){
                        this.handleData.content[key] = this.allMenuInfo[key]
                    }
                } else {
                    Object.keys(this.allMenuInfo[key].submenu).forEach((subkey)=>{
                        if(this.checkState[key][subkey] === true){
                            if(!this.handleData.content.hasOwnProperty(key)){
                                this.handleData.content[key] = this.deepClone(this.allMenuInfo[key]);
                                this.handleData.content[key].submenu = {};
                            }
                            this.handleData.content[key].submenu[subkey] = this.allMenuInfo[key].submenu[subkey];
                        }
                    })
                }
            })
            
            this.postToServer("https://shop.funnything.net/client/admin/authority/groupModify",this.handleData,(response)=>{
                
            })
        },
        openModifyDialog(index){
            this.handleData = this.groupData[index];
            this.modifyDialogVisible = true;
            Object.keys(this.allMenuInfo).forEach((key)=>{
                if(this.allMenuInfo[key].type === "single"){
                    if(this.handleData.content.hasOwnProperty(key)){
                        this.checkState[key] = true;
                    }else{
                        this.checkState[key] = false;
                    }
                } else {
                    if(this.handleData.content.hasOwnProperty(key)){
                        Object.keys(this.allMenuInfo[key].submenu).forEach((subkey)=>{
                            if(this.handleData.content[key].submenu.hasOwnProperty(subkey)){
                                this.checkState[key][subkey] = true;
                            }else{
                                this.checkState[key][subkey] = false;
                            }
                        })
                    }else{
                        Object.keys(this.allMenuInfo[key].submenu).forEach((subkey)=>{
                            this.checkState[key][subkey] = false;
                        })
                    }
                }
            })
        }
    },
    async created(){
        const data =  await this.awPostToServer("https://shop.funnything.net/client/admin/authority/getGroupInfo",{});
        this.groupData = data.data.data;
        for (let index = 0; index < this.groupData.length; index++) {
            this.groupData[index].content = JSON.parse(this.groupData[index].content);
        }
        this.checkState = menu.getCheckState();
        this.allMenuInfo = menu.menuInfo;
    }    
}
</script>
