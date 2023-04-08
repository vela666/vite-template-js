<template>
  <section class="layout-container" :name="$route.name">
    <!--    <router-view #default="{ Component, route }">
      <keep-alive v-if="$route.meta.keepAlive">
        <component :is="Component" :key="route.path" />
      </keep-alive>
      <component :is="Component" v-else :key="route.path" />
    </router-view>-->
    <router-view #default="{ Component, route }">
      <keep-alive :max="2">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </router-view>
  </section>
</template>

<script setup name="LayoutContainer"></script>

<style lang="scss" scoped>
.layout-container {
  flex-grow: 1;
  overflow: hidden;
  padding: 10px $interval-36 $interval-24;
}
</style>
