<script setup lang="ts">
import { Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { FetchError } from 'ohmyfetch'
import type { Response } from '~~/@types/api'
import { apiOptions } from '~~/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import type { Person } from '~~/@types/movie'
import { SelectBoxOption } from '~~/components/SelectBox.vue'
import { useDayjs } from '~~/composables/useDayjs'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loaderStore = useLoaderStore()
const person: Ref<Person> = ref<Person>({} as Person)

const { data, error } = await useFetch<Response<Person>>(`/person/${route.query.id}`, apiOptions())

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response?.status === 404)
    toast.error(t('errors.person.notFound'))
  else
    toast.error(t('errors.sww'))

  router.push('/admin/people')
}

if (data)
  person.value = data.value?.data as Person

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

const name: Ref<string> = ref<string>(person.value.Name)
const birthday: Ref<string> = ref<string>(person.value.Birthday ? useDayjs()(person.value.Birthday).format('YYYY-MM-DD') : '')
const placeOfBirth: Ref<string> = ref<string>(person.value.PlaceOfBirth)
const imdbId: Ref<string> = ref<string>(person.value.ImdbId)
const biography: Ref<string> = ref<string>(person.value.Biography)
const profilePath: string = person.value.ProfilePath
const gender: Ref<SelectBoxOption> = ref<SelectBoxOption>(genders.find(gender => gender.value === person.value.Gender.toString()) || genders[0])

const save = async (): Promise<string | void> => {
  loaderStore.setLoading(true)
  const { error } = await useFetch<Response<Person>>('/person', {
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

    if (err.response?.status === 400)
      toast.error(t('errors.person.updateFailed'))
    else
      toast.error(t('errors.sww'))

    return Promise.reject(error.value)
  }

  toast.success(t('messages.person.updated'))
  router.push('/admin/people')

  return Promise.resolve()
}

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
</script>

<template>
  <div class="p-8">
    <admin-title>Person Edit</admin-title>

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
            :label="t('person.name')"
            required
          />
        </admin-edit-card-item>

        <admin-edit-card-item>
          <admin-input
            v-model="birthday"
            :label="t('person.birthday')"
            required
          />
        </admin-edit-card-item>

        <admin-edit-card-item>
          <admin-input
            v-model="imdbId"
            :label="t('person.imdbId')"
            required
          />
        </admin-edit-card-item>

        <admin-edit-card-item>
          <admin-input
            v-model="placeOfBirth"
            :label="t('person.placeOfBirth')"
            required
          />
        </admin-edit-card-item>

        <admin-edit-card-item>
          <select-box
            v-model="gender"
            :label="$t('person.gender')"
            :options="genders"
            variant="gray"
            required
          />
        </admin-edit-card-item>

        <admin-edit-card-item :sm-cols="6">
          <admin-textarea
            v-model="biography"
            :label="$t('person.biography')"
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
