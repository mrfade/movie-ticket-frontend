<script setup lang="ts">
import { createError } from 'h3'
import { FetchError } from 'ohmyfetch'
import { useI18n } from 'vue-i18n'
import { useApi } from '~~/composables/useApi'
import type { Response } from '~~/@types/api'
import type { Person, Movie } from '~~/@types/movie'

const { t } = useI18n()
const route = useRoute()

const { data, error } = await useAsyncData<Response<Person>>(`person_${route.params.slug}`, () => useApi(`/person/${route.params.slug}`))

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response?.status === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found'
    })
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error'
  })
}

const person: Person = data.value?.data as Person

const movies = ref<Movie[]>([])
const { data: moviesData, pending: moviesPending } = useLazyAsyncData<Response<Movie[]>>(`person_${route.params.slug}_movies`, () => useApi(`person/${route.params.slug}/movies`))
if (moviesData.value)
  movies.value = moviesData.value?.data as Movie[]

watch(moviesData, (newValue: any) => {
  movies.value = newValue.data as Movie[]
})

const gender = computed(() => {
  if (person.Gender === 1) return t('gender.female')
  if (person.Gender === 2) return t('gender.male')
  return t('gender.other')
})
</script>

<template>
  <div class="w-full">
    <div class="w-full max-w-screen-xl mx-auto px-8 py-16">
      <div class="grid grid-cols-4 gap-8">
        <div class="col-span-4 lg:col-span-1 bg-cod-gray-100 dark:bg-cod-gray-800">
          <img
            :src="`https://image.tmdb.org/t/p/w500/${person.ProfilePath}`"
            :alt="person.Name"
            class="mx-auto"
          >
          <div class="flex flex-col p-4 space-y-4">
            <h3 class="font-bold text-xl text-cod-gray-900 dark:text-cod-gray-100">{{ $t('person.personalInfo') }}</h3>
            <div v-if="person.Birthday" class="text-sm space-y-2">
              <div class="font-semibold text-cod-gray-800 dark:text-cod-gray-300">{{ $t('person.birthday') }}:</div>
              <span class="font-light text-cod-gray-600 dark:text-cod-gray-100">{{ useDayjs()(person.Birthday).format('DD.MM.YYYY') }} ({{ useDayjs()(person.Birthday).fromNow(true) }} yaşında)</span>
            </div>
            <div v-if="person.PlaceOfBirth" class="text-sm space-y-2">
              <div class="font-semibold text-cod-gray-800 dark:text-cod-gray-300">{{ $t('person.placeOfBirth') }}:</div>
              <span class="font-light text-cod-gray-600 dark:text-cod-gray-100">{{ person.PlaceOfBirth }}</span>
            </div>
            <div class="text-sm space-y-2">
              <div class="font-semibold text-cod-gray-800 dark:text-cod-gray-300">{{ $t('person.gender') }}:</div>
              <span class="font-light text-cod-gray-600 dark:text-cod-gray-100">{{ gender }}</span>
            </div>
          </div>
        </div>
        <div class="col-span-4 lg:col-span-3 space-y-4">
          <h3 class="text-3xl font-medium text-cod-gray-800 dark:text-cod-gray-200 border-b-2 border-cod-gray-200 dark:border-cod-gray-800">
            {{ person.Name }}
          </h3>
          <p v-if="person.Biography" class="text-justify text-cod-gray-600 dark:text-cod-gray-400">
            {{ person.Biography }}
          </p>
          <p v-else class="text-justify text-cod-gray-600 dark:text-cod-gray-400">
            {{ $t('person.noBiography') }}
          </p>
        </div>
      </div>

      <MovieShelf>
        <template #title>
          <h3 class="text-2xl font-medium mb-4 dark:text-white">{{ $t('person.knownFor') }}</h3>
        </template>

        <MovieSingle
          v-for="movie in movies"
          :key="movie.ID"
          :movie="movie"
        />

        <template v-if="moviesPending">
          <MovieSkeleton v-for="i in [...Array(6).keys()]" :key="`sf-${i}`" />
        </template>
      </MovieShelf>
    </div>
  </div>
</template>
