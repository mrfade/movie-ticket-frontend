<script setup lang="ts">
import { Ref } from 'vue'
import { apiOptions } from '~~/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import { ApiResponsePaged } from '~~/@types/api'
import { Ticket } from '~~/@types/ticket'

const loaderStore = useLoaderStore()
const tickets: Ref<Ticket[]> = ref<Ticket[]>([])

const currentPage: Ref<number> = ref<number>(1)
const pageNumber: Ref<number> = ref<number>(0)
const totalPages: Ref<number> = ref<number>(0)

const { data, pending, refresh } = await useFetch<ApiResponsePaged<Ticket[]>>(() => `/me/tickets?pageNumber=${currentPage.value}&pageSize=5`, apiOptions())

const assignData = (data: ApiResponsePaged<Ticket[]>) => {
  tickets.value = data.data as Ticket[]
  pageNumber.value = data.pageNumber
  totalPages.value = data.totalPages
}

if (data.value)
  assignData(data.value)

watch(data, (newValue) => {
  assignData(newValue)
})

watch(pending, (value: boolean) => {
  loaderStore.setLoading(value)
})

const changePage = async (page: number) => {
  currentPage.value = page
  await nextTick()
  refresh()
}

// refresh tickets always when page is changed
onMounted(() => {
  refreshNuxtData()
})
</script>

<template>
  <div class="w-full flex justify-center">
    <div class="container max-w-screen-xl p-4 bg-white dark:bg-cod-gray-850 rounded-lg shadow">
      <h3 class="text-2xl font-bold text-cod-gray-600 dark:text-cod-gray-200">{{ $t('profile.myTicketsU') }}</h3>

      <div class="flex flex-col gap-4 mt-8">
        <ticket-single
          v-for="ticket in tickets"
          :key="ticket.id"
          :ticket="ticket"
        />
      </div>

      <div v-if="tickets.length === 0" class="flex p-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800" role="alert">
        <svg class="inline flex-shrink-0 mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
        <div>
          <span class="font-medium">{{ $t('info') }}!</span> {{ $t('ticket.youDontHaveTicketsYet') }}
        </div>
      </div>

      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <pagination
          :page-number="pageNumber"
          :total-pages="totalPages"
          @page="changePage"
        />
      </div>
    </div>
  </div>
</template>
