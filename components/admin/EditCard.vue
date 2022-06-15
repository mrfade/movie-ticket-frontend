<script setup lang="ts">
interface Button {
  text: string
  icon?: string
  color?: string
  onClick: () => void
}

interface Props {
  buttons?: Button[]
}

defineProps<Props>()
</script>

<template>
  <div class="mt-5 shadow rounded-lg">
    <div class="px-4 py-5 bg-white dark:bg-gray-800 sm:p-6">
      <div class="grid grid-cols-6 gap-6">
        <slot></slot>
      </div>
    </div>
    <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
      <button
        v-for="button in buttons"
        :key="button.text"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2"
        :class="{
          'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500': button.color === 'indigo' || !button.color,
        }"
        @click.prevent="button.onClick"
      >
        {{ button.text }}
      </button>
    </div>
  </div>
</template>
