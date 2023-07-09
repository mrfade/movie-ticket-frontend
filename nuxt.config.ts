import { defineNuxtConfig } from 'nuxt'

const isDev = process.env.NODE_ENV !== 'production'

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
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~~/assets/css/base.scss'
  ],
  typescript: {
    shim: false
  },
  runtimeConfig: {
    public: {
      apiBase: isDev ? 'http://localhost:5000/api' : 'https://ticket-api-v1.solak.dev/api'
    }
  }
})
