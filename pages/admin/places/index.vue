<script setup lang="ts">
import { ComputedRef, Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import type { PagedResponse } from '~~/@types/api'
import { useLoaderStore } from '~~/stores/loader'
import { apiOptions } from '~~/composables/useApi'
import { TableRow } from '~~/components/Table.vue'
import type { City, Place } from '~~/@types/city'
import { SelectBoxOption } from '~~/components/SelectBox.vue'
import { useCityStore } from '~~/stores/city'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const loaderStore = useLoaderStore()
const cityStore = useCityStore()
const places: Ref<Place[]> = ref<Place[]>([])
const cities: Ref<City[]> = ref<City[]>([])

const currentCity: Ref<SelectBoxOption> = ref<SelectBoxOption>({
  value: '0',
  label: t('all')
})
const search: Ref<string> = ref<string>('')
const pageNumber: Ref<number> = ref<number>(0)
const totalPages: Ref<number> = ref<number>(0)
const loading: Ref<boolean> = ref<boolean>(false)

cities.value = cityStore.getCities as City[]

const fetchData = async (page: number = 1, search: string = '', cityId: number = 0): Promise<boolean> => {
  loading.value = true
  const { data, error } = await useFetch<PagedResponse<Place[]>>('/places', {
    ...apiOptions(),
    params: {
      q: search,
      pageNumber: page,
      cityId
    }
  })
  loading.value = false

  if (error.value) {
    toast.error(t('errors.sww'))
    return Promise.reject(error.value)
  }

  if (data) {
    places.value = data.value?.data as Place[]

    pageNumber.value = data.value?.pageNumber || 0
    totalPages.value = data.value?.totalPages || 0
  }

  return Promise.resolve(true)
}

const changePage = async (page: number): Promise<boolean> => {
  await fetchData(page, search.value, parseInt(currentCity.value?.value))
  return Promise.resolve(true)
}

watch(loading, (value: boolean) => {
  loaderStore.setLoading(value)
})

watch(search, async (value: string) => {
  if (value.length === 0)
    await fetchData(1, '', parseInt(currentCity.value?.value))

  if (value.length < 3) return

  await fetchData(1, value, parseInt(currentCity.value?.value))
})

watch(currentCity, async (value: SelectBoxOption) => {
  if (value.value === '0')
    await fetchData(1, search.value, 0)
  else
    await fetchData(pageNumber.value, search.value, parseInt(value.value))
})

const citiesOptions: ComputedRef<SelectBoxOption[]> = computed(() => {
  const options: SelectBoxOption[] = cities.value.map((city: City) => {
    return {
      value: city.ID.toString(),
      label: city.Name
    } as SelectBoxOption
  })

  options.unshift({
    value: '0',
    label: t('all')
  })

  return options
})

const rows: ComputedRef<TableRow[]> = computed(() => {
  return places.value.map((place: Place) => {
    return {
      id: place.ID,
      col1: place.Name,
      col2: cities.value.find(city => city.ID === place.CityId)?.Name || '-',
      actions: [
        {
          label: t('edit'),
          icon: 'edit',
          action: () => {
            router.push({
              name: 'admin-places-edit',
              query: {
                id: place.ID
              }
            })
          }
        },
        {
          label: t('delete'),
          icon: 'delete'
        }
      ]
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
    <admin-title>Places</admin-title>

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
    </div>

    <Table
      :columns="[
        'Name',
        'City',
      ]"
      :rows="rows"
      show-id-column
      show-actions-column
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
