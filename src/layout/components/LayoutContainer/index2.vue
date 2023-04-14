<template>
  <section class="layout-container" :name="$route.name">
    <router-view #default="{ Component, route }">
      <keep-alive :max="2">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </router-view>
  </section>
</template>
<!--(Nav1和2布局用的) -->
<script setup name="LayoutContainer"></script>

<style lang="scss" scoped>
.layout-container {
  flex-grow: 1;
  padding: 20px;
}
</style>
