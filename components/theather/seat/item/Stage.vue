<script setup lang="ts">
import { SeatPlanRowItem } from '~~/@types/theather'

defineProps<{
  item: SeatPlanRowItem
}>()
</script>

<template>
  <div class="h-8 w-16 bg-cod-gray-600 rounded-lg" :class="{'self-center': item.position === 'center'}">
    Stage
  </div>
</template>
