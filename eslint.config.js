import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  {
    rules: {
      // Vue 推荐规则集
      ...vue.configs['vue3-recommended'].rules,
      // Prettier 兼容
      ...prettier.rules,
       // Vue 相关规则
      'vue/multi-word-component-names': 'off', // 关闭组件名称多单词规则
    },
  },
  
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
]
