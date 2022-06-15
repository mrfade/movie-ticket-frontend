<script setup lang="ts">
interface Props {
  cols: number,
  smCols: number,
}

const props = withDefaults(defineProps<Props>(), {
  cols: 6,
  smCols: 3
})
</script>

<template>
  <div
    :class="{
      'col-span-12': cols === 12,
      'col-span-6': cols === 6,
      'col-span-4': cols === 4,
      'col-span-3': cols === 3,
      'col-span-2': cols === 2,
      'col-span-1': cols === 1,
      'sm:col-span-12': smCols === 12,
      'sm:col-span-6': smCols === 6,
      'sm:col-span-4': smCols === 4,
      'sm:col-span-3': smCols === 3,
      'sm:col-span-2': smCols === 2,
      'sm:col-span-1': smCols === 1,
    }"
  >
    <slot></slot>
  </div>
</template>
