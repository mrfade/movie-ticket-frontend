<script setup lang="ts">
import { ComputedRef, Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { ApiResponsePaged } from '~~/@types/api'
import { useLoaderStore } from '~~/stores/loader'
import { apiOptions } from '~~/composables/useApi'
import { TableRow } from '~~/components/Table.vue'
import { City, Place } from '~~/@types/city'
import { SelectBoxOption } from '~~/components/SelectBox.vue'
import { Theather } from '~~/@types/theather'
import { useCityStore } from '~~/stores/city'
import { fetchPlaces, places } from '~~/composables/usePlaces'

const { t } = useI18n()
const toast = useToast()
const loaderStore = useLoaderStore()
const cityStore = useCityStore()
const theathers: Ref<Theather[]> = ref<Theather[]>([])
const cities: Ref<City[]> = ref<City[]>([])

const currentCity: Ref<SelectBoxOption> = ref<SelectBoxOption>({
  value: '0',
  label: t('all')
})
const currentPlace: Ref<SelectBoxOption> = ref<SelectBoxOption>({
  value: '0',
  label: t('all')
})
const search: Ref<string> = ref<string>('')
const pageNumber: Ref<number> = ref<number>(0)
const totalPages: Ref<number> = ref<number>(0)
const loading: Ref<boolean> = ref<boolean>(false)

cities.value = cityStore.getCities as City[]

const fetchData = async (page: number = 1, search: string = '', placeId: number = 0): Promise<boolean> => {
  loading.value = true
  const { data, error } = await useFetch<ApiResponsePaged<Theather[]>>('/theather', {
    ...apiOptions(),
    params: {
      q: search,
      pageNumber: page,
      placeId
    }
  })
  loading.value = false

  if (error.value) {
    toast.error(t('errors.sww'))
    return Promise.reject(error.value)
  }

  if (data) {
    theathers.value = data.value.data as Theather[]

    pageNumber.value = data.value.pageNumber
    totalPages.value = data.value.totalPages
  }

  return Promise.resolve(true)
}

const changePage = async (page: number): Promise<boolean> => {
  await fetchData(page, search.value, parseInt(currentPlace.value?.value))
  return Promise.resolve(true)
}

watch(loading, (value: boolean) => {
  loaderStore.setLoading(value)
})

watch(search, async (value: string) => {
  if (value.length === 0)
    await fetchData(1, '', parseInt(currentPlace.value?.value))

  if (value.length < 3) return

  await fetchData(1, value, parseInt(currentPlace.value?.value))
})

watch(currentCity, async (value: SelectBoxOption) => {
  await fetchPlaces(parseInt(value.value))
  currentPlace.value = {
    value: '0',
    label: t('all')
  }
})

watch(currentPlace, async (value: SelectBoxOption) => {
  await fetchData(1, search.value, parseInt(value.value))
})

const citiesOptions: ComputedRef<SelectBoxOption[]> = computed(() => {
  const options = cities.value.map((city: City) => {
    return {
      value: city.id.toString(),
      label: city.name
    } as SelectBoxOption
  })

  options.unshift({
    value: '0',
    label: t('all')
  })

  return options
})

const placesOptions: ComputedRef<SelectBoxOption[]> = computed(() => {
  const options = places.value.map((place: Place) => {
    return {
      value: place.id.toString(),
      label: place.name
    } as SelectBoxOption
  })

  options.unshift({
    value: '0',
    label: t('all')
  })

  return options
})

const rows: ComputedRef<TableRow[]> = computed(() => {
  return theathers.value.map((theather: Theather) => {
    return {
      id: theather.id,
      col1: theather.name,
      col2: places.value.find(place => place.id === theather.placeId)?.name || '-'
    } as TableRow
  })
})

await fetchData()

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
</script>

<template>
  <div class="p-8">
    <admin-title>Theathers</admin-title>

    <div class="flex gap-8 my-4">
      <admin-input
        v-model="search"
        :label="t('search')"
      />

      <select-box
        v-model="currentCity"
        label="Filter by City"
        variant="gray"
        :options="citiesOptions"
        :select-min-width="250"
      />

      <select-box
        v-model="currentPlace"
        label="Filter by Place"
        variant="gray"
        :options="placesOptions"
        :select-min-width="350"
      />
    </div>

    <Table
      :columns="[
        'Name',
        'Place',
      ]"
      :rows="rows"
      show-id-column
    />

    <div class="flex justify-center mt-8">
      <pagination
        :page-number="pageNumber"
        :total-pages="totalPages"
        @page="changePage"
      />
    </div>
  </div>
</template>
