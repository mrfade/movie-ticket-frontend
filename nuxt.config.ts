import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt'
  ],
  buildModules: [
    './modules/auto-import-eslint'
  ],
  build: {
    transpile: ['@heroicons/vue']
  },
  typescript: {
    shim: false
  }
})
