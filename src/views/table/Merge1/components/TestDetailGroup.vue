<template>
  <div>
    <el-form-item label="试验组" class="set-test-group">
      <div>
        <el-form-item class="n-set-test-params" label="参数：">
          <div
            class="n-set-test-params-list"
            v-for="item of testGroup[0].variables"
            :key="item"
          >
            <el-form-item class="m-r-10">
              <div class="w-100">
                {{
                  parameterTypeArr
                    .filter((f) => f.value !== 'timestamp')
                    .find((v) => v.value === item.type)?.label
                }}
              </div>
            </el-form-item>
            <el-form-item class="m-r-10">
              <div v-showTips class="w-120">
                {{ item.name }}
              </div>
            </el-form-item>
          </div>
        </el-form-item>
      </div>
      <div>
        <div v-for="item of testGroup" :key="item">
          <el-form-item class="n-set-test-group">
            <div class="n-set-test-group-list">
              <div class="n-set-test-group-list-t">
                <el-form-item>
                  <span v-showTips>{{ item.cname }}</span>
                </el-form-item>
              </div>
              <div class="n-set-test-group-list-b">
                <el-form-item label="试验组ID：" class="m-r-10">
                  <div v-showTips="{ hide: false }" class="w-165">
                    {{ item.id || '--' }}
                  </div>
                </el-form-item>
                <el-form-item label="权重：" class="m-r-10">
                  <div>
                    {{ +allocationType === 1 ? '平均分配' : item.ratio + '%' }}
                  </div>
                </el-form-item>
                <el-form-item label="白名单：">
                  <div class="w-165" v-showTips>
                    {{ mapDeviceName(item.equipment) }}
                  </div>
                </el-form-item>
              </div>
            </div>
            <el-form-item
              v-for="sub of item.variables"
              :key="sub"
              class="n-set-test-params"
            >
              <div v-showTips="{ hide: false }" class="w-280">
                {{ sub.value }}
              </div>
            </el-form-item>
          </el-form-item>
        </div>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'TestDetailGroup'
}
</script>
<script setup>
import { parameterTypeArr } from '@/utils'
import { computed, markRaw, ref } from 'vue'
import { asyncGetDebugDeviceList } from '@/api/ab-test/debug-equipment'
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
const deviceList = ref([])
const allocationType = computed(() => {
  return props.data.allocationType
})
const testGroup = computed(() => {
  return JSON.parse(props.data.groups)
})
const mapDeviceName = (id) => {
  const objVal = deviceList.value.find((device) => device.id === id)
  let txt = '--'
  if (objVal) {
    txt = `${objVal.deviceName}${
      objVal.switchStatus === 1 ? '（白名单已停用）' : ''
    }`
  }
  return txt
}

const getDebugDeviceList = async () => {
  let { data } = await asyncGetDebugDeviceList({ pageFlag: false })
  deviceList.value = data
}
getDebugDeviceList()
</script>

<style scoped lang="scss">
$m20: 20px;
$m30: 30;
.set-test-group {
  overflow: hidden;
  > :deep(.operate-form-item__content) {
    //align-items: flex-start;
    //overflow: hidden;
    flex-wrap: nowrap;
    transform: translateX(-54px);

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
  > :deep(.operate-form-item__label) {
    color: #8a8a8a;
    font-size: 14px;
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
    height: 170px;
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
      gap: 10px;

      :deep(.operate-form-item__label) {
        width: 90px !important;
        justify-content: flex-start;
      }
    }
  }
}

.n-set-test-params {
  > :deep(.operate-form-item__label) {
    justify-content: flex-start;
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
div[class^='w-'] {
  &:not(.w-165) {
    background-color: #f0f2f5;
    padding: 0 10px;
  }
}
</style>
