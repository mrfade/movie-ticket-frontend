<script setup lang="ts">
import { Ref } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'

export interface SelectBoxOption {
  value: string,
  label: string | number,
  image?: string
}

interface Props {
  modelValue: SelectBoxOption | SelectBoxOption[] | string | number,
  options: SelectBoxOption[],
  multiple?: boolean,
  label?: string,
  transparentButton?: boolean,
  selectMinWidth?: number,
  variant?: 'gray' | 'cod-gray',
  imageShape?: 'square' | 'rounded' | 'circle',
  imageAspectRatio?: '1/1' | '1/2' | '2/1' | '3/4' | '4/3' | '16/9' | '9/16',
  showIcon?: boolean,
  showRing?: boolean,
  showImageInLabel?: boolean,
  disabled?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  label: '',
  transparentButton: false,
  selectMinWidth: 0,
  variant: 'cod-gray',
  imageShape: 'circle',
  imageAspectRatio: '1/1',
  showIcon: true,
  showRing: true,
  showImageInLabel: true,
  disabled: false
})

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectBoxOption | SelectBoxOption[]): void
}>()

// const currentValue: SelectBoxOption | SelectBoxOption[] = typeof props.modelValue in ['number', 'string'] ? Array.isArray(props.modelValue) ? [...props.modelValue.map((value: SelectBoxOption) => props.options.find(option => option.value === value.value))] : props.options.find(option => option.value === props.modelValue) : props.modelValue as SelectBoxOption
let currentValue: SelectBoxOption | SelectBoxOption[]
if (typeof props.modelValue in ['number', 'string'])
  currentValue = props.options.find(option => option.value === props.modelValue) as SelectBoxOption
else if (Array.isArray(props.modelValue))
  currentValue = [...props.modelValue.map((value: SelectBoxOption) => props.options.find(option => option.value === value.value))] as SelectBoxOption[]
else
  currentValue = props.modelValue as SelectBoxOption

const selected: Ref<SelectBoxOption | SelectBoxOption[]> = ref<SelectBoxOption | SelectBoxOption[]>(currentValue)

watch(selected, (value: SelectBoxOption | SelectBoxOption[]) => {
  emit('update:modelValue', value)
})
</script>

<template>
  <Listbox
    v-model="selected"
    as="div"
    :multiple="multiple"
    :disabled="disabled"
  >
    <ListboxLabel
      v-if="label"
      class="block mb-2 text-sm font-medium"
      :class="{
        'text-cod-gray-700 dark:text-cod-gray-300': variant === 'cod-gray',
        'text-gray-700 dark:text-gray-300': variant === 'gray',
      }"
    >
      {{ label }}
    </ListboxLabel>
    <div class="relative">
      <ListboxButton
        class="relative w-full text-left py-2 focus:outline-none"
        :class="{
          'text-white font-base font-medium cursor-pointer': transparentButton,
          'pl-3 pr-10 cursor-default bg-white border-2 rounded-md shadow-sm sm:text-sm': !transparentButton,
          'dark:text-cod-gray-100 dark:bg-cod-gray-850 border-cod-gray-300 dark:border-cod-gray-700': !transparentButton && variant === 'cod-gray',
          'dark:text-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600': !transparentButton && variant === 'gray',
          'focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500': showRing,
        }"
      >
        <span class="flex items-center">
          <img
            v-if="!Array.isArray(selected) && selected.image"
            :key="`selecbox-img-${selected.value}`"
            :src="selected.image"
            :alt="(selected.label as string)"
            class="flex-shrink-0 h-6"
            :class="{
              'rounded-full': imageShape === 'circle',
              'rounded-lg': imageShape === 'rounded',
              'rounded-none': imageShape === 'square',
              'aspect-[1/2]': imageAspectRatio === '1/2',
              'aspect-[2/1]': imageAspectRatio === '2/1',
              'aspect-[3/4]': imageAspectRatio === '3/4',
              'aspect-[4/3]': imageAspectRatio === '4/3',
              'aspect-[16/9]': imageAspectRatio === '16/9',
              'aspect-[9/16]': imageAspectRatio === '9/16'
            }"
          />
          <span class="ml-3 block truncate">{{ Array.isArray(selected) ? selected.map((value: SelectBoxOption) => value.label).join(', ') : selected.label }}</span>
        </span>
        <span v-if="showIcon" class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronUpDownIcon
            class="h-5 w-5"
            :class="{
              'text-cod-gray-400': variant === 'cod-gray',
              'text-gray-400': variant === 'gray',
            }"
            aria-hidden="true"
          />
        </span>
      </ListboxButton>

      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ListboxOptions
          class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          :style="{
            minWidth: selectMinWidth ? selectMinWidth + 'px' : '',
          }"
          :class="{
            'dark:bg-cod-gray-850': variant === 'cod-gray',
            'dark:bg-gray-800': variant === 'gray',
          }"
        >
          <ListboxOption v-for="option in options" :key="`option-${option.value}`" v-slot="{ active, selected }" as="template" :value="option">
            <li :class="[active ? 'text-white bg-indigo-600' : 'text-gray-900 dark:text-cod-gray-100', 'cursor-pointer select-none relative py-2 pl-3 pr-9']">
              <div class="flex items-center">
                <img
                  v-if="showImageInLabel && option.image"
                  :src="option.image"
                  alt=""
                  class="flex-shrink-0 h-6 rounded-full"
                  :class="{
                    'rounded-full': imageShape === 'circle',
                    'rounded-lg': imageShape === 'rounded',
                    'rounded-none': imageShape === 'square',
                    'aspect-[1/2]': imageAspectRatio === '1/2',
                    'aspect-[2/1]': imageAspectRatio === '2/1',
                    'aspect-[3/4]': imageAspectRatio === '3/4',
                    'aspect-[4/3]': imageAspectRatio === '4/3',
                    'aspect-[16/9]': imageAspectRatio === '16/9',
                    'aspect-[9/16]': imageAspectRatio === '9/16'
                  }"
                />
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">
                  {{ option.label }}
                </span>
              </div>

              <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
