import http from '@/utils/http'

// 获取 banner 图
export function getBannerAPI() {
  return http.request({
    url: 'home/banner',
  })
}
