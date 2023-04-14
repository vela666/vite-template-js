<template>
  <el-dialog
    v-model="show"
    :close-on-click-modal="closeModel"
    :class="['add-or-upd-dialog', className].join(' ')"
    :title="title"
    append-to-body
    :width="width"
    destroy-on-close
    @closed="$emit('close')"
    @open="opened">
    <template #header v-if="Object.keys($slots).includes('header')">
      <div class="operate-dialog__title">
        <slot name="header"></slot>
      </div>
    </template>
    <div v-loading="loading" class="add-or-upd-dialog-container">
      <div>
        <slot></slot>
      </div>
      <section v-if="showBtn">
        <div class="dialog-footer-l">
          <slot name="footer"></slot>
        </div>
        <div class="dialog-footer-r">
          <el-button class="dialog-btn1" @click="show = false">
            取消
          </el-button>
          <el-button
            @click="submit"
            :disabled="loading"
            class="dialog-btn1"
            type="primary">
            {{ submitTxt }}
          </el-button>
        </div>
      </section>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddOrUpdDialog',
}
</script>
<script setup>
import { watch, computed } from 'vue'
import { debounce } from 'lodash-es'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 点击其他地方关闭对话框
  closeModel: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: '424px',
  },
  title: {
    type: [String],
    default: '操作',
  },
  // 是否显示按钮
  showBtn: {
    type: Boolean,
    default: true,
  },
  submitTxt: {
    type: [String, Number],
    default: '确定',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  // 最大高度
  maxH: {
    type: String,
    default: '80%',
  },
})
const emit = defineEmits(['update:modelValue', 'submit', 'close', 'open'])
const show = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
watch(
  () => props.maxH,
  (val) => {
    // 设置全局css变量
    const docStyle = document.documentElement.style
    docStyle.setProperty('--dialog-maxH', val)
  },
  { immediate: true },
)
// 解决嵌套某些内容渲染时很慢 导致对话框有卡顿问题
const opened = () => {
  let setId = setTimeout(() => {
    emit('open')
    clearTimeout(setId)
    setId = null
  })
}
const submit = debounce(() => {
  emit('submit')
}, 300)
</script>
<style lang="scss">
.add-or-upd-dialog {
  display: flex;
  flex-direction: column;
  max-height: var(--dialog-maxH, 80%);

  .operate-dialog__body {
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }
  .operate-dialog__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dedede;
    margin-right: 0;
    padding: 15px 20px;
    .operate-dialog__title {
      font-size: 16px;
      color: #333;
    }
    .operate-dialog__headerbtn {
      position: relative;
      top: 4px;
      width: auto;
      height: auto;
    }
  }
}
</style>
<style lang="scss" scoped>
.add-or-upd-dialog-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > div {
    flex: 1;
    overflow-y: auto;
    overflow-y: overlay;
    padding: 20px 20px 15px;
  }
  > section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #dedede;
    padding: 15px 20px 15px;
  }
}
// 一级按钮
.dialog-btn1 {
  width: 60px;
  height: 32px;
  border: 1px solid #dedede;
  border-radius: 2px;
  margin: 0;
  &:nth-of-type(1) {
    margin-right: 10px;

    &:focus,
    &:hover {
      border-color: $color-primary;
      color: $color-primary;
      //background-color: transparent;
    }
  }
}
.dialog-footer-l {
  font-size: 14px;
  color: #616161;
}

.dialog-footer-r {
  display: flex;
  align-items: center;
}
</style>
