<script setup lang="ts">
import { Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { FetchError } from 'ohmyfetch'
import { ApiResponse } from '~~/@types/api'
import { apiOptions } from '~~/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import { Actor } from '~~/@types/movie'
import { SelectBoxOption } from '~~/components/SelectBox.vue'
import { useDayjs } from '~~/composables/useDayjs'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loaderStore = useLoaderStore()
const actor: Ref<Actor> = ref<Actor>(null)

const { data, error } = await useFetch<ApiResponse<Actor>>(`/actor/${route.query.id}`, apiOptions())

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response.status === 404)
    toast.error(t('errors.actor.notFound'))
  else
    toast.error(t('errors.sww'))

  router.push('/admin/actors')
}

if (data)
  actor.value = data.value.data as Actor

const genders: SelectBoxOption[] = [
  {
    value: '0',
    label: t('gender.other')
  },
  {
    value: '1',
    label: t('gender.female')
  },
  {
    value: '2',
    label: t('gender.male')
  },
  {
    value: '3',
    label: t('gender.other')
  }
]

const name: Ref<string> = ref<string>(actor.value.name)
const birthday: Ref<string> = ref<string>(actor.value.birthday ? useDayjs()(actor.value.birthday).format('YYYY-MM-DD') : '')
const placeOfBirth: Ref<string> = ref<string>(actor.value.placeOfBirth)
const imdbId: Ref<string> = ref<string>(actor.value.imdbId)
const biography: Ref<string> = ref<string>(actor.value.biography)
const profilePath: string = actor.value.profilePath
const gender: Ref<SelectBoxOption> = ref<SelectBoxOption>(genders.find(gender => gender.value === actor.value.gender.toString()))

const save = async (): Promise<string | void> => {
  loaderStore.setLoading(true)
  const { error } = await useFetch<ApiResponse<Actor>>('/actor', {
    ...apiOptions(),
    method: 'PUT',
    body: {
      id: route.query.id,
      name: name.value,
      birthday: useDayjs()(birthday.value).format('YYYY-MM-DD'),
      placeOfBirth: placeOfBirth.value,
      imdbId: imdbId.value,
      biography: biography.value,
      gender: parseInt(gender.value.value)
    }
  })
  loaderStore.setLoading(false)

  if (error.value) {
    const err: FetchError = error.value as FetchError

    if (err.response.status === 400)
      toast.error(t('errors.actor.updateFailed'))
    else
      toast.error(t('errors.sww'))

    return Promise.reject(error.value)
  }

  toast.success(t('messages.actor.updated'))
  router.push('/admin/actors')

  return Promise.resolve()
}

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
</script>

<template>
  <div class="p-8">
    <admin-title>Actor Edit</admin-title>

    <div class="grid grid-cols-3 gap-4">
      <admin-edit-card
        class="col-span-2"
        :buttons="[
          {
            text: t('save'),
            onClick: save
          }
        ]"
      >
        <admin-edit-card-item :sm-cols="6">
          <admin-input
            v-model="name"
            :label="t('actor.name')"
            required
          />
        </admin-edit-card-item>

        <admin-edit-card-item>
          <admin-input
            v-model="birthday"
            :label="t('actor.birthday')"
            required
          />
        </admin-edit-card-item>

        <admin-edit-card-item>
          <admin-input
            v-model="imdbId"
            :label="t('actor.imdbId')"
            required
          />
        </admin-edit-card-item>

        <admin-edit-card-item>
          <admin-input
            v-model="placeOfBirth"
            :label="t('actor.placeOfBirth')"
            required
          />
        </admin-edit-card-item>

        <admin-edit-card-item>
          <select-box
            v-model="gender"
            :label="$t('actor.gender')"
            :options="genders"
            variant="gray"
            required
          />
        </admin-edit-card-item>

        <admin-edit-card-item :sm-cols="6">
          <admin-textarea
            v-model="biography"
            :label="$t('actor.biography')"
            :rows="15"
          />
        </admin-edit-card-item>
      </admin-edit-card>

      <div class="col-span-1">
        <img :src="`https://image.tmdb.org/t/p/w500/${profilePath}`" :alt="name" />
      </div>
    </div>
  </div>
</template>
