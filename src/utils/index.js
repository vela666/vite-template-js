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
