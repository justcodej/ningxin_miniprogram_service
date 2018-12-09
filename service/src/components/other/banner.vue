<template>
  <div class="pages">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Banner</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-alert
        title="Banner图片上传"
        type="info"
        :description="'图片上传最多为5张已经上传（' + fileList.length + '/5）张'"
        show-icon>
      </el-alert>
    </el-row>
    <el-upload
      :action="action"
      list-type="picture-card"
      :file-list="fileList"
      :multiple="true"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      :limit="5">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {isLogin, checkUser} from '@/assets/js/mixin'
export default {
  mixins: [isLogin, checkUser],
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      action: ''
    }
  },
  methods: {
    handleRemove (file, fileList) { // 删除
      this.checkUser()
      this.fileList = fileList
      this.httpRequest('/api/banner/delete', 'POST', '', {id: file.id, fileName: file.name}).then(res => {
        if (!this.isLogin(res)) return
        this.$message({
          type: 'success',
          message: res.data.msg
        })
      }).catch(err => {
        console.log(err.message)
      })
    },
    handlePictureCardPreview (file) { // 查看大图
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadSuccess (response) { // 上传成功后
      if (response.code * 1 !== 200) return false
      setTimeout(() => {
        this.fileList = []
      }, 1000)
      setTimeout(() => {
        this.getBannerList()
      }, 2000)
    },
    getBannerList () { // 获取banner列表
      this.checkUser()
      this.httpRequest('/api/getBannerList', 'GET').then(res => {
        if (!this.isLogin(res)) return
        this.fileList = []
        this.fileList = res.data.data
      }).catch(err => {
        console.log(err.message)
      })
    },
    setAction () {
      this.action = window.location.hostname === 'localhost' ? `http://${window.location.hostname}:3000/api/poster/upload` : `http://${window.location.hostname}:3000/api/poster/upload`
    }
  },
  mounted () {
    this.setAction()
    this.getBannerList()
  }
}
</script>

<style lang="less" scoped>
  .pages{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    padding: 0 24px;
    .el-breadcrumb{
      padding: 24px 0;
    }
    .el-row{
      margin-bottom: 24px;
    }
  }
</style>
