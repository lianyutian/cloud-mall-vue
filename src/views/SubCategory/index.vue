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
const activeName = ref('publishTime')
const req = ref({
  categoryId: route.params.id,
  page: 1,
  pageSize: 20,
  sortField: 'publishTime',
})
const getSubCategory = async () => {
  const res = await getSubCategoryAPI(req.value)
  goodList.value = res.result.items
}
onMounted(() => getSubCategory())

// 表格切换
const onChange = (activeName) => {
  req.value.sortField = activeName
  req.value.page = 1
  getSubCategory()
}

// 滚动加载
const disabled = ref(false)
const load = async () => {
  // 获取下一页的数据
  req.value.page++
  const res = await getSubCategoryAPI(req.value)
  goodList.value = [...goodList.value, ...res.result.items]
  // 加载完毕 停止监听
  if (res.result.items.length === 0) {
    disabled.value = true
  }
}
</script>

<template>
  <div class="container">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>
          <router-link to="/">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <RouterLink :to="`/category/${categoryFilter.parentId}`">
            {{ categoryFilter.parentName }}
          </RouterLink>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ categoryFilter.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container">
      <!-- 分类筛选 -->
      <el-tabs v-model="activeName" @change="onChange">
        <el-tab-pane name="publishTime" label="最新商品"></el-tab-pane>
        <el-tab-pane name="orderNum" label="最高人气"></el-tab-pane>
        <el-tab-pane name="evaluateNum" label="评论最多"></el-tab-pane>
      </el-tabs>
      <div
        class="body"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
      >
        <!-- 商品列表-->
        <GoodItem v-for="good in goodList" :good="good" :key="good.id" />
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
