<script setup lang="ts">
import JsBarcode from 'jsbarcode'
import { useDayjs } from '~~/composables/useDayjs'
import { useCurrencyFormat } from '~~/composables/useCurrencyFormat'
import type { Ticket } from '~~/@types/ticket'

onMounted(() => {
  const barcodes = document.querySelectorAll('.barcode')

  barcodes.forEach((element: Element) => {
    const elem = element as HTMLElement
    JsBarcode(elem, elem.dataset.barcode || '', {
      width: 2,
      height: 40,
      margin: 4,
      lineColor: '#121212',
      background: '#f6f6f6'
    })
  })
})

defineProps<{
  ticket: Ticket
}>()
</script>

<template>
  <div class="flex relative rounded-lg bg-cover bg-[center_top]" :style="`background-image: url('https://image.tmdb.org/t/p/w780/${ticket.Session?.Movie?.BackdropPath}')`">
    <div class="w-full h-full rounded-lg absolute bg-black bg-opacity-80"></div>
    <div class="flex w-full flex-row z-10">
      <div class="flex flex-1 flex-col p-8">
        <h3 class="text-xl text-white font-semibold">{{ ticket.Session?.Movie?.Title }}</h3>
        <span class="text-xs text-cod-gray-200">
          <font-awesome-icon icon="location-dot" class="text-red-600" />
          {{ ticket.Session?.Theater?.Place?.Name }}
        </span>
        <div class="flex flex-col gap-4 mt-4">
          <div class="flex flex-row space-x-4 divide-x-2 divide-cod-gray-800">
            <div class="flex flex-col gap-2">
              <font-awesome-icon icon="calendar" class="text-xl text-cod-gray-400" />
              <span class="text-sm font-medium text-white">{{ useDayjs()(ticket.Session?.ShowTime).format('DD.MM') }}</span>
            </div>

            <div class="flex flex-col gap-2 pl-4">
              <font-awesome-icon icon="clock" class="text-xl text-cod-gray-400" />
              <span class="text-sm font-medium text-white">{{ useDayjs()(ticket.Session?.ShowTime).format('HH:mm') }}</span>
            </div>

            <div class="flex flex-col gap-2 pl-4">
              <font-awesome-icon icon="tag" class="text-xl text-cod-gray-400" />
              <span class="text-sm font-medium text-white">{{ useCurrencyFormat(ticket.TotalPrice) }}</span>
            </div>
          </div>

          <div class="flex flex-row space-x-4 divide-x-2 divide-cod-gray-800">
            <div class="flex flex-col items-center gap-2">
              <span class="text-sm font-medium text-cod-gray-100">{{ $t('ticket.theather') }}</span>
              <span class="text-lg font-bold text-white">{{ ticket.Session?.Theater?.Name.replace('Salon ', '') }}</span>
            </div>

            <div class="flex flex-col items-center gap-2 pl-4">
              <span class="text-sm font-medium text-cod-gray-100">{{ $t('ticket.seatsU') }}</span>
              <span class="text-lg font-bold text-white">{{ ticket.Seats.map((seat) => seat.Name).join(', ') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex bg-white rounded-r-lg box-border p-2 barcode-box">
        <div class="flex h-64 w-20 overflow-hidden">
          <div class="rotate-cls">
            <svg class="barcode mt-5" :data-barcode="Math.floor(Math.random() * 99999999999) + 10000000000"></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.rotate-cls {
  /* transform-origin: top left; */
  /* transform: rotate(-90deg) translate(-100%); */
  transform: rotate(-90deg);
  /* margin-top: -50%; */
  white-space: nowrap;
}
</style>
