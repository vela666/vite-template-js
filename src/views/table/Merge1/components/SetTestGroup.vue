<template>
  <div class="n-add-edit-content-r-content">
    <div class="n-title m-b-15 flex-center">
      <span>设置试验组</span>
      <svg-icon
        class="m-l-5"
        name="micro1-help1"
        v-tooltip="{
          hide: false,
          txt: '您将为该试验选择一个基准组和至少一个试验组。使用选择或新建一个或多个参数进行试验。',
        }" />
    </div>
    <el-form-item label="权重分配方式">
      <el-radio-group
        @change="allocationTypeChange"
        v-model="allocationType"
        class="ml-4">
        <el-radio
          v-for="item of Object.keys(testGroupAllocationList)"
          :key="item"
          :label="+item"
          >{{ testGroupAllocationList[item] }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <el-form-item label="设置试验组" class="set-test-group">
      <div>
        <el-form-item class="n-set-test-params" label="参数：">
          <div
            class="n-set-test-params-list"
            v-for="(item, index) of testGroup[0].variables"
            :key="item">
            <el-form-item class="m-r-10">
              <el-select
                popper-class="n-select-dropdown"
                v-model="item.type"
                @change="paramsTypeChange(index)"
                placeholder="请选择"
                class="w-100">
                <el-option
                  v-for="type of parameterTypeArr.filter(
                    (f) => f.value !== 'timestamp',
                  )"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value">
                  <div class="flex-center">
                    <svg-icon :name="type.svg" class="ft20 m-r-5" />
                    <span>{{ type.label }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="m-r-10"
              :prop="`groups.0.variables.${index}.name`"
              :rules="[
                ...rulesMap.get('required'),
                ...rulesMap.get('repeatParamName'),
              ]">
              <el-select
                v-model="item.name"
                filterable
                allow-create
                placeholder="参数名"
                class="w-120"
                @change="handleParamsName(item)">
                <el-option
                  v-for="(name, index) of paramsNameList"
                  :key="index"
                  :label="name"
                  :value="name" />
              </el-select>
            </el-form-item>
            <svg-icon
              v-if="testGroup[0].variables.length !== 10"
              @click="addOrRemoveParams(true)"
              class="n-set-test-params-svg"
              name="micro1-add1" />
            <svg-icon
              v-if="testGroup[0].variables.length > 1"
              @click="addOrRemoveParams(false, index)"
              class="n-set-test-params-svg"
              name="micro1-delete1" />
          </div>
        </el-form-item>
        <div v-if="checkError.length" class="error">
          {{ checkError.slice(-1)[0] }}
        </div>
      </div>
      <div ref="groupScrollRef">
        <div v-for="(item, index) of testGroup" :key="item">
          <el-form-item class="n-set-test-group">
            <div class="n-set-test-group-list">
              <div class="n-set-test-group-list-t">
                <el-form-item
                  :prop="`groups.${index}.cname`"
                  :rules="[
                    ...rulesMap.get('required'),
                    ...rulesMap.get('repeatGroupName'),
                  ]">
                  <span v-show="!item.isEdit" v-showTips>{{ item.cname }}</span>
                  <el-input
                    v-if="item.isEdit"
                    @blur="editGroupName(item, false)"
                    placeholder="请输入试验组名称"
                    class="n-set-test-group-list-t-input"
                    v-model="item.cname"
                    maxlength="20" />
                  <svg-icon
                    v-show="!item.isEdit"
                    @click="editGroupName(item, true)"
                    class="n-pointer"
                    name="micro1-edit1"></svg-icon>
                </el-form-item>
                <svg-icon
                  v-if="index !== 0 && testGroup.length > 2"
                  @click="deleteGroup(index)"
                  class="c409EFF n-pointer"
                  name="micro1-delete1"></svg-icon>
              </div>
              <div class="n-set-test-group-list-b">
                <el-form-item label="权重：" class="m-r-10">
                  <div v-if="+allocationType === 1">平均分配</div>
                  <template v-else>
                    <el-input
                      class="m-r-10 w-100"
                      v-model="item.ratio"
                      @blur="weightsBlur(item)"
                      :disabled="index === testGroup.length - 1"
                      placeholder="请输入" />
                    %
                  </template>
                </el-form-item>
                <el-form-item label="白名单：">
                  <el-select
                    class="w-165"
                    filterable
                    clearable
                    v-model="item.equipment"
                    placeholder="请选择">
                    <el-option
                      v-for="item of deviceList"
                      :key="item.id"
                      :label="item.deviceName"
                      :disabled="+item.switchStatus === 1"
                      :value="item.id" />
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <el-form-item
              v-for="(sub, subIndex) of item.variables"
              :key="sub"
              class="n-set-test-params"
              :rules="[
                ...rulesMap.get('required'),
                {
                  validator: (rule, value, callback) =>
                    validateParamVal(subIndex, rule, value, callback),
                  trigger: ['blur', 'change'],
                },
              ]"
              :prop="`groups.${index}.variables.${subIndex}.value`">
              <el-select
                v-if="sub.type === 'boolean'"
                class="w-280"
                filterable
                v-model="sub.value"
                placeholder="请选择">
                <el-option
                  v-for="item of boolenOptions"
                  :key="item"
                  :label="item"
                  :value="item" />
              </el-select>
              <el-input
                v-else
                class="w-280"
                v-model="sub.value"
                @blur="paramValBlur(sub)"
                placeholder="请输入参数值" />
            </el-form-item>
          </el-form-item>
        </div>
        <div
          v-if="testGroup.length < 5"
          @click="addGroup"
          class="set-test-group-add">
          <svg-icon name="micro1-add1" />
        </div>
      </div>
    </el-form-item>
    <!--    <el-form-item label="" prop="planDesc" class="set-test-group">
      1231
    </el-form-item>-->
  </div>
</template>

<script setup name="SetTestGroup">
import { computed, reactive, ref, nextTick, markRaw } from 'vue'
import { ElMessage } from 'element-plus'
import { parameterTypeArr, validateDefaultValue, numInputMap } from '@/utils'
import { asyncGetDebugDeviceList } from '@/api/ab-test/debug-equipment'
import { testGroupAllocationList } from '@/views/table/Merge1/enumerate'
import { asyncSelectParameterList } from '@/api/ab-test/test-list'

const props = defineProps({
  groups: {
    type: Array,
    default: () => [],
  },
  ationType: {
    type: [String, Number],
    default: 1,
  },
})
const emit = defineEmits(['update:groups', 'update:ationType', 'validateForm'])
const allocationType = computed({
  get() {
    return props.ationType
  },
  set(val) {
    emit('update:ationType', val)
  },
})
const testGroup = computed(() => {
  return props.groups
})
// 检查试验组权重值及参数名规范
const checkError = computed(() => {
  const errorArr = []
  const reg = /^[_a-zA-Z]\w*$/
  let len = !!testGroup.value[0].variables.some(
    (item) => item.name.trim().length,
  )
  const paramsBool = testGroup.value[0].variables.some(
    (item) => !reg.test(item.name),
  )
  if (len && paramsBool)
    errorArr.push('参数名仅支持英文、数字和下划线，不能以数字开头!')
  const radioBool = testGroup.value.reduce((p, c) => (p += +c.ratio), 0) > 100
  if (radioBool && testGroup.value.length > 2)
    errorArr.push('各试验组权重总和应为100%，请重新设置！')

  return errorArr
})
const deviceList = ref([])
const paramsNameList = ref([])
const groupScrollRef = ref(null)

const boolenOptions = ['true', 'false']

const validateRepeatGroupName = (rule, value, callback) => {
  let bool = testGroup.value.filter((item) => value === item.cname).length > 1
  if (bool) {
    callback(new Error('试验组名称重复'))
    return
  }
  callback()
}
const validateRepeatParamName = (rule, value, callback) => {
  let bool =
    testGroup.value[0].variables.filter((item) => value === item.name).length >
    1
  if (bool) {
    callback(new Error('参数名重复'))
    return
  }
  callback()
}
const validateParamVal = (index, rule, value, callback) => {
  let type = testGroup.value[0].variables[index].type
  let bool = !validateDefaultValue(type, value)
  if (bool) {
    const txt = type === 'number' ? '数字' : 'JSON'
    callback(new Error(`${txt}格式错误`))
    return
  }
  callback()
}

// 触发校验重复值
const validateForm = (bool = true) => {
  nextTick(() => {
    let len = bool
      ? testGroup.value.length
      : testGroup.value[0].variables.length
    for (let i = 0; i < len; i++) {
      let type = bool ? `groups.${i}.cname` : `groups.0.variables.${i}.name`
      emit('validateForm', type)
    }
  })
}
// 重新计算权重值
const calculateRatio = (bool = false) => {
  // 最后一个试验组权重值
  let lastRadio = testGroup.value.slice(-1)[0]
  testGroup.value.forEach((item) => {
    item.ratio = Number.parseFloat(item.ratio)
    if (bool) item.ratio = Number.parseInt(100 / testGroup.value.length)
  })
  const surplus = testGroup.value.reduce((p, c, index) => {
    let flag = bool || index !== testGroup.value.length - 1
    p += flag ? c.ratio : 0
    return p
  }, 0)
  lastRadio.ratio =
    (bool ? lastRadio.ratio : 0) +
    (100 - surplus < 0 ? 0 : +(100 - surplus).toFixed(2))
}
const addGroup = () => {
  testGroup.value.push({
    cname: `试验组${testGroup.value.length}`,
    ratio: 0,
    equipment: '',
    isEdit: false,
    variables: testGroup.value[0].variables.map((item) => {
      return {
        ...item,
        value: '',
      }
    }),
  })
  calculateRatio(+allocationType.value === 1)
  nextTick(() => {
    groupScrollRef.value.scrollTo({
      left: 999999,
      behavior: 'smooth',
    })
  })
}
const deleteGroup = (index) => {
  testGroup.value.splice(index, 1)
  calculateRatio(+allocationType.value === 1)
  validateForm()
}

// 添加或删除每一项参数
const addOrRemoveParams = (bool, index) => {
  for (let i = 0, len = testGroup.value.length; i < len; i++) {
    if (bool) {
      testGroup.value[i].variables.push({
        type: 'string',
        name: '',
        value: '',
      })
    } else {
      testGroup.value[i].variables.splice(index, 1)
    }
  }
  nextTick(() => {
    validateForm(false)
  })
}

const editGroupName = (item, bool, index) => {
  item.isEdit = bool
  if (!bool) {
    item.cname = item.cname.trim()
    validateForm()
    return
  }
  nextTick(() => {
    document
      .querySelector('.n-set-test-group-list-t-input .operate-input__inner')
      .focus()
  })
}

const allocationTypeChange = () => {
  calculateRatio(true)
}
const handleParamsName = (item) => {
  if (item.name.length > 50) ElMessage.warning('参数名称最多保留50个字符')
  item.name = item.name.slice(0, 50)
  validateForm(false)
}

const weightsBlur = (item) => {
  item.ratio = numInputMap(item.ratio, 2)
  if (+item.ratio > 100) {
    item.ratio = 100
  }
  calculateRatio(false)
}

const paramValBlur = (item) => {
  item.value = item.value.trim()
}
const paramsTypeChange = (index) => {
  testGroup.value.forEach((item) => {
    item.variables[index].value = ''
    item.variables[index].type = testGroup.value[0].variables[index].type
  })
}
const getDebugDeviceList = async () => {
  let { data } = await asyncGetDebugDeviceList({ pageFlag: false })
  deviceList.value = markRaw(data)
  deviceList.value.sort((a, b) => +b.switchStatus - +a.switchStatus)
}
const getSelectParameterList = async (_) => {
  const { data } = await asyncSelectParameterList()
  paramsNameList.value = markRaw(data)
}
const rulesMap = new Map([
  [
    'repeatGroupName',
    [
      {
        validator: validateRepeatGroupName,
        trigger: ['blur', 'change'],
      },
    ],
  ],
  [
    'repeatParamName',
    [
      {
        validator: validateRepeatParamName,
        trigger: ['blur', 'change'],
      },
    ],
  ],
  [
    'required',
    [
      {
        required: true,
        message: '请输入',
        trigger: ['blur', 'change'],
      },
    ],
  ],
])
getDebugDeviceList()
getSelectParameterList()
defineExpose({
  checkError,
})
</script>

<style scoped lang="scss">
$m20: 20px;
$m30: 30;
.set-test-group {
  > :deep(.operate-form-item__content) {
    //align-items: flex-start;
    //overflow: hidden;
    flex-wrap: nowrap;
    transform: translateX(-150px);
    .svg-icon {
      color: #8a8a8a;
      cursor: pointer;

      &:hover {
        color: $color-primary;
      }
    }

    > div {
      display: flex;

      &:first-of-type {
        height: 100%;
        flex-direction: column;
        justify-content: flex-end;
        margin-bottom: ($m30 * 2) + px;

        .operate-form-item__content,
        .operate-form-item {
          flex-direction: column;
        }
      }

      &:last-of-type {
        ooverflow-x: auto;
        overflow-x: overlay;
        margin-left: $m20;

        > div {
          margin-bottom: $m30 + px;
        }
      }
    }
  }

  &-add {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 280px;
    height: 149px;
    background: #fff;
    border: 1px dashed #dedede;
    border-radius: 2px;
    cursor: pointer;

    > .svg-icon {
      font-size: 30px;
    }
  }
}

.n-set-test-group {
  > :deep(.operate-form-item__content) {
    flex-direction: column;
    align-items: flex-start;
    gap: $m20;
  }

  > div {
    position: relative;
  }

  &-list {
    display: flex;
    flex-direction: column;
    min-width: 280px;
    height: 149px;
    border: 1px solid #dedede;
    border-radius: 2px;
    margin-right: $m20;

    &-t {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      padding-right: 10px;
      background: #ecf6ff;
      font-size: 14px;
      font-weight: bold;
      color: #333;

      > div {
        display: flex;
        align-items: center;
        width: 100%;

        :deep(.operate-input__wrapper) {
          background-color: transparent;
          border: none;
          box-shadow: none;

          .operate-input__inner {
            border: none;
          }
        }

        span {
          max-width: 180px;
          margin-right: 10px;
          height: 32px;
          min-height: 32px;
          min-width: 30px;
        }
      }

      &-input {
        width: 100%;
      }
    }

    &-b {
      display: flex;
      flex-direction: column;
      padding-left: 10px;
      padding-top: 10px;
      height: 100%;
      gap: $m20;

      :deep(.operate-form-item__label) {
        width: 90px !important;
      }
    }
  }
}

.n-set-test-params {
  > :deep(.operate-form-item__label) {
    &:before {
      content: '*';
      color: $danger-color;
      margin-right: 4px;
    }
  }

  &-list {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-of-type) {
      margin-bottom: $m20;
    }
  }
}

.n-set-test-params-svg {
  &:first-of-type {
    margin-right: 10px;
  }
}

.error {
  position: absolute;
  bottom: -10px;
  left: 0;
  font-size: 12px;
  color: $danger-color;
}
</style>
