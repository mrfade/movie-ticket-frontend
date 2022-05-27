<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { ClockIcon } from '@heroicons/vue/outline'
import { useApi } from '~~/composables/useApi'
import { ApiResponse } from '~~/@types/api'
import { Movie } from '~~/@types/movie'

const casts = [
  {
    name: 'James Franco',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/People/joseph-kosinski-20171014172342.jpg',
    role: 'Actor'
  },
  {
    name: 'Alfred Molina',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/People/joseph-kosinski-20171014172342.jpg',
    role: 'Actor'
  },
  {
    name: 'Bryan Cranston',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/People/joseph-kosinski-20171014172342.jpg',
    role: 'Actor'
  },
  {
    name: 'James Franco',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/People/joseph-kosinski-20171014172342.jpg',
    role: 'Actor'
  },
  {
    name: 'Alfred Molina',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/People/joseph-kosinski-20171014172342.jpg',
    role: 'Actor'
  },
  {
    name: 'Bryan Cranston',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/People/joseph-kosinski-20171014172342.jpg',
    role: 'Actor'
  },
  {
    name: 'James Franco',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/People/joseph-kosinski-20171014172342.jpg',
    role: 'Actor'
  },
  {
    name: 'Alfred Molina',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/People/joseph-kosinski-20171014172342.jpg',
    role: 'Actor'
  },
  {
    name: 'Bryan Cranston',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/People/joseph-kosinski-20171014172342.jpg',
    role: 'Actor'
  }
]

const similarFilms = [
  {
    title: 'The Shawshank Redemption',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: 'The Godfather',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: 'The Godfather: Part II',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: 'The Dark Knight',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: '12 Angry',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: 'Schindler\'s List',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: 'Pulp Fiction',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: 'The Good, the Bad and the Ugly',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: 'Fight Club',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: 'The Lord of the Rings: The Two Towers',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    image: 'https://kdaidggt0f3v.merlincdn.net/Uploads/Films/hayvan-2020314213254.jpg'
  }
]

const route = useRoute()

const { data } = await useAsyncData<ApiResponse<Movie>>(`movie_${route.params.id}`, () => useApi(`movie/${route.params.id}`))

const movie: Movie = data.value.data

definePageMeta({
  layout: 'home'
})
</script>

<template>
  <div class="w-full">
    <div class="w-full h-[32em] flex justify-center items-end relative">
      <div class="w-full h-full relative">
        <div class="w-full h-full absolute bg-black bg-opacity-60"></div>
        <div class="w-full h-full bg-cover" :style="`background-image: url('https://image.tmdb.org/t/p/original/${movie.backdropPath}')`"></div>
      </div>

      <div class="container max-w-screen-xl px-8 h-72 flex justify-between items-center absolute">
        <img :src="`https://image.tmdb.org/t/p/w500/${movie.posterPath}`" alt="" class="h-full rounded-t-lg">
        <div class="h-full p-8 flex-1 flex flex-col justify-end items-start">
          <div class="mb-6">
            <h3 class="text-white text-4xl font-bold">{{ movie.title }}</h3>
            <span class="text-white text-sm font-light">{{ movie.originalTitle }}</span>
          </div>
          <div class="text-white text-xs font-light mb-8 px-4 py-2 rounded bg-black bg-opacity-40">
            {{ movie.releaseDate }}
          </div>
          <div class="text-white text-sm flex items-center gap-1.5 mb-1">
            <ClientOnly><ClockIcon class="h-4 w-4" /></ClientOnly> {{ movie.duration }} dakika
          </div>
          <div class="text-white text-sm">
            {{ movie.genres?.map(genre => genre.name).join(', ') }}
            Action, Adventure, Comedy
          </div>
        </div>
        <Button>Bilet Al</Button>
      </div>
    </div>

    <div class="w-full max-w-screen-xl mx-auto px-8 py-16">
      <TabGroup>
        <TabList class="flex">
          <Tab v-slot="{ selected }" as="template">
            <button class="tab-btn" :class="{ selected }">
              Açıklama
            </button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button class="tab-btn" :class="{ selected }">
              Filmin Kadrosu
            </button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button class="tab-btn" :class="{ selected }">
              Fragman
            </button>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel class="tab-panel">
            {{ movie.description }}
          </TabPanel>
          <TabPanel class="tab-panel">
            <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
              <div v-for="cast in casts" :key="cast.name" class="flex flex-col items-center">
                <img class="mb-2 w-24 h-24 rounded-full shadow-lg" :src="cast.image" :alt="cast.name" />
                <h5 class="mb-1 text-xl text-center  font-medium text-gray-900 dark:text-white">{{ cast.name }}</h5>
                <span class="text-sm text-gray-500 dark:text-gray-200">{{ cast.role }}</span>
              </div>
            </div>
          </TabPanel>
          <TabPanel class="tab-panel">
            xx
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>

    <div class="w-full max-w-screen-xl mx-auto px-8 py-16">
      <h3 class="text-2xl font-medium mb-4 dark:text-white">Benzer Filmler</h3>

      <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
        <div v-for="film in similarFilms.slice(0, 6)" :key="film.title" class="flex flex-col items-center rounded-lg transition hover:scale-105">
          <img class="w-full rounded-lg" :src="film.image" :alt="film.title">
          <h5 class="p-2 text-center font-medium text-gray-900 dark:text-white">{{ film.title }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-btn {
  @apply rounded-t px-6 py-3 font-medium leading-5 focus:outline-none dark:text-white;

  &.selected {
    @apply bg-white dark:bg-white/5;
  }
}

.tab-panel {
  @apply bg-white p-6 focus:outline-none dark:bg-white/5 dark:text-white;

  p {
    @apply font-light;
  }
}
</style>
