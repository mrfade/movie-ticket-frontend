<script setup>

const searchFocus = ref(false)

const onSearchFocus = () => {
  searchFocus.value = true
}
const onSearchBlur = () => {
  searchFocus.value = false
}

definePageMeta({
  layout: 'home'
})
</script>

<template>
  <div class="w-full">
    <div class="w-full h-[700px] relative flex justify-center items-center bg-gray-300">
      <div class="w-full h-full relative">
        <div class="w-full h-full absolute bg-black transition-opacity" :class="[searchFocus ? 'opacity-60' : 'opacity-20']"></div>
        <div class="w-full h-full bg-cover bg-[url('https://kdaidggt0f3v.merlincdn.net/Uploads/Slider/top-gun-maverick-202251812531_middle.jpg')]"></div>
      </div>

      <div class="lg:w-1/2 mx-auto flex flex-row drop-shadow absolute z-10">
        <input
          type="text"
          class="flex-1 border-none shadow-none rounded-l-full px-6 py-4 text-base focus:outline-none"
          placeholder="Ara"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
        >
        <button class="text-black font-bold bg-white hover:bg-ywllow rounded-r-full px-6 py-4">
          Bilet Ara
        </button>
      </div>
    </div>
  </div>
</template>
