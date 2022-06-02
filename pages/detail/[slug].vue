<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { ClockIcon } from '@heroicons/vue/outline'
import { useApi } from '~~/composables/useApi'
import { ApiResponse } from '~~/@types/api'
import { Movie, Cast } from '~~/@types/movie'

const route = useRoute()

const { data: movieData, error } = await useAsyncData<ApiResponse<Movie>>(`movie_${route.params.slug}`, () => useApi(`movie/${route.params.slug}`))

if (error.value)
  throwError('not found')

const movie: Movie = movieData.value.data

const cast = ref<Cast[]>([])
const { data: castData, pending: castPending } = useLazyAsyncData<ApiResponse<Cast[]>>(`movie_${route.params.slug}_cast`, () => useApi(`movie/${route.params.slug}/cast`))
if (castData.value)
  cast.value = castData.value.data

watch(castData, (newValue) => {
  cast.value = newValue.data
})

const similarMovies = ref<Movie[]>([])
const { data: similarMoviesData, pending: similarMoviesPending } = useLazyAsyncData<ApiResponse<Movie[]>>(`movie_${route.params.slug}_similar_movies`, () => useApi(`movie/${route.params.slug}/similiar_movies`))
if (similarMoviesData.value)
  similarMovies.value = similarMoviesData.value.data

watch(similarMoviesData, (newValue) => {
  similarMovies.value = newValue.data
})

definePageMeta({
  layout: 'home'
})
</script>

<template>
  <div class="w-full">
    <div class="w-full h-[32em] flex justify-center items-end relative">
      <div class="w-full h-full relative">
        <div class="w-full h-full absolute bg-black bg-opacity-60"></div>
        <div class="w-full h-full bg-cover bg-[center_top]" :style="`background-image: url('https://image.tmdb.org/t/p/original/${movie.backdropPath}')`"></div>
      </div>

      <div class="container max-w-screen-xl px-8 h-72 flex justify-between items-center absolute">
        <img :src="`https://image.tmdb.org/t/p/w500/${movie.posterPath}`" alt="" class="w-32 sm:w-48 md:w-56 h-auto rounded-t-lg self-end">
        <div class="h-full p-8 flex-1 flex flex-col justify-end items-start">
          <div class="mb-6">
            <h3 class="text-white text-4xl font-bold">{{ movie.title }}</h3>
            <span class="text-white text-sm font-light">{{ movie.originalTitle }}</span>
          </div>
          <div class="text-white text-xs font-light mb-8 px-4 py-2 rounded bg-black bg-opacity-40">
            {{ movie.releaseDate }}
          </div>
          <div class="text-white text-sm flex items-center gap-1.5 mb-1">
            <ClientOnly><ClockIcon class="h-4 w-4" /></ClientOnly> {{ movie.duration }} dakika
          </div>
          <div class="text-white text-sm">
            {{ movie.genres?.map(genre => genre.genre.name).join(', ') }}
          </div>
        </div>
        <button class="button">Bilet Al</button>
      </div>
    </div>

    <div class="w-full max-w-screen-xl mx-auto px-8 py-16">
      <TabGroup>
        <TabList class="flex">
          <Tab v-slot="{ selected }" as="template">
            <button class="tab-btn" :class="{ selected }">
              Açıklama
            </button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button class="tab-btn" :class="{ selected }">
              Filmin Kadrosu
            </button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button class="tab-btn" :class="{ selected }">
              Fragman
            </button>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel class="tab-panel">
            {{ movie.description }}
          </TabPanel>
          <TabPanel class="tab-panel">
            <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
              <CastSingle
                v-for="character in cast"
                :key="character.id"
                :character="character"
              />

              <CastSkeleton v-if="castPending" />
              <CastSkeleton v-if="castPending" />
              <CastSkeleton v-if="castPending" />
              <CastSkeleton v-if="castPending" />
            </div>
          </TabPanel>
          <TabPanel class="tab-panel">
            xx
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>

    <MovieShelf>
      <template #title>
        <h3 class="text-2xl font-medium mb-4 dark:text-white">Benzer Filmler</h3>
      </template>

      <MovieSingle
        v-for="smovie in similarMovies"
        :key="smovie.id"
        :movie="smovie"
      />

      <MovieSkeleton v-if="similarMoviesPending" />
      <MovieSkeleton v-if="similarMoviesPending" />
      <MovieSkeleton v-if="similarMoviesPending" />
      <MovieSkeleton v-if="similarMoviesPending" />
      <MovieSkeleton v-if="similarMoviesPending" />
      <MovieSkeleton v-if="similarMoviesPending" />
    </MovieShelf>
  </div>
</template>

<style lang="scss" scoped>
.tab-btn {
  @apply rounded-t px-6 py-3 font-medium leading-5 focus:outline-none dark:text-white;

  &.selected {
    @apply bg-white dark:bg-white/5;
  }
}

.tab-panel {
  @apply bg-white p-6 focus:outline-none dark:bg-white/5 dark:text-white;

  p {
    @apply font-light;
  }
}
</style>
