import dayjs from 'dayjs'
import 'dayjs/locale/tr'

const useDayjs = () => {
  dayjs.locale('tr')
  return dayjs
}

export {
  useDayjs
}
