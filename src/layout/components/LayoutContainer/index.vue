<template>
  <section class="layout-container" :name="$route.name">
    <div :class="{ 'fixed-header': fixedHeader }">
      <NavBar />
    </div>
    <!--    <router-view #default="{ Component, route }">
           <keep-alive v-if="$route.meta.keepAlive">
             <component :is="Component" :key="route.path" />
           </keep-alive>
           <component :is="Component" v-else :key="route.path" />
         </router-view>-->
    <div class="layout-container-content">
      <router-view #default="{ Component, route }">
        <keep-alive :max="2">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </router-view>
    </div>
  </section>
</template>

<script setup name="LayoutContainer">
import NavBar from '@/layout/components/NavBar'
const fixedHeader = true
</script>

<style lang="scss" scoped>
.fixed-header {
  position: sticky;
  top: 0;
  z-index: 99999998;
  transition: width $time-dot-3;
}
.layout-container {
  position: relative;
  min-height: 100%;
  transition: margin-left $time-dot-3;
  .layout-container-content {
    padding: $spacing-20;
    position: relative;
    overflow: hidden;
  }
}
</style>
