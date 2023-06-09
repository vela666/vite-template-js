import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
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
  const toggleCollapseOrExpand = () => {
    state.isCollapse = !state.isCollapse
  }
  return {
    ...toRefs(state),
    toggleCollapseOrExpand,
  }
})
