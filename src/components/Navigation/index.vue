<template>
  <div class="nav-header">
    <div v-for="(item, index) of navbarList" :key="index">
      <span class="nav-header-link">
        <span v-if="!item.path" class="label">{{ item.label }}</span>
        <el-link v-else @click="$router.replace(item.path)">{{
          item.label
        }}</el-link>
        <span v-show="index + 1 !== navbarList.length" class="label-link"
          >/</span
        >
      </span>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  navbar: {
    type: Array,
    default() {
      /*   [
            {
                 label: '用户分群',
                    path: '/userAnalysis/userGroup'
            }
        ]*/
      return []
    },
  },
})

const navbarList = computed(() => {
  return props.navbar
})
</script>
<style lang="scss" scoped>
.nav-header {
  display: flex;
  align-items: center;
  width: 100%;
  //padding: 20px 20px 0;
  //background-color: #f0f2f5;
  &-link {
    display: flex;
    font-size: 16px;
    font-weight: bold;
    color: #ababab;
    a {
      font-size: 16px;
      font-weight: bold;
      color: $color-primary;
    }
  }
  .label {
    color: #888;
    font-weight: 500;
    font-size: 16px;
    cursor: default;
  }
  .label-link {
    margin: 0 8px;
    color: #8d9eb9;
  }
}
</style>
