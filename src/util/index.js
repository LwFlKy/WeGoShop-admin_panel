export default{
  install(Vue,options)
  {
    Vue.prototype.setCookie = function(payload,callback = null){
		var timestamp = Date.parse(new Date())/1000
		timestamp = timestamp + payload.expiredTime
		var exdate = new Date(timestamp*1000)
		document.cookie = payload.name + "=" + escape(payload.value) + ";expires=" + exdate.toGMTString();
		if (callback !== null) {
			return callback()
		}
    }

    Vue.prototype.deepClone = function(source){
      var _obj = JSON.stringify(source)
      return JSON.parse(_obj);
    }

    Vue.prototype.delCookie = function(payload,callback = null){
      payload.expiredTime = -1
      this.setCookie(payload);
    if (callback !== null) {
      return callback()
    }
    }

   	Vue.prototype.getCookie = function (cookiename) {
	    var name = cookiename + "=";
	    var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
		    var c = ca[i];
		    while (c.charAt(0) == ' ') c = c.substring(1);
		    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
		}
	    return false;
	} 
   	Vue.prototype.tokenDetect = function (store,axios,router) {
   		const token = Vue.prototype.getCookie("token")
   		return axios.get('https://shop.funnything.net/admin/auth/verify',{headers: {'x-wegoshop-token': token}})
            .then((response) => {
            	const data = response.data
            	Vue.prototype.setCookie({
                    "name":"token",
                    "value":token,
                    "expiredTime":3600
                })
            	if(data.errno !== 401){
            		store.commit("login",data.data.userInfo)
            	}
            })
            .catch(function (error) {
            });
	} 
    Vue.prototype.postToServer = function (url,data,callback = function(){}) {
      this.$ajax.post(url,data,{headers:{"x-wegoshop-token":this.getCookie("token")}})
        .then((response) => {
          callback(response)
      })
    }

    Vue.prototype.awGetToServer = function (url,data) {
      return this.$ajax.get(url,{headers:{"x-wegoshop-token":this.getCookie("token")}})
    }

    Vue.prototype.awPostToServer = function (url,data) {
      return this.$ajax.post(url,data,{headers:{"x-wegoshop-token":this.getCookie("token")}})
    }

    Vue.prototype.getToServer = function (url,callback = function(){}) {
      let _this = this
      this.$ajax.get(url,{headers:{"x-wegoshop-token":this.getCookie("token")}})
        .then((response) => {
          callback(response)
      }).catch(function (error) {
        if(error){
          callback(error)
          _this.$message.warning("长时间无操作，请重新登录")
          _this.$store.commit("logout")
          _this.$router.push("/login")
        }
      })
    }
    Vue.prototype.randomString = function(len){
    　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    　　var maxPos = $chars.length;
    　　var pwd = '';
    　　for (let i = 0; i < len; i++) {
    　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return pwd;
    }

  }
}