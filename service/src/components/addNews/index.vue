<template>
  <div class="repost">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item to="/newsList">文章</el-breadcrumb-item>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form label-width="120px" :rules="rules" :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <div class="form-left">
        <div class="content">
          <el-form-item label="标题" prop="title">
            <el-input placeholder="标题" v-model="ruleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop='subtitle'>
            <el-input placeholder="副标题" v-model="ruleForm.subtitle"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input placeholder="作者" v-model="ruleForm.author"></el-input>
          </el-form-item>
          <el-form-item prop="date" label="分类目录/日期" required>
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date" style="width: 100%;"></el-time-picker>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <quill-editor v-model="ruleForm.content"></quill-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </div>
      </div>
      <div class="form-right">
        <div class="form-right">
          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {isLogin, checkUser} from '@/assets/js/mixin'
export default {
  mixins: [isLogin, checkUser],
  name: 'Post',
  data () {
    return {
      ruleForm: {
        title: '',
        subtitle: '',
        author: '',
        categories: '',
        date: '',
        content: '',
        imageUrl: ''
      },
      rules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        subtitle: [
          {required: true, message: '请输入副标题', trigger: 'blur'}
        ],
        author: [
          {required: true, message: '请输入作者', trigger: 'blur'}
        ],
        date: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
        ],
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },
      action: ''
    }
  },
  methods: {
    submitForm (formName) {
      let options = {
        title: this.ruleForm.title,
        subtitle: this.ruleForm.subtitle,
        author: this.ruleForm.author,
        date: this.ruleForm.date,
        content: this.ruleForm.content,
        poster: this.ruleForm.imageUrl
      }
      if (this.$route.params.id) options.id = this.$route.params.id
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.checkUser()
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.httpRequest('/api/news', 'POST', '', options).then(res => {
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
          }).catch(err => {
            console.log(err.message)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleAvatarSuccess (res, file) {
      this.ruleForm.imageUrl = file.response.img
    },
    beforeAvatarUpload (file) {
      const isPIC = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isPIC) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isPIC && isLt2M
    },
    getNewsDetail () {
      this.httpRequest('/api/getNewsDetail', 'GET', {id: this.$route.params.id}).then(res => {
        if (res.data.code * 1 === 200) {
          this.ruleForm.title = res.data.data[0].title
          this.ruleForm.subtitle = res.data.data[0].subtitle
          this.ruleForm.author = res.data.data[0].author
          this.ruleForm.content = res.data.data[0].content
          this.ruleForm.imageUrl = res.data.data[0].poster
        }
      })
    },
    setAction () {
      this.action = window.location.hostname === 'localhost' ? `http://${window.location.hostname}:3000/api/poster/upload` : `http://${window.location.hostname}:3000/api/poster/upload`
    }
  },
  mounted () {
    this.setAction()
    if (this.$route.params.id) {
      this.getNewsDetail()
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
  .repost{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background-color: white;
    z-index: 1;
    padding: 0 24px;
    .mask{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.5);
      z-index: 1;
    }
    .el-breadcrumb{
      padding: 24px 0;
    }
    .el-row{
      margin-bottom: 24px;
    }
    .el-form{
      display: flex;
      .form-left{
        .content{
          max-width: 750px;
          .el-form-item{
            .quill-editor{
              @{deep} .ql-container{
                min-height: 200px;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
              }
              @{deep} .ql-toolbar{
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
              }
              @{deep} .ql-snow{
                border-color: #dcdfe6;
              }
            }
            .el-form-item__content{
              .el-select{
                width: 100%;
              }
            }
          }
        }
      }
      .form-right{
        .avatar-uploader{
          @{deep} .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            margin-left: 80px;
            .avatar-uploader-icon {
              font-size: 28px;
              color: #8c939d;
              width: 178px;
              height: 178px;
              line-height: 178px;
              text-align: center;
            }
          }
          @{deep} .el-upload:hover {
            border-color: #409EFF;
          }
        }
        .avatar {
          width: 178px;
          height: 178px;
          display: block;
        }
      }
    }
  }
</style>
