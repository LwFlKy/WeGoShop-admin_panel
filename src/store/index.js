import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: null,
    logined:false,
    uploadUrl:"https://upload-z2.qiniup.com",
    update:false,
    checkState:{}
  },
  mutations: {
    updateToggle (state) {
      if (state.update) {
        state.update = false;
      }else{
        state.update = true;
      }
    },
    login (state,userInfo) {
      state.userInfo = userInfo;
      state.logined = true;
    },
    logout (state){
      state.userInfo = null;
      state.logined = false;
    },
    inject (state,checkState){
      state.checkState = checkState;
    }
  }
})

export default store;