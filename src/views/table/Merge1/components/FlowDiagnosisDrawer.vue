<template>
  <el-drawer
    v-model="visible"
    append-to-body
    destroy-on-close
    direction="rtl"
    class="n-ab-test-drawer"
    size="900px">
    <template #header>
      <div class="flex-center">
        <span class="title m-r-20"> 预诊结果 </span>
        <span class="fz-14 c1f1f1f">{{ detailData[0]?.experimentName }}</span>
      </div>
    </template>
    <div class="n-ab-test-drawer-c">
      <div class="n-ab-test-detail-c-t">
        <div class="n-title m-b-10">用户占比</div>
        <Chart height="410px" :options="options" />
        <div class="n-title m-b-10">预诊数据</div>
        <el-table
          height="100%"
          class="n-table-custom-css"
          style="width: 100%"
          :data="detailData"
          ref="tableRef"
          border>
          <el-table-column
            v-for="item of columns"
            :key="item"
            :label="item.label"
            :prop="item.prop"
            :fixed="item.fixed"
            :min-width="item.width">
            <template #header v-if="item.prop === 'userNumRatio'">
              <span>
                {{ item.label }}
                <svg-icon
                  v-tooltip="{
                    hide: false,
                    txt: '计算公式：命中用户数 / 用户总人数',
                  }"
                  name="micro1-help1" />
              </span>
            </template>
            <template #header v-else-if="item.prop === 'cfgRatio'">
              <span>
                {{ item.label }}
                <svg-icon
                  v-tooltip="{
                    hide: false,
                    txt: '计算公式：试验层所占比例 * 受众用户百分比 * 权重',
                  }"
                  name="micro1-help1" />
              </span>
            </template>
            <template #default="{ row }">
              {{ `${row[item.prop]}${item.percent ? '%' : ''} ` }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'FlowDiagnosisDrawer',
}
</script>
<script setup>
import { shallowRef } from 'vue'
import Chart from '@/components/Chart'
import {
  releaseMethodList,
  testlayerStatusTypeList,
} from '@/views/table/Merge1/enumerate'
import DataFilter from '@/components/DataFilter/index.vue'

const color = ['#FF9F24', '#409EFF']
const visible = shallowRef(false)
const detailData = shallowRef([])

const options = shallowRef({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    confine: true, // 限制tootip在容器内
    formatter(params) {
      let html = ``
      params.forEach((v) => {
        let vIndex = v.seriesIndex + 1
        html += `
            <div style="display:flex;align-items: center;">
              <span style="display:inline-block;margin-right:5px;width:6px;height:2px;background-color:${
                v.color
              }"></span>
                ${v.seriesName}：
                  <span>${v.value[vIndex] + '%'}</span>
            </div>`
      })
      return html
    },
  },
  legend: {
    // data: ['配置用户占比', '模拟用户占比'],
    bottom: '0%',
    itemHeight: 4,
    itemWidth: 16,
  },
  grid: {
    // left: '8%',
    top: '10%',
    right: '8%',
    width: '87%',
  },
  dataset: {
    // 用 dimensions 指定了维度的顺序。直角坐标系中，如果 X 轴 type 为 category，
    // 默认把第一个维度映射到 X 轴上，后面维度映射到 Y 轴上。
    // 如果不指定 dimensions，也可以通过指定 series.encode
    // 完成映射，参见后文。
    /*  dimensions: ['product', '配置用户占比', '模拟用户占比'],
      source: [
          { product: '试验组1', 配置用户占比: 0.21, 模拟用户占比: 0.18 },
          { product: '试验组4', 配置用户占比: 83.1, 模拟用户占比: 73.4 },
          { product: '试验组3', 配置用户占比: 86.4, 模拟用户占比: 65.2 },
          { product: '基准组', 配置用户占比: 72.4, 模拟用户占比: 53.9 },
          { product: '试验组2', 配置用户占比: 72.4, 模拟用户占比: 53.9 }
      ] */
    source: [
      /*  ['product', '配置用户占比', '模拟用户占比'],
      ['试验组1', 0.21, 0.18],
      ['试验组4', 0.16, 0.18],
      ['试验组3', 0.15, 0.18],
      ['基准组', 0.15, 0.18],
      ['试验组2', 1, 5]*/
    ],
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false, alignWithLabel: true },
      name: '试验组',
      nameTextStyle: {
        color: '#333',
        fontSize: 14,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisLine: {
        show: true,
      },
      name: '用户占比',
      nameTextStyle: {
        color: '#333',
        fontSize: 14,
      },
      axisLabel: {
        formatter: '{value}%',
      },
    },
  ],
  series: [
    {
      name: '配置用户占比',
      type: 'bar',
      barGap: 0,
      label: {
        show: false,
      },
      emphasis: {
        focus: 'series',
      },
      // 设置柱子最大宽度为 30
      barMaxWidth: 30,
      itemStyle: {
        color: color[1],
      },
    },
    {
      name: '模拟用户占比',
      type: 'bar',
      label: {
        show: false,
      },
      emphasis: {
        focus: 'series',
      },
      // 设置柱子最大宽度为 30
      barMaxWidth: 30,
      itemStyle: {
        color: color[0],
      },
    },
  ],
})
const columns = [
  { label: '试验组', prop: 'groupName' },
  {
    label: '命中用户数',
    prop: 'userNum',
  },
  { label: '模拟用户占比', percent: true, prop: 'userNumRatio' },
  { label: '配置用户占比', percent: true, prop: 'cfgRatio' },
]

const open = (data) => {
  visible.value = true
  detailData.value = data
  options.value.dataset.source = data.map((item) => {
    return [
      item.groupName,
      parseFloat(item.cfgRatio),
      parseFloat(item.userNumRatio),
    ]
  })
}
defineExpose({
  open,
})
</script>

<style lang="scss">
.n-ab-test-drawer {
  .operate-drawer__header {
    margin-bottom: 0;
    align-items: center;
    justify-content: center;
    padding: 19px;
  }
  .operate-drawer__body {
    display: flex;
    flex-direction: column;
    padding: 0;
    background: #f7f7f7;
  }
}
</style>
<style lang="scss" scoped>
.title {
  font-size: 14px;
  font-weight: bold;
  color: #1f1f1f;
}

.n-ab-test-drawer-c {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #fff;
  margin-top: 5px;
  flex: 1;
  overflow: hidden;
  .n-ab-test-detail-c-t {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    overflow-y: overlay;
  }
}
</style>
