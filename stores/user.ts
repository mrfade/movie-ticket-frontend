import { acceptHMRUpdate, defineStore } from 'pinia'
import { setAccessToken, removeAccessToken } from '~~/composables/useAuthCookie'
import { useApi } from '~~/composables/useApi'
import type { Response } from '~~/@types/api'
import type { User } from '~~/@types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    authenticated: false,
    token: '',
    id: 0,
    name: '',
    email: '',
    roles: [] as string[]
  }),

  getters: {
    isAuthenticated: state => state.authenticated,
    isAdmin: state => state.roles.includes('admin') || state.roles.includes('god'),
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

    setId (id: number) {
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
      this.token = ''
      this.id = 0
      this.name = ''
      this.email = ''
      this.roles = []

      removeAccessToken()
    },

    logout () {
      this.clear()
    },

    login (token: string, id: number, name: string, email: string) {
      this.setAuthenticated(true)
      this.setToken(token)
      this.setId(id)
      this.setName(name)
      this.setEmail(email)

      setAccessToken(token)
    },

    async getMe (): Promise<void | Boolean> {
      const data = await useApi<Response<User>>('/me').catch(() => {
        this.clear()
        return false
      })

      if (!data)
        return Promise.resolve(false)

      const user: User = data.data

      this.setAuthenticated(true)
      this.setId(user.ID)
      this.setName(user.Name)
      this.setEmail(user.Email)
      this.setRoles(user.Roles)

      setAccessToken(this.getToken)
    },

    async updateUser (user: User): Promise<boolean> {
      const data = await useApi<Response<User>>('/me/details', {
        method: 'PUT',
        body: user
      }).catch(() => {
        return false
      })

      if (!data)
        return Promise.resolve(false)

      const updatedUser: User = data.data
      this.setName(updatedUser.Name)
      this.setEmail(updatedUser.Email)

      return Promise.resolve(true)
    },

    loginWithToken (token: string) {
      this.setToken(token)
      return this.getMe()
    }
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
