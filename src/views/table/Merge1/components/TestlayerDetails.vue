<template>
  <AddOrUpdDialog
    v-model="state.show"
    width="960px"
    :loading="state.operatLoading"
    @submit="submitForm"
    @close="close">
    <template #header>
      试验层【{{ state.infoData.experimentLayerName }}】详情
    </template>
    <header class="n-surplus-ratio">
      <div>剩余可用流量比例</div>
      <el-progress :percentage="maxRatio" />
    </header>
    <div class="fz-14 c333 m-b-5">试验信息</div>
    <el-table
      height="100%"
      class="n-table-custom-css"
      style="width: 100%"
      :data="listData"
      border>
      <el-table-column
        v-for="item of columns"
        :key="item"
        :label="item.label"
        :prop="item.prop"
        :fixed="item.fixed"
        :min-width="item.width"
        :filter-multiple="false">
        <template #header v-if="item.isStatus">
          <DataFilter
            v-model="state.filterStatus"
            ref="dataFilterRef"
            name="状态"
            :list="equipmentStatusTypeList" />
        </template>
        <template #default="{ row }">
          <div v-if="item.isStatus" class="flex-center">
            <i
              :class="[
                'm-r-5',
                equipmentStatusTypeMap(row[item.prop]).css,
              ]"></i>
            <span>
              {{ equipmentStatusTypeMap(row[item.prop]).label }}
            </span>
          </div>
          <div v-else-if="item.isOperate" class="flex-center">
            <span v-show="!row.isEdit">{{ row[item.prop] }}</span>
            <el-input
              v-if="row.isEdit"
              @blur="editOccupancy(row, false)"
              class="n-test-ratio-input w-120"
              v-model="row[item.prop]" />
            %
            <svg-icon
              v-show="
                row.operateFlag && [1, 2].includes(+row.status) && !row.isEdit
              "
              @click="editOccupancy(row, true)"
              class="n-pointer m-l-10"
              name="micro1-edit1" />
            <span v-if="+row.status === 4"> （已释放） </span>
          </div>
          <template v-else>
            {{ row[item.prop] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
  </AddOrUpdDialog>
</template>

<script>
export default {
  name: 'TestlayerDetails',
}
</script>
<script setup>
import { computed, watch, reactive, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { asyncInfoTestLayer, asyncUpdRatio } from '@/api/ab-test/test-layer'
import AddOrUpdDialog from '@/components/AddOrUpdDialog'
import DataFilter from '@/components/DataFilter'
import { numInputMap } from '@/utils'
import { equipmentStatusTypeList, equipmentStatusTypeMap } from '../enumerate'
import { ElMessage } from 'element-plus'

const initVal = () => {
  return {
    show: false,
    filterStatus: '',
    operatLoading: false,
    infoData: {
      remainingData: 0,
      experimentLayerId: '',
      experimentLayerName: '',
      experimentList: [],
    },
  }
}
const columns = [
  { label: '试验名称', prop: 'experimentName' },
  { label: '创建人', prop: 'creator' },
  { label: '状态', prop: 'status', isStatus: true },
  // { label: '试验触发总人数', prop: 'totalNum' },
  { label: '占用试验层比例', prop: 'occupancy', isOperate: true },
]
// 请求过
let isReqOnce = false
const emit = defineEmits(['refreshList'])
const props = defineProps({
  behavior: {
    type: Object,
    default: () => ({
      model: 'AB测试',
      page: '试验层',
    }),
  },
})
const state = reactive(initVal())
const listData = computed(() => {
  let data = state.infoData.experimentList
  data.forEach((item) => {
    item.isEdit = false
  })
  if (!state.filterStatus) {
    return data
  }
  return data.filter((item) => item.status === state.filterStatus)
})
const maxRatio = computed(() => {
  const data = state.infoData.experimentList
  if (!data.length) return state.infoData.remainingData
  // 过滤掉已完成和发布失败的
  let val =
    100 -
    data
      .filter((item) => ![10, 4].includes(item.status))
      .reduce((p, c) => (p += numInputMap(c.occupancy, 0)), 0)
  return val > 100 ? 100 : val < 0 ? 0 : val
})
const getData = async (experimentLayerId) => {
  state.operatLoading = true
  const { code, data } = await asyncInfoTestLayer({
    experimentLayerId,
  }).finally((_) => {
    state.operatLoading = false
  })
  code === 200 && (state.infoData = data)
}
// 修改比例
const editOccupancy = (row, bool) => {
  row.isEdit = bool
  if (!bool) {
    row.occupancy = numInputMap(row.occupancy, 0)
    if (row.occupancy < 1) {
      row.occupancy = 1
      return
    }
    // 总和不包括当前编辑的
    const max = state.infoData.experimentList
      .filter(
        (item) =>
          ![10, 4].includes(item.status) &&
          item.experimentId !== row.experimentId,
      )
      .reduce((p, c) => (p += +c.occupancy), 0)
    if (row.occupancy + max > 100) {
      row.occupancy = 100 - max
    }
    return
  }
  nextTick(() => {
    document.querySelector('.n-test-ratio-input .operate-input__inner').focus()
  })
}

const open = (experimentLayerId) => {
  state.show = true
  getData(experimentLayerId)
}
const close = () => {
  Object.assign(state, initVal())
}

const submitForm = async () => {
  ElMessage.closeAll()
  const experimentList = state.infoData.experimentList.filter((item) =>
    [1, 2].includes(item.status),
  )

  if (experimentList.length < 1) {
    close()
    return
  }
  const max =
    state.infoData.experimentList
      .filter((item) => ![10, 4].includes(item.status))
      .reduce((p, c) => (p += numInputMap(c.occupancy, 0)), 0) > 100
  if (max) {
    ElMessage.warning('占用试验层比例总和不能大于100%')
    return
  }
  const params = {
    experimentLayerId: state.infoData.experimentLayerId,
    experimentList: experimentList.map((item) => {
      return {
        experimentId: item.experimentId,
        occupancy: item.occupancy,
      }
    }),
    COLLECT_USER_BEHAVIOR: {
      ...props.behavior,
      operate: '编辑试验层比例',
    },
  }
  const { code } = await asyncUpdRatio(params)
  if (code !== 200) return
  emit('refreshList')
  close()
  ElMessage.success('编辑成功')
}
defineExpose({
  open,
})
</script>

<style scoped lang="scss">
.n-surplus-ratio {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid $color-dedede;
  > div {
    &:last-of-type {
      width: 435px;
      margin: 10px 0;
    }
  }
}
</style>
