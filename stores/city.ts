import { acceptHMRUpdate, defineStore } from 'pinia'
import { useApi } from '~~/composables/useApi'
import type { Response } from '~~/@types/api'
import type { City } from '~~/@types/city'

export const useCityStore = defineStore('city', {
  state: () => ({
    selectedCity: {} as City,
    cities: [] as City[]
  }),

  getters: {
    getSelectedCity: (state): City => state.selectedCity,
    getCities: (state): City[] => state.cities
  },

  actions: {
    setSelectedCity (city: City) {
      this.selectedCity = city
    },

    setSelectedCityId (cityId: number) {
      this.selectedCity = this.cities.find(city => city.ID === cityId) || {} as City
    },

    setCities (cities: City[]) {
      this.cities = cities
    },

    async fetchCities (): Promise<void | Boolean> {
      const data = await useApi<Response<City[]>>('/cities').catch(() => false)

      if (!data)
        return Promise.resolve(false)

      const cities: City[] = data.data
      this.setCities(cities)

      return Promise.resolve(true)
    }
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCityStore, import.meta.hot))
