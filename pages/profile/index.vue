<script setup lang="ts">
import type { User } from '~~/@types/user';
import { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useUserStore } from '~~/stores/user'

const { t } = useI18n()
const userStore = useUserStore()
const toast = useToast()

const name: Ref<string> = ref<string>(userStore.getName)
const email: Ref<string> = ref<string>(userStore.getEmail)
const password: Ref<string> = ref<string>('')

const updateUser = async () => {
  if (!name.value || !email.value) {
    toast.error(t('errors.profile.emptyFields'))
    return
  }

  const update = await userStore.updateUser({
    ID: userStore.getId,
    Name: name.value,
    Email: email.value,
    Password: password.value
  } as User)

  if (update)
    toast.success(t('profile.updated'))
  else
    toast.error(t('profile.updateFailed'))
}
</script>

<template>
  <div class="w-full flex justify-center">
    <div class="container max-w-screen-xl p-4 bg-white dark:bg-cod-gray-850 rounded-lg shadow">
      <div class="flex items-center flex-col gap-4">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
          class="w-32 h-32 rounded-full shadow"
        >
        <h3 class="text-2xl font-medium text-cod-gray-800 dark:text-cod-gray-200">{{ userStore.getName }}</h3>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="text-cod-gray-800 dark:text-cod-gray-200 font-bold">
          {{ $t('edit') }}
        </h3>

        <div class="flex flex-col gap-1">
          <label for="name" class="text-sm text-cod-gray-800 dark:text-cod-gray-200">{{ $t('name_surname') }}</label>
          <input
            id="name"
            v-model="name"
            type="text"
            class="input"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="email" class="text-sm text-cod-gray-800 dark:text-cod-gray-200">{{ $t('email') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="input"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="password" class="text-sm text-cod-gray-800 dark:text-cod-gray-200">{{ $t('password') }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="input"
          />
        </div>

        <div class="flex p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800" role="alert">
          <svg class="inline flex-shrink-0 mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
          <div>
            <span class="font-medium">Bilgi!</span> Şifreyi sadece şifrenizi değiştirmek istediğinizde giriniz.
          </div>
        </div>

        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          @click.prevent="updateUser"
        >
          {{ $t('update') }}
        </button>
      </div>
    </div>
  </div>
</template>
