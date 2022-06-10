<script setup lang="ts">

const links = [
  {
    name: 'Profile',
    path: '/profile'
  },
  {
    name: 'Tickets',
    path: '/profile/tickets'
  }
]

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="w-full flex justify-center py-16">
    <div class="container max-w-screen-xl px-8">
      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-3 lg:col-span-1">
          <div class="flex flex-col gap-4">
            <nuxt-link v-for="link in links" :key="link.path" :to="link.path">
              <div class="flex items-center p-4 dark:text-cod-gray-200 bg-cod-gray-100 dark:bg-cod-gray-850 hover:bg-cod-gray-200 hover:dark:bg-cod-gray-800 rounded-lg">
                {{ link.name }}
              </div>
            </nuxt-link>
          </div>
        </div>
        <div class="col-span-3 lg:col-span-2">
          <nuxt-page />
        </div>
      </div>
    </div>
  </div>
</template>
