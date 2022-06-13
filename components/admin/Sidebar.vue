<script setup lang="ts">
import { Ref } from 'vue'

const menuOpen: Ref<boolean> = ref<boolean>(true)
const toggleMenu = useToggle(menuOpen)

const menus = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    path: '/admin/dashboard'
  },
  {
    name: 'Admins',
    icon: 'user-tie',
    path: '/admin/admins'
  },
  {
    name: 'Movies',
    icon: 'clapperboard',
    path: '/admin/movies'
  },
  {
    name: 'Users',
    icon: 'user',
    path: '/admin/users'
  },
  {
    name: 'Settings',
    icon: 'gear',
    path: '/admin/settings'
  }
]
</script>

<template>
  <aside class="w-auto">
    <div class="h-full overflow-y-auto py-4 px-8 lg:px-3 bg-gray-50 dark:bg-gray-800">
      <div
        class="flex flex-wrap justify-between items-center mx-auto lg:mb-5"
        :class="{'mb-5': menuOpen}"
      >
        <a href="#" class="flex items-center lg:pl-2.5">
          <!-- <img src="/docs/images/logo.svg" class="h-6 mr-3 sm:h-7" alt="Flowbite Logo" /> -->
          <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Ticket.Admin
          </span>
        </a>
        <button
          type="button"
          class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          @click.prevent="toggleMenu()"
        >
          <span class="sr-only">Open main menu</span>
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
          <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
      </div>
      <ul class="space-y-2 lg:block" :class="{'hidden': !menuOpen}">
        <li v-for="menu in menus" :key="`menu-${menu.name}`">
          <nuxt-link :to="menu.path" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <font-awesome-icon
              v-if="menu.icon"
              :icon="menu.icon"
              class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            />
            <span class="ml-3">{{ menu.name }}</span>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </aside>
</template>
