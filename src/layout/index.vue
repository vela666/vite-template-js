<template>
  <div
    class="app-wrapper"
    :class="settingStore.isCollapse ? 'n-fold-menu' : 'n-open-menu'">
    <LayoutHeader />
    <LayoutContainer />
  </div>
</template>

<script setup name="Layout">
import LayoutHeader from './components/LayoutHeader'
import LayoutContainer from './components/LayoutContainer'
import useSetting from '@/stores/modules/setting'
const settingStore = useSetting()
</script>
<style lang="scss" scoped>
.app-wrapper {
  //display: flex;
  //flex-wrap: nowrap;
  height: 100%;
  width: 100%;
  // 第一种布布局时停用下面样式
  //display: grid;
  //grid-template-columns: auto 1fr;
}
</style>
