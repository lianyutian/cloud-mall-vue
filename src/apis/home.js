import http from '@/utils/http'

// 获取 banner 图
export function getBannerAPI() {
  return http({
    url: '/home/banner',
  })
}

// 获取新鲜好物
export const getNewAPI = () => {
  return http({
    url: '/home/new',
  })
}

// 获取人气推荐
export const getHotAPI = () => {
  return http('/home/hot')
}

// 获取产品列表
export const getGoodsAPI = () => {
  return http('/home/goods')
}
