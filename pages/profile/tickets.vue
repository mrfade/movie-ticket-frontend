<script setup lang="ts">
import { FetchError } from 'ohmyfetch'
import { Ref } from 'vue'
import { apiOptions } from '~~/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import { ApiResponsePaged } from '~~/@types/api'
import { Ticket } from '~~/@types/ticket'

const loaderStore = useLoaderStore()
const tickets: Ref<Ticket[]> = ref<Ticket[]>([])

const pageNumber: Ref<number> = ref<number>(0)
const totalPages: Ref<number> = ref<number>(0)
const loading: Ref<boolean> = ref<boolean>(false)

const fetchTickets = async (page: number): Promise<boolean> => {
  loading.value = true
  const { data } = await useFetch<ApiResponsePaged<Ticket[]>>('/me/tickets', {
    ...apiOptions(),
    params: {
      pageNumber: page
    }
  })
    .catch((error: FetchError) => {
      return Promise.reject(error)
    })

  loading.value = false

  if (data) {
    tickets.value = data.value.data as Ticket[]

    pageNumber.value = data.value.pageNumber
    totalPages.value = data.value.totalPages
  }

  return Promise.resolve(true)
}

watch(loading, (value: boolean) => {
  loaderStore.setLoading(value)
})

await fetchTickets(1)

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
          @page="fetchTickets"
        />
      </div>
    </div>
  </div>
</template>
