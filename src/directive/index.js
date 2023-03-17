import { debounce, throttle } from 'lodash-es'
// https://github.com/floating-ui/floating-ui/tree/v2.x
import { createPopper } from '@popperjs/core'
import { ElMessage } from 'element-plus'
import delegate from 'delegate'
import { isObject } from '@/utils/types'
import { getActualWidthOfChars } from '@/utils'

// 单行 超出文字显示...并显示文字提示框 只需要设置元素宽即可
const showTips = {
  // el {element} 当前元素
  mounted(el, binding) {
    const {
      delay = 300,
      place = 'top',
      hide = true
    } = isObject(binding.value) ? binding.value : {}
    // 鼠标移入
    let setId = null
    let tooltipId = null
    el.classList.add('n-only-tooltip')
    let fn = throttle(function (e) {
      // mousemove 事件
      // if (e.path.some(item => /n-only-tooltip/.test(item.className))) {
      if (
        e.relatedTarget?.matches('.n-only-tooltip') &&
        e.target.matches('.n-only-tooltip')
      ) {
        clearTimeout(tooltipId)
      }
      tooltipId = setTimeout(() => {
        // mousemove 事件
        // if (!e.path.some(item => /n-only-tooltip/.test(item.className))) {
        if (
          !e.relatedTarget?.matches('.n-only-tooltip') &&
          !e.target.matches('.n-only-tooltip')
        ) {
          let tooltip = document.getElementById('tooltip')
          window.removeEventListener('mouseover', fn)
          if (tooltip) {
            tooltip.onmouseleave = null
            tooltip.remove()
          }
          clearTimeout(tooltipId)
          tooltipId = null
        }
      }, 300)
    }, 300)
    // 给当前元素设置超出隐藏
    el.style.overflow = 'hidden'
    el.style.textOverflow = 'ellipsis'
    el.style.whiteSpace = 'nowrap'
    // 鼠标移入
    el.onmouseenter = function (e) {
      // scrollWidth获取总宽度 包含超出  显示提示框
      let textWidth = getActualWidthOfChars(el.innerText)
      // if (el.scrollWidth > el.offsetWidth) {
      if (
        el.innerText &&
        (textWidth > el.offsetWidth || el.scrollWidth > el.offsetWidth)
      ) {
        // el.style.cursor = 'pointer'
        clearTimeout(setId)
        setId = setTimeout(() => {
          let tooltip = document.getElementById('tooltip')
          tooltip && tooltip.remove()
          // 创建浮层元素并设置样式
          const div = document.createElement('div')
          div.classList.add('yf-eas-tooltip', 'n-only-tooltip')
          // 设置id方便寻找
          div.setAttribute('id', 'tooltip')
          // 浮层中的文字
          div.innerHTML = `<div class="yf-eas-tooltip-overflow n-only-tooltip">${el.innerText}</div>`
          div.onmouseleave = function () {
            clearTimeout(tooltipId)
            tooltipId = null
            this.onmouseleave = null
            this.remove()
          }
          // 将浮层插入到body中
          document.body.appendChild(div)
          // 让提示元素的位置始终保持在正确位置
          createPopper(this, div, {
            strategy: 'fixed',
            placement: place,
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8]
                }
              }
            ]
          })
          clearTimeout(setId)
          setId = null
        }, delay)
      }
    }
    // 鼠标移出
    el.onmouseleave = function () {
      // el.style.cursor = 'default'
      if (hide) {
        let id = setTimeout(() => {
          // 找到浮层元素并移除
          const tooltip = document.getElementById('tooltip')
          tooltip && document.body.removeChild(tooltip)
          clearTimeout(id)
          id = null
        }, 300)
        return
      }
      window.addEventListener('mousemove', fn)
    }
  },
  // 指令与元素解绑时
  beforeUnmount(el) {
    el.onmouseenter = null
    el.onmouseleave = null
    // 找到浮层元素并移除
    let tooltip = document.getElementById('tooltip')
    tooltip && tooltip.remove()
  }
}

let delegation = null
/**
 * @description 事件委托 精准委托
 * @author 王应龙
 * @date 2021-08-23 14:38:10
 * @link https://github.com/zenorocha/delegate
 * @returns 返回目标元素
 * @example
 * <button v-eventDelegation="{fn: handler, target: '触发目标类名'}"></button>
 * <button v-eventDelegation:change="{fn: handler, target: '触发目标类名'}"></button>
 */
const eventDelegation = {
  // el {element} 当前元素
  mounted(el, binding) {
    let event = binding.arg || 'click'
    const {
      target = false,
      fn = (e) => {
        console.log(e, '触发元素')
      }
    } = binding.value
    if (target) {
      delegation = delegate(
        el,
        target,
        event,
        function (e) {
          fn(e.delegateTarget)
        },
        false
      )
    }
  },
  // 指令与元素解绑时
  beforeUnmount() {
    // 找到浮层元素并移除
    delegation.destroy()
  }
}

/**
 * @des 左键点击复制内容
 * val = 要复制的内容
 * v-copy:stop="val" 不允许冒泡
 * <span v-copy="val">
 *   {{ val }}
 * </span>
 */
let elMessage = null
const copy = {
  mounted(el, { value, arg }) {
    el.$value = value
    if (!el.$value) return
    el.handler = debounce(() => {
      elMessage && elMessage.close()
      const input = document.createElement('input')
      input.value = el.$value
      document.body.appendChild(input)
      input.select()
      document.execCommand('Copy')
      input.remove()
      elMessage = ElMessage.success({
        message: '复制成功',
        duration: 500
      })
    }, 300)
    // 绑定点击事件，就是所谓的一键 copy 啦
    el.addEventListener('click', (e) => {
      // 是否允许事件冒泡  true不允许( v-copy:stop="val" ) false允许( v-copy="val" )
      arg && e.stopPropagation()
      el.handler()
    })
  },
  // 当传进来的值更新的时候触发
  updated(el, { value }) {
    el.$value = value
  },
  // 指令与元素解绑的时候，移除事件绑定
  beforeUnmount(el) {
    el.removeEventListener('click', el.handler)
  }
}

/**
 * @description  元素提示说明 实现el-tooltip组件效果且全局不存在n个DOM元素
 * @date 2021-09-28
 * @returns 鼠标hover提示
 * @example
 * <span v-tooltip="提示"> 文字 </span>
 * <span v-tooltip="{txt:提示文字,delay:出现延迟时间,place:显示位置,hide:(el-tooltip组件效果)}"> 默认文字</span>
 */
const tooltip = {
  // el {element} 当前元素
  mounted(el, binding) {
    const {
      txt = '',
      delay = 300,
      place = 'top',
      hide = true
    } = isObject(binding.value) ? binding.value : { txt: binding.value }
    el.$value = txt
    // 鼠标移入
    let setId = null
    let tooltipId = null
    el.classList.add('n-only-tooltip')
    let fn = throttle(function (e) {
      // mousemove 事件
      // if (e.path.some(item => /n-only-tooltip/.test(item.className))) {
      if (
        e.relatedTarget?.matches('.n-only-tooltip') &&
        e.target.matches('.n-only-tooltip')
      ) {
        clearTimeout(tooltipId)
      }
      tooltipId = setTimeout(() => {
        // mousemove 事件
        // if (!e.path.some(item => /n-only-tooltip/.test(item.className))) {
        if (
          !e.relatedTarget?.matches('.n-only-tooltip') &&
          !e.target.matches('.n-only-tooltip')
        ) {
          let tooltip = document.getElementById('tooltip')
          window.removeEventListener('mouseover', fn)
          if (tooltip) {
            tooltip.onmouseleave = null
            tooltip.remove()
          }
          clearTimeout(tooltipId)
          tooltipId = null
        }
      }, 300)
    }, 300)
    el.onmouseenter = function (e) {
      if (!el.$value) return
      // el.style.cursor = 'pointer'
      clearTimeout(setId)
      setId = setTimeout(() => {
        let tooltip = document.getElementById('tooltip')
        tooltip && tooltip.remove()
        // 创建浮层元素并设置样式
        const div = document.createElement('div')
        // const i = document.createElement('i')
        div.classList.add('yf-eas-tooltip', 'n-only-tooltip')
        // 设置id方便寻找
        div.setAttribute('id', 'tooltip')
        // 浮层中的文字
        div.innerHTML = `<div class="yf-eas-tooltip-overflow n-only-tooltip">${el.$value}</div>`
        // div.appendChild(i)
        div.onmouseleave = function () {
          clearTimeout(tooltipId)
          tooltipId = null
          this.onmouseleave = null
          this.remove()
        }
        // 将浮层插入到body中
        document.body.appendChild(div)
        // 让提示元素的位置始终保持在正确位置
        createPopper(this, div, {
          strategy: 'fixed',
          placement: place,
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 8]
              }
            }
          ]
        })
        clearTimeout(setId)
        setId = null
      }, delay)
    }
    // 鼠标移出
    el.onmouseleave = function () {
      // el.style.cursor = 'default'
      if (hide) {
        let id = setTimeout(() => {
          // 找到浮层元素并移除
          const tooltip = document.getElementById('tooltip')
          tooltip && document.body.removeChild(tooltip)
          clearTimeout(id)
          id = null
        }, 300)
        return
      }
      window.addEventListener('mousemove', fn)
    }
  },
  // 当传进来的值更新的时候触发
  updated(el, { value }) {
    el.$value = value
  },
  // 指令与元素解绑时
  beforeUnmount(el) {
    el.onmouseenter = null
    el.onmouseleave = null
    // 找到浮层元素并移除
    let tooltip = document.getElementById('tooltip')
    tooltip && tooltip.remove()
  }
}

export default {
  showTips,
  eventDelegation,
  tooltip,
  copy
}
