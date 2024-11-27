<script setup>
import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFixed from './components/LayoutFixed.vue'
import LayoutFooter from './components/LayoutFooter.vue'
</script>

<template>
  <LayoutNav />
  <LayoutHeader />
  <LayoutFixed />
  <!-- 二级路由 -->
  <RouterView />
  <LayoutFooter />
  <LayoutFooter />
  <LayoutFooter />
  <LayoutFooter />
  <LayoutFooter />
</template>