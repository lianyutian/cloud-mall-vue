import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'
import { addCartAPI, removeCartAPI, getNewCartListAPI } from '@/apis/cart'

export const useCartStore = defineStore(
  'cart',
  () => {
    const cartListState = ref([])

    const userStore = useUserStore()
    const isLogin = computed(() => userStore.userInfo?.token)

    // 获取最新购物车列表action
    const updateNewListAction = async () => {
      const res = await getNewCartListAPI()
      cartListState.value = res.result
    }

    /*
      添加购物车: 入参
      skuId: sku.id,
      price: sku.price,
      oldPrice: sku.oldPrice,
      inventory: sku.inventory,
      specsText: sku.specs
    */
    const addCartAction = async (good) => {
      if (isLogin.value) {
        // 登录之后的加入购车逻辑
        const { skuId, count } = good
        await addCartAPI(skuId, count)
        updateNewListAction()
      } else {
        // 添加购物车操作
        // 已添加过 - count + good.count
        // 没有添加过 - 直接push
        // 思路：通过匹配传递过来的商品对象中的skuId能不能在cartList中找到，找到了就是添加过
        const item = cartListState.value.find(
          (item) => item.skuId === good.skuId
        )
        if (item) {
          item.count += good.count
        } else {
          cartListState.value.push(good)
        }
      }
    }

    // 移除购物车
    const removeCartAction = async (skuId) => {
      if (isLogin.value) {
        await removeCartAPI([skuId])
        updateNewListAction()
      } else {
        cartListState.value = cartListState.value.filter(
          (item) => item.skuId !== skuId
        )
      }
    }

    // 清空购物车
    const clearCartAction = () => {
      cartListState.value = []
    }

    // 单选
    const singleCheckAction = (skuId, selected) => {
      // 通过skuId找到要修改的那一项 然后把它的selected修改为传过来的selected
      const good = cartListState.value.find((item) => item.skuId === skuId)
      good.selected = selected
    }

    // 全选功能action
    const allCheckAction = (selected) => {
      // 把cartList中的每一项的 selected 都设置为当前的全选框状态
      cartListState.value.forEach((item) => (item.selected = selected))
    }

    // 是否全选计算属性
    const isAllCheck = computed(() =>
      cartListState.value.every((item) => item.selected)
    )

    // 所有商品数
    // data.reduce((sum, item) => sum + item.amount, 0);
    const allCount = computed(() => {
      return cartListState.value.reduce((sum, item) => sum + item.count, 0)
    })

    // 所有商品价格
    const allPrice = computed(() => {
      return cartListState.value.reduce(
        (sum, item) => sum + item.count * item.price,
        0
      )
    })

    // 已选商品数量
    const selectedCount = computed(() => {
      return cartListState.value
        .filter((item) => item.selected)
        .reduce((sum, item) => {
          return sum + item.count
        }, 0)
    })

    // 已选商品价格
    const selectedPrice = computed(() => {
      return cartListState.value
        .filter((item) => item.selected)
        .reduce((sum, item) => {
          return sum + item.count * item.price
        }, 0)
    })

    return {
      cartListState,
      addCartAction,
      removeCartAction,
      singleCheckAction,
      allCheckAction,
      updateNewListAction,
      clearCartAction,
      allCount,
      allPrice,
      isAllCheck,
      selectedCount,
      selectedPrice,
    }
  },
  {
    persist: true,
  }
)
