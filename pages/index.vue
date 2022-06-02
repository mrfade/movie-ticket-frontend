<script setup lang="ts">
import shuffle from 'lodash.shuffle'
import { onClickOutside } from '@vueuse/core'
import { useApi } from '~~/composables/useApi'
import { ApiResponse } from '~~/@types/api'
import { Movie } from '~~/@types/movie'

const search = ref('')
const searchResult = ref<Movie[]>([])
const searchLoading = ref(false)

const searchContainer = ref(null)
const searchFocus = ref(false)

const onSearchFocus = () => {
  searchFocus.value = true
}
onClickOutside(searchContainer, () => {
  searchFocus.value = false
})

const { data } = await useAsyncData<ApiResponse<Movie[]>>('movies', () => useApi('movie'), {
  transform: (response) => {
    response.data = shuffle(response.data)
    return response
  }
})

const movies: Movie[] = data.value.data
const first6Movies: Movie[] = movies.slice(0, 6)

watch(search, async (newValue) => {
  if (newValue.length < 3) return

  searchLoading.value = true
  const { data: searchData } = await useApi<ApiResponse<Movie[]>>(`search/movie?q=${newValue}`)
  searchResult.value = searchData
  searchLoading.value = false
})

definePageMeta({
  layout: 'home'
})
</script>

<template>
  <div class="w-full space-y-24 mb-24">
    <div class="w-full h-[700px] relative flex justify-center items-center bg-gray-300">
      <div class="w-full h-full relative">
        <div class="w-full h-full absolute bg-black transition-opacity duration-400" :class="[searchFocus ? 'opacity-60' : 'opacity-20']"></div>
        <div class="w-full h-full bg-cover bg-[url('https://kdaidggt0f3v.merlincdn.net/Uploads/Slider/top-gun-maverick-202251812531_middle.jpg')]"></div>
      </div>

      <div ref="searchContainer" class="lg:w-1/2 mx-auto flex flex-col drop-shadow absolute z-10">
        <div class="flex flex-row">
          <div class="flex-1 flex relative">
            <input
              v-model="search"
              type="text"
              class="flex-1 border-none shadow-none px-6 py-4 text-base focus:outline-none transition-[border-radius] duration-400"
              :class="[searchFocus ? 'rounded-tl-[2rem]' : 'rounded-l-[2rem]']"
              :placeholder="$t('search')"
              @focus="onSearchFocus"
            >
            <div v-if="searchLoading" class="h-full flex items-center absolute right-0 top-0">
              <MiniLoader />
            </div>
          </div>
          <button
            class="text-black font-bold bg-white hover:bg-ywllow px-6 py-4 transition-[border-radius] duration-400"
            :class="[searchFocus ? 'rounded-tr-[2rem]' : 'rounded-r-[2rem]']"
          >
            {{ $t('search ticket') }}
          </button>
        </div>
        <div
          class="w-full p-4 bg-white rounded-b-[2rem] absolute top-14 transition-opacity duration-400"
          :class="[searchFocus ? 'border-t border-t-cod-gray-100 visible opacity-100' : 'invisible opacity-0']"
        >
          <div class="flex flex-col space-y-2 divide-y divide-cod-gray-100">
            <MovieSearchSingle v-for="movie in searchResult" :key="movie.id" :movie="movie" />
          </div>
        </div>
      </div>
    </div>

    <MovieShelf>
      <template #title>
        <h3 class="text-2xl font-medium mb-4 dark:text-white">Vizyondaki Filmler</h3>
      </template>

      <MovieSingle
        v-for="smovie in first6Movies"
        :key="smovie.id"
        :movie="smovie"
      />
    </MovieShelf>
  </div>
</template>
