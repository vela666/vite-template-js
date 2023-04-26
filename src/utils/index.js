// 使用canvas获取文本实际宽度
export function getActualWidthOfChars(text = '', options = {}) {
  const { size = 12, family = 'Microsoft YaHei' } = options
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = `${size}px ${family}`
  const metrics = ctx.measureText(text)
  return (
    Math.abs(metrics.actualBoundingBoxLeft) +
    Math.abs(metrics.actualBoundingBoxRight)
  )
}

// 数字输入约束
// v = 值   decimalPoint = 可输入的小数点位数
export function numInputMap(v, decimalPoint = 2) {
  v += ''
  // 0开头不能出现多个
  v = v.replace(/^0{2,}/g, '0')
  // 把非数字的都替换掉，除了数字和.
  v = v.replace(/[^\d.]/g, '')
  // 保证只有出现一个.而没有多个.
  v = v.replace(/\.{2,}/g, '.')
  // 必须保证第一个为数字而不是.
  v = v.replace(/^\./g, '')
  // 保证.只出现一次，而不能出现两次以上
  v = v.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  // 可输入的小数点位数 动态配置 默认2位
  v = v.replace(
    new RegExp(`^(-)*(\\d+)\\.(\\d{${decimalPoint}}).*$`),
    '$1$2.$3',
  )
  v = v.replace(/^\d*\.$/g, v.match(/(\d*)/g)[0])
  // 获取除了0 后面的所有值
  v = /^0\d/g.test(v) ? v.match(/(?<=^0)(\d.*)/g)[0] : v
  return +v
}

// 参数类型
export const parameterTypeArr = [
  { label: '字符串', value: 'string', svg: 'micro1-string1' },
  { label: '数字', value: 'number', svg: 'micro1-number1' },
  { label: '时间戳', value: 'timestamp', svg: 'micro1-timestamp1' },
  { label: '布尔值', value: 'boolean', svg: 'micro1-boolean1' },
  { label: 'JSON', value: 'json', svg: 'micro1-json1' },
]

//解析保存的json字符串格式的过滤条件
export const parsJsonFilter = (val) => {
  const tmp = []
  if (!isJson(val)) return tmp
  const datas = JSON.parse(val)
  for (const item of datas) {
    const t = {
      prop: [],
      relation: {},
      val: '',
    }
    if (item.property) {
      t.prop[0] = { ...item.property }
    }
    if (item.operation) {
      t.relation = { ...item.operation }
    }
    if (item.tag) {
      t.prop[1] = {
        key: item.tag.userTag,
        tagId: item.tag.tgId,
        name: item.tag.name,
      }
    }
    if (item.value) {
      if (
        (['EQ', 'NOT_EQ'].includes(item.operation.key) &&
          item.property.type !== 'timestamp') ||
        (item.property.type === 'timestamp' && item.operation.key === 'RG')
      ) {
        t.val = [...item.value]
      } else {
        t.val = item.value[0]
      }
    }
    tmp.push(t)
  }
  return tmp
}

// 检测默认值是否与类型匹配
export const validateDefaultValue = (type, val) => {
  // type = 当前文件下的parameterTypeArr的value
  /*if (type === 'timestamp') {
    return true
  } else if (type === 'number') {
    return isFloatNumber(val)
  } else if (type === 'string') {
    return true
  } else if (type === 'boolean') {
    return true
  } else if (type === 'json') {
    return isJson(val)
  }*/
  switch (type) {
    case 'timestamp':
    case 'string':
    case 'boolean':
      return true
    case 'number':
      return isFloatNumber(val)
    case 'json':
      return isJson(val)
    default:
      return false
  }
}

// 禁用日/时/分/秒(之前且不包括当前) el-date-picker使用
/*
:disabled-date=" (time) => disableDayHourMinuteSecond('day', time)  "
:disabled-hours="() => disableDayHourMinuteSecond('hours')"
:disabled-minutes="() => disableDayHourMinuteSecond('minutes')"
:disabled-seconds="() => disableDayHourMinuteSecond(seconds)"
time = new Date() startTime = 开始时间(默认今天) endTime = 结束时间(默认没有)
*/
export function disableDayHourMinuteSecond(
  type = 'day',
  time,
  startTime = Date.now(),
  endTime = false,
) {
  let result = type === 'day' ? false : []
  const len = type === 'hours' ? 24 : 60
  const typeFn = {
    day() {
      // 禁用之前且不包含今天的日期
      result =
        time.getTime() < +dayjs(startTime) - 24 * 60 * 60 * 1000 ||
        (endTime ? time.getTime() > +dayjs(endTime) : endTime)
    },
    /* hours() {
      for (let i = 0; i < 24; i++) {
        // 限制之前 < 之后 > ，下面同理
        if (new Date().getHours() <= i) continue
        result.push(i)
      }
    },
    minutes() {
      for (let i = 0; i < 60; i++) {
        if (new Date().getMinutes() <= i) continue
        result.push(i)
      }
    },
    seconds() {
      for (let i = 0; i < 60; i++) {
        if (new Date().getSeconds() <= i) continue
        result.push(i)
      }
    },*/
    uncertain() {
      for (let i = 0; i < len; i++) {
        if (type === 'hours' && new Date().getHours() > i) {
          result.push(i)
        }
        if (type === 'minutes' && new Date().getMinutes() > i) {
          result.push(i)
        }
        if (type === 'seconds' && new Date().getSeconds() > i) {
          result.push(i)
        }
      }
    },
  }
  if (typeFn[type]) typeFn[type]()
  else typeFn.uncertain()
  return result
}
/**
 * el-form表单自动滚动到错误的校验框
 * @param {*} el ref或dom元素
 * @param {string} [scrollOption={
 *     behavior: 'smooth',
 *     block: 'center'
 *   }] 滚动参数
 */
export function scrollToError(
  el,
  scrollOption = {
    behavior: 'smooth',
    block: 'center',
  },
) {
  nextTick(() => {
    let isError = el.$el || el
    isError = isError.getElementsByClassName('is-error')
    isError[0].scrollIntoView(scrollOption)
  })
}

// 检测过滤条件中是否有值为空
export const validateFilterItem = (item) => {
  if (
    !Array.isArray(item.prop) ||
    item.prop.length === 0 ||
    !item.prop?.[0]?.key
  ) {
    return false
  }
  if (!item?.relation?.key) {
    return false
  }
  let isHvAndNV = ['HV', 'NV'].includes(item.relation.key)
  if (!isHvAndNV && !item.val) {
    return false
  }
  if (Array.isArray(item.val) && item.val.length === 0) {
    return false
  }
  const tmp = {
    property: {
      name: item.prop[0].name,
      key: item.prop[0].key,
      type: item.prop[0].type,
    },
    operation: {
      name: item.relation.name,
      key: item.relation.key,
    },
    value: Array.isArray(item.val) ? item.val : isHvAndNV ? [] : [item.val],
  }
  if (item?.prop?.[1]) {
    tmp['tag'] = {
      userTag: item.prop[1].key,
      name: item.prop[1].name,
      tgId: item.prop[1].tagId,
    }
  }
  return tmp
}
