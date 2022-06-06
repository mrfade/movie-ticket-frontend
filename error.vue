<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object,
    default: () => ({})
  }
})

// eslint-disable-next-line no-console
console.log(props.error)

const errors = {
  400: {
    statusCode: 400,
    message: 'Bad Request',
    description: 'The request was invalid or cannot be otherwise served.'
  },
  401: {
    statusCode: 401,
    message: 'Unauthorized',
    description: 'Authentication is required and has failed or has not yet been provided.'
  },
  403: {
    statusCode: 403,
    message: 'Forbidden',
    description: 'The request was valid, but the server is refusing action.'
  },
  404: {
    statusCode: 404,
    message: 'Not Found',
    description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
  },
  500: {
    statusCode: 500,
    message: 'Internal Server Error',
    description: 'Something went wrong on our end. Please try again later.'
  }
}

const err = props.error.statusCode ? errors[props.error.statusCode] : errors[500]

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center bg-white">
    <div class="flex flex-row space-x-4">
      <div class="flex text-6xl font-bold text-indigo-600">{{ err.statusCode }}</div>
      <div class="max-w-xl flex flex-1 flex-col">
        <div class="flex pl-4 text-6xl font-semibold text-gray-900 tracking-tighter border-l-2 border-cod-gray-100">
          {{ err.message }}
        </div>
        <div class="flex pl-4 mt-2 text-gray-500">
          {{ err.description }}
        </div>
        <div class="flex pl-4 mt-8">
          <button
            class="bg-indigo-600 text-white text-sm py-2 px-4 rounded-lg"
            @click="handleError"
          >
            Go back home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
