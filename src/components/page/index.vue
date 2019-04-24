<template>
  <el-container class = "all">
    <el-header>
      <app-header></app-header>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <app-menu :child-msg="msg"></app-menu>
      </el-aside>
      <el-container>
        <el-scrollbar style="height:100%">
          <el-main>
            <app-main></app-main>
          </el-main>
        </el-scrollbar>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>


<script>
import AppHeader from '../common/header.vue';
import AppMenu from '../common/menu.vue';
import AppMain from '../common/main.vue';
export default {
  data() {
    return {
      msg:"a",
      /*rules: {
        password: [
          { validator: passIsEmpty, trigger: 'blur' }
        ],
        username: [
          { validator: userIsEmpty, trigger: 'blur' }
        ]
      },*/
      loading : false
    }
  },
    components: {
      AppHeader,
      AppMenu,
      AppMain
    },
    methods: {

    }
}

</script>

<style>
  .el-pagination{
    margin: 10px auto;
    text-align:center;  
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .all{
    height: 100%;
  }
  .el-header, .el-footer {
    color: #333;
    line-height: 60px;
  }
  .el-header {
    background-color: #409eff;
    color: white;
  }
  .el-menu{
    height:100%;
  }
  .el-aside {
    text-align: center;
  }
  .el-aside::-webkit-scrollbar {
      display: none;
  }
  .el-main {
    flex:1;
    height: 100%;
  }
  
  body > .el-container {
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
