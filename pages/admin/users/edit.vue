<script setup lang="ts">
import { ComputedRef, Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { FetchError } from 'ohmyfetch'
import type { Response } from '~~/@types/api'
import { apiOptions } from '~~/composables/useApi'
import type { Role, User } from '~~/@types/user'
import { SelectBoxOption } from '~~/components/SelectBox.vue'
import { useLoaderStore } from '~~/stores/loader'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loaderStore = useLoaderStore()
const user: Ref<User> = ref<User>({} as User)
const allRoles: Ref<Role[]> = ref<Role[]>([])

const { data, error } = await useFetch<Response<User>>(`/user/${route.query.id}`, {
  ...apiOptions()
})

if (error.value) {
  const err: FetchError = error.value as FetchError

  if (err.response?.status === 404)
    toast.error(t('errors.user.notFound'))
  else
    toast.error(t('errors.sww'))

  router.push('/admin/users')
}

if (data)
  user.value = data.value?.data as User

const { data: rolesData, error: rolesError } = await useFetch<Response<Role[]>>('/roles', {
  ...apiOptions()
})

if (rolesError.value) {
  toast.error(t('errors.sww'))
  router.push('/admin/users')
}

if (rolesData)
  allRoles.value = rolesData.value?.data as Role[]

const name: Ref<string> = ref<string>(user.value.Name)
const email: Ref<string> = ref<string>(user.value.Email)
const password: Ref<string> = ref<string>('')
const roles: Ref<Role[]> = ref<Role[]>([
  ...user.value.Roles.map((role: Role) => {
    return allRoles.value.find((claim: Role) => claim.ID === role.ID) || {} as Role
  })
])

const currentRoles: Ref<SelectBoxOption[]> = ref<SelectBoxOption[]>([
  ...roles.value.map((role: Role) => {
    return {
      value: role.ID.toString(),
      label: role.Name
    }
  })
])

const rolesOptions: ComputedRef<SelectBoxOption[]> = computed(() => {
  return roles.value.map((role: Role) => {
    return {
      value: role.ID.toString(),
      label: role.Name
    } as SelectBoxOption
  })
})

const save = async (): Promise<string | void> => {
  loaderStore.setLoading(true)
  const { error } = await useFetch<Response<User>>('/user', {
    ...apiOptions(),
    method: 'PUT',
    body: {
      id: route.query.id,
      name: name.value,
      email: email.value,
      password: password.value,
      roles: currentRoles.value.map((crole: SelectBoxOption) => allRoles.value.find((role: Role) => role.ID.toString() === crole.value)?.Name)
    }
  })
  loaderStore.setLoading(false)

  if (error.value) {
    const err: FetchError = error.value as FetchError

    if (err.response?.status === 400)
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
          :options="rolesOptions"
          multiple
        />
      </admin-edit-card-item>
    </admin-edit-card>
  </div>
</template>
