import { acceptHMRUpdate, defineStore } from 'pinia'
import { setAccessToken, removeAccessToken } from '~~/composables/useAuthCookie'
import { useApi } from '~~/composables/useApi'
import { ApiResponse } from '~~/@types/api'
import { User } from '~~/@types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    authenticated: false,
    token: null,
    id: null,
    name: null,
    email: null,
    roles: []
  }),

  getters: {
    isAuthenticated: state => state.authenticated,
    isAdmin: state => state.roles.includes('admin'),
    isGod: state => state.roles.includes('god'),
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

    setRoles (roles: string[]) {
      this.roles = roles
    },

    clear () {
      this.authenticated = false
      this.token = null
      this.id = null
      this.name = null
      this.email = null
      this.roles = []

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
    },

    async getMe (): Promise<void | Boolean> {
      const data = await useApi<ApiResponse<User>>('/me').catch(() => {
        this.clear()
        return false
      })

      if (!data)
        return Promise.resolve(false)

      const user: User = data.data

      this.setAuthenticated(true)
      this.setId(user.id)
      this.setName(user.name)
      this.setEmail(user.email)
      this.setRoles(user.roles)

      setAccessToken(this.getToken)
    },

    async updateUser (user: User): Promise<boolean> {
      const data = await useApi<ApiResponse<User>>('/me/details', {
        method: 'PUT',
        body: user
      }).catch(() => {
        return false
      })

      if (!data)
        return Promise.resolve(false)

      const updatedUser: User = data.data
      this.setName(updatedUser.name)
      this.setEmail(updatedUser.email)

      return Promise.resolve(true)
    },

    loginWithToken (token: string) {
      this.setToken(token)
      return this.getMe()
    }
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
