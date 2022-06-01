<script setup lang="ts">
import shuffle from 'lodash.shuffle'
import { useApi } from '~~/composables/useApi'
import { ApiResponse } from '~~/@types/api'
import { Movie } from '~~/@types/movie'

const searchFocus = ref(false)

const onSearchFocus = () => {
  searchFocus.value = true
}
const onSearchBlur = () => {
  searchFocus.value = false
}

const { data } = await useAsyncData<ApiResponse<Movie[]>>('movies', () => useApi('movie'), {
  transform: (response) => {
    response.data = shuffle(response.data)
    return response
  }
})

const movies: Movie[] = data.value.data
const first6Movies: Movie[] = movies.slice(0, 6)

definePageMeta({
  layout: 'home'
})
</script>

<template>
  <div class="w-full space-y-24 mb-24">
    <div class="w-full h-[700px] relative flex justify-center items-center bg-gray-300">
      <div class="w-full h-full relative">
        <div class="w-full h-full absolute bg-black transition-opacity" :class="[searchFocus ? 'opacity-60' : 'opacity-20']"></div>
        <div class="w-full h-full bg-cover bg-[url('https://kdaidggt0f3v.merlincdn.net/Uploads/Slider/top-gun-maverick-202251812531_middle.jpg')]"></div>
      </div>

      <div class="lg:w-1/2 mx-auto flex flex-row drop-shadow absolute z-10">
        <input
          type="text"
          class="flex-1 border-none shadow-none rounded-l-full px-6 py-4 text-base focus:outline-none"
          :placeholder="$t('search')"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
        >
        <button class="text-black font-bold bg-white hover:bg-ywllow rounded-r-full px-6 py-4">
          {{ $t('search ticket') }}
        </button>
      </div>
    </div>

    <div class="w-full max-w-screen-xl mx-auto px-8 py-16">
      <h3 class="text-2xl font-medium mb-4 dark:text-white">Vizyondaki Filmler</h3>

      <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
        <MovieSingle
          v-for="smovie in first6Movies"
          :key="smovie.id"
          :movie="smovie"
        />
      </div>
    </div>
  </div>
</template>
