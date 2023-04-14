<template>
  <div class="flow-diagnosis" v-loading="state.loading">
    <Navigation :navbar="navbar" />
    <CommonLayout>
      <template #hl>
        <el-cascader
          v-model="state.search.experiment"
          class="w-320"
          @change="cascaderChange"
          :options="cascaderOption"
          :props="cascaderProps"
          collapse-tags
          filterable
          placeholder="筛选试验"
          collapse-tags-tooltip
          clearable
        />
        <el-button @click="getFlowDiagnosis(true)" :icon="Refresh"
          >刷新
        </el-button>
      </template>
      <div class="pre-diagnosis-tips">
        <div>注意：</div>
        <div>
          <span
            >1、暂时只支持运行中的试验进行预诊断，试验流量只分析用户首次请求</span
          >
          <span
            >2、流量预诊断出来的结果可能跟实际结果有一定偏差，如调整试验占用试验层流量比例；定向试验（选择分群）时，用户不符合定向条件；试验完成（流量释放）；试验层中加入运行中的试验</span
          >
        </div>
      </div>
      <div class="statistics m-t-20">
        <div class="n-title m-b-10">预诊流量数</div>
        <div class="flex-center">
          <span class="fz-14 c333"
            >用户总人数：{{ state.trafficData.requestNum }}</span
          >
          <span class="fz-14 c333"
            >异常请求数：{{ state.trafficData.exceptionReqNum }}</span
          >
          <span class="fz-14 c333"
            >测试用户数：{{ state.trafficData.testUserNum }}</span
          >
        </div>
      </div>
      <div class="n-title m-t-20 m-b-20">预诊数据</div>
      <el-table
        height="100%"
        class="n-table-custom-css"
        style="width: 100%"
        :span-method="mergeHanlder"
        :data="tableData"
        ref="tableRef"
        border
      >
        <el-table-column
          v-for="item of columns"
          :key="item"
          :label="item.label"
          :prop="item.prop"
          :fixed="item.fixed"
          :min-width="item.width"
        >
          <template #header v-if="item.prop === 'userNumRatio'">
            <span>
              {{ item.label }}
              <svg-icon
                v-tooltip="{
                  hide: false,
                  txt: '计算公式：命中用户数 / 用户总人数'
                }"
                name="micro1-help1"
              />
            </span>
          </template>
          <template #header v-else-if="item.prop === 'cfgRatio'">
            <span>
              {{ item.label }}
              <svg-icon
                v-tooltip="{
                  hide: false,
                  txt: '计算公式：试验层所占比例 * 受众用户百分比 * 权重'
                }"
                name="micro1-help1"
              />
            </span>
          </template>
          <template #default="{ row }">
            <el-button
              v-if="item.operate"
              @click="viewResults(row)"
              text
              type="primary"
              >预诊结果
            </el-button>
            <template v-else>
              {{ `${row[item.prop]}${item.percent ? '%' : ''} ` }}
            </template>
          </template>
        </el-table-column>
      </el-table>
    </CommonLayout>
    <FlowDiagnosisDrawer ref="flowDiagnosisDrawerRef" />
  </div>
</template>
<script>
export default {
  name: 'FlowDiagnosis'
}
</script>
<script setup>
import { ref, reactive, markRaw, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import Navigation from '@/components/Navigation'
import CommonLayout from '@/components/CommonLayout'
import FlowDiagnosisDrawer from './components/FlowDiagnosisDrawer'
import { asyncGetFlowDiagnosis } from '@/api/ab-test/test-list'
import { uniqBy } from 'lodash-es'
const route = useRoute()
const router = useRouter()

const columns = [
  {
    label: '试验层',
    prop: 'layerName',
    mergeKey: 'layerId'
  },
  { label: '试验', prop: 'experimentName', mergeKey: 'experimentId' },
  { label: '试验组', prop: 'groupName' },
  {
    label: '命中用户数',
    prop: 'userNum'
  },
  { label: '模拟用户占比', percent: true, prop: 'userNumRatio' },
  { label: '配置用户占比', percent: true, prop: 'cfgRatio' },
  {
    label: '操作',
    operate: true,
    mergeKey: 'experimentId'
  }
]

const initVal = () => {
  return {
    loading: false,
    trafficData: {
      hit: [],
      exceptionReqNum: 0,
      requestNum: 0,
      testUserNum: 0
    },
    // 记录已计算的行合并数据
    cache: {},
    tableRowLists: [],
    // 记录试验及试验层相同id有多少数据
    experiment: {},
    layer: {},
    // 过滤试验
    search: {
      experiment: []
    }
  }
}
const navbar = [
  {
    label: '试验列表',
    path: '/ab-test/index'
  },
  {
    label: '流量预诊',
    path: ''
  }
]
const cascaderProps = { multiple: true, emitPath: false }
const state = reactive(initVal())
const cascaderOption = computed(() => {
  const data = uniqBy(state.trafficData.hit, 'experimentId')
  return Object.values(
    data.reduce((acc, item) => {
      const { layerName, layerId } = item
      if (!acc[layerName]) {
        acc[layerName] = {
          value: layerId,
          label: layerName,
          children: []
        }
      }
      acc[layerName].children.push({
        label: item.experimentName,
        value: item.experimentId
      })
      return acc
    }, {})
  )
})
const tableData = computed(() => {
  if (state.search.experiment.length) {
    return state.trafficData.hit.filter((item) =>
      state.search.experiment.includes(item.experimentId)
    )
  }
  return state.trafficData.hit
})
const flowDiagnosisDrawerRef = ref(null)
const viewResults = (row) => {
  flowDiagnosisDrawerRef.value.open(state.experiment[row.experimentId])
}

const cascaderChange = () => {
  state.cache = {}
}

const mergeLine = (mergeKey = 'experimentId') => {
  if (state.cache[mergeKey]) return state.cache[mergeKey]

  let position = 0
  const rowSpanArr = tableData.value.reduce((p, item, index) => {
    if (index === 0) {
      p.push(1)
      position = 0
    } else {
      if (item[mergeKey] === tableData.value[index - 1][mergeKey]) {
        p[position] += 1 //项目名称相同，合并到同一个数组中
        p.push(0)
      } else {
        p.push(1)
        position = index
      }
    }
    return p
  }, [])
  state.cache[mergeKey] = rowSpanArr
  return rowSpanArr
}
// 当前行row、当前列column、当前行号rowIndex、当前列号columnIndex
const mergeHanlder = ({ row, column, rowIndex, columnIndex }) => {
  if (column.rawColumnKey.mergeKey && columnIndex === column.no) {
    return {
      // rowspan: 1,
      rowspan: mergeLine(column.rawColumnKey.mergeKey)[rowIndex],
      colspan: 1
    }
  }
  /*if (columnIndex === 1 || columnIndex === 6) {
      const rowSpan = handleTableData1.value[rowIndex]
      return {
        rowspan: rowSpan, //行
        colspan: 1 //列
      }
    }*/
}

const getFlowDiagnosis = async (bool = false) => {
  try {
    bool && Object.assign(state, initVal())
    state.loading = true
    const { data } = await asyncGetFlowDiagnosis()
    state.trafficData = markRaw(data)
    state.trafficData.hit.forEach((c) => {
      ;(
        state.experiment[c.experimentId] ||
        (state.experiment[c.experimentId] = [])
      ).push(c)
      ;(state.layer[c.layerId] || (state.layer[c.layerId] = [])).push(c)
    })
    // 按照试验层及试验排序
    state.trafficData.hit.sort((a, b) => {
      const aKey = `${a.layerId}${a.experimentId}`
      const bKey = `${b.layerId}${b.experimentId}`
      return aKey.localeCompare(bKey)
    })

    // 按照数据长度排序
    state.trafficData.hit.sort(
      (a, b) => state.layer[a.layerId].length - state.layer[b.layerId].length
    )
  } catch (e) {
    Object.assign(state, initVal())
    console.log(e)
  }
  state.loading = false
}
getFlowDiagnosis()
</script>
<style lang="scss" scoped>
.flow-diagnosis {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.pre-diagnosis-tips {
  display: flex;
  width: 880px;
  background: #fff2e2;
  border: 1px solid #ff9f24;
  border-radius: 2px;
  padding: 10px;
  > div {
    font-size: 14px;
    color: #333;
    &:first-of-type {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      white-space: nowrap;
    }
    &:last-of-type {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  }
}
.statistics {
  > .flex-center {
    gap: 20px;
  }
}
:deep(.common-layout-header) {
  border-bottom: 1px solid $border-color;
  margin-bottom: 20px;
}

:deep(.common-layout-main) {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}
:deep(.operate-cascader__tags) {
  flex-wrap: nowrap;
  .operate-tag.is-closable {
    max-width: 50%;
  }
}
</style>
