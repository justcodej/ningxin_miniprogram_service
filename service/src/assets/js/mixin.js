export const isLogin = {
  methods: {
    isLogin (res) {
      if (!Number(res.data.code)) {
        this.$message({
          type: 'success',
          message: res.data.msg
        })
        this.$router.push('/login')
        return false
      } else {
        return true
      }
    }
  }
}

export const checkUser = {
  methods: {
    checkUser () {
      let accessToken = window.localStorage.getItem('accessToken')
      if (!accessToken) {
        this.$router.push('/login')
        return
      }
      this.httpRequest('/api/checkUser', 'POST', '', {accessToken}).then(res => {
        if (!res.data.code * 1) {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.$router.push('/login')
          window.localStorage.clear()
        } else {
          window.localStorage.setItem('level', res.data.result.level)
          window.localStorage.setItem('username', res.data.result.username)
        }
      })
    }
  }
}
