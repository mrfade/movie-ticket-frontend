<script setup lang="ts">
import { createError } from 'h3'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import { ClockIcon } from '@heroicons/vue/outline'
import { useToast } from 'vue-toastification'
import { FetchError } from 'ohmyfetch'
import { useI18n } from 'vue-i18n'
import { useApi } from '~~/composables/useApi'
import { useDayjs } from '~~/composables/useDayjs'
import { ApiResponse } from '~~/@types/api'
import { Movie, Cast } from '~~/@types/movie'
import { useUserStore } from '~~/stores/user'
import { MovieSession, SessionPlace } from '~~/@types/session'
import { useCityStore } from '~~/stores/city'
import { City } from '~~/@types/city'
import '@splidejs/vue-splide/css'
import { useLoaderStore } from '~~/stores/loader'

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const userStore = useUserStore()
const cityStore = useCityStore()
const loaderStore = useLoaderStore()

const { data: movieData, error } = await useAsyncData<ApiResponse<Movie>>(`movie_${route.params.slug}`, () => useApi(`movie/${route.params.slug}`))

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

const movie: Movie = movieData.value.data

const cast = ref<Cast[]>([])
const { data: castData, pending: castPending } = useLazyAsyncData<ApiResponse<Cast[]>>(`movie_${route.params.slug}_cast`, () => useApi(`movie/${route.params.slug}/cast`))
if (castData.value)
  cast.value = castData.value.data

watch(castData, (newValue) => {
  cast.value = newValue.data
})

const similarMovies = ref<Movie[]>([])
const { data: similarMoviesData, pending: similarMoviesPending } = useLazyAsyncData<ApiResponse<Movie[]>>(`movie_${route.params.slug}_similar_movies`, () => useApi(`movie/${route.params.slug}/similar_movies`))
if (similarMoviesData.value)
  similarMovies.value = similarMoviesData.value.data

watch(similarMoviesData, (newValue) => {
  similarMovies.value = newValue.data
})

const sessionPlaces = ref<SessionPlace[]>([])
const openSessions = ref(false)
const sessionsSection = ref<HTMLElement | null>(null)
const sessionsPending = ref(false)
const currentDay = ref<string>(useDayjs()().format('YYYY-MM-DD'))

const getSessionPlaces = async (movieSlug: string, cityId: number, date: string) => {
  sessionsPending.value = true
  const { data: sessionPlacesData, error } = await useAsyncData<ApiResponse<SessionPlace[]>>(`movie_${movieSlug}_city_${cityId}_date_${date}_session_places`, () => useApi(`movie/${movieSlug}/sessions?city=${cityId}&date=${date}`))

  if (error.value) {
    const err: FetchError = error.value as FetchError
    if (err.response.status !== 404) {
      toast.error(t('errors.sww'))
      Promise.reject(new Error('not found'))
    }
  } else {
    sessionPlaces.value = sessionPlacesData.value.data
  }

  sessionsPending.value = false
  Promise.resolve()
}

const sessionDays = computed(() => {
  const days = []
  const today = useDayjs()()

  for (let i = 0; i < 7; i++) {
    const day = today.add(i, 'day')
    days.push({
      date: day.format('YYYY-MM-DD'),
      isToday: day.isSame(today, 'day'),
      isTomorrow: day.isSame(today.add(1, 'day'), 'day')
    })
  }

  return days
})

const onClickBuyTicket = async () => {
  if (!userStore.isAuthenticated) {
    toast.error(t('errors.payment.notLoggedIn'))
    navigateTo({
      path: '/login',
      query: {
        next: route.path
      }
    })
    return
  }

  const selectedCity: City = cityStore.getSelectedCity
  if (!selectedCity) {
    toast.error(t('errors.payment.noCity'))
    document.querySelector('#city-selector')?.scrollIntoView({ behavior: 'smooth' })
    return
  }

  await getSessionPlaces(route.params.slug as string, selectedCity.id, currentDay.value)
  openSessions.value = true

  nextTick(() => {
    sessionsSection.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

const changeSessionsDay = async (day: string) => {
  loaderStore.setLoading(true)

  currentDay.value = day
  await getSessionPlaces(route.params.slug as string, cityStore.getSelectedCity?.id, day)

  loaderStore.setLoading(false)
}

const onSelectSession = (session: MovieSession) => {
  navigateTo({
    path: '/choose_seat',
    query: {
      sessionId: session.id
    }
  })
}

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
          <div class="flex flex-row gap-4 mb-8">
            <div class="text-white text-xs font-light px-4 py-2 rounded bg-black bg-opacity-40">
              {{ useDayjs()(movie.releaseDate).format('D MMMM YYYY dddd') }}
            </div>
            <div v-if="movie.nowPlaying" class="text-white text-xs px-4 py-2 rounded-full bg-green-600">
              {{ $t('nowPlaying') }}
            </div>
          </div>
          <div class="flex-1 items-end space-y-2">
            <div v-if="movie.director" class="text-white text-sm">
              {{ $t('director') }}: {{ movie.director }}
            </div>
            <div v-if="cast.length > 0" class="text-white text-sm">
              {{ $t('actors') }}: {{ cast.slice(0,3).map(c => c.actor.name).join(', ') }}
            </div>
            <div class="text-white text-sm flex items-center gap-1.5">
              <ClientOnly><ClockIcon class="h-4 w-4" /></ClientOnly> {{ movie.duration }} {{ $t('minutes') }}
            </div>
            <div class="text-white text-sm">
              {{ movie.genres?.map(genre => genre.name).join(', ') }}
            </div>
          </div>
        </div>
        <button class="button items-center gap-x-2" @click.prevent="onClickBuyTicket">
          {{ $t('buyTicket') }}
          <MiniLoader v-if="sessionsPending" variant="light" />
        </button>
      </div>
    </div>

    <div class="w-full max-w-screen-xl mx-auto px-8 py-16">
      <TabGroup>
        <TabList class="flex">
          <Tab v-slot="{ selected }" as="template">
            <button class="tab-btn" :class="{ selected }">
              {{ $t('description') }}
            </button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button class="tab-btn" :class="{ selected }">
              {{ $t('movieCast') }}
            </button>
          </Tab>
          <Tab v-if="movie.trailerUrl" v-slot="{ selected }" as="template">
            <button class="tab-btn" :class="{ selected }">
              {{ $t('trailer') }}
            </button>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel class="tab-panel">
            {{ movie.description }}
          </TabPanel>
          <TabPanel class="tab-panel">
            <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
              <nuxt-link
                v-for="character in cast"
                :key="character.id"
                :to="`/actor/${character.actor.slug}`"
              >
                <CastSingle :character="character" />
              </nuxt-link>

              <CastSkeleton v-if="castPending" />
              <CastSkeleton v-if="castPending" />
              <CastSkeleton v-if="castPending" />
              <CastSkeleton v-if="castPending" />
            </div>
          </TabPanel>
          <TabPanel v-if="movie.trailerUrl" class="tab-panel">
            <client-only>
              <vue-plyr>
                <div data-plyr-provider="youtube" :data-plyr-embed-id="movie.trailerUrl"></div>
              </vue-plyr>
            </client-only>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>

    <div
      v-if="openSessions"
      ref="sessionsSection"
      class="w-full max-w-screen-xl mx-auto px-8 py-16 space-y-4"
    >
      <h3 class="text-xl font-bold p-6 text-cod-gray-800 dark:text-cod-gray-50 bg-white dark:bg-cod-gray-850 shadow">
        <font-awesome-icon icon="film" />
        {{ $t('sessionsAndTheatres') }}
      </h3>

      <client-only>
        <Splide
          :options="{
            perPage: 4,
            perMove: 1,
            pagination: false
          }"
          class="bg-white dark:bg-cod-gray-850"
        >
          <SplideSlide
            v-for="day in sessionDays"
            :key="day.date"
            class="flex flex-col gap-2 items-center justify-center p-4 cursor-pointer hover:bg-cod-gray-100 hover:dark:bg-cod-gray-800"
            :class="{ 'bg-cod-gray-100 dark:bg-cod-gray-800': day.date === currentDay }"
            @click.prevent="changeSessionsDay(day.date)"
          >
            <span v-if="day.isToday" class="font-bold text-sm dark:text-cod-gray-100">{{ $t('today') }}</span>
            <span v-if="day.isTomorrow" class="font-bold text-sm dark:text-cod-gray-100">{{ $t('tomorrow') }}</span>
            <span class="font-bold dark:text-cod-gray-100">{{ useDayjs()(day.date).format('D MMMM dddd') }}</span>
          </SplideSlide>
        </Splide>
      </client-only>

      <div class="flex flex-col space-y-1 bg-white dark:bg-cod-gray-850 shadow divide-y-2 divide-cod-gray-50 dark:divide-cod-gray-900">
        <div v-for="place in sessionPlaces" :key="place.id" class="flex flex-row gap-4 px-8 py-4">
          <div class="flex min-w-[33%] items-center font-semibold text-cod-gray-700 dark:text-cod-gray-50">
            <nuxt-link :to="`/place/${place.id}`">{{ place.name }}</nuxt-link>
          </div>
          <div class="flex-1 flex-col flex gap-4 text-cod-gray-900 dark:text-cod-gray-50 divide-y-2 divide-cod-gray-50 dark:divide-cod-gray-900">
            <div
              v-for="theather in place.theathers"
              :key="theather.id"
              class="flex pt-4 items-center"
            >
              <div class="flex-1 flex items-center underline">
                {{ theather.name }}
              </div>
              <div class="flex gap-2">
                <button
                  v-for="session in theather.sessions"
                  :key="session.id"
                  class="p-2 border border-transparent text-sm font-medium rounded text-cod-gray-900 bg-ywllow hover:bg-yellow-300 focus:outline-none"
                  @click.prevent="onSelectSession(session)"
                >
                  {{ session.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="sessionPlaces.length === 0" class="flex justify-center p-4 bg-yellow-100 text-cod-gray-600">
          {{ $t('errors.session.noSession') }}
        </div>
      </div>
    </div>

    <MovieShelf>
      <template #title>
        <h3 class="text-2xl font-medium mb-4 dark:text-white">{{ $t('similarMovies') }}</h3>
      </template>

      <MovieSingle
        v-for="smovie in similarMovies"
        :key="smovie.id"
        :movie="smovie"
      />

      <template v-if="similarMoviesPending">
        <MovieSkeleton v-for="i in [...Array(6).keys()]" :key="`sf-${i}`" />
      </template>
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
