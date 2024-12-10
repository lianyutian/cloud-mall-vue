import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

// 创建axios实例
const http = axios.create({
  //baseURL: 'http://www.cloudmall.com',
  baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
  timeout: 5000,
})

// axios请求拦截器
http.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.userState.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (e) => Promise.reject(e)
)

// axios响应式拦截器
http.interceptors.response.use(
  (res) => res.data,
  (e) => {
    return Promise.reject(e)
  }
)

export default http
