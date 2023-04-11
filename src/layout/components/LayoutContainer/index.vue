<template>
  <section class="layout-container" :name="$route.name">
    <div>
      <!--    <router-view #default="{ Component, route }">
           <keep-alive v-if="$route.meta.keepAlive">
             <component :is="Component" :key="route.path" />
           </keep-alive>
           <component :is="Component" v-else :key="route.path" />
         </router-view>-->
      <div>
        <router-view #default="{ Component, route }">
          <keep-alive :max="2">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </section>
</template>

<script setup name="LayoutContainer"></script>

<style lang="scss" scoped>
.layout-container {
  position: relative;
  min-height: 100%;
  transition: margin-left 0.1s;
  > div {
    width: 100%;
    position: relative;
    overflow: hidden;
    > div {
      padding: 20px;
    }
  }
}
</style>
