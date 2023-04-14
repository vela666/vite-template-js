<template>
  <div
    :style="`min-width: ${width}; min-height: ${height}`"
    id="chart"
    ref="chart"
    class="chart"
  ></div>
</template>
<script>
export default {
  name: 'Chart'
}
</script>
<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入图表，图表后缀都为 Chart
import { LineChart, BarChart } from 'echarts/charts'
// 引入提示框等，组件后缀都为 Component
import {
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  DataZoomComponent,
  DataZoomInsideComponent
} from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer
import { CanvasRenderer } from 'echarts/renderers'
import { debounce } from 'lodash-es'

// 注册必须的组件
echarts.use([
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  GridComponent,
  LineChart,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])
const props = defineProps({
  options: {
    type: Object,
    default() {
      return {}
    }
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '200px'
  }
})
// 获取真实DOM
let chart = ref()
// 存储图表实例
let myChart = null
let resizeHandler = null
const initEcharts = (options) => {
  nextTick(() => {
    // myChart && myChart.dispose()
    myChart = echarts.init(chart.value, 'light')
    myChart.setOption(options)
    myChart.resize()
  })
}
onMounted(() => {
  initEcharts(props.options)
  resizeHandler = debounce(() => {
    myChart.resize()
  }, 300)
  // 图表自适应
  window.addEventListener('resize', resizeHandler)
})
onBeforeUnmount(() => {
  myChart && myChart.dispose()
  myChart = null
  window.removeEventListener('resize', resizeHandler)
})

watch(
  () => props.options,
  (val) => {
    myChart.setOption(props.options, {
      notMerge: true
    })
    // initEcharts(props.options)
  },
  { deep: true }
)
</script>

<style lang="scss" scoped></style>
