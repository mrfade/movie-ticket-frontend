import { acceptHMRUpdate, defineStore } from 'pinia'
import { Session } from '~~/@types/movie'
import { Seat } from '~~/@types/theather'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    session: null,
    selectedSeats: []
  }),

  getters: {
    getSession: (state): Session => state.session,
    getSelectedSeats: (state): Seat[] => state.selectedSeats
  },

  actions: {
    setSession (session: Session) {
      this.session = session
    },
    setSelectedSeats (seats: Seat[]) {
      this.selectedSeats = seats
    }
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(usePaymentStore, import.meta.hot))
