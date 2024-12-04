<script setup>
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore()
</script>

<template>
  <div>
    <ul class="app-header-nav">
      <!-- 渲染一级分类数据 -->
      <li
        class="home"
        v-for="item in categoryStore.categoryList"
        :key="item.id"
      >
        <!-- 配置分类路由跳转 -->
        <RouterLink active-class="active" :to="`/category/${item.id}`">{{
          item.name
        }}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.app-header-nav {
  width: 820px;
  display: flex;
  padding-left: 40px;
  position: relative;
  z-index: 998;

  li {
    margin-right: 40px;
    width: 38px;
    text-align: center;

    a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;

      &:hover {
        color: $mallColor;
        border-bottom: 1px solid $mallColor;
      }
    }

    .active {
      color: $mallColor;
      border-bottom: 1px solid $mallColor;
    }
  }
}
</style>
