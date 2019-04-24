<template>
    <el-row type="flex">
        <el-col :xs="0"></el-col>
        <el-col :xs="24">
            <div class="grid-content bg-purple-light center">
                <div class="login-panel">
                    <h2>登录</h2>
                    <el-form :model="Form" status-icon :rules="rules" ref="Form" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="用户名" prop="username">
                            <el-input type="text" v-model="Form.username" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="Form.password" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                        <el-button type="primary" :loading="loading" @click="submitForm('Form')">登录</el-button>
                            <el-button @click="resetForm('Form')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-col>
        <el-col :xs="0"></el-col>
    </el-row>
</template>


<script>
export default {
  data() {
    var userIsEmpty = (rule, value, callback) => {
      if (value === '') {
        callback("请输入用户名");
      }else{
        callback()
      }
    };
    var passIsEmpty = (rule, value, callback) => {
      if (value === '') {
        callback("请输入密码");
      }else{
        callback()
      }
    };

    return {
      Form: {
        password: '',
        username: ''
      },
      rules: {
        password: [
          { validator: passIsEmpty, trigger: 'blur' }
        ],
        username: [
          { validator: userIsEmpty, trigger: 'blur' }
        ]
      },
      loading : false
    }
  },
  methods: {
    submitForm(formName){
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.loading = true
                this.$ajax.post('https://shop.funnything.net/admin/auth/login', this.Form)
                .then((response) => {
                    
                    if (response.data.errno == 0){
                        var data = response.data.data
                        this.setCookie({
                            "name":"token",
                            "value":data.token,
                            "expiredTime":3600
                        },() => {
                            
                            this.$store.commit("login",data.userInfo)
                            this.$message.success('登录成功!');
                            this.loading = false;
                            this.$router.push("/")
                        })
                    }else{
                    var data = response.data
                    this.$message.error('用户名或密码错误！');
                    this.loading = false;
                    }
                })
                .catch(function (error) {
                });
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
  }
}

</script>

<style scoped>
    .el-row{
      font-family: Helvetica, sans-serif;
      height: 100%;
      background-color: #d2d2d2;
    }
    .center{
      height: 500px;
      display:flex;/*Flex布局*/
      display: -webkit-flex; /* Safari */
      align-items:center;/*指定垂直居中*/
      width: 768px;
    }
    h2{
      text-align:center;
      margin-bottom:30px;
      padding-left: 50px;
    }
    .login-panel{
      background-color: white;
      border-radius: 5px;
      padding: 0 0;
      padding-top: 10px;
      padding-right: 50px;
      margin: 0 auto;
      width: 50%;
      border-bottom: 10px solid #409eff;
    }
</style>
