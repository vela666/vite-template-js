<template>
  <section class="layout-container" :name="$route.name">
    <div :class="{ 'fixed-header': fixedHeader }">
      <NavBar />
    </div>
    <div class="layout-container-content">
      <div class="p20">
        <router-view #default="{ Component, route }">
          <transition appear name="fade-transform" mode="out-in">
            <keep-alive :max="2">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
      <!--   内容区滚动，其他地方不滚动         -->
      <!--      <div>
        <el-scrollbar always class="layout-container-content-scroll">
          <div class="p20">
            <router-view #default="{ Component, route }">
              <transition appear name="fade-transform" mode="out-in">
                <keep-alive :max="2">
                  <component :is="Component" :key="route.path" />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </el-scrollbar>
      </div>-->
    </div>
  </section>
</template>

<script setup name="LayoutContainer">
import NavBar from '@/layout/components/NavBar'
import SidebarItem from '@/layout/components/LayoutHeaderNav3/SidebarItem.vue'
const fixedHeader = true
</script>

<style lang="scss" scoped>
.fixed-header {
  position: sticky;
  top: 0;
  z-index: 9;
}
.layout-container {
  position: relative;
  min-height: 100%;
  transition: margin-left $time-dot-3;
  .layout-container-content {
    //padding: $size-20;
    position: relative;
    width: 100%;
    background: #f0f2f5;
    overflow: hidden;
    &-scroll {
      height: calc(100vh - 50px);
    }
  }
}
</style>
