<template>
  <!--  <header class="layout-header" :name="$route.name">
    <LayoutHeaderNav1 />
    &lt;!&ndash; 第二种菜单布局   &ndash;&gt;
    &lt;!&ndash;        <LayoutHeaderNav2/>&ndash;&gt;
    &lt;!&ndash;        <LayoutHeaderMenu/>&ndash;&gt;
  </header>-->
  <LayoutHeaderNav3 />
</template>

<script setup name="LayoutHeader">
import LayoutHeaderNav1 from '../LayoutHeaderNav1'
import LayoutHeaderNav2 from '../LayoutHeaderNav2'
import LayoutHeaderMenu from '../LayoutHeaderMenu'
import LayoutHeaderNav3 from '../LayoutHeaderNav3'
</script>

<style scoped lang="scss">
.layout-header {
  //flex-shrink: 0;
  // 第一种时布局停用
  height: 100%;
  background-color: $menuBg;
}
</style>
