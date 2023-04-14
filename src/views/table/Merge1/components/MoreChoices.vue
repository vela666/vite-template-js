<template>
  <div class="n-ad-test-more-choose">
    <el-button
      v-if="[10, 2].includes(data.status)"
      @click="$emit('click', 'publishTest')"
      text
      :disabled="!data.operateFlag"
      type="primary">
      <svg-icon
        v-tooltip="allowOperation(data) || '发布'"
        name="micro1-publish1" />
    </el-button>
    <el-button
      @click="$emit('click', 'editTest')"
      text
      type="primary"
      :disabled="!data.operateFlag || ![1, 2].includes(+data.status)">
      <svg-icon
        v-tooltip="allowOperation(data) || '编辑'"
        name="micro1-edit1" />
    </el-button>
    <el-button
      @click="$emit('click', 'testDetails')"
      text
      type="primary"
      v-tooltip="'详情'">
      <svg-icon name="micro1-details1" />
    </el-button>

    <!--    <el-button
      @click="$emit('click', 'testData')"
      text
      type="primary"
      v-tooltip="'数据'"
    >
      <svg-icon name="micro1-data1" />
    </el-button>-->
    <el-button
      v-if="data.status !== 2"
      @click="$emit('click', 'copyTest')"
      text
      type="primary"
      v-tooltip="'复制试验'">
      <svg-icon name="micro1-copy1" />
    </el-button>
    <!--    <el-button
      :key="item.svg"
      v-for="item of btns.slice(0, data.status === 2 ? 0 : 0)"
      text
      :disabled="item.disabled"
      @click="$emit('click', item.type)"
      type="primary"
      v-tooltip="item.label"
    >
      <svg-icon :name="item.svg" />
    </el-button>-->

    <el-popover
      :show-arrow="false"
      placement="right"
      popper-class="n-asset-popover-more"
      trigger="hover"
      :popper-options="popperConfig">
      <template #reference>
        <svg-icon
          v-tooltip="'更多'"
          name="micro1-more1"
          class="m-r-5 c409EFF" />
      </template>
      <div class="more-choices">
        <template v-for="item of btns" :key="item.type">
          <el-button
            @click="$emit('click', item.type)"
            v-if="!item.isShow"
            :disabled="item.disabled"
            text>
            <span v-tooltip="item.tips">
              <svg-icon :name="item.svg" class="m-r-5" />
              {{ item.label }}
            </span>
          </el-button>
        </template>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'MoreChoices',
}
</script>
<script setup>
import { computed } from 'vue'
import { allowOperation } from '../enumerate'
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const emit = defineEmits(['click'])
const btns = computed(() => {
  return [
    {
      type: 'copyTest',
      label: '复制试验',
      svg: 'micro1-copy1',
      isShow: +props.data.status !== 2,
    },
    /* {
      type: 'editTest',
      label: '编辑',
      svg: 'micro1-edit1',
      isShow: +props.data.status !== 2,
      disabled: ![1, 2].includes(+props.data.status)
    },*/
    {
      type: 'stopTest',
      label: '终止',
      svg: 'micro1-stop1',
      isShow: +props.data.status !== 3,
    },
    {
      type: 'deleteTest',
      label: '删除',
      svg: 'micro1-delete1',
      disabled: !props.data.operateFlag || [8, 3].includes(+props.data.status),
      tips: allowOperation(props.data),
    },
  ]
})

const popperConfig = {
  modifiers: [
    {
      name: 'flip',
      options: {
        padding: 0,
        fallbackPlacements: ['bottom', 'left'],
      },
    },
  ],
}
</script>

<style lang="scss">
.operate-popper.n-asset-popover-more {
  max-width: 115px;
  min-width: 105px;
  padding: 0;
  .operate-button {
    margin-left: 0;
    justify-content: flex-start;
  }
}
</style>
<style lang="scss" scoped>
.n-ad-test-more-choose {
  display: flex;
  align-items: center;
  gap: 10px;
  :deep(.operate-button) {
    padding: 0;
    margin: 0;
  }
}
/*.svg-icon {
  display: inline-block;
  cursor: pointer;
  outline: none;
  font-size: 14px;
  &:hover {
    color: $color-primary;
  }
}*/
.more-choices {
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: content-box;

  > :deep(.operate-button) {
    margin: 0;

    &:hover {
      background: #f5f7fa;
      &:not(.is-disabled) {
        * {
          color: $color-primary;
        }
      }
    }
  }
}
</style>
