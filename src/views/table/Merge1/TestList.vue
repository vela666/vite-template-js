<template>
  <CommonLayout :loading="state.reqLoading" :pd="false">
    <template #hl>
      <el-input
        v-model="state.search.keyWord"
        :prefix-icon="Search"
        placeholder="搜索试验名称/ID"
        class="w-220"
        clearable
      />
      <el-checkbox class="m-l-10" v-model="state.search.type">
        仅查看我创建的</el-checkbox
      >
    </template>
    <template #hr>
      <div class="fz-14 c616161 flex-center">
        可运行试验剩余数量：<i class="c409EFF">{{
          state.totalExperimentObj
        }}</i>
      </div>
      <el-button @click="$router.replace({ name: 'FlowDiagnosis' })">
        <svg-icon name="micro1-diagnosis1" />
        <span class="m-l-r-5">流量预诊</span>
        <svg-icon
          v-tooltip="
            '以试验角度进行预诊断分析，分流服务会根据昨日日活用户进行流量试验并获取用户首次请求试验命中或未命中的情况，同时可以也进一步验证分流服务的健康度'
          "
          name="micro1-help1"
        />
      </el-button>
      <el-button @click="getTableData()" :icon="Refresh">刷新 </el-button>

      <el-button
        @click="addOrEditTestHandler()"
        :icon="CirclePlus"
        type="primary"
      >
        创建试验
      </el-button>
    </template>
    <el-table
      height="100%"
      class="n-table-custom-css"
      style="width: 100%"
      :data="listData"
      @sort-change="tableSort"
      @filter-change="filterChange"
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
        :column-key="showFilters(item.prop) ? item.prop : undefined"
        :filter-multiple="showFilters(item.prop) ? true : false"
        :filters="showFilters(item.prop) ? equipmentStatusFilters : undefined"
        :filter-placement="showFilters(item.prop) ? 'bottom-end' : undefined"
        :sortable="item.sortable"
        :show-overflow-tooltip="showTooltipfn(item)"
      >
        <template #header v-if="item.isSwitch">
          <DataFilter
            v-model="state.search.switchFilter"
            name="启用/停用"
            :list="testlayerStatusTypeList"
          />
        </template>
        <template #header v-else-if="item.pushType">
          <DataFilter
            v-model="state.search.pushType"
            name="发布方式"
            :list="
              Object.keys(releaseMethodList).map((item) => ({
                type: +item,
                label: releaseMethodList[item]
              }))
            "
          />
        </template>
        <!-- <template #header v-else-if="item.isStatus">
          <DataFilter
            v-model="state.search.statusFilter"
            name="状态"
            :list="equipmentStatusTypeList"
          />
        </template> -->

        <template #default="{ row }">
          <el-switch
            v-if="item.isSwitch"
            :disabled="!row.operateFlag || row.status === 4"
            v-tooltip="allowOperation(row)"
            @change="switchChange(row)"
            v-model="row[item.prop]"
            :active-value="2"
            :inactive-value="1"
          >
          </el-switch>
          <div class="flex-center" v-else-if="item.isStatus">
            <i
              :class="['m-r-5', equipmentStatusTypeMap(row[item.prop]).css]"
            ></i>
            <span>
              {{ equipmentStatusTypeMap(row[item.prop]).label }}
            </span>
          </div>
          <!-- <template v-else-if="item.prop === 'testType'"> 在线参数 </template> -->
          <template v-else-if="item.prop === 'occupancy'">
            <div>{{ row[item.prop] }}%</div>
            <el-button
              v-showTips
              @click="viewDetails(row)"
              class="m0 p0"
              type="primary"
              text
            >
              {{ row.experimentLayerName }}</el-button
            >
          </template>
          <template v-else-if="item.prop === 'pushType'">
            {{ releaseMethodList[row[item.prop]] }}
            <div v-show="+row[item.prop] === 2">{{ row.pushTime }}</div>
          </template>
          <template v-else-if="item.prop === 'dayNum'">
            {{ row[item.prop] }}天
          </template>
          <template v-else-if="item.elapsedTime">
            <el-tooltip v-if="row.beginTime" placement="top">
              <template #content>
                <div>已运行时长：{{ timeConversion(row) }}</div>
                <div>开始时间：{{ row.beginTime }}</div>
                <div>结束时间：{{ row.endTime }}</div>
              </template>
              <div>
                <div>
                  {{ timeConversion(row) }}
                  <span class="cffa800">
                    {{ +row.stopFlag === 2 ? '手动终止' : '' }}
                  </span>
                </div>
                <div class="fz-12">
                  {{ row.beginTime }} 至 {{ row.endTime }}
                </div>
              </div>
            </el-tooltip>
            <!--            <div
              v-if="row.beginTime"
              v-tooltip="{
                hide: false,
                txt: `
                <div>
                  <div>已运行时长：${timeConversion(row)}</div>
                 <div class='m-t-b-10'>开始时间：${row.beginTime}</div>
                 <div>结束时间：${row.endTime}</div>
                </div>
              `,
                className: 'n-test-list-tooltip'
              }"
            >
              <div class="fz-12">
                <div>{{ timeConversion(row) }}</div>
                <div>{{ row.beginTime }} 至 {{ row.endTime }}</div>
              </div>
            </div>-->
            <div v-else>--</div>
          </template>

          <div class="flex-center" v-else-if="item.userRatio">
            <span class="m-r-5">{{ row[item.prop] }}%</span>
            <el-popover
              v-if="row.operateFlag && state.userRatioTips && +row.status !== 4"
              :show-arrow="false"
              :width="280"
              placement="bottom-start"
              trigger="click"
            >
              <template #reference>
                <el-button
                  :disabled="!row.operateFlag"
                  class="m0 p0"
                  text
                  type="primary"
                >
                  <svg-icon name="micro1-edit1" />
                </el-button>
              </template>
              <h4 class="m0">提示</h4>
              <div class="m-t-b-10">
                若调小试验用户流量百分比，仅针对新用户生效，对于已经请求命中试验的用户流量不会被释放
              </div>
              <div class="text-align-r">
                <el-button @click="noRemind(row, true)">不再提示 </el-button>
                <el-button @click="noRemind(row)" type="primary">
                  知道了
                </el-button>
              </div>
            </el-popover>
            <el-button
              :disabled="!row.operateFlag"
              v-else-if="+row.status !== 4"
              class="m0 p0"
              @click="noRemind(row)"
              text
              type="primary"
            >
              <svg-icon v-tooltip="allowOperation(row)" name="micro1-edit1" />
            </el-button>
          </div>
          <MoreChoices
            v-else-if="item.isOperate"
            :data="row"
            @click="(type) => handleOperation(row, type)"
          />

          <!--          <el-button
            v-else-if="item.prop === 'experimentLayerName'"
            @click="viewDetails(row)"
            type="primary"
            text
          >
            {{ row[item.prop] }}</el-button
          >-->
          <template v-else>
            {{ row[item.prop] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <Pagination
        v-model:limit="pagingConfig.pageSize"
        v-model:page="pagingConfig.page"
        :total="pagingConfig.total"
        @getData="getTableData"
      />
    </template>
  </CommonLayout>
  <TestListDrawer ref="testListDrawerRef" />
  <TestlayerDetails
    :behavior="USER_BEHAVIOR"
    @refreshList="getTableData"
    ref="testlayerDetailsRef"
  />
  <AddOrUpdDialog
    v-model="state.updUserRatioDialog"
    title="修改受众用户百分比"
    :loading="state.operatLoading"
    @submit="submitUpdUserRatio"
    @close="dialogClose"
  >
    <div class="flex-center">
      <el-input
        v-model="state.formData.userPercent"
        placeholder="请输入"
        class="m-r-5"
        @blur="inputBlur('userRatioFn')"
      />
      %
    </div>
  </AddOrUpdDialog>
</template>

<script>
export default {
  name: 'TestList'
}
</script>
<script setup>
import { reactive, ref, watch } from 'vue'
// import { reactive, ref, watch, h, withDirectives, resolveDirective } from 'vue'
import { useRouter } from 'vue-router'
import CommonLayout from '@/components/CommonLayout'
import AddOrUpdDialog from '@/components/AddOrUpdDialog'
import DataFilter from '@/components/DataFilter'
import Pagination from '@/components/Pagination'
import AddOrEditTest from '@/views/ABTest/AddOrEditTest'
import MoreChoices from './components/MoreChoices'
import TestListDrawer from './components/TestListDrawer'
import TestlayerDetails from './components/TestlayerDetails'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CirclePlus, Refresh, Search, Loading } from '@element-plus/icons-vue'
import { numInputMap } from '@/utils'
import { debounce } from 'lodash-es'
import dayjs from 'dayjs'
import {
  allowOperation,
  equipmentStatusTypeMap,
  equipmentStatusTypeList,
  testlayerStatusTypeList,
  releaseMethodList,
  timeConversion
} from './enumerate'

import {
  asyncGetTestList,
  asyncUpdTestSwitch,
  asyncReleaseTest,
  asyncDelTest,
  asyncTotalExperiment,
  updateUserPercent,
  asyncStopTest
} from '@/api/ab-test/test-list'
import { behaviorCollection } from '@/api/common'
import usePaginationState from '@/components/Pagination/hooks'

const router = useRouter()
const { executeGetData, listData, pagingConfig } = usePaginationState()
const initVal = () => {
  return {
    formData: {
      // 受众用户百分比
      userPercent: '',
      // 试验ID
      experimentId: ''
    },
    search: {
      keyWord: '',
      switchFilter: '',
      statusFilter: '',
      pushType: '',
      type: false,
      statusList: []
    },
    reqLoading: false,
    operatLoading: false,
    totalExperimentObj: 0,
    // 更新受众用户百分比弹窗
    updUserRatioDialog: false,
    // 根据哪个字段排序
    orderBy: null,
    // 排序方式:降序DESC 升序ASC
    orderType: null,
    // 是否显示修改受众用户百分比提示
    userRatioTips: JSON.parse(sessionStorage.getItem('userRatioTips') || 'true')
  }
}
const state = reactive(initVal())
const tableRef = ref(null)
const testListDrawerRef = ref(null)
const testlayerDetailsRef = ref(null)
// jsx里使用自定义指令
// const elLoading = resolveDirective('loading')

const columns = [
  {
    label: '启用/停用',
    prop: 'switchStatus',
    width: '100',
    fixed: true,
    isSwitch: true
  },
  { label: '试验名称', prop: 'experimentName', width: 180, fixed: true },
  { label: '试验ID', prop: 'experimentId', fixed: true },
  { label: '状态', isStatus: true, prop: 'status', width: 100, fixed: true },
  { label: '占用试验层比例', prop: 'occupancy', width: 120 },
  /* { label: '试验类型', prop: 'testType' }, */
  { label: '受众用户百分比', prop: 'userPercent', userRatio: true, width: 120 },
  { label: '发布方式', prop: 'pushType', pushType: true, width: 120 },
  // { label: '试验层', prop: 'experimentLayerName' },
  { label: '试验已运行时长', elapsedTime: true, width: 210 },
  { label: '操作', width: 150, isOperate: true }
  // { label: '试验时长', prop: 'dayNum' },
  // { label: '开始时间', prop: 'beginTime', sortable: true },
  // { label: '结束时间', prop: 'endTime', sortable: true },
  // { label: '创建人', prop: 'creator' },
  // { label: '创建时间', prop: 'createTime', sortable: true },
  // { label: '备注', prop: 'remark' }
]
const USER_BEHAVIOR = {
  model: 'AB测试',
  page: '试验列表'
}
const getTableData = async (reset = false, behavior = false) => {
  // 数据未加载完成表格 显示加载效果
  state.reqLoading = true
  const params = {
    ...state.search
  }
  if (behavior) {
    params.COLLECT_USER_BEHAVIOR = {
      ...USER_BEHAVIOR,
      operate: '查询试验列表'
    }
  }
  executeGetData(params, asyncGetTestList, reset).finally((_) => {
    state.reqLoading = false
    if (state.orderBy && state.orderType) {
      tableRef.value?.sort(state.orderBy, state.orderType)
    }
  })
  const { data } = await asyncTotalExperiment()
  state.totalExperimentObj = data
}

const inputBlur = (type) => {
  const typeFn = {
    userRatioFn() {
      const val = numInputMap(state.formData.userPercent, 2)
      state.formData.userPercent = val > 100 ? 100 : val < 0.01 ? 0.01 : val
    },
    uncertainFn() {
      state.formData[type] = state.formData[type].trim()
    }
  }
  if (typeFn[type]) typeFn[type]()
  else typeFn.uncertainFn()
}

// 不再提示修改受众用户百分比提示
const noRemind = (row, noPrompt = false) => {
  state.userRatioTips = false
  state.updUserRatioDialog = true
  Object.keys(state.formData).forEach((key) => {
    state.formData[key] = row[key]
  })
  noPrompt &&
    sessionStorage.setItem('userRatioTips', JSON.stringify(state.userRatioTips))
}

const tableSort = ({ prop, order }) => {
  state.orderBy = prop
  state.orderType = order
}
// 内容过长是否显示提示
const showTooltipfn = (column) => {
  let arr = ['isOperate', 'isSwitch', 'elapsedTime']
  return Object.keys(column).reduce((p, c) => {
    if (arr.includes(c)) {
      p = false
    }
    return p
  }, true)
}

// 切换启用/停用
const switchChange = async (row) => {
  try {
    // 隐藏事件需要确认
    row.switchStatus === 1 &&
      (await ElMessageBox.confirm(
        `确定暂停试验【${row.experimentName}】吗？`,
        '暂停试验',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          customClass: 'n-message-box-424'
        }
      ))
    ElMessage.closeAll()
    const { code } = await asyncUpdTestSwitch({
      experimentId: row.experimentId,
      switchStatus: row.switchStatus,
      COLLECT_USER_BEHAVIOR: {
        ...USER_BEHAVIOR,
        operate: `${row.switchStatus === 1 ? '停用' : '启用'}试验`
      }
    })
    code === 200 &&
      ElMessage.success(`${row.switchStatus === 1 ? '停用' : '启用'}成功`)
  } catch (e) {
    row.switchStatus = row.switchStatus === 1 ? 2 : 1
  }
}

const viewDetails = (row) => {
  testlayerDetailsRef.value.open(row.experimentLayerId)
}

const handleOperation = debounce((row, type) => {
  operationCallback[type]?.(row)
}, 300)

const addOrEditTestHandler = (experimentId = null, type = 1) => {
  const query = {
    // 1创建 2编辑 3复制
    type
  }
  if (type !== 1) {
    query.experimentId = experimentId
  }
  router.replace({
    name: 'AddOrEditTest',
    query
  })
}
const operationCallback = {
  async publishTest(row) {
    try {
      // 隐藏事件需要确认
      await ElMessageBox.confirm(
        `确定发布试验【${row.experimentName}】吗？`,
        '发布试验',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          customClass: 'n-message-box-424'
        }
      )
      ElMessage.closeAll()
      const { code } = await asyncReleaseTest({
        experimentId: row.experimentId,
        COLLECT_USER_BEHAVIOR: {
          ...USER_BEHAVIOR,
          operate: '发布试验'
        }
      })
      if (code !== 200) return
      ElMessage.success('发布成功')
      getTableData()
    } catch (e) {
      console.log(e)
    }
  },
  testDetails(row) {
    testListDrawerRef.value.open(row)
  },
  testData(row) {
    // 隐藏事件需要确认
    ElMessageBox.confirm(
      `确定暂停试验【${row.experimentName}}】吗？`,
      '隐藏事件',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customClass: 'n-message-box-424'
      }
    )
  },
  copyTest(row) {
    addOrEditTestHandler(row.experimentId, 3)
  },
  editTest(row) {
    addOrEditTestHandler(row.experimentId, 2)
  },
  async deleteTest(row) {
    try {
      // 隐藏事件需要确认
      await ElMessageBox.confirm(
        `确定删除试验【${row.experimentName}】吗？`,
        '删除试验',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          customClass: 'n-message-box-424'
        }
      )
      ElMessage.closeAll()
      const { code } = await asyncDelTest({
        experimentId: row.experimentId,
        COLLECT_USER_BEHAVIOR: {
          ...USER_BEHAVIOR,
          operate: '删除试验'
        }
      })
      if (code !== 200) return
      ElMessage.success('删除成功')
      getTableData()
    } catch (e) {
      console.log(e)
    }
  },
  async stopTest(row) {
    try {
      await ElMessageBox.confirm(
        `终止后，该试验将终止运行，确定终止该试验吗？`,
        '终止试验',
        {
          title: '终止试验',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          customClass: 'n-message-box-424'
        }
      )
      // 使用jsx自定义按钮
      /*   await ElMessageBox.confirm(
        `终止后，该试验将终止运行，确定终止该试验吗？`,
        '终止试验',
        {
          title: '终止试验',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          showCancelButton: false,
          showConfirmButton: false,
          customClass: 'n-message-box-424',
          /!* beforeClose: (action, instance, done) => {
              console.log(action, instance)
            },*!/
          message: () =>
            h('div', {}, [
              '终止后，该试验将终止运行，确定终止该试验吗？',
              h('div', { class: 'text-align-r m-t-20' }, [
                withDirectives(
                  h(ElButton, {
                    type: 'primary',
                    innerText: 'cance12312l'
                    // onclick: cancel,
                  }),
                  [[elLoading, true]]
                )
              ])
            ])
        }
      )*/
      ElMessage.closeAll()
      const { code } = await asyncStopTest({
        experimentId: row.experimentId,
        COLLECT_USER_BEHAVIOR: {
          ...USER_BEHAVIOR,
          operate: '终止试验'
        }
      })
      if (code !== 200) return
      ElMessage.success('终止试验成功')
      getTableData()
    } catch (e) {
      console.log(e)
    }
  }
}

const dialogClose = (_) => {
  state.formData = initVal().formData
  state.updUserRatioDialog = false
  if (!sessionStorage.getItem('userRatioTips')) {
    state.userRatioTips = true
  }
}
const submitUpdUserRatio = async (_) => {
  if (!state.formData.userPercent) {
    ElMessage.closeAll()
    ElMessage.warning('请输入')
    return
  }
  state.operatLoading = true
  const { code } = await updateUserPercent(state.formData).finally((_) => {
    state.operatLoading = false
  })
  if (code === 200) {
    ElMessage.success('修改成功')
    dialogClose()
    getTableData()
  }
}

const showFilters = (prop) => ['status'].includes(prop)

const equipmentStatusFilters = equipmentStatusTypeList.map(
  ({ label, type }) => ({ text: label, value: type })
)

const filterChange = (filters) => {
  if (filters['status']) state.search.statusList = filters['status']
}
watch(
  () => state.search,
  debounce(() => {
    getTableData()
  }, 300),
  { deep: true }
)
getTableData(false, true)
</script>

<style lang="scss">
.n-test-list-tooltip {
  overflow: visible !important;
  white-space: normal !important;
}
</style>
