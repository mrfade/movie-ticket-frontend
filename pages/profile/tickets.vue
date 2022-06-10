<script setup lang="ts">
import { FetchError } from 'ohmyfetch'
import { useApi } from '~~/composables/useApi'
import { ApiResponse } from '~~/@types/api'
import { Ticket } from '~~/@types/ticket'

const { data: tickets } = await useApi<ApiResponse<Ticket[]>>('/me/tickets')
  .catch((error: FetchError) => {
    console.log(error)
  })
</script>

<template>
  <div class="w-full flex justify-center">
    <div class="container max-w-screen-xl p-4 bg-white dark:bg-cod-gray-850 rounded-lg shadow">
      <h3 class="text-2xl font-bold text-cod-gray-600 dark:text-cod-gray-200">BİLETLERİM</h3>

      <div class="flex flex-col gap-4 mt-8">
        <ticket-single
          v-for="ticket in tickets"
          :key="ticket.id"
          :ticket="ticket"
        />
      </div>
    </div>
  </div>
</template>
