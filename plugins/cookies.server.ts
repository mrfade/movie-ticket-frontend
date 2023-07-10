// @ts-expect-error
import cookieparser from 'cookieparser'
import { useCityStore } from '~~/stores/city'

export default defineNuxtPlugin(async () => {
  const cityStore = useCityStore()
  await cityStore.fetchCities()

  const cookies = useRequestHeaders(['cookie'])
  if (!cookies.cookie) return

  const parsed = cookieparser.parse(cookies.cookie)

  if (parsed.cityId)
    cityStore.setSelectedCityId(parseInt(parsed.cityId))
})
