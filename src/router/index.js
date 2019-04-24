import Vue from 'vue';
import Router from 'vue-router';
import menu from '../menu'
Vue.use(Router);
export default new Router({
	routes:[{
		path: '/',
		component: resolve => require(['../components/page/index.vue'],resolve),
		children:menu.createSubRouterInfo()
	},{
		path: "/login",
		name: "login",
		component: resolve => require(['../components/page/login.vue'],resolve)
	},{
		path: "/init",
		name: "init",
		component: resolve => require(['../components/page/init.vue'],resolve)
	}],
})