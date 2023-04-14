<template>
  <el-drawer
    v-model="visible"
    append-to-body
    destroy-on-close
    direction="rtl"
    class="n-ab-test-drawer"
    size="900px"
    @close="drawerClose">
    <template #header>
      <span class="title">{{ detailData.experimentName }}</span>
    </template>
    <div class="drawer-t">
      <template v-for="item of tabsPane" :key="item.is">
        <el-button
          :class="{
            'drawer-btn-active': item.is.name === currentComponent.name,
          }"
          class="drawer-btn"
          text
          @click="tabsClick(item.is)">
          {{ item.label }}
        </el-button>
      </template>
    </div>
    <div class="n-ab-test-drawer-c">
      <div class="n-ab-test-detail-c-t">
        <component
          :is="currentComponent"
          :data="detailData"
          :ref="(el) => setRefs(currentComponent.name, el)">
        </component>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'TestDetails',
}
</script>
<script setup>
import { ref, markRaw } from 'vue'
import TestDetail from './TestDetail'
import { debounce } from 'lodash-es'
const currentComponent = ref(null)
const visible = ref(false)
const componentRefs = ref({})
const detailData = ref({})
// 功能界面切换按钮列表
const tabsPane = [
  {
    label: '详情',
    is: markRaw(TestDetail),
  },
  /*{
    label: '数据',
    is: 'Data'
  }*/
]
currentComponent.value = tabsPane[0].is

// 切换显示 详情还是数据
const tabsClick = debounce((val) => {
  if (val.name === currentComponent.value.name) return
  currentComponent.value = val
}, 300)
// 设置组件实例
const setRefs = (name, el) => {
  componentRefs.value[name] = el
}
const drawerClose = (name, el) => {
  componentRefs.value = {}
}
const open = (row) => {
  visible.value = true
  detailData.value = row
}
defineExpose({
  open,
})
</script>

<style lang="scss">
.n-ab-test-drawer {
  .operate-drawer__header {
    margin-bottom: 0;
    align-items: center;
    justify-content: center;
    padding: 19px;
  }
  .operate-drawer__body {
    display: flex;
    flex-direction: column;
    padding: 0;
    background: #f7f7f7;
  }
}
</style>
<style lang="scss" scoped>
.title {
  font-size: 14px;
  font-weight: bold;
  color: #1f1f1f;
}
.drawer-t {
  position: relative;
  border-top: 1px solid #dedede;
  background: #fff;
}
.n-ab-test-drawer-c {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #fff;
  margin-top: 5px;
  flex: 1;
  overflow: hidden;
  .n-ab-test-detail-c-t {
    flex: 1;
    overflow-y: auto;
    overflow-y: overlay;
  }
}

.show-details {
  margin: 10px;
  overflow-y: auto;
  overflow-y: overlay;
}
.drawer-btn {
  width: 86px;
  height: 32px;
  border-radius: 0px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 0;
  transform: translateY(-1px);
  background-color: transparent !important;
  /* &:focus {
    color: var(--el-button-font-color, var(--el-text-color-regular));
    background: #fff;
  }*/

  &:hover {
    color: $color-primary;
    border-color: transparent;
  }
}

.drawer-btn-active {
  border: 1px solid $color-primary !important;
  color: $color-primary !important;
  background-color: #ecf6ff;
  border: 1px solid #409eff;
}
</style>
