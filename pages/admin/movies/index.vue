<script setup lang="ts">
import { ComputedRef, Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import type { PagedResponse } from '~~/@types/api'
import type { Genre, Movie } from '~~/@types/movie'
import { useLoaderStore } from '~~/stores/loader'
import { apiOptions } from '~~/composables/useApi'
import { useDayjs } from '~~/composables/useDayjs'
import { TableRow } from '~~/components/Table.vue'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const loaderStore = useLoaderStore()
const movies: Ref<Movie[]> = ref<Movie[]>([])

const search: Ref<string> = ref<string>('')
const pageNumber: Ref<number> = ref<number>(0)
const totalPages: Ref<number> = ref<number>(0)
const loading: Ref<boolean> = ref<boolean>(false)

const fetchData = async (page: number = 1, search: string = ''): Promise<boolean> => {
  loading.value = true
  const { data, error } = await useFetch<PagedResponse<Movie[]>>('/movies', {
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
    movies.value = data.value?.data as Movie[]

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
    await fetchData()

  if (value.length < 3) return

  await fetchData(pageNumber.value, value)
})

const rows: ComputedRef<TableRow[]> = computed(() => {
  return movies.value.map((movie: Movie) => {
    return {
      id: movie.ID,
      col1: movie.Title,
      col2: movie.Genres?.map((genre: Genre) => genre.Name).join(', ') || '-',
      col3: useDayjs()(movie.ReleaseDate).format('YYYY-MM-DD'),
      col4: movie.Status,
      actions: [
        {
          label: t('edit'),
          icon: 'edit',
          action: () => {
            router.push({
              name: 'admin-movies-edit',
              query: {
                id: movie.ID
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
    <admin-title>Movies</admin-title>

    <div class="flex my-4">
      <admin-input
        v-model="search"
        :label="t('search')"
      />
    </div>

    <Table
      :columns="[
        'Name',
        'Genres',
        'Release Date',
        'Status',
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
