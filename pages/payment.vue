<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { Ref } from 'vue'
// import { useApi } from '~~/composables/useApi'
import { useDayjs } from '~~/composables/useDayjs'
import { useCurrencyFormat } from '~~/composables/useCurrencyFormat'
import { usePaymentStore } from '~~/stores/payment'
import { Seat } from '~~/@types/theather'
import { Session } from '~~/@types/movie'

const toast = useToast()
const paymentStore = usePaymentStore()

if (!paymentStore.getSession) {
  toast.error('Session not found')
  navigateTo('/')
}

const session: Session = paymentStore.getSession
const selectedSeats: Ref<Seat[]> = ref<Seat[]>([])

// get fresh data
if (paymentStore.getSelectedSeats)
  selectedSeats.value = paymentStore.getSelectedSeats

const sessionDate = computed(() => useDayjs()(session.date).format('DD MMMM YYYY dddd HH:mm'))

// const basePrice = session.theather.prices.find(price => price.type === 1).price
const serviceFee = 3.00

const totalTicketPrice = computed(() => selectedSeats.value.reduce((acc, seat) => acc + session.theather.prices.find(price => price.type === seat.type)?.price, 0))
const totalServiceFee = computed(() => selectedSeats.value.length * serviceFee)

const totalTicketPriceText = computed(() => useCurrencyFormat(totalTicketPrice.value))
const totalServiceFeeText = computed(() => useCurrencyFormat(totalServiceFee.value))
const totalPriceText = computed(() => useCurrencyFormat(totalTicketPrice.value + totalServiceFee.value))

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
          <div class="order-2 col-span-3 lg:col-span-2 lg:order-1 space-y-8">
            <div class="flex flex-col bg-white dark:bg-cod-gray-800 p-4 rounded-lg shadow space-y-4">
              <div class="flex w-full">
                <h3 class="text-cod-gray-800 dark:text-cod-gray-200 font-bold">
                  Koltuk Bilgileri
                </h3>
              </div>

              <div class="grid grid-flow-row grid-cols-6 gap-4">
                <div
                  v-for="(seat, idx) in selectedSeats"
                  :key="seat.id"
                  class="col-span-6 sm:col-span-3 lg:col-span-2 flex flex-col gap-2"
                >
                  <label class="text-sm text-cod-gray-800 dark:text-cod-gray-200">Koltuk {{ idx + 1 }} ({{ seat.name }})</label>
                  <select
                    v-model="seat.type"
                    class="flex-1 bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option
                      v-for="price in session.theather.prices"
                      :key="price.id"
                      :value="price.type"
                    >
                      {{ price.type === 1 ? 'Tam' : 'Öğrenci' }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

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
                      {{ session.theather.place.name }} - {{ session.theather.name }}
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

            <div class="flex justify-center mt-4">
              <nuxt-link :to="`/choose_seat?sessionId=${session.id}`" class="underline text-cod-gray-400">Geri Dön</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
