<template>
  <!--  <div class="demo">
    <p class="name">{{ name }}</p>
    <button @click="modify">修改</button>
  </div>-->
  <router-view />
  <el-button v-loading="loading" @click="test">as111111111111</el-button>
  <el-button @click="modify">a2</el-button>
  <p class="a">红红火火恍恍惚惚或或或或或或或或或或或或或或或</p>
</template>
<script setup name="Test1">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
const name = ref('111')
const loading = ref(true)
const obj = ref({
  a: 1,
})
const arr = ref([1, 2, 3])
const modify = () => {
  name.value = '222' // 关键的赋值语句，如果注释掉，结果就大不一样了
  arr.value.push(4)
  obj.value.a = 2
  nextTick(() => {
    const text = document.querySelector < HTMLElement > '.name'.innerText
    console.log(text)
  })
  name.value = '333'
}
const test = () => {
  ElMessage.success('a')
}
</script>

<style lang="scss" scoped>
/*.a {
  color: $color-primary;
}*/
</style>
