import http from '@/utils/http'

// 获取一级分类
export function getCategoryAPI () {
  return http({
    url: '/home/category/head'
  })
}