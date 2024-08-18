import axios from 'axios'
import store from '@/store'
import { Message } from 'iview'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    let config = {
      baseURL: this.baseUrl,
      headers: {
        'content-type': 'application/json'
      }
    }
    if (store.state.user.tokenHeader != null && store.state.user.tokenHeader.length > 0) {
      config.headers[store.state.user.tokenHeader] = store.state.user.token
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      let rData = res.data
      if (rData.code != 10001) {
        Message.error(rData.msg)
        if (rData.code == 10003) {
          store.dispatch('handleLogOut')
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
        return Promise.reject(new Error(`参数错误: ${rData.code}`))
      }
      return rData
    }, error => {
      this.destroy(url)
      Message.error('请求错误，请联系管理员')
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
