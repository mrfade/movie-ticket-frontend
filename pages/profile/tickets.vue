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

      <div class="flex justify-center mt-8">
        <pagination
          :page-number="pageNumber"
          :total-pages="totalPages"
          @page="fetchTickets"
        />
      </div>
    </div>
  </div>
</template>
