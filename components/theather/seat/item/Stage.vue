<script setup lang="ts">
import type { SeatPlanRowItem } from '~~/@types/theater'

defineProps<{
  item: SeatPlanRowItem
}>()
</script>

<template>
  <div class="h-8 w-16 bg-cod-gray-600 rounded-lg" :class="{'self-center': item.position === 'center'}">
    {{ $t('payment.stageU') }}
  </div>
</template>
@types/theater