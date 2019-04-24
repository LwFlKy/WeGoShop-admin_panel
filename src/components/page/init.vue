<template>
    <el-row type="flex">
      <el-col :xs="0"></el-col>
      <el-col :xs="24"><div class="grid-content bg-purple-light center">
        <div class="login-panel">
          <h2>初始化密码</h2>
          <el-form :model="Form" status-icon :rules="rules" ref="Form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="Form.newPassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="rePassword">
            <el-input type="password" v-model="Form.rePassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="submitForm('Form')">提交</el-button>
            <el-button @click="resetForm('Form')">重置</el-button>
          </el-form-item>
        </el-form>

        </div>
      </div></el-col>
      <el-col :xs="0"></el-col>
    </el-row>
</template>


<script>
export default {
  data() {
    var rePassword = (rule, value, callback) => {
      if (value === '') {
        callback("请输入用户名");
      }else{
        if (value === this.Form.newPassword) {
          callback()
        }else{
          callback("密码不一致")
        }
      }
    };

    return {
      Form: {
        newPassword: '',
        rePassword: ''
      },
      rules: {
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 8, max: 18, message: '长度在 8 到 18 个字符', trigger: 'blur' },
          { regexp:'/[0-9a-zA-Z\x21-\x7e]\d*/g', message: '请输入英文、数字及标点符号', trigger: 'blur' }
        ],
        rePassword: [
          { required: true,validator: rePassword, trigger: 'blur' }
        ]
      },
      loading : false
    }
  },
  methods: {
    startHacking () {
      this.$notify({
        title: 'It works!',
        type: 'success',
        message: 'We\'ve laid the ground work for you. It\'s time for you to build something epic!',
        duration: 5000
      })
    },
    submitForm(formName) {
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.postToServer("https://shop.funnything.net/admin/auth/modify",that.Form,function(response) {
              that.delCookie({name:"token"})
              that.$message.success('初始化成功!请重新登录')
              that.$store.commit("logout")
              that.$router.push("/")
            })
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
    }
    .login-panel{
      background-color: white;
      border-radius: 5px;
      padding: 0 0;
      padding-top: 10px;
      padding-right: 50px;
      padding-left: 30px;
      margin: 0 auto;
      width: 50%;
      border-bottom: 10px solid #409eff;
    }
</style>
