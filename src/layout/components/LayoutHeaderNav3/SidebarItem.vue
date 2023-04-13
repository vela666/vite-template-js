<!--      <template
            v-if="
      hasOneShowingChild(item.children, item) &&
      (!onlyOneChild.children.length || onlyOneChild.noShowingChildren) &&
      !item.alwaysShow
    ">-->
<template v-if="!item.hidden">
  <template
    v-if="
      hasOneShowingChild(item.children, item) &&
      !onlyOneChild?.children?.length &&
      !item.alwaysShow
    ">
    <router-link :to="onlyOneChild.menu_path">
      <el-menu-item :index="onlyOneChild.menu_path">
        <el-icon><location /></el-icon>
        <template #title>
          <span>{{ onlyOneChild.menu_name }}</span>
        </template>
      </el-menu-item>
    </router-link>
  </template>

  <el-sub-menu v-else :index="item.menu_path">
    <template #title>
      <el-icon><setting /></el-icon>
      <span> {{ item.menu_name }}</span>
    </template>
    <div class="nest-menu">
      <SidebarItem
        v-for="child of item.children"
        :key="child.menu_path"
        :is-nest="true"
        :item="child"
        :base-path="child.menu_path" />
    </div>
  </el-sub-menu>
</template>

<script setup name="SidebarItem">
import { ref } from 'vue'
const props = defineProps({
  // route object
  item: {
    type: Object,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: '',
  },
})
const onlyOneChild = ref(null)
const hasOneShowingChild = (children = [], parent) => {
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false
    } else {
      // 临时设置（如果只有一个显示的孩子将被使用）
      onlyOneChild.value = item
      return true
    }
  })
  // 当只有一个子路由器时，默认显示子路由器
  if (showingChildren.length === 1) {
    return true
  }

  // 如果没有要显示的子路由器，则显示父级
  if (showingChildren.length === 0) {
    // onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    onlyOneChild.value = parent
    return true
  }

  return false
}
</script>
