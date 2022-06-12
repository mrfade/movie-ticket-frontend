<script setup lang="ts">
import { Ref } from 'vue'

interface Props {
  modelValue: string,
  id?: string,
  label?: string,
  type?: 'text' | 'password' | 'email' | 'number',
  placeholder?: string,
  required?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  id: `input-${Math.random()}`,
  label: '',
  type: 'text',
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
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      class="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
  </div>
</template>
