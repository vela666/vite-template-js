import dayjs from 'dayjs'

export const equipmentStatusTypeList = [
  { type: 1, label: '草稿', css: 'test-status-draft' },
  { type: 2, label: '调试中', css: 'test-status-debug' },
  { type: 3, label: '运行中', css: 'test-status-run' },
  { type: 4, label: '已完成', css: 'test-status-finish' },
  { type: 8, label: '发布中', css: 'test-status-in_release' },
  { type: 10, label: '发布失败', css: 'test-status-release_error' }
]
export const equipmentStatusTypeMap = (type) => {
  return equipmentStatusTypeList.find((item) => +item.type === +type) ?? {}
}

export const testlayerStatusTypeList = [
  { type: 2, label: '启用' },
  { type: 1, label: '停用' }
]
export const testGroupAllocationList = {
  1: '平均分配',
  2: '自定义分配'
}

export const releaseMethodList = {
  1: '手动发布',
  2: '定时发布'
}

export const allowOperation = (row) => {
  let txt = !row.operateFlag ? '非本人创建无权限操作' : ''
  if (Reflect.has(row, 'deleteFlag') && !txt) {
    txt = !row.deleteFlag ? '此试验层拥有正在运行的试验，不可删除' : ''
  }
  return txt
}
// 返回天时分钟
const getDayHourMinute = (beginTime, endTime) => {
  const date1 = dayjs(beginTime)
  const date2 = dayjs(endTime)
  const diff = date2.diff(date1)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24
  const minutes = Math.floor(diff / (1000 * 60)) % 60
  return { days, hours, minutes }
}

// 试验已运行时长转换
export const timeConversion = (row, nowTime = new Date()) => {
  if (+row.status === 10) return '--'
  if (!row?.beginTime) return ''
  const { days, hours, minutes } = getDayHourMinute(
    row.beginTime,
    +row.stopFlag === 2 ? row.endTime : nowTime
  )
  // if (+row.stopFlag === 2) return `${days}天${hours}时${minutes}分`
  if (days >= row.dayNum) return `${row.dayNum}天`
  if (days < 0) return `0天0时0分`
  return `${days}天${hours}时${minutes}分`
}
