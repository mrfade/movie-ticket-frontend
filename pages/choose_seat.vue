<script setup lang="ts">
import { createError } from 'h3'
import { Ref } from 'vue'
import { useApi } from '~~/composables/useApi'
import { useCurrencyFormat } from '~~/composables/useCurrencyFormat'
import { useDayjs } from '~~/composables/useDayjs'
import { usePaymentStore } from '~~/stores/payment'
import { ApiResponse } from '~~/@types/api'
import { Session } from '~~/@types/movie'
import { SeatPlan, Seat } from '~~/@types/theather'

const route = useRoute()
const sessionId = route.query.sessionId
const paymentStore = usePaymentStore()

if (!sessionId)
  throwError(
    createError({
      statusCode: 400,
      statusMessage: 'Bad Request'
    })
  )

const { data: sessionData, error } = await useAsyncData<ApiResponse<Session>>(`session_${sessionId}`, () => useApi(`session/${sessionId}`))

if (error.value)
  throwError(
    createError({
      statusCode: 404,
      statusMessage: 'Not Found'
    })
  )

const session: Session = sessionData.value.data
const seatPlan: SeatPlan = JSON.parse(session.theather.seatPlan)
const selectedSeats: Ref<Seat[]> = ref<Seat[]>([])

const basePrice = session.theather.prices.find(price => price.type === 1).price
const sessionDate = computed(() => useDayjs()(session.date).format('DD MMMM YYYY dddd HH:mm'))

// get selected seats from db
if (paymentStore.getSession?.id === session.id)
  selectedSeats.value = paymentStore.getSelectedSeats

// set session
paymentStore.setSession(session)

const getSeat = (id: number) => {
  return session.seats.find(seat => seat.id === id)
}

const isSelectedSeat = (id: number) => {
  return selectedSeats.value?.find(seat => seat.id === id)
}

const selectSeat = (id: number) => {
  if (selectedSeats.value.find(seat => seat.id === id)) {
    // remove seat
    selectedSeats.value = selectedSeats.value.filter(seat => seat.id !== id)

    // update selectedSeats
    paymentStore.setSelectedSeats(selectedSeats.value)

    return
  }

  const seat = getSeat(id)
  if (!seat || seat.available === false)
    return

  // default ticket price
  seat.type = 1
  selectedSeats.value.push(seat)

  // update selectedSeats
  paymentStore.setSelectedSeats(selectedSeats.value)
}

const totalPriceText = computed(() => useCurrencyFormat(selectedSeats.value.length * basePrice))

const priceTypeText = (type: number): string => {
  switch (type) {
    case 1:
      return 'Tam'
    case 2:
      return 'Öğrenci'
    default:
      return 'Tam'
  }
}

const seatPlanSeats = seatPlan.rows.map((row) => {
  return row.map((_seat) => {
    return {
      ..._seat,
      seat: getSeat(_seat.id)
    }
  })
})

const goPaymentPage = () => {
  if (!selectedSeats.value.length)
    return

  navigateTo('/payment')
}

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <div class="w-full">
    <div class="w-full h-auto lg:h-36 flex justify-center bg-cod-gray-800">
      <div class="container max-w-screen-xl box-border px-8 py-4 h-full flex flex-col lg:flex-row justify-between items-center">
        <div class="w-full h-28 lg:w-auto flex flex-row justify-center">
          <img :src="`https://image.tmdb.org/t/p/w500/${session.movie.posterPath}`" alt="" class="h-28 aspect-[2/3] rounded-lg">
          <div class="pl-4 lg:pl-8 flex flex-col justify-center">
            <h3 class="text-white text-2xl font-bold mb-2 lg:mb-4">{{ session.movie.title }}</h3>
            <div class="space-y-1">
              <div class="text-white text-sm">
                {{ session.theather.place.name }} - {{ session.theather.name }}
              </div>
              <div class="text-white text-sm">
                {{ sessionDate }}
              </div>
            </div>
          </div>
        </div>

        <!-- info card -->
        <div
          class="flex flex-col w-full lg:w-80 mt-4 bg-white dark:bg-cod-gray-900 divide-y divide-cod-gray-100 dark:divide-cod-gray-500 rounded-lg shadow-lg z-10"
          :class="selectedSeats.length > 0 ? 'lg:mt-48' : 'lg:mt-24'"
        >
          <div class="flex flex-col py-4 px-6 space-y-4">
            <div class="text-cod-gray-500 dark:text-cod-gray-200 uppercase text-xs font-bold">BİLET FİYATLARI</div>
            <div class="flex flex-row space-x-6">
              <div
                v-for="price in session.theather.prices"
                :key="price.id"
                class="flex flex-col justify-center items-center"
              >
                <div class="text-cod-gray-600 dark:text-cod-gray-100 font-bold">{{ useCurrencyFormat(price.price) }}</div>
                <div class="text-cod-gray-600 dark:text-cod-gray-300 text-xs px-2">{{ priceTypeText(price.type) }}</div>
              </div>
            </div>
          </div>

          <div v-if="selectedSeats.length > 0" class="flex flex-col py-2 px-4 space-y-2">
            <div class="text-cod-gray-900 dark:text-cod-gray-200 text-sm font-bold">Seçili Koltuklar</div>
            <div class="flex flex-row flex-wrap gap-2">
              <div
                v-for="selectedSeat in selectedSeats"
                :key="selectedSeat.id"
                class="w-8 h-8 text-xs flex justify-center items-center cursor-pointer font-medium text-cod-gray-800 bg-ywllow rounded-lg"
                @click="selectSeat(selectedSeat.id)"
              >
                {{ selectedSeat.name }}
              </div>
            </div>
          </div>

          <div v-if="selectedSeats.length > 0" class="flex py-3 px-4 space-x-2">
            <span class="text-cod-gray-900 dark:text-cod-gray-200 font-bold">Toplam: </span>
            <span class="text-cod-gray-900 dark:text-cod-gray-50">{{ totalPriceText }}</span>
          </div>

          <div v-if="selectedSeats.length === 0" class="flex justify-center items-center uppercase text-xl font-bold py-4 text-cod-gray-900 dark:text-cod-gray-50 bg-cod-gray-200 dark:bg-cod-gray-800 rounded-b-lg">
            KOLTUK SEÇİNİZ
          </div>
          <div v-else class="flex justify-center items-center uppercase text-lg font-bold py-4 cursor-pointer text-cod-gray-900 bg-ywllow rounded-b-lg" @click.prevent="goPaymentPage">
            ÖDEME YAP
          </div>
        </div>
      </div>
    </div>

    <div class="w-full max-w-screen-xl mx-auto px-8 py-16 flex flex-col items-center space-y-8">
      <!-- seat info grid -->
      <div class="grid grid-flow-col gap-x-4">
        <div class="flex justify-center items-center space-x-2">
          <div class="w-8 h-8 bg-ywllow rounded-lg"></div>
          <span class="text-cod-gray-900 dark:text-cod-gray-50">Seçili</span>
        </div>

        <div class="flex justify-center items-center space-x-2">
          <div class="w-8 h-8 bg-cod-gray-600 rounded-lg"></div>
          <span class="text-cod-gray-900 dark:text-cod-gray-50">Dolu</span>
        </div>

        <div class="flex justify-center items-center space-x-2">
          <div class="w-8 h-8 border-2 border-cod-gray-200 dark:border-cod-gray-400 rounded-lg"></div>
          <span class="text-cod-gray-900 dark:text-cod-gray-50">Boş</span>
        </div>
      </div>

      <!-- seats grid -->
      <div class="grid grid-flow-row space-y-2 max-w-full overflow-x-auto">
        <div v-for="(row, ri) in seatPlanSeats" :key="`row-${ri}`" class="grid grid-flow-col space-x-2">
          <!-- eslint-disable-next-line vue/no-v-for-template-key -->
          <template v-for="(seat, si) in row" :key="`seat-${ri}-${si}`">
            <!-- seat -->
            <div
              v-if="seat.type == 'seat'"
              class="w-10 h-10 text-sm lg:w-12 lg:text-base lg:h-12 flex justify-center items-center cursor-pointer font-medium rounded-lg"
              :class="[
                isSelectedSeat(seat.id) ? 'bg-ywllow text-cod-gray-900 border-ywllow dark:text-cod-gray-900 dark:border-ywllow' : 'border-cod-gray-200 dark:border-cod-gray-400',
                !seat.seat.available ? 'bg-cod-gray-600 text-cod-gray-200' : 'border-2 text-cod-gray-800 dark:text-cod-gray-200 hover:text-cod-gray-900 hover:dark:text-cod-gray-900 hover:bg-ywllow hover:border-ywllow hover:dark:border-ywllow'
              ]"
              @click="selectSeat(seat.id)"
            >
              {{ seat.seat.name }}
            </div>
            <!-- stage -->
            <div
              v-if="seat.type == 'stage'"
              class="h-16 w-1/3 mt-8 flex justify-center items-center text-xl font-bold uppercase text-cod-gray-500 dark:text-cod-gray-200 bg-cod-gray-100 dark:bg-cod-gray-600 rounded-lg"
              :class="{'justify-self-center': seat.position === 'center'}"
            >
              SAHNE
            </div>
            <!-- space -->
            <div v-if="seat.type == 'space-seat'" class="w-10 h-10 lg:w-12 lg:h-12"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
