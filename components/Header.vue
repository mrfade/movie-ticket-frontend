<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useUserStore } from '~~/stores/user'

const userStore = useUserStore()

const isDark = useDark()
const toggleDark = useToggle(isDark)

defineProps({
  transparent: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="w-full bg-black px-4 sm:px-6" :class="{ 'bg-opacity-0 absolute top-0 z-10 drop-shadow-md': transparent }">
    <div class="flex justify-between items-center py-6 md:justify-start md:space-x-10">
      <div class="flex justify-start">
        <NuxtLink to="/" class="whitespace-nowrap text-white hover:text-gray-100">
          <span class="text-2xl">MoTic</span>
        </NuxtLink>
      </div>
      <div class="flex space-x-10 flex-1">
        <a href="#" class="whitespace-nowrap text-white hover:text-gray-100">
          test
        </a>
        <a href="#" class="whitespace-nowrap text-white hover:text-gray-100">
          test
        </a>
      </div>
      <div class="flex items-center justify-end space-x-8">
        <NuxtLink v-if="!userStore.isAuthenticated" to="/login" class="whitespace-nowrap text-white hover:text-gray-100">
          Giriş Yap
        </NuxtLink>
        <a v-if="!userStore.isAuthenticated" class="whitespace-nowrap text-white hover:text-gray-100">
          Üye Ol
        </a>

        <!-- Profile dropdown -->
        <Menu v-if="userStore.isAuthenticated" as="div" class="flex-1 relative">
          <div class="w-full">
            <MenuButton class="flex flex-row flex-nowrap items-center">
              <span class="mr-4 whitespace-nowrap text-white hover:text-gray-100">{{ userStore.name || 'test name' }}</span>
              <div class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              </div>
            </MenuButton>
          </div>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-cod-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem v-slot="{ active }">
                <a href="#" :class="[active ? 'bg-gray-100 dark:bg-cod-gray-800' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-cod-gray-100']">Profilim</a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a href="#" :class="[active ? 'bg-gray-100 dark:bg-cod-gray-800' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-cod-gray-100']">Ayarlar</a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a href="#" :class="[active ? 'bg-gray-100 dark:bg-cod-gray-800' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-cod-gray-100']" @click.prevent="userStore.logout">Çıkış Yap</a>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>

        <button type="button" class="p-1 rounded-full text-sm text-white hover:bg-gray-700 focus:outline-none" @click="toggleDark()">
          <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
          <svg v-if="!isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>
