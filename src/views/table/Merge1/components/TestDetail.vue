<template>
  <div class="n-test-detail-container">
    <div>
      <div class="n-title">基本信息</div>
      <div>
        <span class="label">试验ID</span>
        <span class="content">{{ data.experimentId }}</span>
      </div>
      <div>
        <span class="label">状态</span>
        <span class="content">{{
          equipmentStatusTypeMap(data.status).label
        }}</span>
      </div>
      <!-- <div>
        <span class="label">试验类型</span>
        <span class="content">在线参数</span>
      </div> -->
      <div>
        <span class="label">试验层</span>
        <span class="content">{{ data.experimentLayerName }}</span>
      </div>
      <div>
        <span class="label">占用试验层比例</span>
        <span class="content">{{ data.occupancy }}%</span>
      </div>
      <div>
        <span class="label">试验时长</span>
        <span class="content">{{ data.dayNum }}天</span>
      </div>
      <div>
        <span class="label">运行时长</span>
        <span class="content"
          >{{ timeConversion(data) }}
          <span class="cffa800">
            {{ +data.stopFlag === 2 ? '手动终止' : '' }}
          </span>
        </span>
      </div>
      <div>
        <span class="label">开始时间</span>
        <span class="content">{{ data.beginTime }}</span>
      </div>
      <div>
        <span class="label">结束时间</span>
        <span class="content">{{ data.endTime }}</span>
      </div>
      <div>
        <span class="label">创建人</span>
        <span class="content">{{ data.creator }}</span>
      </div>
      <div>
        <span class="label">创建时间</span>
        <span class="content">{{ data.createTime }}</span>
      </div>
      <div>
        <span class="label">发布方式</span>
        <span class="content">
          {{ releaseMethodList[data.pushType] }}
          {{ +data.pushType === 2 ? `：${data.pushTime}` : '' }}
        </span>
      </div>
      <div>
        <span class="label">备注</span>
        <span class="content" v-showTips>{{ data.remark }}</span>
      </div>
    </div>
    <div>
      <div class="n-title">受众用户</div>
      <div>
        <span class="label">选择受众用户</span>
        <TestDetailUser :data="parsJsonFilter(data.userFilter)" />
      </div>
      <div>
        <span class="label">受众用户百分比</span>
        <span class="content">{{ data.userPercent }}%</span>
      </div>
    </div>
    <div>
      <div class="n-title">试验组设置</div>
      <div>
        <span class="label">分配方式</span>
        <span class="content">{{
          testGroupAllocationList[data.allocationType]
        }}</span>
      </div>
      <TestDetailGroup :data="data" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestDetail'
}
</script>
<script setup>
import {
  equipmentStatusTypeMap,
  releaseMethodList,
  testGroupAllocationList,
  timeConversion
} from '../enumerate'
import TestDetailUser from './TestDetailUser'
import TestDetailGroup from './TestDetailGroup'
import { parsJsonFilter } from '@/utils'
import useSpecial from '@/store/modules/special'
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
const specialStore = useSpecial()
specialStore.asyncGetFilterValue()
</script>

<style scoped lang="scss">
.n-test-detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  > div {
    display: flex;
    flex-direction: column;
    gap: 15px;
    &:not(:last-of-type) {
      border-bottom: 1px solid #dedede;
      padding-bottom: 5px;
    }
    > div {
      display: flex;
      padding-right: 20px;
    }
    .label,
    .content {
      font-size: 14px;
    }
    .label {
      color: #8a8a8a;
      white-space: nowrap;
      min-width: 110px;
      margin-right: 10px;
    }
    .content {
      color: #333;
      flex-grow: 1;
      word-break: break-all;
    }
  }
}
.content {
  &:empty::after {
    content: '--';
  }
}
</style>
