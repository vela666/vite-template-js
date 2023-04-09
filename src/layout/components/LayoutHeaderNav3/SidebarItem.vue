<!--      <template
            v-if="
      hasOneShowingChild(item.children, item) &&
      (!onlyOneChild.children.length || onlyOneChild.noShowingChildren) &&
      !item.alwaysShow
    ">-->
<template>
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
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })
  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    // onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    onlyOneChild.value = parent
    return true
  }

  return false
}
</script>
