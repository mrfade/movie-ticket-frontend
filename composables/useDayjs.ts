import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/tr'

const locale = useStorage('locale', 'tr')

const useDayjs = () => {
  dayjs.locale(locale.value)
  dayjs.extend(relativeTime)
  return dayjs
}

export {
  useDayjs
}
