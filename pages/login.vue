<script setup>
import { useJwt } from '@vueuse/integrations/useJwt'
import { useToast } from 'vue-toastification'
import { useApi } from '@/composables/useApi'
import { useLoaderStore } from '~~/stores/loader'
import { useUserStore } from '~~/stores/user'

const email = ref(null)
const password = ref(null)

const toast = useToast()
const router = useRouter()
const loaderStore = useLoaderStore()
const userStore = useUserStore()

const login = async () => {
  const emailValue = email.value
  const passwordValue = password.value

  if (!emailValue || !passwordValue) {
    // TODO: add notification
    return
  }

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
    console.log('catch', err)
    toast.error('Beklenmeyen bir hata oluştu')
  }).finally(() => {
    loaderStore.setLoading(false)
  })

  if (error) {
    console.log('error', error)
    return
  }

  if (!data.token) {
    // TODO: add notification
    return
  }

  const { payload } = useJwt(data.token)
  const { id: _id, name: _name, email: _email } = payload.value

  userStore.login(data.token, _id, _name, _email)

  // redirect
  router.push('/')
}
</script>

<template>
  <div class="w-full flex items-center justify-center my-16">
    <div class="w-full sm:max-w-xs md:max-w-sm lg:max-w-md space-y-8 py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-opacity-5 drop-shadow-md">
      <div>
        <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div>
          <div class="mb-2">
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              placeholder="Email address"
              class="input"
            />
          </div>

          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              placeholder="Password"
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
          <Button fluid>
            Sign in
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
