<script setup lang="ts">
import { ComputedRef, Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { FetchError } from 'ohmyfetch'
import { ApiResponse } from '~~/@types/api'
import { apiOptions } from '~~/composables/useApi'
import { OperationClaim, User } from '~~/@types/user'
import { SelectBoxOption } from '~~/components/SelectBox.vue'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const user: Ref<User> = ref<User>(null)
const claims: Ref<OperationClaim[]> = ref<OperationClaim[]>([])

const { data, error } = await useFetch<ApiResponse<User>>(`/customer/${route.query.id}`, {
  ...apiOptions()
})

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response.status === 404)
    toast.error(t('errors.user.notFound'))
  else
    toast.error(t('errors.sww'))

  router.push('/admin/users')
}

if (data)
  user.value = data.value.data as User

const { data: claimsData, error: claimsError } = await useFetch<ApiResponse<OperationClaim[]>>('/operationclaim', {
  ...apiOptions()
})

if (claimsError.value) {
  toast.error(t('errors.sww'))
  router.push('/admin/users')
}

if (claimsData)
  claims.value = claimsData.value.data as OperationClaim[]

const name: Ref<string> = ref<string>(user.value.name)
const email: Ref<string> = ref<string>(user.value.email)
const password: Ref<string> = ref<string>(null)
const roles: Ref<OperationClaim[]> = ref<OperationClaim[]>([
  ...user.value.roles.map((role: string) => {
    return claims.value.find((claim: OperationClaim) => claim.name === role)
  })
])

const currentRoles: Ref<SelectBoxOption[]> = ref<SelectBoxOption[]>([
  ...roles.value.map((role: OperationClaim) => {
    return {
      value: role.id.toString(),
      label: role.name
    }
  })
])

const claimsOptions: ComputedRef<SelectBoxOption[]> = computed(() => {
  return claims.value.map((claim: OperationClaim) => {
    return {
      value: claim.id.toString(),
      label: claim.name
    } as SelectBoxOption
  })
})

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
</script>

<template>
  <div class="p-8">
    <admin-title>User Edit</admin-title>

    <div class="mt-10 sm:mt-0">
      <div class="shadow sm:rounded-md">
        <div class="px-4 py-5 bg-white dark:bg-gray-800 sm:p-6">
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-3">
              <admin-input
                v-model="name"
                :label="t('name_surname')"
                required
              />
            </div>

            <div class="col-span-6 sm:col-span-3">
              <admin-input
                v-model="email"
                :label="t('email')"
                type="email"
                required
              />
            </div>

            <div class="col-span-6 sm:col-span-3">
              <admin-input
                v-model="password"
                :label="t('password')"
                type="password"
              />
            </div>

            <div class="col-span-6 sm:col-span-3">
              <select-box
                v-model="currentRoles"
                label="Roles"
                :options="claimsOptions"
                multiple
              />
            </div>
          </div>
        </div>
        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>