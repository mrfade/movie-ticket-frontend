<script setup lang="ts">
import { Ref } from 'vue'
import { SelectBoxOption } from './SelectBox.vue'
import type { City } from '~~/@types/city'
import { useCityStore } from '~~/stores/city'

const cityStore = useCityStore()

const selectedCity: Ref<SelectBoxOption> = ref<SelectBoxOption>({
  value: cityStore.selectedCity?.ID.toString(),
  label: cityStore.selectedCity?.Name
})

const cities: City[] = cityStore.getCities
const options: SelectBoxOption[] = cities.map(city => ({
  value: city.ID.toString(),
  label: city.Name
} as SelectBoxOption))

const cityIdCookie = useCookie('cityId')

watch(selectedCity, (option: SelectBoxOption) => {
  cityStore.setSelectedCityId(parseInt(option.value))
  cityIdCookie.value = option.value
})
</script>

<template>
  <div class="w-auto">
    <select-box
      id="city-selector"
      v-model="selectedCity"
      label="Şehir Seçin"
      :select-min-width="150"
      :options="options"
    />
  </div>
</template>
