<script setup lang="ts">
import { ComputedRef, Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { FetchError } from 'ohmyfetch'
import { ApiResponse } from '~~/@types/api'
import { apiOptions } from '~~/composables/useApi'
import { OperationClaim, User } from '~~/@types/user'
import { SelectBoxOption } from '~~/components/SelectBox.vue'
import { useLoaderStore } from '~~/stores/loader'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loaderStore = useLoaderStore()
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

const save = async (): Promise<string | void> => {
  loaderStore.setLoading(true)
  const { error } = await useFetch<ApiResponse<User>>('/customer', {
    ...apiOptions(),
    method: 'PUT',
    body: {
      id: route.query.id,
      name: name.value,
      email: email.value,
      password: password.value,
      roles: currentRoles.value.map((role: SelectBoxOption) => claims.value.find((claim: OperationClaim) => claim.id.toString() === role.value).name)
    }
  })
  loaderStore.setLoading(false)

  if (error.value) {
    const err: FetchError = error.value as FetchError

    if (err.response.status === 400)
      toast.error(t('errors.user.updateFailed'))
    else
      toast.error(t('errors.sww'))

    return Promise.reject(error.value)
  }

  toast.success(t('messages.user.updated'))
  router.push('/admin/users')

  return Promise.resolve()
}

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
</script>

<template>
  <div class="p-8">
    <admin-title>User Edit</admin-title>

    <admin-edit-card
      :buttons="[
        {
          text: t('save'),
          onClick: save
        }
      ]"
    >
      <admin-edit-card-item>
        <admin-input
          v-model="name"
          :label="t('name_surname')"
          required
        />
      </admin-edit-card-item>

      <admin-edit-card-item>
        <admin-input
          v-model="email"
          :label="t('email')"
          type="email"
          required
        />
      </admin-edit-card-item>

      <admin-edit-card-item>
        <admin-input
          v-model="password"
          :label="t('password')"
          type="password"
        />
      </admin-edit-card-item>

      <admin-edit-card-item>
        <select-box
          v-model="currentRoles"
          label="Roles"
          variant="gray"
          :options="claimsOptions"
          multiple
        />
      </admin-edit-card-item>
    </admin-edit-card>
  </div>
</template>
