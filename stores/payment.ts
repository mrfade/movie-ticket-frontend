import { acceptHMRUpdate, defineStore } from 'pinia'
import { FetchError } from 'ohmyfetch'
import { useApi } from '~~/composables/useApi'
import type { Response } from '~~/@types/api'
import type { Session } from '~~/@types/movie'
import type { Seat } from '~~/@types/theater'
import type { Ticket } from '~~/@types/ticket'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    session: {} as Session,
    selectedSeats: [] as Seat[],
    lastTicket: {} as Ticket
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
      const data = await useApi<Response<Ticket>>(`/session/${sessionId}/buy`, {
        method: 'POST',
        body: paymentData
      }).catch((error: FetchError<Response<Ticket>>) => {
        if (error.response?.status === 400)
          throw new Error(error.response._data?.error || 'Unexpected error')

        throw new Error('Unexpected error')
      })

      // empty the selected seats
      this.setSelectedSeats([])

      this.setLastTicket(data.data)
      return Promise.resolve(data.data)
    }
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(usePaymentStore, import.meta.hot))
