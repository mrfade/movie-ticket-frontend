<script setup lang="ts">
import { Paged } from '~~/@types/api'

const emit = defineEmits(['page'])

const changePage = (page: number) => {
  emit('page', page)
}

defineProps<{
  paged: Paged
}>()
</script>

<template>
  <nav aria-label="Page navigation example">
    <ul class="inline-flex items-center -space-x-px">
      <li>
        <a
          href="#"
          class="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          :class="{ disabled: paged.pageNumber === 1 }"
          @click.prevent="changePage(paged.pageNumber - 1)"
        >
          <span class="sr-only">Previous</span>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        </a>
      </li>

      <li v-for="i in 4" :key="`prev-${i}`">
        <a
          v-if="paged.pageNumber - 5 + i > 0"
          href="#"
          class="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          @click.prevent="changePage(paged.pageNumber - 5 + i)"
        >
          {{ paged.pageNumber - 5 + i }}
        </a>
      </li>

      <li>
        <a
          href="#"
          aria-current="page"
          class="z-10 py-2 px-3 leading-tight text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          @click.prevent=""
        >
          {{ paged.pageNumber }}
        </a>
      </li>

      <li v-for="i in 4" :key="`next-${i}`">
        <a
          v-if="paged.pageNumber + i <= paged.totalPages"
          href="#"
          class="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          @click.prevent="changePage(paged.pageNumber + i)"
        >
          {{ paged.pageNumber + i }}
        </a>
      </li>

      <li>
        <a
          href="#"
          class="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          :class="{ disabled: paged.pageNumber === paged.totalPages }"
          @click.prevent="changePage(paged.pageNumber + 1)"
        >
          <span class="sr-only">Next</span>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
        </a>
      </li>
    </ul>
  </nav>
</template>
