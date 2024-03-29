<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { Ref } from 'vue'
// import { useApi } from '~~/composables/useApi'
import { useI18n } from 'vue-i18n'
import { useDayjs } from '~~/composables/useDayjs'
import { useCurrencyFormat } from '~~/composables/useCurrencyFormat'
import { usePaymentStore } from '~~/stores/payment'
import { useLoaderStore } from '~~/stores/loader'
import type { Seat } from '~~/@types/theater'
import type { Session } from '~~/@types/movie'
import type { Ticket } from '~~/@types/ticket'

const { t } = useI18n()
const toast = useToast()
const paymentStore = usePaymentStore()
const loaderStore = useLoaderStore()

if (!paymentStore.getSession) {
  toast.error(t('errors.session.notFound'))
  navigateTo('/')
}

const cardName: Ref<string> = ref<string>('')
const cardNumber: Ref<string> = ref<string>('')
const cardMonth: Ref<number> = ref<number>(useDayjs()().month() + 1)
const cardYear: Ref<number> = ref<number>(useDayjs()().year())
const cardCvc: Ref<number> = ref<number>(0)

const session: Session = paymentStore.getSession
const selectedSeats: Ref<Seat[]> = ref<Seat[]>([])

// get fresh data
if (paymentStore.getSelectedSeats)
  selectedSeats.value = paymentStore.getSelectedSeats

const sessionDate = computed(() => useDayjs()(session.ShowTime).format('DD MMMM YYYY dddd HH:mm'))

// const basePrice = session.theather.prices.find(price => price.type === 1).price
const serviceFee = 3.00

const totalTicketPrice = computed(() => selectedSeats.value.reduce((acc, seat) => acc + (session.Theater?.Prices?.find(price => price.Type === seat.Type)?.Price || 0), 0))
const totalServiceFee = computed(() => selectedSeats.value.length * serviceFee)

const totalTicketPriceText = computed(() => useCurrencyFormat(totalTicketPrice.value))
const totalServiceFeeText = computed(() => useCurrencyFormat(totalServiceFee.value))
const totalPriceText = computed(() => useCurrencyFormat(totalTicketPrice.value + totalServiceFee.value))

const paymentData = computed(() => {
  return {
    seats: selectedSeats.value,
    cardName: cardName.value,
    cardNumber: cardNumber.value,
    cardMonth: cardMonth.value,
    cardYear: cardYear.value,
    cardCvc: cardCvc.value
  }
})

const makePayment = async () => {
  if (!selectedSeats.value.length) {
    toast.error(t('errors.payment.pleaseSelectSeats'))
    return
  }

  if (!cardName.value) {
    toast.error(t('errors.payment.pleaseEnterCardName'))
    return
  }

  if (!cardNumber.value) {
    toast.error(t('errors.payment.pleaseEnterCardNumber'))
    return
  }

  if (!cardCvc.value) {
    toast.error(t('errors.payment.pleaseEnterCardCvc'))
    return
  }

  if (!cardMonth.value) {
    toast.error(t('errors.payment.pleaseEnterCardMonth'))
    return
  }

  if (!cardYear.value) {
    toast.error(t('errors.payment.pleaseEnterCardYear'))
    return
  }

  loaderStore.setLoading(true)
  const ticket: Ticket = await paymentStore.makePayment(session.ID, paymentData.value).catch((error: Error) => {
    toast.error(error.message)
  }).finally(() => {
    loaderStore.setLoading(false)
  }) as Ticket

  if (ticket) {
    toast.success(t('payment.success'))
    await navigateTo('/profile/tickets')
  }
}

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
                  {{ $t('payment.seatDetails') }}
                </h3>
              </div>

              <div class="grid grid-flow-row grid-cols-6 gap-4">
                <div
                  v-for="(seat, idx) in selectedSeats"
                  :key="seat.ID"
                  class="col-span-6 sm:col-span-3 lg:col-span-2 flex flex-col gap-2"
                >
                  <label class="text-sm text-cod-gray-800 dark:text-cod-gray-200">{{ $t('_seat') }} {{ idx + 1 }} ({{ seat.Name }})</label>
                  <select
                    v-model="seat.Type"
                    class="flex-1 select"
                  >
                    <option
                      v-for="price in session.Theater?.Prices"
                      :key="price.ID"
                      :value="price.Type"
                    >
                      {{ price.Type === 1 ? 'Tam' : 'Öğrenci' }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="flex flex-col bg-white dark:bg-cod-gray-800 p-4 rounded-lg shadow space-y-4">
              <div class="flex w-full">
                <h3 class="text-cod-gray-800 dark:text-cod-gray-200 font-bold">
                  {{ $t('payment.cardDetails') }}
                </h3>
              </div>

              <div class="flex flex-col w-full space-y-4">
                <div class="flex flex-col gap-1">
                  <label for="cardName" class="text-sm text-cod-gray-800 dark:text-cod-gray-200">{{ $t('payment.cardName') }}</label>
                  <input
                    id="cardName"
                    v-model="cardName"
                    type="text"
                    class="input"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label for="cardNumber" class="text-sm text-cod-gray-800 dark:text-cod-gray-200">{{ $t('payment.cardNumber') }}</label>
                  <input
                    id="cardNumber"
                    v-model="cardNumber"
                    type="text"
                    class="input"
                  />
                </div>
              </div>

              <div class="grid grid-flow-col grid-cols-4 w-full space-x-4">
                <div class="flex flex-col gap-1 col-span-3">
                  <label for="cardMonth" class="text-sm text-cod-gray-800 dark:text-cod-gray-200">{{ $t('payment.cardExpiration') }}</label>
                  <div class="flex flex-row gap-2">
                    <select
                      id="cardMonth"
                      v-model="cardMonth"
                      class="select flex-1"
                    >
                      <option
                        v-for="month in [...Array(12).keys()].map(m => m + 1)"
                        :key="month"
                        :value="month"
                      >
                        {{ month }}
                      </option>
                    </select>

                    <select
                      id="cardYear"
                      v-model="cardYear"
                      class="select flex-1"
                    >
                      <option
                        v-for="year in [...Array(20).keys()].map(y => y + (new Date().getFullYear()))"
                        :key="year"
                        :value="year"
                      >
                        {{ year }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="flex flex-col gap-1 col-span-1">
                  <label for="cardCVC" class="text-sm text-cod-gray-800 dark:text-cod-gray-200">{{ $t('payment.cardCvc') }}</label>
                  <input
                    id="cardCVC"
                    v-model="cardCvc"
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
                  :src="`https://image.tmdb.org/t/p/w500/${session.Movie?.PosterPath}`"
                  class="h-24 aspect-[2/3] rounded"
                >
                <div class="h-full flex-1 flex flex-col">
                  <h3 class="text-cod-gray-800 dark:text-cod-gray-50 text-lg font-bold mb-4">
                    {{ session.Movie?.Title }}
                  </h3>
                  <div class="flex-1 space-y-1">
                    <div class="text-cod-gray-600 dark:text-cod-gray-50 text-sm">
                      {{ session.Theater?.Place?.Name }} - {{ session.Theater?.Name }}
                    </div>
                    <div class="text-cod-gray-600 dark:text-cod-gray-50 text-sm">
                      {{ sessionDate }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col pt-4 items-end">
                <div class="flex space-x-2">
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-200">{{ $t('payment.ticketPrice') }}: </span>
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-50 font-bold">{{ totalTicketPriceText }}</span>
                </div>
                <div class="flex space-x-2">
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-200">{{ $t('payment.serviceFee') }}: </span>
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-50 font-bold">{{ totalServiceFeeText }}</span>
                </div>
                <div class="flex space-x-2">
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-200">{{ $t('payment.total') }}: </span>
                  <span class="text-sm text-cod-gray-800 dark:text-cod-gray-50 font-bold">{{ totalPriceText }}</span>
                </div>
              </div>

              <div class="flex flex-col pt-4 items-center justify-center">
                <button
                  class="w-full bg-ywllow text-cod-gray-800 tracking-wider font-bold py-4 px-4 rounded-lg"
                  @click.prevent="makePayment"
                >
                  {{ $t('payment.payU') }} ({{ totalPriceText }})
                </button>
              </div>
            </div>

            <div class="flex justify-center mt-4">
              <nuxt-link :to="`/choose_seat?sessionId=${session.ID}`" class="underline text-cod-gray-400">{{ $t('go back') }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
