<script setup>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { useLoaderStore } from '~~/stores/loader'
const loaderStore = useLoaderStore()
</script>

<template>
  <div>
    <ClientOnly>
      <loading
        :active="loaderStore.isLoading"
        :is-full-page="true"
        :opacity="0.8"
        background-color="#000"
        color="#fff"
      />
    </ClientOnly>

    <Header />
    <slot />
    <Footer />
  </div>
</template>
