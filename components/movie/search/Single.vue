<script setup lang="ts">
import { Movie } from '~~/@types/movie'

defineProps<{
  movie: Movie
}>()
</script>

<template>
  <nuxt-link :to="`/detail/${movie.slug}`">
    <div class="flex items-center py-2 space-x-4">
      <span class="flex-1 text-base font-light text-cod-gray-900">{{ movie.title }}</span>
      <span class="text-xs px-4 py-1 bg-ywllow text-cod-gray-900 rounded-full">sinema</span>
    </div>
  </nuxt-link>
</template>
