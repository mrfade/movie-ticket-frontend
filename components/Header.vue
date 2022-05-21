<script setup lang="ts">

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
        <NuxtLink to="/">
          <span class="text-2xl">MoTic</span>
        </NuxtLink>
      </div>
      <div class="flex space-x-10 flex-1">
        <NuxtLink to="/detail">
          Detay
        </NuxtLink>
        <a href="#">
          test
        </a>
      </div>
      <div class="flex items-center justify-end lg:w-0">
        <NuxtLink to="/login">
          Giriş Yap
        </NuxtLink>
        <a class="ml-8">
          Üye Ol
        </a>

        <button type="button" class="ml-4 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm" @click="toggleDark()">
          <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
          <svg v-if="!isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  @apply whitespace-nowrap text-white hover:text-gray-100;
}
</style>
