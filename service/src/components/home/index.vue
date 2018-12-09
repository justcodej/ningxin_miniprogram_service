<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1" @click="goToHome">处理中心</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" disabled>消息中心</el-menu-item>
        <el-menu-item index="3" @click='logout'>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="300px">
        <el-menu :default-openeds="['1']">
          <el-menu-item index="1" @click="goToHome">
            <span slot="title"><i class="el-icon-bell"></i>控制台</span>
          </el-menu-item>
          <el-menu-item index="2" :disabled="level * 1 === 0" @click="goToNews">
            <span slot="title"><i class="el-icon-edit-outline"></i>新闻</span>
          </el-menu-item>
          <el-menu-item index="3" @click="goToProducts">
            <span slot="title"><i class="el-icon-edit-outline"></i>产品</span>
          </el-menu-item>
          <el-menu-item index="4" :disabled="level * 1 === 0" @click="goToPages">
            <span slot="title"><i class="el-icon-document"></i>页面</span>
          </el-menu-item>
          <el-menu-item index="5" @click="goToCntact">
            <span slot="title"><i class="el-icon-message"></i>联系我们</span>
          </el-menu-item>
          <el-submenu index="6">
            <template slot="title"><i class="el-icon-more"></i>其他</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="6-1" @click="goToBanner">Banner</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        🚧 施工中...
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '1',
      level: '',
      username: ''
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    goToHome () {
      this.$router.push('home')
    },
    goToPages () {
      this.$router.push('pageList')
    },
    goToNews () {
      this.$router.push('newsList')
    },
    goToProducts () {
      this.$router.push('productList')
    },
    goToCntact () {
      this.$router.push('contact')
    },
    goToBanner () {
      this.$router.push('banner')
    },
    logout () {
      window.localStorage.clear()
      this.$router.push('/login')
    }
  },
  mounted () {
    this.level = window.localStorage.getItem('level')
    this.username = window.localStorage.getItem('username')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .el-container{
    .el-header{
      padding: 0;
    }
    .el-container{
      .el-aside{
        .el-menu{
          height: 94vh;
        }
      }
      .el-main{
        position: relative;
      }
    }
  }
</style>
