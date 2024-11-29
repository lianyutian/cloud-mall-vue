<script setup>
import { onMounted, ref } from 'vue'
import { getBannerAPI } from '@/apis/home'

const bannerList = ref([])
const getBanner = async () => {
  const res = await getBannerAPI()
  bannerList.value = res.result
}

onMounted(() => getBanner())
</script>

<template>
  <div class="home-banner">
    <a-carousel height="500px" autoplay>
      <div v-for="item in bannerList" :key="item.id">
        <img :src="item.imgUrl" alt="" />
      </div>
    </a-carousel>
  </div>
</template>

<style scoped lang="scss">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;

  img {
    width: 100%;
    height: 500px;
  }
}
</style>
