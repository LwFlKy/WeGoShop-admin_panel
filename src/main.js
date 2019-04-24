import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import util from './util'
import store from './store'
import router from './router'
import axios from 'axios'
import menu from './menu'
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$ajax = axios
Vue.use(util);

store.commit("inject",menu.getCheckState())
router.beforeEach(async (to, from, next) => {
  await Vue.prototype.tokenDetect(store,axios,router)
	if (store.state.logined == true) {
		if (to.path == "/login") {
			next("/")
		}else if (store.state.userInfo.init == 0) {
			if(to.path == "/init"){
				next()
			}else{
				next("/init")
			}
		}else{
      if(menu.authorityVerify(store.state.userInfo.authority.content,to.name) === true){
        next()
      }
		}
	}else{
		if (to.path == "/login") {
			next()
		}else{
			next("/login")
		}
	}
})

Vue.use(ElementUI);
new Vue({
    store,
    router,
    el: '#app',
    render: h => h(App),
  })