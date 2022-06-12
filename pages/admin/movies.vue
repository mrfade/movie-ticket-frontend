<script setup lang="ts">
import { ComputedRef, Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { ApiResponsePaged } from '~~/@types/api'
import { Genre, Movie } from '~~/@types/movie'
import { useLoaderStore } from '~~/stores/loader'
import { apiOptions } from '~~/composables/useApi'
import { useDayjs } from '~~/composables/useDayjs'
import { TableRow } from '~~/components/Table.vue'

const { t } = useI18n()
const toast = useToast()
const loaderStore = useLoaderStore()
const movies: Ref<Movie[]> = ref<Movie[]>([])

const pageNumber: Ref<number> = ref<number>(0)
const totalPages: Ref<number> = ref<number>(0)
const loading: Ref<boolean> = ref<boolean>(false)

const fetchData = async (page: number): Promise<boolean> => {
  loading.value = true
  const { data, error } = await useFetch<ApiResponsePaged<Movie[]>>('/movie', {
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
    movies.value = data.value.data as Movie[]

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
  return movies.value.map((movie: Movie) => {
    return {
      id: movie.id,
      col1: movie.title,
      col2: movie.genres.map((genre: Genre) => genre.name).join(', '),
      col3: useDayjs()(movie.releaseDate).format('YYYY-MM-DD'),
      col4: movie.status
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
    <admin-title>Movies</admin-title>

    <Table
      :columns="[
        'Name',
        'Genres',
        'Release Date',
        'Status',
      ]"
      :rows="rows"
      show-id-column
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
