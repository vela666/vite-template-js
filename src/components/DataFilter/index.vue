<template>
  <div class="flex-center">
    <span class="m-r-5">{{ name }}</span>
    <el-dropdown trigger="click" placement="bottom" @command="commandHandler">
      <span class="el-dropdown-link">
        <el-button class="p0" text size="small">
          <svg-icon name="micro1-filter1" class="c409EFF" />
        </el-button>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="dropItem of typeList"
            :key="dropItem.type"
            :class="{ dromClass: dropName === dropItem.type }"
            :command="dropItem.type"
            >{{ dropItem.label }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'DataFilter'
}
</script>
<script setup>
/*
使用
<DataFilter
    v-model="value"
    ref="dataFilterRef"
    name="数据类型"
    :list="typeList"
    @change="handleChange"
/>
const typeList = [
  { type: 'string', label: '文本' },
  { type: 'double', label: '数值' },
  { type: 'datetime', label: '时间（日期）' },
  { type: 'timestamp', label: '时间（时间戳）' },
  { type: 'array', label: '数组' },
  { type: 'boolean', label: '布尔' }
]
*/

import { computed, ref } from 'vue'
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  name: {
    type: [String, Number],
    default: ''
  },
  list: {
    type: Array,
    require: true
  }
})
const emit = defineEmits(['change', 'update:modelValue'])
const dropName = ref('')
const typeList = computed(() => {
  return [{ type: '', label: '全部' }, ...props.list]
})
const commandHandler = (type) => {
  if (dropName.value === type) return
  dropName.value = type
  emit('update:modelValue', type)
  emit('change', type)
}
const clearFilter = () => {
  dropName.value = ''
  emit('update:modelValue', '')
  emit('change', '')
}
defineExpose({
  clearFilter
})
</script>
<style scoped lang="scss"></style>
