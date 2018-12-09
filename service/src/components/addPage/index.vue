<template>
  <div class="page-edit">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item to="/pages">页面</el-breadcrumb-item>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form label-width="120px" :rules="rules" :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <div class="form-left">
        <div class="content">
          <el-form-item label="标题" prop="title">
            <el-input placeholder="标题" v-model="ruleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="路径" prop="router">
            <el-input placeholder="路径" v-model="ruleForm.router"></el-input>
          </el-form-item>
          <el-form-item label="页面" prop="parent">
            <el-select v-model="ruleForm.parent" placeholder="请选择父页面" style="width: 100%;">
              <el-option v-for="(item, index) in pageLevel" :label="item.title" :value="item.title" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="date" label="日期" required>
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date" style="width: 100%;"></el-time-picker>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <quill-editor v-model="ruleForm.content"></quill-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{this.$route.params.id ? "编辑" : "添加"}}</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {isLogin, checkUser} from '@/assets/js/mixin'
export default {
  mixins: [isLogin, checkUser],
  data () {
    return {
      ruleForm: {
        title: '',
        router: '',
        date: '',
        content: '',
        parent: ''
      },
      rules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        router: [
          {required: true, message: '请输入路径', trigger: 'blur'}
        ],
        date: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
        ],
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ],
        parent: [
          {required: true, message: '请选择页面', trigger: 'change'}
        ]
      },
      pageLevel: []
    }
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    submitForm (formName) {
      const options = {
        title: this.ruleForm.title,
        router: this.ruleForm.router,
        date: this.ruleForm.date,
        content: this.ruleForm.content,
        parent: this.ruleForm.parent
      }
      if (this.$route.params.id) {
        options.id = this.$route.params.id
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.checkUser()
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.httpRequest('/api/pages', 'POST', '', options).then(res => {
            if (!this.isLogin(res)) return
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.$refs['ruleForm'].resetFields()
            setTimeout(() => {
              loading.close()
              this.$router.back()
            }, 1000)
          })
        } else {
          console.log('err submit!!')
          return false
        }
      })
    },
    getPageLevel () {
      this.httpRequest('/api/getPages', 'GET', {level: 1}).then(res => {
        this.checkUser()
        if (res.data.code * 1 === 200) {
          this.pageLevel = res.data.data
          if (!this.$route.params.id) {
            this.pageLevel.push({
              title: '无'
            })
          }
        }
      })
    },
    getPageDetail () {
      this.httpRequest('/api/getPageDetail', 'GET', {id: this.$route.params.id}).then(res => {
        if (res.data.code * 1 === 200) {
          this.ruleForm.title = res.data.data.title
          this.ruleForm.router = res.data.data.router
          this.ruleForm.content = res.data.data.content
          if (res.data.data.level === 1) {
            this.ruleForm.parent = '无'
          } else {
            this.ruleForm.parent = res.data.data.parent
            this.getPageLevel()
          }
        }
      })
    }
  },
  mounted () {
    if (!this.$route.params.id) {
      this.getPageLevel()
      return
    }
    if (this.$route.params.id) {
      this.getPageDetail()
    }
  }
}
</script>

<style lang="less" scoped>
  .page-edit{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    z-index: 1;
    padding: 0 24px;
    .el-breadcrumb{
      padding: 24px 0;
    }
    .el-row{
      margin-bottom: 24px;
    }
  }
</style>
