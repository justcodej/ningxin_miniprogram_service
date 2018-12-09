import axios from 'axios'

export function fetch (config) {
  let baseUrl = process.env.NODE_ENV === 'development' ? 'http://192.168.62.120:8080' : 'https://ningxinziguan.com:3000' // http://192.168.62.120:8080
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: baseUrl,
      timeout: 50000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': config.contentType
      }
    })
    instance(config).then(res => {
      res.data.code *= 1
      resolve(res)
    }).catch(err => {
      if (err && err.response) {
        switch (err.response.status) {
          case 400: err.message = '请求错误'; break
          case 401: err.message = '未授权，请重新登录'; break
          case 403: err.message = '拒绝访问'; break
          case 404: err.message = '请求出错'; break
          case 408: err.message = '请求超时'; break
          case 500: err.message = '服务器错误'; break
          case 501: err.message = '服务未实现'; break
          case 502: err.message = '网络错误'; break
          case 503: err.message = '服务不可用'; break
          case 504: err.message = '网络超时'; break
          case 505: err.message = 'HTTP版本不受支持'; break
          default: err.message = `连接出错(${err.response.status})`
        }
      } else {
        err.message = `服务器连接失败(${err.message})`
      }
      reject(err)
    })
  })
}
