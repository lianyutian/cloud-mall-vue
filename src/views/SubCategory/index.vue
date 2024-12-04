<script setup>
import GoodItem from '../Home/components/GoodItem.vue'
import { onMounted, ref } from 'vue'
import { getCategoryFilterAPI, getSubCategoryAPI } from '@/apis/category'
import { useRoute } from 'vue-router'

const route = useRoute()

// 面包屑数据
const categoryFilter = ref({})
const getCategoryFilter = async (id = route.params.id) => {
  const res = await getCategoryFilterAPI(id)
  categoryFilter.value = res.result
}
onMounted(() => getCategoryFilter())

// 二级分类列表数据
const goodList = ref([])
const activeKey = ref()
const req = ref({
  categoryId: route.params.id,
  page: 1,
  pageSize: 10,
  sortField: 'publishTime',
})
const getSubCategory = async () => {
  const res = await getSubCategoryAPI(req.value)
  goodList.value = res.result.items
}
onMounted(() => getSubCategory())

// 表格切换
const onChange = (activeKey) => {
  req.value.sortField = activeKey
  getSubCategory()
}

// 滚动加载
const disable = ref(false)
const load = async () => {
  // 获取下一页的数据
  req.value.page++
  const res = await getSubCategoryAPI(req.value)
  goodList.value = [...goodList.value, ...res.result.items]
  // 加载完毕 停止监听
  if (res.result.items.length === 0) {
    disable.value = true
  }
}
// 监听是否滚动到底
const handleScroll = (event) => {
  console.log('滚动开始')
  console.log(event)

  const { scrollTop, clientHeight, scrollHeight } =
    event.target.scrollingElement
  console.log(scrollTop)
  console.log(clientHeight)
  console.log(scrollHeight)

  if (scrollTop + clientHeight >= scrollHeight - 10 && !disable.value) {
    load()
  }
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="container">
    <!-- 面包屑 -->
    <div class="bread-container">
      <a-breadcrumb separator=">">
        <a-breadcrumb-item>
          <router-link to="/">首页</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item
          ><RouterLink :to="`/category/${categoryFilter.parentId}`">{{
            categoryFilter.parentName
          }}</RouterLink></a-breadcrumb-item
        >
        <a-breadcrumb-item>{{ categoryFilter.name }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="sub-container">
      <a-tabs v-model:activeKey="activeKey" @change="onChange">
        <a-tab-pane key="publishTime" tab="最新商品"></a-tab-pane>
        <a-tab-pane key="orderNum" tab="最高人气"> </a-tab-pane>
        <a-tab-pane key="evaluateNum" tab="评论最多"></a-tab-pane>
      </a-tabs>
      <div class="body" @scroll="handleScroll">
        <!-- 商品列表-->
        <GoodItem v-for="good in goodList" :goods="good" :key="good.id" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bread-container {
  padding: 25px 0;
  color: #666;
}

.sub-container {
  padding: 20px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }

  .goods-item {
    display: block;
    width: 220px;
    margin-right: 20px;
    padding: 20px 30px;
    text-align: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
.loading {
  text-align: center;
  padding: 10px;
}
</style>
