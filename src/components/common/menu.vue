<template>
	<el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :router="true">
	  <div>
      	<div v-for="(item, key) in menuData"  :key="key">

	      <el-menu-item v-if="item.type == 'single'" :index="item.targetCom">
	        <i :class="item.icon"></i>
	        <span slot="title">{{ item.name }}</span>
	      </el-menu-item>

	      <el-submenu v-if="item.type == 'multiple'" :index="key">
	       <template slot="title">
		     <i :class="item.icon"></i>
		     <span>{{item.name}}</span>
		   </template>
		   <el-menu-item v-for="(item, key) in item.submenu" :key="key" :index="item.targetCom">
		   	<small>{{item.name}}</small>
		   </el-menu-item>
	      </el-submenu>

	    </div>
	  </div>
    </el-menu>
</template>
<style>
	.el-submenu li{
	}
</style>
<script>
export default {
	data(){
	  return {
	  	menuData:this.$store.state.userInfo.authority.content,
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
	props: ['childMsg'],
	methods: {
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      }
    },
    created:function(){
    }
}
</script>