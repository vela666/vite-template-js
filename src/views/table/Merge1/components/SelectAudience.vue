<template>
  <div class="n-select-audience-content">
    <div>
      <ConditionFilter
        class="n-select-audience-filter hide-filter-item-right-del"
        v-model="userFilter"
        :source="filterOptions"
        :allowCreate="false"
      />
      <!--      <div>
        <span class="icon-btn icon-btn__add" @click="addParamsFilters">
          <el-icon><Plus /></el-icon>新增
        </span>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectAudience'
}
</script>
<script setup>
import { computed, watch, reactive, ref } from 'vue'
import ConditionFilter from '@/components/ConditionFilter'
import { queryFilters } from '@/api/online-parameters'
import {
  Search,
  Promotion,
  CopyDocument,
  CirclePlus,
  Edit,
  Delete,
  Plus,
  Rank,
  ArrowUp,
  ArrowDown,
  InfoFilled,
  Tickets
} from '@element-plus/icons-vue'

const props = defineProps({
  selectUserfilter: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:selectUserfilter'])
const userFilter = computed({
  get() {
    return props.selectUserfilter
  },
  set(val) {
    emit('update:selectUserfilter', val)
  }
})
const filterOptions = ref([])

// 添加参数条件筛选项
/*const addParamsFilters = () => {
  userFilter.value.push({
    prop: [],
    relation: '',
    val: ''
  })
}*/

// 获取筛选的条件列表
const getFilterOptions = async () => {
  let { data } = await queryFilters({
    appId: sessionStorage.getItem('appId')
  })
  data = data.filter((item) => item.id === 13)
  const temp = data.map((el) => {
    const temp = {
      label: el.fzh,
      value: { name: el.fzh, key: el.fen, type: el.ftype }
    }
    // 目前只保留用户分群
    if (Array.isArray(el.userTagList)) {
      const children = el.userTagList.map((ele) => ({
        label: ele.tagZhName,
        value: {
          key: ele.tagName,
          name: ele.tagZhName,
          tagId: ele.tagId
        }
      }))
      temp['children'] = children
    }
    return temp
  })
  filterOptions.value = temp
  if (userFilter.value.length < 1) {
    userFilter.value = [
      {
        prop: [{ ...temp[0].value }],
        relation: { key: 'BE', name: '属于' },
        val: ''
      }
    ]
  }
}
getFilterOptions()
</script>

<style scoped lang="scss">
.n-select-audience-filter {
  :deep(.condition-filter-item-left) {
    width: auto !important;
    gap: 10px;
    padding: 6px !important;
    > div {
      &:nth-of-type(1) {
        margin: 0 !important;
        width: 120px;
      }
      &:nth-of-type(2) {
        width: 90px;
      }
      &:nth-of-type(3) {
        width: 120px;
      }
    }
  }
}
.hide-filter-item-right-del {
  :deep(.condition-filter-item-right) {
    display: none;
  }
}
</style>
