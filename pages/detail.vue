<script setup>
import { ClockIcon } from '@heroicons/vue/outline'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

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

definePageMeta({
  layout: 'home'
})
</script>

<template>
  <div class="w-full">
    <div class="w-full h-96 pt-20 flex justify-center items-end bg-black bg-opacity-90">
      <!-- <div class="w-full h-full relative">
        <div class="w-full h-full absolute bg-black bg-opacity-40"></div>
        <div class="w-full h-full bg-cover bg-[url('https://kdaidggt0f3v.merlincdn.net/Uploads/FilmCover/top-gun-maverick-2019624115131.jpg')]"></div>
      </div> -->

      <div class="container max-w-screen-xl px-8 h-72 flex justify-between items-center">
        <img src="https://kdaidggt0f3v.merlincdn.net/Uploads/Films/top-gun-maverick-202251811657.jpg" alt="" class="h-full rounded-t-lg">
        <div class="h-full p-8 flex-1 flex flex-col justify-end items-start">
          <div class="text-white text-4xl font-bold mb-6">
            Top Gun: Maverick
          </div>
          <div class="text-white text-xs font-light mb-8 px-4 py-2 rounded bg-black bg-opacity-40">
            27 Mayıs 2022
          </div>
          <div class="text-white text-sm flex items-center gap-1.5 mb-1">
            <ClockIcon class="h-4 w-4" /> 131 dakika
          </div>
          <div class="text-white text-sm">
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
            <p>1986 yapımı Top Gun'ın devam hikâyesi olan Top Gun: Maverick, usta pilot Maverick'in bu kez eğitmen olarak hava kuvvetlerine geri dönüşü sonrası gelişen olayları anlatıyor.</p>
            <br>
            <p>Donanmanın en iyi pilotlarından biri olan Pete “Maverick” Mitchell, 30 yıllık hizmetten sonra ait olduğu yerde, cesur bir test pilotu olarak sınırları zorlar ve kendisini yere bağlayacak olan terfiden kaçar. Kendisini Top Gun mezunlarından oluşan bir müfrezeyi o güne kadar hiçbir pilotun görmediği özel bir görev için eğitirken bulur. Belirsiz bir gelecekle ve geçmişinden gelen anılarla karşı karşıya kalan Maverick, en büyük korkularıyla yüzleşmek ve büyük bir fedakarlık yapmasını gerektiren bir göreve gitmek zorunda kalır.</p>
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
