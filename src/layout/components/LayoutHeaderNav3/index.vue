<template>
  <div class="sidebar-container">
    <el-scrollbar always wrap-class="scrollbar-wrapper">
      <el-menu
        :collapse-transition="false"
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
    </el-scrollbar>
  </div>
</template>

<script setup name="LayoutHeaderNav">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import usePermissionStore from '@/stores/modules/permission'
import useSetting from '@/stores/modules/setting'
import SidebarItem from './SidebarItem'

const route = useRoute()
const store = usePermissionStore()
const settingStore = useSetting()
const { asyncRoutes } = storeToRefs(store)
</script>

<style lang="scss">
.sidebar-container {
  transition: width $time-dot-3;
  background-color: $color-304156;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999999;
  overflow: hidden;
  .is-horizontal {
    display: none;
  }
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
  /* .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }*/

  .el-scrollbar {
    height: 100%;
  }
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
      background-color: $color-263445 !important;
    }
  }

  & .nest-menu .el-sub-menu > .el-sub-menu__title,
  & .el-sub-menu .el-menu-item {
    background-color: $color-1f2d3d !important;

    &:hover {
      background-color: $color-001528 !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.n-el-menu-vertical {
  border-right: none;
}
</style>
