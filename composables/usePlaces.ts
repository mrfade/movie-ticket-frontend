import { Ref } from 'vue'
import { apiOptions } from './useApi'
import { ApiResponsePaged } from '~~/@types/api'
import { Place } from '~~/@types/city'

const places: Ref<Place[]> = ref<Place[]>([])

const fetchPlaces = async (cityId: number = 1): Promise<boolean> => {
  const { data } = await useFetch<ApiResponsePaged<Place[]>>('/place', {
    ...apiOptions(),
    params: {
      pageSize: 100,
      cityId
    }
  })

  if (data)
    places.value = data.value.data as Place[]

  return Promise.resolve(true)
}

export { places, fetchPlaces }
