<template>
  <CommonLayout :loading="state.reqLoading" :pd="false">
    <template #hl>
      <el-input
        v-model="state.search.keyWord"
        :prefix-icon="Search"
        placeholder="搜索白名单名称/用户ID"
        class="w-220"
        clearable
      />
      <el-checkbox class="m-l-10" v-model="state.search.type">
        仅查看我创建的</el-checkbox
      >
    </template>
    <template #hr>
      <el-button
        @click="addOrEditEquipment()"
        :icon="CirclePlus"
        type="primary"
      >
        添加白名单
        <svg-icon
          v-tooltip="{
            hide: false,
            txt: '添加到白名单的用户，可以跳过分流服务的计算直接命中应用中的实验组，便于程序调试'
          }"
          name="help1"
          class="m-l-5"
        />
      </el-button>
    </template>
    <el-table
      height="100%"
      class="n-table-custom-css"
      style="width: 100%"
      :data="listData"
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
      >
        <template #header v-if="item.isSwitch">
          <DataFilter
            v-model="state.search.switchFilter"
            ref="dataFilterRef"
            name="白名单状态"
            :list="testlayerStatusTypeList"
          />
        </template>
        <template #default="{ row }">
          <el-switch
            v-tooltip="allowOperation(row)"
            :disabled="!row.operateFlag"
            v-if="item.isSwitch"
            @change="switchChange(row)"
            v-model="row[item.prop]"
            :active-value="2"
            :inactive-value="1"
          >
          </el-switch>
          <template v-else-if="item.isOperate">
            <el-button
              class="p0 m-r-10"
              @click="addOrEditEquipment(true, row)"
              text
              :disabled="!row.operateFlag"
            >
              <svg-icon
                v-tooltip="allowOperation(row)"
                :class="{ c409EFF: row.operateFlag }"
                name="micro1-edit1"
              />
            </el-button>
            <el-button
              :disabled="!row.operateFlag"
              class="p0 m0"
              @click="deleteData(row)"
              text
            >
              <svg-icon
                v-tooltip="allowOperation(row)"
                :class="{ c409EFF: row.operateFlag }"
                name="micro1-delete1"
              />
            </el-button>
          </template>
          <template v-else-if="item.isDeviceId">
            <div v-for="deviceId of row[item.prop]" :key="deviceId">
              {{ deviceId }}
            </div>
          </template>
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
    :title="`${state.formData.id ? '编辑' : '添加'}白名单`"
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
      :rules="rules"
    >
      <el-form-item label="白名单名称" prop="deviceName">
        <el-input
          @blur="inputBlur('deviceName')"
          maxlength="50"
          show-word-limit
          clearable
          placeholder="请输入"
          v-model="state.formData.deviceName"
        />
      </el-form-item>
      <el-form-item label="用户ID(__fid)" prop="deviceId">
        <section class="copywriting-list-wrapper">
          <div class="copywriting-list-header">
            <div><span>批量添加ID</span>(最多10个)</div>

            <el-button
              v-show="state.formData.deviceId.length > 1"
              text
              @click="handleCopywritingClear"
              >清空
            </el-button>
          </div>

          <section class="copywriting-list-scrollbar">
            <el-scrollbar height="350px">
              <ul
                ref="copywritingListRef"
                v-eventDelegation="{
                  fn: handleCopywritingDelete,
                  target: '.copywriting-remove'
                }"
                class="copywriting-list"
              >
                <li
                  v-for="(item, index) of state.formData.deviceId"
                  :key="item"
                  class="copywriting-item"
                >
                  <div class="copywriting-num">{{ index + 1 }}</div>
                  <div class="copywriting">
                    <el-input
                      v-model="item.val"
                      placeholder="请输入ID，每行一个ID，回车换行，200字符"
                      type="text"
                      @blur="handleInputBlurOrEnter"
                      @paste="handlePaste"
                      @keydown.enter.prevent="handleInputBlurOrEnter"
                    >
                      <template
                        v-if="state.formData.deviceId.length > 1"
                        #append
                      >
                        <div :data-index="index" class="copywriting-remove">
                          <svg-icon name="micro1-close1" />
                        </div>
                      </template>
                    </el-input>
                  </div>
                </li>
              </ul>
            </el-scrollbar>
          </section>
        </section>
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
</template>

<script>
export default {
  name: 'DebuggingEquipmentManagement'
}
</script>
<script setup>
import { reactive, ref, nextTick, watch } from 'vue'
import CommonLayout from '@/components/CommonLayout'
import AddOrUpdDialog from '@/components/AddOrUpdDialog'
import DataFilter from '@/components/DataFilter'
import Pagination from '@/components/Pagination'
import { CirclePlus, Search } from '@element-plus/icons-vue'
import { testlayerStatusTypeList, allowOperation } from './enumerate'
import usePaginationState from '@/components/Pagination/hooks'
import { ElMessageBox, ElMessage } from 'element-plus'
import { uniqBy, debounce, cloneDeep } from 'lodash-es'

import {
  asyncAddDebugDevice,
  asyncUpdDebugDevice,
  asyncDelDebugDevice,
  asyncUpdStatusDevice,
  asyncGetDebugDeviceList
} from '@/api/ab-test/debug-equipment'
import { behaviorCollection } from '@/api/common'

const { executeGetData, listData, pagingConfig } = usePaginationState()

const initCopywritingList = () => ({
  val: ''
})
const initVal = () => {
  return {
    search: {
      keyWord: '',
      switchFilter: '',
      type: false
    },
    showOperateDialog: false,
    formData: {
      deviceName: '',
      deviceId: [initCopywritingList()],
      remark: ''
    },
    reqLoading: false,
    operatLoading: false
  }
}
// 请求过
let isReqOnce = false
const rules = {
  deviceName: [{ required: true, message: '请输入', trigger: 'blur' }],
  deviceId: [
    {
      required: true,
      message: '请至少添加一个用户ID',
      trigger: ['change', 'blur']
    },
    { validator: validatorEquipment, trigger: ['change', 'blur'] }
  ]
}
const state = reactive(initVal())
const formRef = ref(null)
const copywritingListRef = ref(null)

// 验证用户id数量
function validatorEquipment(rule, value, callback) {
  let len = value.filter((item) => item.val.trim().length).length
  if (!len) {
    callback(new Error(`请至少添加一个用户ID`))
    return
  }
  callback()
}
const USER_BEHAVIOR = {
  model: 'AB测试',
  page: '白名单管理'
}
const columns = [
  { label: '启用/停用', prop: 'switchStatus', isSwitch: true, width: 40 },
  { label: '白名单名称', prop: 'deviceName' },
  { label: '用户ID(__fid)', prop: 'deviceId', isDeviceId: true },
  { label: '备注', prop: 'remark' },
  { label: '创建人', prop: 'creator' },
  { label: '操作', isOperate: true, width: 40 }
]

const getTableData = async (reset = false, behavior = false) => {
  // 数据未加载完成表格 显示加载效果
  state.reqLoading = true
  const params = {
    ...state.search
  }
  if (behavior) {
    params.COLLECT_USER_BEHAVIOR = {
      ...USER_BEHAVIOR,
      operate: '查询白名单列表'
    }
  }
  executeGetData(params, asyncGetDebugDeviceList, reset).finally((_) => {
    state.reqLoading = false
  })
}

const addOrEditEquipment = (bool = true, item) => {
  state.showOperateDialog = bool
  if (item) {
    state.formData = {
      id: item.id,
      deviceName: item.deviceName,
      remark: item.remark,
      deviceId: item.deviceId.map((item) => ({ val: item + '' }))
    }
  }
}
// 内容过长是否显示提示
const showTooltipfn = (column) => {
  let arr = ['isOperate', 'isSwitch', 'isDeviceId']
  return Object.keys(column).reduce((p, c) => {
    if (arr.includes(c)) {
      p = !column[c]
    }
    return p
  }, '')
}
const switchChange = async (column) => {
  try {
    ElMessage.closeAll()
    const { code } = await asyncUpdStatusDevice({
      id: column.id,
      switchStatus: column.switchStatus,
      COLLECT_USER_BEHAVIOR: {
        ...USER_BEHAVIOR,
        operate: `${column.switchStatus === 1 ? '停用' : '启用'}白名单`
      }
    })
    code === 200 &&
      ElMessage.success(`${column.switchStatus === 1 ? '停用' : '启用'}成功`)
  } catch (e) {
    column.switchStatus = column.switchStatus === 1 ? 2 : 1
  }
}
const deleteData = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定删除白名单【${row.deviceName}】吗？`,
      '删除白名单',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customClass: 'n-message-box-424'
      }
    )
    const { code } = await asyncDelDebugDevice({
      id: row.id,
      COLLECT_USER_BEHAVIOR: {
        ...USER_BEHAVIOR,
        operate: '删除白名单'
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
    const bool = Reflect.has(state.formData, 'id')
    const params = {
      ...state.formData,
      deviceName: state.formData.deviceName.trim(),
      remark: state.formData.remark.trim(),
      deviceId: state.formData.deviceId
        .filter((item) => item.val.trim().length)
        .map((item) => item.val.trim()),
      COLLECT_USER_BEHAVIOR: {
        ...USER_BEHAVIOR,
        operate: `${bool ? '编辑' : '添加'}白名单`
      }
    }
    const reqFn = bool ? asyncUpdDebugDevice : asyncAddDebugDevice
    const { code } = await reqFn(params).finally((_) => {
      state.operatLoading = false
    })
    if (code !== 200) return
    isReqOnce = true
    addOrEditEquipment(false)
    ElMessage.success(`${bool ? '编辑' : '添加'}成功`)
  } catch (e) {
    console.log(e)
  }
}, 300)

const inputBlur = (key) => {
  state.formData[key] = state.formData[key].trim()
}

// 自动插入光标到文案输入框
const initInputFocus = () => {
  nextTick(() => {
    const nodeList = copywritingListRef.value.querySelectorAll(
      '.operate-input__inner'
    )
    nodeList[nodeList.length - 1].focus()
  })
}

// 清空
const handleCopywritingClear = () => {
  state.formData.deviceId = [initCopywritingList()]
  initInputFocus()
}

// 输入框失去焦点时触发或回车键
const handleInputBlurOrEnter = () => {
  ElMessage.closeAll()
  let emptyLine = state.formData.deviceId.filter(
    (item) => !item.val.trim().length
  ).length
  const overstep200 = state.formData.deviceId.some(
    (item) => item.val.trim().length > 200
  )
  overstep200 && ElMessage.warning('每个ID最多保留200个字符')
  state.formData.deviceId = state.formData.deviceId.map((item) => {
    let val = item.val.trim().slice(0, 200)
    return { val }
  })
  state.formData.deviceId = uniqBy(state.formData.deviceId, 'val')
  if (!emptyLine && state.formData.deviceId.length < 10) {
    state.formData.deviceId.push(initCopywritingList())
    initInputFocus()
  }
}

// 删除指定id
const handleCopywritingDelete = (e) => {
  state.formData.deviceId.splice(parseInt(e.dataset.index), 1)
  if (state.formData.deviceId.length < 10) {
    state.formData.deviceId = state.formData.deviceId.filter(
      (item) => item.val.trim().length
    )
    state.formData.deviceId.push(initCopywritingList())
  }
}

// 粘贴
const handlePaste = (e) => {
  let paste = (e.clipboardData || window.clipboardData).getData('text')
  // 以n个换行/制表/回车符切割转为 数组
  if (/[\n\r\t]/.test(paste)) {
    let tmp = paste.split(/[\n\r\t]+/).map((item) => ({ val: item.trim() }))
    state.formData.deviceId = uniqBy(
      [...state.formData.deviceId, ...tmp],
      'val'
    )
      .filter((item) => item.val.trim().length)
      .slice(0, 10)
    e.preventDefault()
  }
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

<style scoped lang="scss">
.copywriting-list-wrapper {
  display: flex;
  flex-direction: column;
  border: 1px solid $border-color;
  width: 100%;

  :deep(.operate-button) {
    background-color: transparent !important;
  }

  .copywriting-list-header {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
    padding-left: 20px;
    height: 40px;
    border-bottom: 1px solid $border-color;
  }

  .copywriting-list-scrollbar {
    height: 350px;
  }

  .copywriting-list {
    position: relative;
    min-height: 350px;

    &:after {
      position: absolute;
      top: 0;
      left: 35px;
      bottom: 0;
      display: block;
      width: 1px;
      height: 100%;
      background-color: $border-color;
      content: '';
    }

    .copywriting-item {
      display: flex;
      align-items: center;
      height: 32px;
      line-height: 32px;
    }

    .copywriting-num {
      flex-shrink: 0;
      width: 35px;
      height: 32px;
      text-align: center;
    }

    .copywriting {
      $height: 32px;

      position: relative;
      flex-grow: 1;
      height: $height;
      background-color: $light-bg-color;
      font-size: 12px;

      &:hover {
        background-color: #f3f3f3;

        :deep(.operate-input__wrapper) {
          background-color: #f3f3f3;
        }
      }

      :deep(.operate-input) {
        display: flex;
        height: 32px;

        &:hover {
          .operate-input__wrapper ~ .operate-input-group__append {
            display: block;
          }
          /*
          .operate-input__wrapper:focus ~ .operate-input-group__append {
            display: none !important;
          }*/
        }
        .operate-input__wrapper {
          box-shadow: none;
        }

        .operate-input__inner {
          flex-grow: 1;
          overflow: hidden;
          padding: 0 20px 0 10px;
          height: $height;
          line-height: $height;
          border: none;
          border-radius: 0;
          resize: none;
          background-color: transparent;
          font-family: inherit;
        }

        /*.operate-input__suffix {
          position: relative;
          right: 0;
          flex-shrink: 0;
          display: none;
          margin-right: 10px;
          height: $height;
          line-height: $height;
          background-color: transparent;
          transform: none !important;

          .operate-input__count-inner {
            background-color: transparent;
          }
        }*/

        .operate-input-group__append {
          flex-shrink: 0;
          display: none;
          margin-right: 10px;
          padding: 0;
          width: $height;
          height: $height;
          border: none;
          border-radius: 0;
          background-color: transparent;
          box-shadow: none;

          .copywriting-remove {
            width: $height;
            height: $height;
            line-height: $height;
            text-align: center;
            cursor: pointer;

            svg {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
