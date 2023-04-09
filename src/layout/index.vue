<template>
  <div class="app-wrapper">
    <LayoutHeader />
    <LayoutContainer />
  </div>
</template>

<script setup name="Layout">
import LayoutHeader from './components/LayoutHeader'
import LayoutContainer from './components/LayoutContainer'
</script>
<style lang="scss" scoped>
.app-wrapper {
  height: 100%;
  // 第一种布布局时停用下面样式
  display: flex;
  //display: grid;
  //grid-template-columns: auto 1fr;
}
</style>
