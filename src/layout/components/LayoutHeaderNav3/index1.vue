<template>
  <div class="sidebar-container">
    <!--    <el-scrollbar always wrap-class="scrollbar-wrapper">
      <el-menu
        ref="menuRef"
        :default-active="route.path"
        :collapse="settingStore.isCollapse"
        class="n-el-menu-vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#f4f4f5">
        <SidebarItem
          v-for="route of asyncRoutes"
          :key="route.menu_path"
          :item="route"
          :base-path="route.menu_path" />
      </el-menu>
    </el-scrollbar>-->
    <el-button @click="settingStore.isCollapse = !settingStore.isCollapse"
      >测试</el-button
    >
    <el-menu
      ref="menuRef"
      :default-active="route.path"
      :collapse="settingStore.isCollapse"
      class="n-el-menu-vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#f4f4f5">
      <el-scrollbar always wrap-class="scrollbar-wrapper">
        <SidebarItem
          v-for="route of asyncRoutes"
          :key="route.menu_path"
          :item="route"
          :base-path="route.menu_path" />
      </el-scrollbar>
    </el-menu>
  </div>
</template>

<script setup name="LayoutHeaderNav">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import usePermissionStore from '@/stores/modules/permission'
import useSetting from '@/stores/modules/setting'
import SidebarItem from './SidebarItem'

const route = useRoute()
const store = usePermissionStore()
const settingStore = useSetting()
console.log(settingStore)
const { asyncRoutes } = storeToRefs(store)
const menuRef = ref(null)
</script>

<style lang="scss">
.sidebar-container {
  transition: width 0.28s;
  background-color: $menuBg;
  //overflow: hidden;
}
.scrollbar-wrapper {
  overflow-x: hidden !important;
  height: 100%;
  .router-link-active {
    > * {
      color: $color-primary;
    }
  }
  // 不要过渡动画
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .el-scrollbar {
    height: 100%;
  }
  .el-menu--collapse .el-sub-menu {
    background: yellow;
  }

  // reset element-ui css
  /* .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }*/

  .el-scrollbar__bar.is-vertical {
    right: 0px;
  }

  .is-horizontal {
    display: none;
  }

  a {
    width: 100%;
    overflow: hidden;
  }

  .svg-icon {
    margin-right: 16px;
  }

  .sub-el-icon {
    margin-right: 12px;
    margin-left: -2px;
  }

  // menu hover
  .el-sub-menu__title {
    &:hover {
      background-color: $menuHover !important;
    }
  }

  & .nest-menu .el-sub-menu > .el-sub-menu__title,
  & .el-sub-menu .el-menu-item {
    background-color: $subMenuBg !important;

    &:hover {
      background-color: $subMenuHover !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.n-el-menu-vertical {
  position: sticky;
  top: 0;
  z-index: 1001;
  &:not(.el-menu--collapse) {
    width: 210px;
  }
}
.layout-menu-breadcrumb {
  padding: 10px $interval-36 0 $interval-36;

  & + .layout-container {
    margin-top: 10px;
  }
}
</style>
