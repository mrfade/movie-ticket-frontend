<script setup lang="ts">
import { Movie } from '~~/@types/movie'

defineProps<{
  movie: Movie
}>()
</script>

<template>
  <nuxt-link :to="`/detail/${movie.slug}`">
    <div class="flex flex-col items-center rounded-lg transition hover:scale-105">
      <img class="w-full rounded-lg aspect-[2/3]" :src="`https://image.tmdb.org/t/p/w500/${movie.posterPath}`" :alt="movie.title">
      <h5 class="p-2 text-center font-medium text-gray-900 dark:text-white">{{ movie.title }}</h5>
    </div>
  </nuxt-link>
</template>
