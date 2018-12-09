<template>
  <div class="contact">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>联系我们</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="tableData"
      border>
      <el-table-column
        fixed
        prop="date"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width='300'>
      </el-table-column>
      <el-table-column
        prop="message"
        label="留言"
        width="700">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button @click="dialogTableVisible = true" type="text" size="small">查看</el-button>
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
      tableData: []
    }
  },
  methods: {
    getContactList () {
      this.checkUser()
      this.httpRequest('/api/getContact', 'GET').then(res => {
        if (!this.isLogin(res)) return
        this.tableData = res.data.data
      })
    }
  },
  mounted () {
    this.getContactList()
  }
}
</script>

<style lang="less" scoped>
  .contact{
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
  }
</style>
