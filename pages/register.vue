<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { FetchError } from 'ohmyfetch'
import { useApi } from '@/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import { useUserStore } from '~~/stores/user'

const name = ref(null)
const email = ref(null)
const password = ref(null)

const toast = useToast()
const router = useRouter()
const loaderStore = useLoaderStore()
const userStore = useUserStore()

const register = async () => {
  const nameValue = name.value
  const emailValue = email.value
  const passwordValue = password.value

  if (!nameValue || !emailValue || !passwordValue) {
    toast.error('Please fill all fields')
    return
  }

  loaderStore.setLoading(true)

  // login
  const user = {
    name: nameValue,
    email: emailValue,
    password: passwordValue
  }

  const { data } = await useApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(user)
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log('catch', error)

    const err: FetchError = error as FetchError

    if (err.response.status === 400)
      toast.error('Fields are required')
    else
      toast.error('Something went wrong')
  }).finally(() => {
    loaderStore.setLoading(false)
  })

  if (!data.token) {
    toast.error('Register failed')
    return
  }

  await userStore.loginWithToken(data.token)
  if (!userStore.isAuthenticated) {
    toast.error('Kayıt başarısız')
    return
  }

  toast.success('Kayıt başarılı')
  router.push('/')
}
</script>

<template>
  <div class="w-full flex items-center justify-center my-16">
    <div class="w-full sm:max-w-xs md:max-w-sm lg:max-w-md space-y-8 py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-opacity-5 drop-shadow-md">
      <div>
        <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white">Kayıt Ol</h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="register">
        <div class="space-y-2">
          <div>
            <label for="name" class="sr-only">Ad Soyad</label>
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="Ad Soyad"
              class="input"
            />
          </div>

          <div>
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

        <div>
          <button class="button w-full">
            Kaydol
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
