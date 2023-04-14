<template>
  <div
    :class="settingStore.isCollapse ? 'n-fold-menu' : 'n-open-menu'"
    class="app-wrapper">
    <div>
      <LayoutHeader />
      <LayoutContainer />
    </div>
  </div>
</template>

<script setup name="Layout">
import LayoutHeader from './components/LayoutHeader'
import LayoutContainer from './components/LayoutContainer'
import useSetting from '@/stores/modules/setting'
const settingStore = useSetting()
</script>
<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
