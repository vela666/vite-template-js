<template>
  <header class="layout-header" :name="$route.name">
    <LayoutHeaderNav1 />
    <!-- 第二种菜单布局   -->
    <!--    <LayoutHeaderNav2/>-->
    <!--    <LayoutHeaderMenu/>-->
  </header>
</template>

<script setup name="LayoutHeader">
import LayoutHeaderNav1 from '../LayoutHeaderNav1'
// import LayoutHeaderNav2 from '../LayoutHeaderNav2'
// import LayoutHeaderMenu from '../LayoutHeaderMenu'
</script>

<style scoped lang="scss">
.layout-header {
  flex-shrink: 0;
}
</style>
