<template>
  <CommonLayout :loading="state.reqLoading" :pd="false">
    <template #hl>
      <el-input
        v-model="state.search.keyWord"
        :prefix-icon="Search"
        placeholder="搜索试验层名称"
        class="w-220"
        clearable
      />
      <el-checkbox class="m-l-10" v-model="state.search.type">
        仅查看我创建的</el-checkbox
      >
    </template>
    <template #hr>
      <el-button
        @click="addOrEditTestLayer()"
        :icon="CirclePlus"
        type="primary"
      >
        添加试验层
        <svg-icon
          v-tooltip="{
            hide: false,
            txt: '在同一个试验层下的试验，相互之间是互斥的，这意味着应用的用户只能命中该试验层中的一个试验'
          }"
          name="help1"
          class="m-l-5"
        />
      </el-button>
    </template>
    <el-table
      ref="tableRef"
      height="100%"
      class="n-table-custom-css"
      style="width: 100%"
      :data="listData"
      @sort-change="tableSort"
      border
    >
      <el-table-column
        v-for="item of columns"
        :key="item"
        :label="item.label"
        :prop="item.prop"
        :fixed="item.fixed"
        :min-width="item.width"
        :filter-multiple="false"
        :show-overflow-tooltip="showTooltipfn(item)"
        :sortable="item.sortable"
      >
        <template #default="{ row }">
          <template v-if="item.isOperate">
            <el-button
              class="p0 m-r-10"
              :disabled="!row.operateFlag"
              @click="addOrEditTestLayer(true, row)"
              text
            >
              <svg-icon
                v-tooltip="!row.operateFlag ? '非本人创建无权限操作' : ''"
                :class="{ c409EFF: row.operateFlag }"
                name="micro1-edit1"
              />
            </el-button>
            <el-button
              :disabled="!row.operateFlag || !row.deleteFlag"
              class="p0 m0"
              @click="deleteData(row)"
              text
            >
              <svg-icon
                v-tooltip="allowOperation(row)"
                :class="{ c409EFF: row.deleteFlag && row.operateFlag }"
                name="micro1-delete1"
              />
            </el-button>
          </template>
          <el-progress
            v-else-if="item.isFlowRate"
            :percentage="row[item.prop]"
          />
          <el-button
            v-else-if="item.isExperimentNum"
            @click="viewDetails(row)"
            type="primary"
            text
          >
            {{ row[item.prop] }}</el-button
          >
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
  <AddOrUpdDialog
    v-model="state.showOperateDialog"
    :title="diaLogTitle"
    width="450px"
    :loading="state.operatLoading"
    @submit="submitForm"
    @close="formClose"
  >
    <el-form
      ref="formRef"
      label-position="top"
      label-width="100px"
      :model="state.formData"
    >
      <el-form-item
        :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
        label="试验层名称"
        prop="experimentLayerName"
      >
        <el-input
          @blur="inputBlur('experimentLayerName')"
          maxlength="50"
          show-word-limit
          clearable
          placeholder="请输入"
          v-model="state.formData.experimentLayerName"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          @blur="inputBlur('remark')"
          maxlength="200"
          show-word-limit
          resize="none"
          rows="9"
          type="textarea"
          placeholder="请输入"
          v-model="state.formData.remark"
        />
      </el-form-item>
    </el-form>
  </AddOrUpdDialog>
  <TestlayerDetails @refreshList="getTableData" ref="testlayerDetailsRef" />
</template>

<script>
export default {
  name: 'Testlayer'
}
</script>
<script setup>
import { watch, reactive, ref, nextTick, computed } from 'vue'
import CommonLayout from '@/components/CommonLayout'
import AddOrUpdDialog from '@/components/AddOrUpdDialog'
import Pagination from '@/components/Pagination'
import TestlayerDetails from './components/TestlayerDetails'
import { CirclePlus, Search } from '@element-plus/icons-vue'
import usePaginationState from '@/components/Pagination/hooks'
import { ElMessageBox, ElMessage } from 'element-plus'
import { cloneDeep, debounce } from 'lodash-es'
import { allowOperation } from './enumerate'
import {
  asyncAddTestLayer,
  asyncUpdTestLayer,
  asyncGetTestLayerList,
  asyncDelTestLayer
} from '@/api/ab-test/test-layer'
import { behaviorCollection } from '@/api/common'
const { executeGetData, listData, pagingConfig } = usePaginationState()

const USER_BEHAVIOR = {
  model: 'AB测试',
  page: '试验层'
}
const initVal = () => {
  return {
    search: {
      keyWord: '',
      type: false
    },
    listData: [],
    showOperateDialog: false,
    formData: {
      experimentLayerName: '',
      remark: ''
    },
    reqLoading: false,
    operatLoading: false,
    // 根据哪个字段排序
    orderBy: null,
    // 排序方式:降序DESC 升序ASC
    orderType: null
  }
}
const columns = [
  { label: '试验层名称', prop: 'experimentLayerName' },
  { label: '备注', prop: 'remark' },
  {
    label: '试验数',
    prop: 'experimentNum',
    isExperimentNum: true,
    sortable: true
  },
  { label: '剩余可用流量比例', prop: 'remainingData', isFlowRate: true },
  { label: '创建时间', prop: 'createTime', sortable: true },
  { label: '创建人', prop: 'creator' },
  { label: '操作', isOperate: true }
]
// 请求过
let isReqOnce = false

const state = reactive(initVal())
const formRef = ref(null)
const tableRef = ref(null)
const testlayerDetailsRef = ref(null)
const diaLogTitle = computed(() => {
  return `${state.formData.experimentLayerId ? '编辑' : '添加'}试验层`
})
const getTableData = async (reset = false, behavior = false) => {
  // 数据未加载完成表格 显示加载效果
  state.reqLoading = true
  const params = {
    ...state.search
  }
  if (behavior) {
    params.COLLECT_USER_BEHAVIOR = {
      ...USER_BEHAVIOR,
      operate: '查询试验层列表'
    }
  }
  await executeGetData(params, asyncGetTestLayerList, reset).finally((_) => {
    state.reqLoading = false
  })
  if (state.orderBy && state.orderType) {
    tableRef.value?.sort(state.orderBy, state.orderType)
  }
}
const tableSort = ({ prop, order }) => {
  state.orderBy = prop
  state.orderType = order
}
const addOrEditTestLayer = (bool = true, item) => {
  state.showOperateDialog = bool
  if (item) {
    state.formData = {
      experimentLayerId: item.experimentLayerId,
      experimentLayerName: item.experimentLayerName,
      remark: item.remark
    }
  }
}
// 内容过长是否显示提示
const showTooltipfn = (column) => {
  let arr = ['isOperate', 'isFlowRate']
  return Object.keys(column).reduce((p, c) => {
    if (arr.includes(c)) {
      p = !column[c]
    }
    return p
  }, '')
}
const inputBlur = (key) => {
  state.formData[key] = state.formData[key].trim()
}
const deleteData = async (row) => {
  try {
    await ElMessageBox.confirm(
      `删除【${row.experimentLayerName}】试验层，会同时删除其中的${row.experimentNum}个试验，确定删除吗？`,
      '删除试验层',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customClass: 'n-message-box-424'
      }
    )
    const { code } = await asyncDelTestLayer({
      experimentLayerId: row.experimentLayerId,
      COLLECT_USER_BEHAVIOR: {
        ...USER_BEHAVIOR,
        operate: '删除试验层'
      }
    })
    if (code !== 200) return
    code === 200 && ElMessage.success('删除成功')
    getTableData()
  } catch (e) {
    console.log(e)
  }
}
const formClose = async () => {
  state.formData = cloneDeep(initVal().formData)
  isReqOnce && getTableData()
  isReqOnce = false
}
const submitForm = debounce(async () => {
  try {
    const valid = await formRef.value.validate()
    state.operatLoading = true
    const bool = Reflect.has(state.formData, 'experimentLayerId')
    const reqFn = bool ? asyncUpdTestLayer : asyncAddTestLayer
    const { code } = await reqFn({
      ...state.formData,
      experimentLayerName: state.formData.experimentLayerName.trim(),
      remark: state.formData.remark.trim(),
      COLLECT_USER_BEHAVIOR: {
        ...USER_BEHAVIOR,
        operate: diaLogTitle.value
      }
    }).finally((_) => {
      state.operatLoading = false
    })
    if (code !== 200) return
    isReqOnce = true
    addOrEditTestLayer(false)
    ElMessage.success(`${bool ? '编辑' : '添加'}成功`)
  } catch (e) {
    console.log(e)
  }
}, 300)
const viewDetails = (row) => {
  testlayerDetailsRef.value.open(row.experimentLayerId)
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

<style scoped lang="scss"></style>
