<template>
  <el-config-provider :locale="zhCn" namespace="ep">
    <header>
      <el-button id="button" aria-describedby="tooltip" @click="test"
        >啦啦啦</el-button
      >
      <div id="tooltip" role="tooltip">
        My tooltip with more content My tooltip with more content
        <div id="arrow"></div>
      </div>
    </header>
  </el-config-provider>
</template>
<script setup name="App">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {
  computePosition,
  flip,
  shift,
  arrow,
  autoUpdate,
  autoPlacement,
} from '@floating-ui/dom'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'
const test = (_) => {
  ElMessage.warning('1')
}

nextTick(() => {
  const button = document.querySelector('#button')
  const tooltip = document.querySelector('#tooltip')
  const arrowElement = document.querySelector('#arrow')

  // This function will get called repeatedly.
  function updatePosition() {
    computePosition(button, tooltip, {
      // placement: 'top',
      middleware: [
        // autoPlacement(),
        flip(),
        shift({ padding: 5 }),
        arrow({ element: arrowElement }),
      ],
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(tooltip.style, {
        left: `${x}px`,
        top: `${y}px`,
      })

      // Accessing the data
      const { x: arrowX, y: arrowY } = middlewareData.arrow
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]]

      Object.assign(arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
      })
    })
  }

  const cleanup = autoUpdate(button, tooltip, updatePosition)
  function showTooltip() {
    tooltip.style.display = 'block'
    updatePosition()
  }

  function hideTooltip() {
    tooltip.style.display = ''
  }

  ;[
    ['mouseenter', showTooltip],
    ['mouseleave', hideTooltip],
    ['focus', showTooltip],
    ['blur', hideTooltip],
  ].forEach(([event, listener]) => {
    button.addEventListener(event, listener)
  })
})
</script>

<style lang="scss" scoped>
#tooltip {
  display: none;
  width: max-content;
  position: fixed;
  top: 0;
  left: 0;
  background: #222;
  color: white;
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;
  font-size: 90%;
}
#arrow {
  position: absolute;
  background: #222;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
}
</style>
