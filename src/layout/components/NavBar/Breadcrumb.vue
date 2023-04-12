<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) of levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup name="Breadcrumb">
import { computed, watch, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pathToRegexp } from 'path-to-regexp'
import usePermissionStore from '@/stores/modules/permission'
const store = usePermissionStore()
const route = useRoute()
const router = useRouter()
const levelList = ref(null)

const getBreadcrumb = () => {
  // only show routes with meta.title
  const menu = store.generateRoutes.find((item) => item.path === '/')
  let matched = route.matched.filter((item) => item.meta && item.meta.title)
  if (menu.children.length === 1) {
    matched = [{ ...menu.children[0], redirect: menu.redirect }, ...matched]
  }
  const first = matched[0]
  console.log({ first, a: route.matched, matched })
  levelList.value = matched.filter(
    // (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false,
    (item) => item.meta && item.meta.title,
  )
}

const pathCompile = (path) => {
  // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
  const { params } = route
  const toPath = pathToRegexp.compile(path)
  return toPath(params)
}
const handleLink = (item) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(pathCompile(path))
}
watch(route, (val) => {
  getBreadcrumb()
})

getBreadcrumb()
</script>

<style scoped lang="scss">
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
