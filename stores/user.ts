import { acceptHMRUpdate, defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { useJwt } from '@vueuse/integrations/useJwt'
import { setAccessToken, removeAccessToken } from '~~/composables/useAuthCookie'

const toast = useToast()

const parseToken = (token: string) => {
  const { payload } = useJwt(token)

  const {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': id,
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': name,
    email
  } = payload.value as any

  return { id, name, email }
}

export { parseToken }

export const useUserStore = defineStore('user', {
  state: () => ({
    authenticated: false,
    token: null,
    id: null,
    name: null,
    email: null
  }),

  getters: {
    isAuthenticated: state => state.authenticated,
    getToken: state => state.token,
    getId: state => state.id,
    getName: state => state.name,
    getEmail: state => state.email
  },

  actions: {
    setAuthenticated (authenticated: boolean) {
      this.authenticated = authenticated
    },

    setToken (token: string) {
      this.token = token

      setAccessToken(token)
    },

    setId (id: string) {
      this.id = id
    },

    setName (name: string) {
      this.name = name
    },

    setEmail (email: string) {
      this.email = email
    },

    clear () {
      this.authenticated = false
      this.token = null
      this.id = null
      this.name = null
      this.email = null

      removeAccessToken()
    },

    logout () {
      this.clear()
    },

    login (token: string, id: string, name: string, email: string) {
      this.setAuthenticated(true)
      this.setToken(token)
      this.setId(id)
      this.setName(name)
      this.setEmail(email)

      setAccessToken(token)
      toast.success('Başarıyla giriş yapıldı')
    },

    loginWithToken (token: string) {
      const { id, name, email } = parseToken(token)
      this.login(token, id, name, email)
    }
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
