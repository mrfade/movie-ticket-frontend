import { acceptHMRUpdate, defineStore } from 'pinia'
import { FetchError } from 'ohmyfetch'
import { useApi } from '~~/composables/useApi'
import { ApiResponse } from '~~/@types/api'
import { Session } from '~~/@types/movie'
import { Seat } from '~~/@types/theather'
import { Ticket } from '~~/@types/ticket'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    session: null,
    selectedSeats: [],
    lastTicket: null
  }),

  getters: {
    getSession: (state): Session => state.session,
    getSelectedSeats: (state): Seat[] => state.selectedSeats,
    getLastTicket: (state): Ticket => state.lastTicket
  },

  actions: {
    setSession (session: Session) {
      this.session = session
    },

    setSelectedSeats (seats: Seat[]) {
      this.selectedSeats = seats
    },

    setLastTicket (ticket: Ticket) {
      this.lastTicket = ticket
    },

    async makePayment (sessionId: number, paymentData: any): Promise<Ticket> {
      const data = await useApi<ApiResponse<Ticket>>(`/session/${sessionId}/buy`, {
        method: 'POST',
        body: paymentData
      }).catch((error: FetchError<ApiResponse<Ticket>>) => {
        if (error.response.status === 400)
          throw new Error(error.response._data.message)

        throw new Error('Unexpected error')
      })

      this.setLastTicket(data.data)
      return Promise.resolve(data.data)
    }
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(usePaymentStore, import.meta.hot))
