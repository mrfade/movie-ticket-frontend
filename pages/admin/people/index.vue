<script setup lang="ts">
import { ComputedRef, Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { PagedResponse } from '~~/@types/api'
import { useLoaderStore } from '~~/stores/loader'
import { apiOptions } from '~~/composables/useApi'
import { TableRow } from '~~/components/Table.vue'
import type { Person } from '~~/@types/movie'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const loaderStore = useLoaderStore()
const people: Ref<Person[]> = ref<Person[]>([])

const search: Ref<string> = ref<string>('')
const pageNumber: Ref<number> = ref<number>(0)
const totalPages: Ref<number> = ref<number>(0)
const loading: Ref<boolean> = ref<boolean>(false)

const fetchData = async (page: number = 1, search: string = ''): Promise<boolean> => {
  loading.value = true
  const { data, error } = await useFetch<PagedResponse<Person[]>>('/people', {
    ...apiOptions(),
    params: {
      q: search,
      pageNumber: page
    }
  })
  loading.value = false

  if (error.value) {
    toast.error(t('errors.sww'))
    return Promise.reject(error.value)
  }

  if (data) {
    people.value = data.value?.data as Person[]

    pageNumber.value = data.value?.pageNumber || 0
    totalPages.value = data.value?.totalPages || 0
  }

  return Promise.resolve(true)
}

const changePage = async (page: number): Promise<boolean> => {
  await fetchData(page, search.value)
  return Promise.resolve(true)
}

watch(loading, (value: boolean) => {
  loaderStore.setLoading(value)
})

watch(search, async (value: string) => {
  if (value.length === 0)
    await fetchData(1, '')

  if (value.length < 3) return

  await fetchData(1, value)
})

const rows: ComputedRef<TableRow[]> = computed(() => {
  return people.value.map((person: Person) => {
    return {
      id: person.ID,
      col1: person.Name,
      actions: [
        {
          label: t('edit'),
          icon: 'edit',
          action: () => {
            router.push({
              name: 'admin-people-edit',
              query: {
                id: person.ID
              }
            })
          }
        }
      ]
    } as TableRow
  })
})

await fetchData()

definePageMeta({
  layout: 'admin',
  middleware: ['auth-admin']
})
</script>

<template>
  <div class="p-8">
    <admin-title>People</admin-title>

    <div class="flex gap-8 my-4">
      <admin-input
        v-model="search"
        :label="t('search')"
      />
    </div>

    <Table
      :columns="[
        'Name',
      ]"
      :rows="rows"
      show-id-column
      show-actions-column
    />

    <div class="flex justify-center mt-8">
      <pagination
        :page-number="pageNumber"
        :total-pages="totalPages"
        @page="changePage"
      />
    </div>
  </div>
</template>
