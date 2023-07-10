<script setup>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { useLoaderStore } from '~~/stores/loader'
const loaderStore = useLoaderStore()

useDark()
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

    <div class="flex flex-col lg:flex-row">
      <admin-sidebar class="w-full lg:fixed lg:w-64 lg:h-screen" />
      <div class="lg:ml-64 lg:flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
body {
  @apply bg-gray-100 dark:bg-gray-900;
}
</style>
