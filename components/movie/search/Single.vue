<script setup lang="ts">
import type { Movie } from '~~/@types/movie'

defineProps<{
  movie: Movie
}>()
</script>

<template>
  <nuxt-link :to="`/detail/${movie.Slug}`">
    <div class="flex items-center py-2 space-x-4">
      <span class="flex-1 text-base font-light text-cod-gray-900">{{ movie.Title }}</span>
      <span class="text-xs px-4 py-1 bg-ywllow text-cod-gray-900 rounded-full">sinema</span>
    </div>
  </nuxt-link>
</template>
