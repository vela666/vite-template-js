<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :default-sort="{ prop: 'name', order: 'descending' }"
    @sort-change="handleSortChange"
    :header-cell-class-name="handleHeaderCellClass">
    <el-table-column prop="date" label="日期" sortable="custom" width="180">
    </el-table-column>
    <el-table-column prop="name" label="姓名" sortable="custom" width="180">
    </el-table-column>
  </el-table>
</template>

<script setup name="Test2">
import { ref } from 'vue'
const tableData = ref([
  {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
  },
])
const orderArray = ref([])

//添加排序方法（可把多个字段共同加入排序）
function handleHeaderCellClass({ column }) {
  orderArray.value.forEach((element) => {
    if (column.property === element.prop) {
      column.order = element.order
    }
  })
}
// 点击排序箭头
function handleSortChange({ column, prop, order }) {
  console.log({ column, prop, order })
  if (order) {
    //参与排序
    let flagIsHave = false
    orderArray.value.forEach((element) => {
      if (element.prop === prop) {
        element.order = order
        flagIsHave = true
      }
    })
    if (!flagIsHave) {
      orderArray.value.push({
        prop: prop,
        order: order,
      })
    }
  } else {
    //不参与排序
    orderArray.value = orderArray.value.filter((element) => {
      return element.prop !== prop
    })
  }
  //调后端接口进行排序操作, this.orderArray就是最终排序后的集合
  console.log(orderArray.value)
}
</script>

<style scoped lang="scss"></style>
