<script setup lang="ts">
import { createError } from 'h3'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import { useToast } from 'vue-toastification'
import { FetchError } from 'ohmyfetch'
import { useI18n } from 'vue-i18n'
import { useApi } from '~~/composables/useApi'
import { useDayjs } from '~~/composables/useDayjs'
import type { Response } from '~~/@types/api'
import { useLoaderStore } from '~~/stores/loader'
import type { Place } from '~~/@types/city'
import type { MovieSimple } from '~~/@types/movie'
import type { MovieSession } from '~~/@types/session'
import '@splidejs/vue-splide/css'
import 'leaflet/dist/leaflet.css'

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const loaderStore = useLoaderStore()

const { data: placeData, error } = await useAsyncData<Response<Place>>(`place_${route.params.id}`, () => useApi(`place/${route.params.id}`))

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response?.status === 404)
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found'
    })

  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error'
  })
}

const place: Place = placeData.value?.data as Place

const sessions = ref<MovieSimple[]>([])
const sessionsSection = ref<HTMLElement | null>(null)
const currentDay = ref<string>(useDayjs()().format('YYYY-MM-DD'))

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

const { data: sessionsData } = useLazyAsyncData<Response<MovieSimple[]>>(`place_${route.params.id}_date_${currentDay.value}_sessions`, () => useApi(`place/${route.params.id}/sessions?date=${currentDay.value}`))
if (sessionsData.value)
  sessions.value = sessionsData.value.data as MovieSimple[]
watch(sessionsData, (newValue: any) => {
  sessions.value = newValue.data as MovieSimple[]
})

const getSessions = async (date: string) => {
  const { data: sessionsData, error } = await useAsyncData<Response<MovieSimple[]>>(`place_${route.params.id}_date_${date}_sessions`, () => useApi(`place/${route.params.id}/sessions?date=${date}`))

  if (error.value) {
    const err: FetchError = error.value as FetchError
    if (err.response?.status !== 404) {
      toast.error(t('errors.sww'))
      Promise.reject(new Error('not found'))
    }
  } else {
    sessions.value = sessionsData.value?.data as MovieSimple[]
  }

  Promise.resolve()
}

const changeSessionsDay = async (day: string) => {
  loaderStore.setLoading(true)

  currentDay.value = day
  await getSessions(day)

  loaderStore.setLoading(false)
}

const onSelectSession = (session: MovieSession) => {
  navigateTo({
    path: '/choose_seat',
    query: {
      sessionId: session.ID
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
        <div class="w-full h-full bg-cover bg-center" style="background-image: url('/assets/images/place.jpg')"></div>
      </div>

      <div class="container max-w-screen-xl px-8 h-72 flex justify-between items-center absolute">
        <div class="h-full p-8 flex-1 flex flex-col justify-end items-start">
          <div class="mb-6">
            <h3 class="text-white text-4xl font-bold">{{ place.Name }}</h3>
            <span class="text-white text-sm font-light">{{ place.Address }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="place.Latitude && place.Longitude" class="w-full max-w-screen-xl mx-auto px-8 pt-16">
      <h3 class="text-xl font-bold p-6 text-cod-gray-800 dark:text-cod-gray-50 bg-white dark:bg-cod-gray-850 shadow">
        <font-awesome-icon icon="location-dot" />
        {{ $t('place.location') }}
      </h3>

      <client-only>
        <div class="flex h-64">
          <l-map
            ref="map"
            :zoom="15"
            :center="[place.Latitude, place.Longitude]"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            ></l-tile-layer>

            <l-marker :lat-lng="[place.Latitude, place.Longitude]"></l-marker>
          </l-map>
        </div>
      </client-only>
    </div>

    <div
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
        <div v-for="movie in sessions" :key="movie.ID" class="flex flex-row gap-4 px-8 py-4">
          <div class="flex flex-col w-1/4 space-y-2">
            <img class="w-24 rounded-lg aspect-[2/3]" :src="`https://image.tmdb.org/t/p/w500/${movie.PosterPath}`" :alt="movie.Title">
            <span class="break-words font-semibold text-cod-gray-700 dark:text-cod-gray-50">
              {{ movie.Title }}
            </span>
          </div>
          <div class="flex-1 flex-col flex gap-4 text-cod-gray-900 dark:text-cod-gray-50 divide-y-2 divide-cod-gray-50 dark:divide-cod-gray-900">
            <div
              v-for="theater in movie.Theaters"
              :key="theater.ID"
              class="flex pt-4 items-center"
            >
              <div class="flex-1 flex items-center underline">
                {{ theater.Name }}
              </div>
              <div class="flex gap-2">
                <button
                  v-for="session in theater.Sessions"
                  :key="session.ID"
                  class="p-2 border border-transparent text-sm font-medium rounded text-cod-gray-900 bg-ywllow hover:bg-yellow-300 focus:outline-none"
                  @click.prevent="onSelectSession(session)"
                >
                  {{ session.Name }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="sessions.length === 0" class="flex justify-center p-4 bg-yellow-100 text-cod-gray-600">
          {{ $t('errors.session.noSession') }}
        </div>
      </div>
    </div>
  </div>
</template>
