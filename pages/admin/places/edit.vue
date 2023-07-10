<script setup lang="ts">
import { ComputedRef, Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { FetchError } from 'ohmyfetch'
import type { Response } from '~~/@types/api'
import { apiOptions, useApi } from '~~/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import type { City, Place } from '~~/@types/city'
import { useCityStore } from '~~/stores/city'
import { SelectBoxOption } from '~~/components/SelectBox.vue'
import type { Theater } from '~~/@types/theater'
import { TableRow } from '~~/components/Table.vue'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loaderStore = useLoaderStore()
const cityStore = useCityStore()
const place: Ref<Place> = ref<Place>({} as Place)
const theaters: Ref<Theater[]> = ref<Theater[]>([])

const { data, error } = await useFetch<Response<Place>>(`/place/${route.query.id}`, {
  ...apiOptions()
})

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response?.status === 404)
    toast.error(t('errors.place.notFound'))
  else
    toast.error(t('errors.sww'))

  router.push('/admin/places')
}

if (data)
  place.value = data.value?.data as Place

const { data: theathersData } = useLazyAsyncData<Response<Theater[]>>(`admin_place_${route.query.id}_theaters`, () => useApi(`/place/${route.query.id}/theaters`))
if (theathersData.value)
  theaters.value = theathersData.value.data as Theater[]
watch(theathersData, (newValue: any) => {
  theaters.value = newValue.data as Theater[]
})

const name: Ref<string> = ref<string>(place.value.Name)

const save = async (): Promise<string | void> => {
  loaderStore.setLoading(true)
  const { error } = await useFetch<Response<Place>>('/place', {
    ...apiOptions(),
    method: 'PUT',
    body: {
      id: route.query.id,
      name: name.value
    }
  })
  loaderStore.setLoading(false)

  if (error.value) {
    const err: FetchError = error.value as FetchError

    if (err.response?.status === 400)
      toast.error(t('errors.place.updateFailed'))
    else
      toast.error(t('errors.sww'))

    return Promise.reject(error.value)
  }

  toast.success(t('messages.place.updated'))
  router.push('/admin/places')

  return Promise.resolve()
}

const currentCity: Ref<SelectBoxOption> = ref<SelectBoxOption>({
  value: cityStore.getCities.find(city => city.ID === place.value.CityId)?.ID.toString() ?? '0',
  label: cityStore.getCities.find(city => city.ID === place.value.CityId)?.Name ?? 'N/A'
})
const citiesOptions: ComputedRef<SelectBoxOption[]> = computed(() => {
  return cityStore.getCities.map((city: City) => {
    return {
      value: city.ID.toString(),
      label: city.Name
    } as SelectBoxOption
  })
})

const theatersRows: ComputedRef<TableRow[]> = computed(() => {
  return theaters.value.map((theater: Theater) => {
    return {
      id: theater.ID,
      col1: theater.Name,
      actions: [
        {
          label: t('show'),
          action: () => {
            router.push({
              name: 'admin-theaters-edit',
              query: {
                id: theater.ID
              }
            })
          }
        }
      ]
    }
  })
})

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
</script>

<template>
  <div class="p-8">
    <admin-title>Place Edit</admin-title>

    <admin-edit-card
      :buttons="[
        {
          text: t('save'),
          onClick: save
        }
      ]"
    >
      <admin-edit-card-item>
        <admin-input
          v-model="name"
          :label="t('place.name')"
          required
        />
      </admin-edit-card-item>
      <admin-edit-card-item>
        <select-box
          v-model="currentCity"
          :label="t('place.city')"
          variant="gray"
          :options="citiesOptions"
          :select-min-width="250"
          disabled
        />
      </admin-edit-card-item>
    </admin-edit-card>

    <h3 class="text-xl dark:text-gray-200 font-semibold mt-8 mb-2">{{ $t('place.theaters') }}</h3>
    <Table
      :columns="[
        'Name',
      ]"
      :rows="theatersRows"
      show-id-column
      show-actions-column
    />
  </div>
</template>
