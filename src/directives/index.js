import { useIntersectionObserver } from '@vueuse/core'

export const imgLazyPlugin = {
  install: (app) => {
    app.directive('img-lazy', {
      mounted(el, binding) {
        // el:指令绑定的元素 img
        // binding: binding.value 等于指令后面绑定的表达式 图片url
        const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
          if (isIntersecting) {
            el.src = binding.value
            // 在监听的图片第一次完成加载之后就停止监听
            stop()
          }
        })
      },
    })
  },
}
