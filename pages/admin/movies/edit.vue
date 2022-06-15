<script setup lang="ts">
import { Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { FetchError } from 'ohmyfetch'
import { ApiResponse } from '~~/@types/api'
import { apiOptions } from '~~/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import { Movie } from '~~/@types/movie'
import { SelectBoxOption } from '~~/components/SelectBox.vue'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loaderStore = useLoaderStore()
const movie: Ref<Movie> = ref<Movie>(null)

const { data, error } = await useFetch<ApiResponse<Movie>>(`/movie/${route.query.id}`, {
  ...apiOptions()
})

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response.status === 404)
    toast.error(t('errors.place.notFound'))
  else
    toast.error(t('errors.sww'))

  router.push('/admin/movies')
}

if (data)
  movie.value = data.value.data as Movie

const statusses: SelectBoxOption[] = [
  {
    value: 'Rumored',
    label: t('movie.status.rumored')
  },
  {
    value: 'Planned',
    label: t('movie.status.planned')
  },
  {
    value: 'In Production',
    label: t('movie.status.inProduction')
  },
  {
    value: 'Post Production',
    label: t('movie.status.postProduction')
  },
  {
    value: 'Released',
    label: t('movie.status.released')
  },
  {
    value: 'Canceled',
    label: t('movie.status.canceled')
  }
]

const _title: Ref<string> = ref<string>(movie.value.title)
const originalTitle: Ref<string> = ref<string>(movie.value.originalTitle)
const releaseDate: Ref<string> = ref<string>(movie.value.releaseDate)
const duration: Ref<string> = ref<string>(movie.value.duration.toString())
const imdbId: Ref<string> = ref<string>(movie.value.imdbId)
const description: Ref<string> = ref<string>(movie.value.description)

const status: Ref<SelectBoxOption> = ref<SelectBoxOption>({
  value: movie.value.status,
  label: t(`movie.status.${movie.value.status.toLocaleLowerCase()}`)
})
const nowPlaying: Ref<SelectBoxOption> = ref<SelectBoxOption>({
  value: movie.value.nowPlaying ? '1' : '0',
  label: movie.value.nowPlaying ? 'Yes' : 'No'
})

const save = async (): Promise<string | void> => {
  loaderStore.setLoading(true)
  const { error } = await useFetch<ApiResponse<Movie>>('/movie', {
    ...apiOptions(),
    method: 'PUT',
    body: {
      id: route.query.id,
      title: _title.value,
      originalTitle: originalTitle.value,
      releaseDate: releaseDate.value,
      duration: parseInt(duration.value),
      imdbId: imdbId.value,
      description: description.value,
      status: status.value.value,
      nowPlaying: nowPlaying.value.value === '1'
    }
  })
  loaderStore.setLoading(false)

  if (error.value) {
    const err: FetchError = error.value as FetchError

    if (err.response.status === 400)
      toast.error(t('errors.movie.updateFailed'))
    else
      toast.error(t('errors.sww'))

    return Promise.reject(error.value)
  }

  toast.success(t('messages.movie.updated'))
  router.push('/admin/movies')

  return Promise.resolve()
}

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
</script>

<template>
  <div class="p-8">
    <admin-title>Movie Edit</admin-title>

    <admin-edit-card
      :buttons="[
        {
          text: t('save'),
          onClick: save
        }
      ]"
    >
      <admin-edit-card-item :sm-cols="6">
        <admin-input
          v-model="_title"
          :label="t('movie.title')"
          required
        />
      </admin-edit-card-item>

      <admin-edit-card-item :sm-cols="6">
        <admin-input
          v-model="originalTitle"
          :label="t('movie.originalTitle')"
          required
        />
      </admin-edit-card-item>

      <admin-edit-card-item :sm-cols="6">
        <admin-input
          v-model="releaseDate"
          :label="t('movie.releaseDate')"
          required
        />
      </admin-edit-card-item>

      <admin-edit-card-item>
        <admin-input
          v-model="duration"
          :label="t('movie.duration')"
          required
        />
      </admin-edit-card-item>

      <admin-edit-card-item>
        <admin-input
          v-model="imdbId"
          :label="t('movie.imdbId')"
          required
        />
      </admin-edit-card-item>

      <admin-edit-card-item>
        <select-box
          v-model="status"
          :label="t('movie.status')"
          :options="statusses"
          variant="gray"
        />
      </admin-edit-card-item>

      <admin-edit-card-item>
        <select-box
          v-model="nowPlaying"
          :label="t('movie.nowPlaying')"
          :options="[
            {
              value: '1',
              label: 'Yes'
            },
            {
              value: '0',
              label: 'No'
            }
          ]"
          variant="gray"
        />
      </admin-edit-card-item>

      <admin-edit-card-item :sm-cols="6">
        <admin-textarea
          v-model="description"
          :label="t('movie.description')"
          :rows="5"
          required
        />
      </admin-edit-card-item>
    </admin-edit-card>
  </div>
</template>
