import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'

const locale = useStorage('locale', 'tr')

const useDayjs = () => {
  dayjs.locale(locale.value)
  return dayjs
}

export {
  useDayjs
}
