<script setup lang="ts">
import type { Cast } from '~~/@types/movie'

defineProps<{
  character: Cast
}>()
</script>

<template>
  <div class="flex flex-col items-center">
    <img class="mb-2 w-24 aspect-[2/3] rounded-lg shadow-lg" :src="`https://image.tmdb.org/t/p/w500/${character.Person.ProfilePath}`" :alt="character.Person.Name" />
    <h5 class="mb-1 text-xl text-center font-medium text-gray-900 dark:text-white">{{ character.Person.Name }}</h5>
    <span class="text-sm text-center text-gray-500 dark:text-cod-gray-300">{{ character.Role }}</span>
  </div>
</template>
