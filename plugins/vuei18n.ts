import { createI18n } from 'vue-i18n'

import tr from '~~/locales/tr.json'
import en from '~~/locales/en.json'

const vuei18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'tr',
  fallbackLocale: 'en',
  messages: {
    tr,
    en
  }
})

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vuei18n)
})
