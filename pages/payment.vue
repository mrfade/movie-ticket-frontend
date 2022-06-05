<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import { useApi } from '~~/composables/useApi'
import { useDayjs } from '~~/composables/useDayjs'
import { useCurrencyFormat } from '~~/composables/useCurrencyFormat'
import { usePaymentStore } from '~~/stores/payment'
import { Seat } from '~~/@types/theather'
import { Session } from '~~/@types/movie'

const toast = useToast()
const paymentStore = usePaymentStore()

console.log(paymentStore.getSelectedSeats)
console.log(paymentStore.getSession)

if (!paymentStore.getSession) {
  toast.error('Session not found')
  navigateTo('/')
}

const session: Session = paymentStore.getSession
const selectedSeats: Seat[] = paymentStore.getSelectedSeats

const sessionDate = computed(() => useDayjs()(session.date).format('DD MMMM YYYY dddd HH:mm'))

// TODO: get price from session
const basePrice = 31.00
const serviceFee = 3.00

const totalTicketPriceText = computed(() => {
  const price = selectedSeats.length * basePrice
  return useCurrencyFormat(price)
})

const totalServiceFeeText = computed(() => {
  const price = selectedSeats.length * serviceFee
  return useCurrencyFormat(price)
})

const totalPriceText = computed(() => {
  // TODO: get price from session
  const price = selectedSeats.length * (basePrice + serviceFee)
  return useCurrencyFormat(price)
})

definePageMeta({
  middleware: ['auth'],
  layout: 'blank'
})
</script>

<template>
  <div class="w-full">
    <div class="w-full flex justify-center py-16">
      <div class="container max-w-screen-xl px-8">
        <div class="grid grid-cols-3 gap-8">
          <div class="order-2 col-span-3 lg:col-span-2 lg:order-1">
            <div class="flex flex-col bg-white dark:bg-cod-gray-800 p-4 rounded-lg shadow space-y-4">
              <div class="flex w-full">
                <h3 class="text-cod-gray-800 dark:text-cod-gray-200 font-bold">
                  Kart Bilgileri
                </h3>
              </div>

              <div class="flex flex-col w-full space-y-4">
                <div class="flex flex-col gap-1">
                  <label for="cardName" class="text-sm text-cod-gray-800 dark:text-cod-gray-200">Kart Üzerindeki İsim</label>
                  <input
                    id="cardName"
                    type="text"
                    class="input"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label for="cardNumber" class="text-sm text-cod-gray-800 dark:text-cod-gray-200">Kart Numarası</label>
                  <input
                    id="cardNumber"
                    type="text"
                    class="input"
                  />
                </div>
              </div>

              <div class="grid grid-flow-col grid-cols-4 w-full space-x-4">
                <div class="flex flex-col gap-1 col-span-3">
                  <label for="cardExp" class="text-sm text-cod-gray-800 dark:text-cod-gray-200">Son Kullanma Tarihi</label>
                  <input
                    id="cardExp"
                    type="text"
                    class="input"
                  />
                </div>

                <div class="flex flex-col gap-1 col-span-1">
                  <label for="cardCVC" class="text-sm text-cod-gray-800 dark:text-cod-gray-200">Güvenlik Kodu</label>
                  <input
                    id="cardCVC"
                    type="text"
                    class="input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="order-1 col-span-3 lg:col-span-1 lg:order-2">
            <div class="flex flex-col bg-white dark:bg-cod-gray-800 p-4 rounded-lg shadow divide-y divide-cod-gray-100 dark:divide-cod-gray-500 space-y-4">
              <div class="flex flex-row gap-4">
                <img
                  :src="`https://image.tmdb.org/t/p/w500/${session.movie.posterPath}`"
                  class="h-24 aspect-[2/3] rounded"
                >
                <div class="h-full flex-1 flex flex-col">
                  <h3 class="text-cod-gray-800 dark:text-cod-gray-50 text-lg font-bold mb-4">
                    {{ session.movie.title }}
                  </h3>
                  <div class="flex-1 space-y-1">
                    <div class="text-cod-gray-600 dark:text-cod-gray-50 text-sm">
                      {{ session.theather.name }}
                    </div>
                    <div class="text-cod-gray-600 dark:text-cod-gray-50 text-sm">
                      {{ sessionDate }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col pt-4 items-end">
                <div class="flex space-x-2">
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-200">Bilet Ücreti: </span>
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-50 font-bold">{{ totalTicketPriceText }}</span>
                </div>
                <div class="flex space-x-2">
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-200">Hizmet Ücreti: </span>
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-50 font-bold">{{ totalServiceFeeText }}</span>
                </div>
                <div class="flex space-x-2">
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-200">Toplam: </span>
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-50 font-bold">{{ totalPriceText }}</span>
                </div>
              </div>

              <div class="flex flex-col pt-4 items-center justify-center">
                <button class="w-full bg-ywllow text-cod-gray-800 tracking-wider font-bold py-4 px-4 rounded-lg">
                  ÖDEME YAP ({{ totalPriceText }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
