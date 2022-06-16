<script setup lang="ts">
import { createError } from 'h3'
import { FetchError } from 'ohmyfetch'
import { useI18n } from 'vue-i18n'
import { ApiResponse } from '~~/@types/api'
import { Actor, Movie } from '~~/@types/movie'
import { useApi } from '~~/composables/useApi'

const { t } = useI18n()
const route = useRoute()

const { data, error } = await useAsyncData<ApiResponse<Actor>>(`actor_${route.params.slug}`, () => useApi(`/actor/${route.params.slug}`))

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response.status === 404)
    throwError(
      createError({
        statusCode: 404,
        statusMessage: 'Not Found'
      })
    )

  throwError(
    createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  )
}

const actor: Actor = data.value.data

const movies = ref<Movie[]>([])
const { data: moviesData, pending: moviesPending } = useLazyAsyncData<ApiResponse<Movie[]>>(`actor_${route.params.slug}_movies`, () => useApi(`actor/${route.params.slug}/movies`))
if (moviesData.value)
  movies.value = moviesData.value.data

watch(moviesData, (newValue) => {
  movies.value = newValue.data
})

const gender = computed(() => {
  if (actor.gender === 1) return t('gender.female')
  if (actor.gender === 2) return t('gender.male')
  return t('gender.other')
})
</script>

<template>
  <div class="w-full">
    <div class="w-full max-w-screen-xl mx-auto px-8 py-16">
      <div class="grid grid-cols-4 gap-8">
        <div class="col-span-4 lg:col-span-1 bg-cod-gray-100 dark:bg-cod-gray-800">
          <img
            :src="`https://image.tmdb.org/t/p/w500/${actor.profilePath}`"
            :alt="actor.name"
            class="mx-auto"
          >
          <div class="flex flex-col p-2 space-y-2">
            <div v-if="actor.birthday" class="text-sm space-x-2">
              <span class="text-cod-gray-800 dark:text-cod-gray-300">{{ $t('actor.birthday') }}:</span>
              <span class="text-cod-gray-600 dark:text-cod-gray-100">{{ useDayjs()(actor.birthday).format('DD.MM.YYYY') }}</span>
            </div>
            <div v-if="actor.placeOfBirth" class="text-sm space-x-2">
              <span class="text-cod-gray-800 dark:text-cod-gray-300">{{ $t('actor.placeOfBirth') }}:</span>
              <span class="text-cod-gray-600 dark:text-cod-gray-100">{{ actor.placeOfBirth }}</span>
            </div>
            <div class="text-sm space-x-2">
              <span class="text-cod-gray-800 dark:text-cod-gray-300">{{ $t('actor.gender') }}:</span>
              <span class="text-cod-gray-600 dark:text-cod-gray-100">{{ gender }}</span>
            </div>
          </div>
        </div>
        <div class="col-span-4 lg:col-span-3 space-y-4">
          <h3 class="text-3xl font-medium text-cod-gray-800 dark:text-cod-gray-200 border-b-2 border-cod-gray-200 dark:border-cod-gray-800">
            {{ actor.name }}
          </h3>
          <p v-if="actor.biography" class="text-justify text-cod-gray-600 dark:text-cod-gray-400">
            {{ actor.biography }}
          </p>
          <p v-else class="text-justify text-cod-gray-600 dark:text-cod-gray-400">
            {{ $t('actor.noBiography') }}
          </p>
        </div>
      </div>

      <MovieShelf>
        <template #title>
          <h3 class="text-2xl font-medium mb-4 dark:text-white">{{ $t('actor.knownFor') }}</h3>
        </template>

        <MovieSingle
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
        />

        <template v-if="moviesPending">
          <MovieSkeleton v-for="i in [...Array(6).keys()]" :key="`sf-${i}`" />
        </template>
      </MovieShelf>
    </div>
  </div>
</template>
