import { defineStore } from 'pinia'
import { reactive, toRefs, watch, nextTick, computed } from 'vue'
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
  return {
    ...toRefs(state),
  }
})
