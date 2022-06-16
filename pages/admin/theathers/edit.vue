<script setup lang="ts">
import { Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { FetchError } from 'ohmyfetch'
import { ApiResponse } from '~~/@types/api'
import { apiOptions } from '~~/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import { Seat, SeatPlan, Theather } from '~~/@types/theather'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loaderStore = useLoaderStore()
const theather: Ref<Theather> = ref<Theather>(null)
const seats: Ref<Seat[]> = ref<Seat[]>([])

const { data, error } = await useFetch<ApiResponse<Theather>>(`/theather/${route.query.id}`, apiOptions())
const { data: seatsData, error: seatsError } = await useFetch<ApiResponse<Seat[]>>(`/theather/${route.query.id}/seats`, {
  ...apiOptions(),
  params: {
    pageSize: 250
  }
})

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response.status === 404)
    toast.error(t('errors.theather.notFound'))
  else
    toast.error(t('errors.sww'))

  router.push('/admin/theathers')
}

if (seatsError.value) {
  toast.error(t('errors.sww'))
  router.push('/admin/theathers')
}

if (data)
  theather.value = data.value.data as Theather

if (seatsData)
  seats.value = seatsData.value.data as Seat[]

const name: Ref<string> = ref<string>(theather.value.name)
const placeName: Ref<string> = ref<string>(theather.value.place.name)

const seatPlan: SeatPlan = JSON.parse(theather.value.seatPlan)

const save = async (): Promise<string | void> => {
  loaderStore.setLoading(true)
  const { error } = await useFetch<ApiResponse<Theather>>('/theather', {
    ...apiOptions(),
    method: 'PUT',
    body: {
      id: route.query.id,
      name: name.value
    }
  })
  loaderStore.setLoading(false)

  if (error.value) {
    const err: FetchError = error.value as FetchError

    if (err.response.status === 400)
      toast.error(t('errors.theather.updateFailed'))
    else
      toast.error(t('errors.sww'))

    return Promise.reject(error.value)
  }

  toast.success(t('messages.theather.updated'))
  router.push('/admin/theathers')

  return Promise.resolve()
}

const seatPlanSeats = seatPlan.rows.map((row) => {
  return row.map((_seat) => {
    return {
      ..._seat,
      seat: seats.value.find(seat => seat.id === _seat.id)
    }
  })
})

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
</script>

<template>
  <div class="p-8">
    <admin-title>Theather Edit</admin-title>

    <admin-edit-card
      :buttons="[
        {
          text: t('save'),
          onClick: save
        }
      ]"
    >
      <admin-edit-card-item>
        <admin-input
          v-model="name"
          :label="t('theather.name')"
          required
        />
      </admin-edit-card-item>

      <admin-edit-card-item>
        <admin-input
          v-model="placeName"
          :label="t('theather.placeName')"
          disabled
        />
        <nuxt-link
          :to="{
            path: '/admin/places/edit',
            query: {
              id: theather.place.id
            }
          }"
          class="mt-2 text-sm text-blue-500"
        >
          Go to place
        </nuxt-link>
      </admin-edit-card-item>
    </admin-edit-card>

    <div class="w-full max-w-screen-xl mx-auto px-8 py-16 flex flex-col items-center space-y-8">
      <h3 class="text-xl dark:text-gray-200 font-semibold">{{ $t('theather.seatPlan') }}</h3>
      <!-- seat info grid -->
      <div class="grid grid-flow-col gap-x-4">
        <div class="flex justify-center items-center space-x-2">
          <div class="w-8 h-8 border-2 border-gray-200 dark:border-gray-400 rounded-lg"></div>
          <span class="text-gray-900 dark:text-gray-50">{{ $t('seat.available') }}</span>
        </div>

        <div class="flex justify-center items-center space-x-2">
          <div class="w-8 h-8 bg-green-700 rounded-lg"></div>
          <span class="text-gray-900 dark:text-gray-50">{{ $t('seat.filler') }}</span>
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
              class="w-10 h-10 text-sm lg:w-12 lg:text-base lg:h-12 flex justify-center items-center font-medium rounded-lg border-gray-200 dark:border-gray-400 border-2 text-gray-800 dark:text-gray-200"
            >
              {{ seat.seat.name }}
            </div>
            <!-- stage -->
            <div
              v-if="seat.type == 'stage'"
              class="h-16 w-1/3 mt-8 flex justify-center items-center text-xl font-bold uppercase text-gray-500 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg"
              :class="{'justify-self-center': seat.position === 'center'}"
            >
              {{ $t('payment.stageU') }}
            </div>
            <!-- space -->
            <div v-if="seat.type == 'space-seat'" class="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-green-700"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
