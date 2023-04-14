<template>
  <div v-loading="state.loading" class="n-add-edit-container">
    <div class="n-add-edit-content">
      <div class="n-add-edit-content-l">
        <div class="n-add-edit-content-l-t p-l-20">{{ title }}</div>
        <nav class="n-add-edit-content-l-n">
          <div
            v-for="(item, index) of containerNavigator"
            :key="index"
            class="p-l-20"
            :class="{ 'n-active-left-line': state.navIndex === index }"
            @click="changeNavigatorBar(index)">
            {{ item }}
          </div>
        </nav>
      </div>
      <div class="n-add-edit-content-r">
        <el-form
          ref="testFormRef"
          :model="state.formData"
          label-width="150px"
          :rules="formRules"
          class="n-add-edit-content-r-form">
          <div class="n-add-edit-content-r-content">
            <div class="n-title m-b-15">基本信息</div>
            <!-- <el-form-item label="试验类型" prop="planName">
              在线参数
            </el-form-item> -->
            <el-form-item label="试验名称" prop="experimentName">
              <el-input
                class="w-400"
                @blur="inputBlur('experimentName')"
                v-model="state.formData.experimentName"
                placeholder="请输入"
                :maxlength="30"
                show-word-limit />
            </el-form-item>
            <el-form-item label="选择试验层" prop="experimentLayerId">
              <template #label>
                <div class="flex-center">
                  <span>选择试验层</span>
                  <svg-icon
                    class="m-l-5"
                    name="micro1-help1"
                    v-tooltip="{
                      hide: false,
                      txt: '在同一个试验层下的试验，相互之间是互斥的，这意味着应用的用户只能命中该试验层中的一个试验',
                    }" />
                </div>
              </template>

              <el-select-v2
                class="w-400"
                v-model="state.formData.experimentLayerId"
                :options="state.testLayercList"
                @change="selectTestLayerChange(true)"
                placeholder="请选择">
                <template #default="{ item }">
                  <div class="n-select-test-layer flex-center">
                    <span v-showTips class="w-220">{{ item.label }}</span>
                    <span class="m-l-10">剩余流量{{ item.flowVal }}%</span>
                  </div>
                </template>
              </el-select-v2>
            </el-form-item>
            <el-form-item label="占用试验层比例" prop="occupancy">
              <template #label>
                <div class="flex-center">
                  <span>占用试验层比例</span>
                  <svg-icon
                    class="m-l-5"
                    name="micro1-help1"
                    v-tooltip="{
                      hide: false,
                      txt: '最多只能输入选中试验层的最大剩余流量，请合理分配',
                    }" />
                </div>
              </template>
              <el-input
                :disabled="!(state.formData.experimentLayerId + '')"
                v-model="state.formData.occupancy"
                @blur="inputBlur('occupancy')"
                class="w-100" />
              <span class="flex-center occupy-proportion"
                ><i>%</i> 最大可输入{{ state.maxOccupancy }}%</span
              >
            </el-form-item>
            <el-form-item label="启用/停用" prop="switchStatus">
              <el-switch
                v-model="state.formData.switchStatus"
                :active-value="2"
                :inactive-value="1" />
            </el-form-item>
            <el-form-item label="试验时长" prop="dayNum">
              <el-input
                @blur="inputBlur('dayNum')"
                v-model="state.formData.dayNum"
                class="w-100 m-r-10" />
              天
            </el-form-item>
            <el-form-item label="发布方式" prop="pushType">
              <el-radio-group
                @change="releaseMethod"
                v-model="state.formData.pushType">
                <el-radio-button
                  v-for="item of Object.keys(releaseMethodList)"
                  :key="item"
                  :label="+item"
                  >{{ releaseMethodList[item] }}</el-radio-button
                >
              </el-radio-group>
              <el-form-item
                v-if="+state.formData.pushType === 2"
                prop="pushTime">
                <el-date-picker
                  popper-class="n-test-date-picker"
                  ref="datePickerRef"
                  class="m-l-10"
                  format="YYYY-MM-DD HH:mm"
                  v-model="state.formData.pushTime"
                  type="datetime"
                  :clearable="false"
                  :editable="false"
                  :disabled-date="
                    (time) => disableDayHourMinuteSecond('day', time)
                  "
                  placeholder="请选择"
                  value-format="YYYY-MM-DD HH:mm:ss" />
              </el-form-item>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                @blur="inputBlur('remark')"
                maxlength="200"
                class="w-400"
                show-word-limit
                resize="none"
                rows="8"
                type="textarea"
                placeholder="请输入"
                v-model="state.formData.remark" />
            </el-form-item>
          </div>
          <div class="n-add-edit-content-r-content m-t-b-20">
            <div class="n-title m-b-15">受众用户</div>
            <el-form-item class="n-select-audience" label="选择受众用户">
              <el-radio-group v-model="state.formData.userType">
                <el-radio-button :label="1">全部用户</el-radio-button>
                <el-radio-button :label="2"> 选择受众用户 </el-radio-button>
              </el-radio-group>
              <el-form-item
                v-if="+state.formData.userType === 2"
                prop="userFilter"
                :rules="[
                  {
                    required: true,
                    message: '请选择',
                    trigger: ['blur', 'change'],
                  },
                  {
                    validator: validateuserFilter,
                    trigger: ['blur', 'change'],
                  },
                ]">
                <SelectAudience
                  v-model:selectUserfilter="state.formData.userFilter" />
              </el-form-item>
            </el-form-item>
            <el-form-item label="受众用户百分比" prop="userPercent">
              <template #label>
                <div class="flex-center">
                  <span>受众用户百分比</span>
                  <svg-icon
                    class="m-l-5"
                    name="micro1-help1"
                    v-tooltip="{
                      hide: false,
                      txt: '输入应用的用户群百分比，以指定与您在目标用户下设置的条件匹配的用户中，您要将其中多少比例的用户平均分配到试验中的基准组和一个或多个试验组。此值可以为介于 0.01% 与 100% 之间的任何百分比。 系统会为每个试验（包括复制的试验）随机分配用户。',
                    }" />
                </div>
              </template>
              <el-input
                v-model="state.formData.userPercent"
                class="w-100 m-r-10"
                placeholder="请输入"
                @blur="inputBlur('userPercent')" />
              %
            </el-form-item>
          </div>
          <SetTestGroup
            ref="setTestGroupRef"
            @validateForm="validateForm"
            v-model:groups="state.formData.groups"
            v-model:ationType="state.formData.allocationType" />
        </el-form>
        <div class="n-add-edit-content-r-buttom">
          <el-button type="primary" @click="saveData(2)">完成配置</el-button>
          <el-button @click="saveData(1)">暂存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AddOrEditTest',
}
</script>
<script setup>
import {
  ref,
  reactive,
  markRaw,
  computed,
  // onMounted,
  // onBeforeUnmount
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SetTestGroup from './components/SetTestGroup'
import SelectAudience from './components/SelectAudience'
import { ElMessage } from 'element-plus'
import { asyncAddTest, asyncUpdTest, findInfo } from '@/api/ab-test/test-list'
import { asyncGetTestLayerRemainTrafficList } from '@/api/ab-test/test-layer'
import {
  numInputMap,
  parsJsonFilter,
  validateFilterItem,
  scrollToError,
} from '@/utils'
import { releaseMethodList } from '@/views/table/Merge1/enumerate'
import { disableDayHourMinuteSecond } from '@/utils'
// import { scrollend } from 'scrollyfills'

const route = useRoute()
const router = useRouter()
const initVal = () => {
  return {
    loading: false,
    navIndex: 0,
    testLayercList: [],
    // 最大占用试验层比例
    maxOccupancy: 0,
    formData: {
      experimentName: '',
      // 选择试验层
      experimentLayerId: '',
      // 占用试验层比例
      occupancy: '',
      // 启用/停用
      switchStatus: 1,
      // 试验天数
      dayNum: '',
      // 发布方式  1 手动发布 2 定时发布
      pushType: 1,
      // 对应的发布时间
      pushTime: '',
      // 备注
      remark: '',
      // 选择受众用户类型 1 全部用户 2 选择受众用户
      userType: 2,
      // 受众用户百分比
      userPercent: '',
      // 受众用户条件
      userFilter: [
        /*  {
            prop: [{ name: '用户分群', key: 'user_cluster', type: 'cluster' }],
            relation: { key: 'BE', name: '属于' },
            val: 'ctbf8wef'
          }*/
      ],
      // 权重分配方式 1 平均分配  2 自定义分配
      allocationType: 1,
      // 试验组
      groups: [
        {
          // 权重值
          ratio: 50,
          // 已选白名单id
          equipment: '',
          // 参数/名称/值
          variables: [
            {
              // 参数类型
              type: 'string',
              // 参数名
              name: '',
              // 参数值
              value: '',
            },
          ],
          cname: '基准组',
          isEdit: false,
        },
        {
          ratio: 50,
          equipment: '',
          variables: [
            {
              type: 'string',
              name: '',
              value: '',
            },
          ],
          cname: '试验组1',
          isEdit: false,
        },
      ],
    },
    // 1创建 2编辑 3复制
    operationType: +route.query.type || 1,
  }
}

const formRules = {
  experimentName: [{ required: true, message: '请输入', trigger: 'blur' }],
  experimentLayerId: [{ required: true, message: '请选择', trigger: 'change' }],
  occupancy: [{ required: true, message: '请输入', trigger: 'blur' }],
  dayNum: [{ required: true, message: '请输入', trigger: 'blur' }],
  userPercent: [{ required: true, message: '请输入', trigger: 'blur' }],
  pushTime: [{ required: true, message: '请选择', trigger: 'blur' }],
}
// 目标
const containerNavigator = ['基本信息', '受众用户', '设置试验组']
const state = reactive(initVal())
const testFormRef = ref(null)
const setTestGroupRef = ref(null)
const datePickerRef = ref(null)
const title = computed(() => {
  return (
    {
      1: '创建',
      2: '编辑',
      3: '复制',
    }[state.operationType] + '试验'
  )
})
const inputBlur = (type) => {
  const typeFn = {
    occupancy() {
      let val = numInputMap(state.formData.occupancy, 0)
      state.formData.occupancy =
        val > state.maxOccupancy ? state.maxOccupancy : val < 1 ? 1 : val
    },
    dayNum() {
      let val = numInputMap(state.formData.dayNum, 0)
      state.formData.dayNum = val > 60 ? 60 : val < 1 ? 1 : val
    },
    userPercent() {
      let val = numInputMap(state.formData.userPercent, 2)
      state.formData.userPercent = val > 100 ? 100 : val < 0.01 ? 0.01 : val
    },
    uncertain() {
      state.formData[type] = state.formData[type].trim()
    },
  }
  if (typeFn[type]) typeFn[type]()
  else typeFn.uncertain()
}
// 编辑时触发
const editParams = (params) => {
  Object.keys(state.formData).forEach((k) => {
    if (k === 'groups') {
      state.formData[k] = JSON.parse(params[k])
    } else if (k === 'userFilter') {
      state.formData[k] = parsJsonFilter(params[k])
    } else {
      state.formData[k] = params[k]
    }
  })
  if (state.operationType === 2) {
    state.formData.experimentId = params.experimentId
  }
  if (+state.formData.dayNum < 1) state.formData.dayNum = 1
}

// 发布方式
const releaseMethod = () => {
  if (+state.formData.pushType === 2) {
    // state.formData.pushTime  = Date.now()
    state.formData.pushTime = ''
    datePickerRef.value.focus()
  }
}

const validateuserFilter = (rule, value, callback) => {
  const bool = !state.formData.userFilter.every((item) => {
    return (
      item.prop.length > 0 && item.relation.key && item.val.trim().length > 0
    )
  })
  if (+state.formData.userType !== 1 && bool) {
    callback(new Error('请选择'))
    return
  }
  callback()
}

const selectTestLayerChange = (bool = false) => {
  const { flowVal = 0 } =
    state.testLayercList.find(
      (item) => item.value === state.formData.experimentLayerId,
    ) || {}
  if (state.formData.occupancy > flowVal) {
    state.formData.occupancy = flowVal
  }

  state.maxOccupancy = flowVal

  if (state.formData.experimentLayerId && state.maxOccupancy === 0) {
    ElMessage.warning('所选试验层剩余流量为0，请重新选择试验层')
    state.formData.experimentLayerId = ''
    state.formData.occupancy = ''
  }
  // bool && getTestLayerRemainTrafficList()
}

//左侧选中下标
// let navFlag = true
const changeNavigatorBar = (index) => {
  if (index === state.navIndex) return
  // navFlag = false
  state.navIndex = index
  let el = document.querySelectorAll('.n-add-edit-content-r-content')[index]
  // 平滑滚动
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'center',
  })
}

// 返回
const handleCancel = () => {
  router.replace({
    name: 'AbTestIndex',
  })
}
// type 1 草稿(暂存) 2 调试(完成配置)
const saveData = async (type) => {
  await testFormRef.value.validate(async (valid, fields) => {
    if (!valid || setTestGroupRef.value.checkError.length) {
      scrollToError(testFormRef.value.$el)
      return
    }
    const variables = state.formData.groups[0].variables
    // 同步试验组参数
    state.formData.groups.forEach((item) => {
      item.variables = item.variables.map((sub, idx) => {
        return {
          ...sub,
          name: variables[idx].name,
          type: variables[idx].type,
        }
      })
    })
    const params = {
      ...state.formData,
      userFilter:
        +state.formData.userType === 1
          ? []
          : state.formData.userFilter.map((item) => {
              return validateFilterItem(item)
            }),
      status: type,
      pushTime: +state.formData.pushType === 1 ? null : state.formData.pushTime,
      COLLECT_USER_BEHAVIOR: {
        model: 'AB测试',
        page: '试验列表',
        operate: title.value,
      },
    }
    const bool = Reflect.has(params, 'experimentId')
    const reqFn = bool ? asyncUpdTest : asyncAddTest
    const { code } = await reqFn(params)
    if (code !== 200) return
    ElMessage.success(`${title.value}成功`)
    handleCancel()
  })
}

// 对某些字段校验
const validateForm = async (type) => {
  /* await testFormRef.value.validateField(type, (valid, fields) => {
    console.log(type, valid, fields)
  })*/
  await testFormRef.value.validateField(type).catch((e) => {})
}
// 获取试验层列表
const getTestLayerRemainTrafficList = async (_) => {
  const params = {}
  if (state.operationType === 2) {
    params.experimentId = state.formData.experimentId
    // params.experimentLayerId = state.formData.experimentLayerId
  }
  const { data } = await asyncGetTestLayerRemainTrafficList(params)
  state.testLayercList = markRaw(
    data.map((item) => {
      return {
        label: item.experimentLayerName,
        value: item.experimentLayerId,
        flowVal: item.remainingData,
        disabled: item.remainingData === 0,
      }
    }),
  )
  selectTestLayerChange(false)
}
// 获取编辑的信息
const getFindInfo = async () => {
  state.loading = true
  try {
    const experimentId = route.query.experimentId
    if (experimentId) {
      const { data } = await findInfo({
        experimentId,
      })
      data && editParams(data)
    }
    await getTestLayerRemainTrafficList()
  } catch (e) {
    console.log(e)
  }
  state.loading = false
}
getFindInfo()

// 滚动监听器
/*const onScroll = () => {
  if (!navFlag) return
  // 获取所有锚点元素
  const navContents = document.querySelectorAll('.n-add-edit-content-l-n div')
  // 所有锚点元素的 offsetTop
  const offsetTopArr = [...navContents].map((item) => item.offsetTop)
  const scrollTop = testFormRef.value.$el.scrollTop
  for (let i = 0; i < offsetTopArr.length; i++) {
    if (scrollTop >= offsetTopArr[i]) {
      state.navIndex = i
    }
  }
}*/

/*onMounted(() => {
  testFormRef.value.$el.addEventListener('scroll', onScroll, false)
  testFormRef.value.$el.addEventListener('scrollend', (event) => {
    navFlag = true
  })
})
onBeforeUnmount(() => {
  testFormRef.value.$el.removeEventListener('scroll', onScroll)
})*/
</script>
<style lang="scss">
.n-test-date-picker {
  .operate-picker-panel__footer,
  .operate-time-panel__footer {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
@mixin boxStyle($bool: 1) {
  @if $bool == 2 {
    padding: 20px;
  }
  background-color: $light-bg-color;
  box-shadow: 0px 0px 6px rgba(28, 39, 80, 0.16);
  border-radius: 4px;
}

.n-select-test-layer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.n-add-edit-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow: hidden;

  .n-add-edit {
    &-content {
      display: flex;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }

    &-content-l {
      height: 100%;
      margin-right: 20px;
      width: 210px;
      min-width: 210px;
      @include boxStyle();

      &-t {
        height: 60px;
        line-height: 60px;
        font-size: 16px;
        color: $title-color;
        border-bottom: 1px solid $border-color;
      }

      &-n {
        > div {
          position: relative;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          font-weight: bold;
          color: $title-color;
          cursor: pointer;
          border-bottom: 1px solid $border-color;
        }
      }
    }

    &-content-r {
      display: flex;
      flex-direction: column;
      height: 100%;
      flex: 1;
      gap: 20px;
      overflow: hidden;

      &-form {
        flex: 1;
        overflow-y: auto;
        overflow-y: overlay;

        :deep(.operate-form-item__label) {
          justify-content: flex-start;
          font-weight: 400;
        }
      }

      &-content {
        @include boxStyle(2);
      }

      &-buttom {
        display: flex;
        align-items: center;
        max-height: 60px;
        @include boxStyle(2);
      }
    }
  }
}

.occupy-proportion {
  font-size: 14px;
  color: #616161;
  margin-left: 10px;
  gap: 10px;
}

.n-select-audience {
  :deep(.operate-form-item__content) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>
