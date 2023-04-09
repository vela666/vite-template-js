import { defineStore } from 'pinia'
import { reactive, toRefs, watch, nextTick } from 'vue'

/*export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})*/

export default defineStore('counter', () => {
  const state = reactive({
    isCollapse: false,
  })
  watch(
    () => state.isCollapse,
    (val) => {
      nextTick(() => {
        // 设置全局css变量
        const docStyle = document.documentElement.style
        docStyle.setProperty(
          '--left-nav-width',
          document.querySelector('.n-el-menu-vertical').offsetWidth + 'px',
        )
      })
    },
    { immediate: true },
  )
  return {
    ...toRefs(state),
  }
})
