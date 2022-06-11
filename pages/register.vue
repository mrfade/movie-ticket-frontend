<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { FetchError } from 'ohmyfetch'
import { useI18n } from 'vue-i18n'
import { useApi } from '@/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import { useUserStore } from '~~/stores/user'

const name = ref(null)
const email = ref(null)
const password = ref(null)

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const loaderStore = useLoaderStore()
const userStore = useUserStore()

const register = async () => {
  const nameValue = name.value
  const emailValue = email.value
  const passwordValue = password.value

  if (!nameValue || !emailValue || !passwordValue) {
    toast.error(t('errors.allFieldsRequired'))
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
      toast.error(t('errors.allFieldsRequired'))
    else
      toast.error(t('errors.sww'))
  }).finally(() => {
    loaderStore.setLoading(false)
  })

  if (!data.token) {
    toast.error(t('errors.register.failed'))
    return
  }

  await userStore.loginWithToken(data.token)
  if (!userStore.isAuthenticated) {
    toast.error(t('errors.register.failed'))
    return
  }

  toast.success(t('register.success'))
  router.push('/')
}
</script>

<template>
  <div class="w-full flex items-center justify-center my-16">
    <div class="w-full sm:max-w-xs md:max-w-sm lg:max-w-md space-y-8 py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-opacity-5 drop-shadow-md">
      <div>
        <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white">{{ $t('_register') }}</h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="register">
        <div class="space-y-2">
          <div>
            <label for="name" class="sr-only">{{ $t('name_surname') }}</label>
            <input
              id="name"
              v-model="name"
              type="text"
              :placeholder="$t('name_surname')"
              class="input"
            />
          </div>

          <div>
            <label for="email-address" class="sr-only">{{ $t('email') }}</label>
            <input
              id="email-address"
              v-model="email"
              type="email"
              :placeholder="$t('email')"
              class="input"
            />
          </div>

          <div>
            <label for="password" class="sr-only">{{ $t('password') }}</label>
            <input
              id="password"
              v-model="password"
              type="password"
              :placeholder="$t('password')"
              class="input"
            />
          </div>
        </div>

        <div>
          <button class="button w-full">
            {{ $t('_register') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
