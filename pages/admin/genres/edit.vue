<script setup lang="ts">
import { Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { FetchError } from 'ohmyfetch'
import { ApiResponse } from '~~/@types/api'
import { apiOptions } from '~~/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import { Genre } from '~~/@types/movie'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loaderStore = useLoaderStore()
const genre: Ref<Genre> = ref<Genre>(null)

const { data, error } = await useFetch<ApiResponse<Genre>>(`/genre/${route.query.id}`, apiOptions())

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response.status === 404)
    toast.error(t('errors.genre.notFound'))
  else
    toast.error(t('errors.sww'))

  router.push('/admin/genres')
}

if (data)
  genre.value = data.value.data as Genre

const name: Ref<string> = ref<string>(genre.value.name)

const save = async (): Promise<string | void> => {
  loaderStore.setLoading(true)
  const { error } = await useFetch<ApiResponse<Genre>>('/genre', {
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
      toast.error(t('errors.genre.updateFailed'))
    else
      toast.error(t('errors.sww'))

    return Promise.reject(error.value)
  }

  toast.success(t('messages.genre.updated'))
  router.push('/admin/genres')

  return Promise.resolve()
}

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
</script>

<template>
  <div class="p-8">
    <admin-title>Genre Edit</admin-title>

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
          :label="t('genre.name')"
          required
        />
      </admin-edit-card-item>
    </admin-edit-card>
  </div>
</template>
