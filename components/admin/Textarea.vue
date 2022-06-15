<script setup lang="ts">
import { Ref } from 'vue'

interface Props {
  modelValue: string,
  id?: string,
  label?: string,
  rows?: number,
  placeholder?: string,
  required?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  id: `textarea-${Math.random()}`,
  label: '',
  rows: 4,
  placeholder: '',
  required: false
})

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const currentValue: Ref<string> = ref<string>(props.modelValue)

watch(currentValue, (value: string) => {
  emit('update:modelValue', value)
})
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ label }}</label>
    <textarea
      :id="id"
      v-model="currentValue"
      :rows="rows"
      :placeholder="placeholder"
      :required="required"
      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    ></textarea>
  </div>
</template>
