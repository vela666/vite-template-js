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
