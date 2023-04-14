import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
export default function plugInSettings(app) {
  // 设置时区 https://github.com/moment/moment-timezone/blob/develop/data/packed/2022e.json
  // import tz from 'dayjs/plugin/timezone'
  // import utc from 'dayjs/plugin/utc'
  // dayjs.extend(utc)
  // dayjs.extend(tz)
  // dayjs.tz.setDefault('Asia/Colombo')
  dayjs.locale('zh-cn')
  // app.config.globalProperties.$dayjs = dayjs
}
