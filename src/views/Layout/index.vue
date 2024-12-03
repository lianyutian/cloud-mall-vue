<script setup>
import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFixed from './components/LayoutFixed.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { onMounted } from 'vue'

// 触发获取导航分类数据 action
const categoryStore = useCategoryStore()
onMounted(() => categoryStore.getCategory())
</script>

<template>
  <LayoutNav />
  <LayoutHeader />
  <LayoutFixed />
  <!-- 二级路由 -->
  <RouterView :key="$route.fullPath" />
  <LayoutFooter />
</template>
