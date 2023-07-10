<script setup lang="ts">
import type { Movie } from '~~/@types/movie'

defineProps<{
  movie: Movie
}>()
</script>

<template>
  <nuxt-link :to="`/detail/${movie.Slug}`">
    <div class="flex flex-col items-center rounded-lg transition hover:scale-105">
      <img class="w-full rounded-lg aspect-[2/3]" :src="`https://image.tmdb.org/t/p/w500/${movie.PosterPath}`" :alt="movie.Title">
      <h5 class="p-2 text-center font-medium text-gray-900 dark:text-white">{{ movie.Title }}</h5>
    </div>
  </nuxt-link>
</template>
