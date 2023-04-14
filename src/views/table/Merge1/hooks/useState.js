import { markRaw, reactive, toRefs } from 'vue'
import Testlayer from '../Testlayer'
import TestList from '../TestList'
import DebugEquipment from '../DebugEquipment'
import { debounce } from 'lodash-es'

export default function () {
  const state = reactive({
    // 当前显示的组件
    currentComponent: null
  })
  const tabsPane = [
    {
      label: '试验列表',
      is: markRaw(TestList)
    },
    {
      label: '试验层',
      is: markRaw(Testlayer)
    },
    {
      label: '白名单管理',
      is: markRaw(DebugEquipment)
    }
  ]
  state.currentComponent = tabsPane[0].is
  // 当前默认渲染的动态组件
  let type = sessionStorage.getItem('abTestCurrentComponents')
  if (type) {
    let val = tabsPane.find((v) => v.is.name === type)
    state.currentComponent = val ? val.is : state.currentComponent
  }
  // 设置组件实例
  const setRefs = (name, el) => {
    state[name] = el
  }

  // 切换标签页
  const tabsClick = debounce((val) => {
    if (val.name === state.currentComponent.name) return
    sessionStorage.setItem('abTestCurrentComponents', val.name)
    state.currentComponent = val
  }, 300)

  return {
    ...toRefs(state),
    tabsPane,
    setRefs,
    tabsClick
  }
}
