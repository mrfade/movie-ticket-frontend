<script setup lang="ts">
import { ComputedRef, Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { FetchError } from 'ohmyfetch'
import { ApiResponse } from '~~/@types/api'
import { apiOptions } from '~~/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import { City, Place } from '~~/@types/city'
import { useCityStore } from '~~/stores/city'
import { SelectBoxOption } from '~~/components/SelectBox.vue'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loaderStore = useLoaderStore()
const cityStore = useCityStore()
const place: Ref<Place> = ref<Place>(null)

const { data, error } = await useFetch<ApiResponse<Place>>(`/place/${route.query.id}`, {
  ...apiOptions()
})

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response.status === 404)
    toast.error(t('errors.place.notFound'))
  else
    toast.error(t('errors.sww'))

  router.push('/admin/places')
}

if (data)
  place.value = data.value.data as Place

const name: Ref<string> = ref<string>(place.value.name)

const save = async (): Promise<string | void> => {
  loaderStore.setLoading(true)
  const { error } = await useFetch<ApiResponse<Place>>('/place', {
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

    if (err.response.status === 400)
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
  value: cityStore.getCities.find(city => city.id === place.value.cityId).id.toString(),
  label: cityStore.getCities.find(city => city.id === place.value.cityId).name
})
const citiesOptions: ComputedRef<SelectBoxOption[]> = computed(() => {
  return cityStore.getCities.map((city: City) => {
    return {
      value: city.id.toString(),
      label: city.name
    } as SelectBoxOption
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
          :label="t('name')"
          required
        />
      </admin-edit-card-item>
      <admin-edit-card-item>
        <select-box
          v-model="currentCity"
          :label="t('city')"
          variant="gray"
          :options="citiesOptions"
          :select-min-width="250"
          disabled
        />
      </admin-edit-card-item>
    </admin-edit-card>
  </div>
</template>
