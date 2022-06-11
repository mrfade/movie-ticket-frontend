<script setup lang="ts">
import { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { SelectBoxOption } from './SelectBox.vue'

const { t, locale, availableLocales } = useI18n()

const locales: SelectBoxOption[] = [
  {
    value: 'tr',
    label: 'Türkçe',
    image: '/images/flags/tr.svg'
  },
  {
    value: 'en',
    label: 'English',
    image: '/images/flags/us.svg'
  }
]

const selected: Ref<SelectBoxOption> = ref<SelectBoxOption>(locales.find(option => option.value === locale.value))
const storageLocale = useStorage('locale', 'tr')

watch(selected, (value: SelectBoxOption) => {
  locale.value = value.value as string
  storageLocale.value = value.value as string
})
</script>

<template>
  <select-box
    v-model="selected"
    transparent-button
    :show-icon="false"
    :show-ring="false"
    :select-min-width="150"
    image-shape="square"
    image-aspect-ratio="4/3"
    :options="locales"
  />
</template>
