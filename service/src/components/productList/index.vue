<template>
  <div class="pages">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-button type="primary" :disabled='tableData.length >= 3' @click="goToAddProduct">添加产品({{tableData.length}}/3)</el-button>
    </el-row>
    <el-table
      :data="tableData"
      v-loading="loading"
      border>
      <el-table-column
        prop="date"
        label="日期"
        width="250">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {isLogin, checkUser} from '@/assets/js/mixin'
export default {
  mixins: [isLogin, checkUser],
  data () {
    return {
      tableData: [],
      loading: true
    }
  },
  methods: {
    handleEdit (row) {
      this.$router.push({
        name: 'AddProduct',
        path: '/addProduct',
        params: row
      })
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkUser()
        this.httpRequest('/api/deleteProduct', 'POST', {id: row.id}).then(res => {
          if (!this.isLogin(res)) return
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.getProductList()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    getProductList () {
      this.checkUser()
      this.httpRequest('/api/getProducts', 'GET').then(res => {
        if (!this.isLogin(res)) return
        if (res.data.code * 1 === 200) {
          this.tableData = res.data.data
        }
        this.loading = false
      }).catch(err => {
        console.log(err.message)
      })
    },
    goToAddProduct () {
      if (this.tableData.length >= 4) {
        this.$message({
          type: 'success',
          message: '最多添加3个产品'
        })
        return
      }
      this.$router.push('addProduct')
    }
  },
  mounted () {
    this.getProductList()
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
