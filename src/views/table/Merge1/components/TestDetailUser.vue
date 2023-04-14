<script>
export default {
  name: 'TestDetailUser',
}
</script>
<script setup>
import useSpecial from '@/store/modules/special'
// import { formatSecondTimestamp } from '@/utils'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
const specialStore = useSpecial(false)
const mapValueName = (item) => {
  // let isArray = Array.isArray(item.val)
  // if (!isArray) return item.val
  // 用户分群 回显显示名
  if (item.prop[0].type === 'cluster') {
    const { label } =
      specialStore.userGroupList.find((v) => v.value === item.val) || {}
    return label || item.val
  }
  // 等于时间戳
  /*if (item.prop[0].type === 'timestamp') {
    let timestampVal = item.val.map((v) => {
      return formatSecondTimestamp(v)
    })
    return timestampVal.join(' 至 ')
  }*/
  return item.val
}
</script>
<template>
  <div v-if="data.length" class="condition-filter">
    <div class="condition-filter-container">
      <div class="condition-left-bar" v-if="data.length > 1">且</div>
      <div :class="['condition-right-panel', data.length > 1 ? 'ml-30' : '']">
        <div class="condition-filter-item" v-for="item of data" :key="item">
          <div v-showTips>
            {{ item.prop.map((item) => item.name).join(' / ') }}
          </div>
          <div v-showTips>
            {{ item.relation.name }}
          </div>
          <div v-showTips>
            {{ mapValueName(item) }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <span v-else class="content">全部用户</span>
</template>
<style lang="scss" scoped>
.condition-filter {
  .condition-filter-container {
    position: relative;
    .condition-left-bar {
      position: absolute;
      width: 20px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: $color-primary;
      background: #f0f2f5;
    }
    .condition-right-panel {
      &.ml-30 {
        margin-left: 30px;
      }
      .condition-filter-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:not(:last-child) {
          margin-bottom: 20px;
        }
        > div {
          width: 250px;
          padding: 10px;
          background: #f0f2f5;
          &:nth-of-type(2) {
            width: 100px;
            margin: 0 10px;
          }
        }
      }
    }
  }
}
.icon-btn {
  cursor: pointer;
  :hover {
    color: $color-primary;
  }
  + .icon-btn {
    margin-left: 12px;
  }
}
</style>
