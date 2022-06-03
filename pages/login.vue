<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { RouteLocationRaw } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import { useUserStore } from '~~/stores/user'

const email = ref(null)
const password = ref(null)

const toast = useToast()
const route = useRoute()
const loaderStore = useLoaderStore()
const userStore = useUserStore()

const login = async () => {
  const emailValue = email.value
  const passwordValue = password.value

  if (!emailValue || !passwordValue)
    // TODO: add notification
    return

  loaderStore.setLoading(true)

  // login
  const user = {
    email: emailValue,
    password: passwordValue
  }

  const { data, error } = await useApi('/auth', {
    method: 'POST',
    body: JSON.stringify(user)
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.log('catch', err)
    toast.error('Beklenmeyen bir hata oluştu')
  }).finally(() => {
    loaderStore.setLoading(false)
  })

  if (error) {
    // eslint-disable-next-line no-console
    console.log('error', error)
    return
  }

  if (!data.token)
    // TODO: add notification
    return

  await userStore.loginWithToken(data.token)
  if (!userStore.isAuthenticated) {
    toast.error('Giriş başarısız')
    return
  }

  toast.success('Giriş yapıldı')
  if (route.query.next)
    navigateTo(route.query.next as RouteLocationRaw)
  else
    navigateTo('/')
}
</script>

<template>
  <div class="w-full flex items-center justify-center my-16">
    <div class="w-full sm:max-w-xs md:max-w-sm lg:max-w-md space-y-8 py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-opacity-5 drop-shadow-md">
      <div>
        <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white">Giriş Yap</h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div>
          <div class="mb-2">
            <label for="email-address" class="sr-only">Email</label>
            <input
              id="email-address"
              v-model="email"
              type="email"
              placeholder="Email"
              class="input"
            />
          </div>

          <div>
            <label for="password" class="sr-only">Şifre</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Şifre"
              class="input"
            />
          </div>
        </div>

        <!-- <div class="flex items-center justify-end">
          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500"> Forgot your password? </a>
          </div>
        </div> -->

        <div>
          <button class="button w-full">
            Giriş Yap
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
