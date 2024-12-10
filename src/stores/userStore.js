// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/apis/user'
import { useCartStore } from './cartStore'
import { mergeCartAPI } from '@/apis/cart'

// 定义并暴露一个store
export const useUserStore = defineStore(
  'user',
  () => {
    // 导航列表的数据管理
    // state 导航列表数据
    const userState = ref({})
    const cartStore = useCartStore()

    // login action
    const loginAction = async (userInfo) => {
      const res = await loginAPI(userInfo)
      userState.value = res.result
      // 合并购物车的操作
      await mergeCartAPI(
        cartStore.cartListState.map((item) => {
          return {
            skuId: item.skuId,
            selected: item.selected,
            count: item.count,
          }
        })
      )
      cartStore.updateNewListAction()
    }

    // 退出登录时清除用户信息
    const clearUserState = () => {
      userState.value = {}
    }

    return {
      userState,
      loginAction,
      clearUserState,
    }
  },
  {
    // 将用户信息持久化到 localStorage
    persist: true,
  }
)
