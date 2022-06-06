<script setup lang="ts">
import { City } from '~~/@types/city'
import { useCityStore } from '~~/stores/city'

const cityStore = useCityStore()

const selectedCityId = ref<string>(cityStore.selectedCity?.id.toString())

const cities: City[] = cityStore.getCities
// const isSelected = (city: City) => cityStore.selectedCity?.id === city.id

const cityIdCookie = useCookie('cityId')

watch(selectedCityId, (id) => {
  cityStore.setSelectedCityId(parseInt(id))
  cityIdCookie.value = id
})
</script>

<template>
  <div class="w-full">
    <label for="city-selector" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Şehir Seçin</label>
    <select
      id="city-selector"
      v-model="selectedCityId"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option
        v-for="city in cities"
        :key="city.id"
        :value="city.id"
      >
        {{ city.name }}
      </option>
    </select>
  </div>
</template>
