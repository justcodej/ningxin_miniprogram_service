<template>
  <div class="login">
    <div class="content">
      <h2 class="title">登录</h2>
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="ruleForm2.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
          <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {isLogin} from '@/assets/js/mixin'
export default {
  mixins: [isLogin],
  data () {
    var checkUsername = (rule, value, callback) => {
      const Reg = /^[a-zA-Z0-9_-]{4,16}$/
      if (!value) {
        return callback(new Error('用户名不能为空'))
      }
      if (!Reg.test(value)) {
        return callback(new Error('4到16位（字母，数字，下划线，减号）'))
      }
      callback()
    }
    var validatePass = (rule, value, callback) => {
      const Reg = /^[\w_.]{6,16}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (!Reg.test(value)) {
          return callback(new Error('6到16位（字母，数字，下划线，小数点）'))
        }
        callback()
      }
    }
    return {
      ruleForm2: {
        pass: '',
        username: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        username: [
          { validator: checkUsername, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let options = {
            username: this.ruleForm2.username,
            password: this.ruleForm2.pass
          }
          this.httpRequest('/api/login', 'POST', '', options).then(res => {
            if (!this.isLogin(res)) return false
            window.localStorage.setItem('accessToken', res.data.accessToken)
            this.$router.push('/home')
          })
        } else {
          this.$message({
            type: 'success',
            message: 'error submit!!'
          })
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang='less' scoped>
.login{
  height: 100vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .title{
    text-align: center;
    font-weight: lighter;
  }
  .content{
    padding: 50px;
    width: 500px;
    height: 300px;
    transform: translateY(-20vh)
  }
}
</style>
