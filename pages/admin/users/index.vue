<script setup lang="ts">
import { ComputedRef, Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { ApiResponsePaged } from '~~/@types/api'
import { useLoaderStore } from '~~/stores/loader'
import { apiOptions } from '~~/composables/useApi'
import { TableRow } from '~~/components/Table.vue'
import { User } from '~~/@types/user'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const loaderStore = useLoaderStore()
const users: Ref<User[]> = ref<User[]>([])

const pageNumber: Ref<number> = ref<number>(0)
const totalPages: Ref<number> = ref<number>(0)
const loading: Ref<boolean> = ref<boolean>(false)

const fetchData = async (page: number): Promise<boolean> => {
  loading.value = true
  const { data, error } = await useFetch<ApiResponsePaged<User[]>>('/customer', {
    ...apiOptions(),
    params: {
      pageNumber: page
    }
  })
  loading.value = false

  if (error.value) {
    toast.error(t('errors.sww'))
    return Promise.reject(error.value)
  }

  if (data) {
    users.value = data.value.data as User[]

    pageNumber.value = data.value.pageNumber
    totalPages.value = data.value.totalPages
  }

  return Promise.resolve(true)
}

watch(loading, (value: boolean) => {
  loaderStore.setLoading(value)
})

await fetchData(1)

const rows: ComputedRef<TableRow[]> = computed(() => {
  return users.value.map((user: User) => {
    return {
      id: parseInt(user.id),
      col1: user.name,
      col2: user.email,
      col3: user.roles?.join(', ') ?? ' ',
      actions: [
        {
          label: t('edit'),
          icon: 'edit',
          action: () => {
            router.push({
              name: 'admin-users-edit',
              query: {
                id: user.id
              }
            })
          }
        },
        {
          label: t('delete'),
          icon: 'delete'
        }
      ]
    } as TableRow
  })
})

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
</script>

<template>
  <div class="p-8">
    <admin-title>Users</admin-title>

    <Table
      :columns="[
        'Name',
        'Email',
        'Roles',
      ]"
      :rows="rows"
      show-id-column
      show-actions-column
    />

    <div class="flex justify-center mt-8">
      <pagination
        :page-number="pageNumber"
        :total-pages="totalPages"
        @page="fetchData"
      />
    </div>
  </div>
</template>
