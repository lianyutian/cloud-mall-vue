import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { imgLazyPlugin } from '@/directives'
import { componentPlugin } from '@/components'

// 引入初始化样式文件
import '@/styles/common.scss'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)
app.use(imgLazyPlugin)
app.use(componentPlugin)

app.mount('#app')
