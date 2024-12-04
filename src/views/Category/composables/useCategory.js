import { onMounted, ref } from 'vue'
import { getTopCategoryAPI } from '@/apis/category'
import { onBeforeRouteUpdate } from 'vue-router'
import { useRoute } from 'vue-router'

export function useCategory() {
  // 获取面包屑分类数据
  const topCategory = ref({})
  const route = useRoute()
  const getTopCategory = async (id = route.params.id) => {
    const res = await getTopCategoryAPI(id)
    topCategory.value = res.result
  }

  onMounted(() => getTopCategory())

  // 目标:路由参数变化的时候 可以把分类数据接口重新发送
  onBeforeRouteUpdate((to) => {
    getTopCategory(to.params.id)
  })

  return {
    topCategory,
  }
}
