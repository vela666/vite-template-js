<template>
  <el-config-provider :locale="zhCn" namespace="el">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

/*import counterStore from '@/stores/modules/counter'
import mainStore from '@/stores/modules/main'
import SelectRangeTime from '@/components/SelectRangeTime'
let store1 = counterStore()
let store2 = mainStore()*/

// 解构
// let state1 = storeToRefs(store1)
// console.log(count)
</script>
