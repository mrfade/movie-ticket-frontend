<script setup>
defineProps({
  fluid: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button :class="{ 'w-full': fluid }">
    <slot />
  </button>
</template>

<style scoped>
button {
  @apply inline-flex justify-center whitespace-nowrap py-2 px-4 border border-transparent text-base font-medium rounded-md text-black bg-ywllow hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-200;
}
</style>
