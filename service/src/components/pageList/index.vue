<template>
  <div class="pages">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>页面</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-button type="primary" @click="goToAddPage">添加页面</el-button>
    </el-row>
    <table class="page-table">
      <thead>
        <tr>
          <td>ID</td>
          <td>日期</td>
          <td>标题</td>
          <td>页面级别</td>
          <td>操作</td>
        </tr>
      </thead>
      <tbody v-for="item of tableData" :key="item.id">
        <tr>
          <td>{{item.id}}</td>
          <td>{{item.date}}</td>
          <td>{{item.title}}</td>
          <td>{{item.level}}</td>
          <td width="240"><el-button size="mini" @click="handleClickEdit(item)">编辑</el-button><el-button size="mini" type="danger" @click="handleClickDelete(item)">删除</el-button><el-button @click='openView(item.router)' type="primary" size="mini">查看</el-button></td>
        </tr>
        <tr class="child" v-if="item.parent !== '无'" v-for="child of item.parent" :key="child.id">
          <td>{{child.id}}</td>
          <td>{{child.date}}</td>
          <td>{{child.title}}</td>
          <td>{{child.level}}</td>
          <td width="240"><el-button size="mini" @click="handleClickEdit(child)">编辑</el-button><el-button size="mini" type="danger" @click="handleClickDelete(child)">删除</el-button><el-button @click="openView(child.router)" type="primary" size="mini">查看</el-button></td>
        </tr>
      </tbody>
    </table>
    <router-view />
  </div>
</template>

<script>
import {isLogin, checkUser} from '@/assets/js/mixin'
export default {
  mixins: [isLogin, checkUser],
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    handleClickEdit (row) {
      this.$router.push({
        name: 'AddPage',
        path: '/addPages',
        params: row
      })
    },
    handleClickDelete (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkUser()
        this.httpRequest('/api/deletePages', 'POST', {id: row.id}).then(res => {
          if (!this.isLogin(res)) return
          this.getPages()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    goToAddPage () {
      this.$router.push('addPage')
    },
    getPages () {
      this.checkUser()
      this.httpRequest('/api/getPages', 'GET').then(res => {
        if (!this.isLogin(res)) return
        if (res.data.code * 1 === 200) {
          this.tableData = res.data.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    openView (router) {
      window.open('http://ningxinglobal.com/#/' + router, '_blank')
    }
  },
  mounted () {
    this.getPages()
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
  .page-table{
    width: 100%;
    border-collapse:collapse;
    border-spacing:0;
    margin:0;
    padding:0;
    border:none;
    thead{
      tr{
        td{
          border: 1px solid #ebeef5;
          padding: 15px 20px;
          margin: 0;
          font-size: 14px;
          color: #606266;
        }
      }
    }
    tbody{
      tr{
        transition: .3s ease-out;
        td{
          border: 1px solid #ebeef5;
          padding: 15px 20px;
          margin: 0;
          font-size: 14px;
          color: #606266;
        }
      }
      tr.child{
        position: relative;
        border-left: 3px solid #999;
      }
      tr:hover{
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
