import { createI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'

import tr from '~~/locales/tr.json'
import en from '~~/locales/en.json'

const vuei18n = createI18n({
  legacy: false,
  globalInjection: true,
  allowComposition: true,
  locale: 'tr',
  fallbackLocale: 'en',
  messages: {
    tr,
    en
  }
})

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vuei18n)

  nuxtApp.hook('app:mounted', () => {
    const _locale = useStorage('locale', 'tr')
    vuei18n.global.locale.value = _locale.value
  })
})
